---
layout: post # needs to be post
title: View的事件分发机制
summary: 浅谈View的事件分发机制
featured-img: sleek #optional - if you want you can include hero image
categories: [Android]
---
View的事件分发就是点击事件的分发，当一个事件产生以后，系统需要把这个事件传递给一个具体的View。了解点击事件我们需要先知道这几个方法。
## 点击事件的传递规则
### 点击事件的重要方法
```
public boolean dispatchTouchEvent(MotionEvent ev)
```
这个方法用于进行事件的分发，如果事件能传递给当前View，那么该方法一定被调用。返回的结果受到当前View的onTouchEvent和下级View的dispatchTouchEvent的影响，表示是否消耗当前事件
```
public boolean onInterceptTouchEvent(MotionEvent ev)
```
在dispatchTouchEvent方法内调用，表示是否拦截事件。如果当前View拦截了事件，那么在同一事件序列中，该方法不会调用。
```
public boolean onTouchEvent(MotionEvent ev)
```
在dispatchTouchEvent方法内调用，用来处理事件。返回结果表示是否消耗当前事件，如果不消耗，在同一事件序列中，当前View无法再次接收事件。
注意事项：
1. 某个View一旦决定拦截，系统会把同一事件序列的其它方法都交给它处理，因此就不再调用onInterceptTouchEvent去询问它是否拦截了
2. 如果某个View开始处理事件，但它没有消耗ACTION_DOWN（onTouchEvent返回false），那么同一事件序列中其它事件都不会交给它处理，并且事件将重新交给它的父View处理。就好比上级交给下级一件事，下级没有处理好，那么上级就收回这件事自己处理，下级就不会再处理了。
3. 如果某个View处理事件只消耗了ACTION_DOWN，没有消耗其它的事件，那么这个点击事件会消失，而且父View的onTouchEvent不会被调用，并且该View可以持续收到后续事件，最终这些点击事件会交给Activity处理。


如果一个View处理事件时，它设置了OnTouchListener，则OnTouchListener中的onTouch会被回调，如果onTouch返回true，则事件被消耗。如果返回false，则onTouchEvent会被调用。如果还设置了OnClickListener的话，则OnClickListener的OnClick会被调用。
>优先级 OnTouchListener>onTouchEvent>OnClickListener
![](http://opsprcvob.bkt.clouddn.com/OnTouchListener%E3%80%81OnTouchEvent%E3%80%81onClickListener.png)

## 事件分发的源码分析
当一个点击事件发生的时候，会传给我们的Activity，有Activity的dispatchTouchEvent进行事件派发。
```
public boolean dispatchTouchEvent(MotionEvent ev){
    if(getWindow().superDispatchTouchEvent(ev)){
        return true;
    }
    return onTouchEvent(ev);
}
```
首先Activity把事件交给所附属的Window去分发，如果返回true，那么就return true，结束。如果false的话，意味着事件没被消耗，那么就执行onTouchEvent。

再看下分发过程，getWindow就是Window，而Window是一个抽象类，实现类是PhoneWindow，所以事件就交给了PhoneWindow，我们看下PhoneWindow的superDispatchTouchEvent方法。
```
public boolean superDispatchTouchEvent(MotionEvent ev){
    return mDecor.superDispatchTouchEvent(ev);
}
```
这里就十分清晰了，PhoneWindow把事件传给了DecorView。而我们通过setContentView设置的View是DecorView的子View。事件接下来将会传给这个子View。一般来说这个子View会是一个ViewGroup。
![](http://opsprcvob.bkt.clouddn.com/View%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%88%86%E5%8F%91%E6%9C%BA%E5%88%B6.png)
### ViewGroup点击事件的分发过程
首先我们看下ViewGroup的拦截过程，也就是dispatchTouchEvent的拦截部分代码
```
final boolean intercepted;
if(actionMasked == MotionEvent.ACTION_DOWN || mFirstTouchTarget != null){//判断是否拦截
    final boolean disallowIntercept = (mGroupFlags & FLAG_DISALLOW_INTERCEPT) != 0);
    if(!disallowIntercept){//判断要拦截事件
        intercepted = onInterceptTouchEvent(ev);//由onInterceptTouchEvent中的逻辑真正确认是否拦截
    } else {//不拦截
        intercepted = false;
    }
} else {// 这种情况一般是mFirstTouchTarget == null
    intercepted = true;
}
```
从上面可以看出，ViewGroup会在ACTION_DOWN和mFirstTouchTarget != null的情况下判断是否进行拦截，注意是判断。当事件被viewGroup的子元素成功处理的时候，mFirstTouchTarget != null。意思是，如果ViewGroup不拦截，子元素处理了，mFirstTouchTarget != null。如果ViewGroup拦截了，那么mFirstTouchTarget == null，所以当ACTION_MOVE和ACTION_UP事件来临的时候，由于既不是ACTION_DOWN，且mFirstTouchTarget == null，统统都会交给ViewGroup处理，并且不会再调用onInterceptTouchEvent。
总结成一句话就是，如果ViewGroup拦截了事件，那么事件序列都会交给它处理。
当然，上面有一个FLAG_DISALLOW_INTERCEPT，它是干嘛的呢，它是一般是由子View通过requestDisallowInterceptedTouchEvent设置的。设置后，ViewGroup将无法拦截除了ACTION_DOWN以外的其它点击事件(前提是ViewGroup不拦截ACTION_DOWN)。ACTION_DOWN会重置这个标记位，也就意味着面对ACTION_DOWN的时候，ViewGroup一定会调用自己的onInterceptTouchEvent。
![](http://opsprcvob.bkt.clouddn.com/ViewGroup%E7%9A%84dispatchTouchEvent.png)
总结两点
1. 当确定拦截后，onInterceptTouchEvent不是每次事件都会调用的，要处理所有的事件，就要在dispatchTouchEvent中处理。
2. FLAG_DISALLOW_INTERCEPTED给我们思路去解决滑动冲突问题。

当ViewGroup不拦截事件的时候，事件分发的代码如下
```
final View[] children = mChildren;
for(int i = childerenCount - 1; i>0 ;i--){
    final int childIndex = customOrder? getChildDrawingOrder(chiildrenCount, i): i;
    final View child = (preorderedList == null)? children[childIndex] :preorderedList.get(childIndex);
    if(!canViewReceivePointerEvents(child) || !isTransformedTuchPointInView(x, y, child, null)){
        continue;
    }
    
    newTouchTarget = getTouchTarget(child);
    if(newTouchTarget != null){
        newTouchTarget.pointerIdBits != idBitsToAssign;
        break;
    }
    
    resetCancelNextUpFlag(child);
    if(dispatchTransformedTouchEvent(ev, false, child, idBitsToAssign)){
        mLastTouchDownTime = ev.getDownTime();
        if(preorderedList != null){
            for(int j = 0; j < childrenCount; j++){
                for(int j =0; j < childrenCount; j++){
                    mLastTouchDownIndex = j;
                    break;
                }
            }
        }else {
            mLastTouchDownIndex = childIndex;
        }
        mLastTouchDownX = ev.getX();
        mLastTouchDownY = ev.getY();
        newTouchTarget = addTouchTarget(child, idBitsTAssign);
        alreadyDispatchedToNewTouchTarget = true;
        break;
    }
    
}
```
上面代码主要的意思是先遍历ViewGroup的所有子元素，然后判断子元素是否能接收到点击事件（子元素是否在播放动画，点击事件的坐标是否落在子元素的区域内）。如果某个子元素这些条件都满足，那么就把事件交给它。dispatchTransformedTouchEvent实际上就是调用子元素的也就是dispatchTouchEvent的拦截部分代码。
```
if(child == null){
    handled = super.dispatchTouchEvent(event);
}else {
    handled = child.dispatchTouchEvent(event);
}
```
因为这里传入的child不为null，所以调用的是child.dispatchTouchEvent(event)。如果child.dispatchTouchEvent返回了true，那么dispatchTransformedTouchEvent就为true，就会继续执行代码，跳出循环
```
newTouchTarget = addTouchTarget(child, idBitsTAssign);
alreadyDispatchedToNewTouchTarget = true;
break;
```
在addTouchTarget内部会对mFirstTouchTarget赋值，使它不为null
```
private TouchTarget addTouchTarget(View child, int pointerIdBits){
    TouchTarget target = TouchTarget.obtain(child, pointerIdbits);
    target.next = mFirstTouchTarget;
    mFirstTouchTarget = target;
    return target;
}
```
如果遍历所有的子元素后，事件都没有被合适地处理。也就是ViewGroup不拦截事件，但是事件并没有得到处理。这里包含两种情况
1. ViewGroup没有子元素
2. 子元素处理了事件，但是在dispatchTouchEvent返回了false，这一般是因为子view的onTouchEvent返回了false。

在这两种情况下，ViewGroup会自己处理事件。
```
handled = dispatchTransformedTouchEvent(ev, canceled, null, TouchTarget.ALL_POINTER_IDS);
```
注意这里的child是null，根据前面的代码，它会调用super.dispatchTouchEvent(event)自己处理事件。（此刻mFirstTouchTarget = null）
```
if(child == null){
    handled = super.dispatchTouchEvent(event);
}else {
    handled = child.dispatchTouchEvent(event);
}
```

### View对点击事件的处理过程
```
public boolean dispatchTouchEvent(MotionEvent event){
    boolean result = false;
    ...
    if(onFilterTouchEventForSecurity(event)){
        ListenerInfo li = mListenerInfo;
        if(li !=null && li.mOnTouchListener !=null &&
               (mViewFlags & ENABLED_MASK) == ENABLED &&
               li.mOnTouchListener.onTouch(this, event)){
            result = true;
        }
        
        if(!result && onTouchEvent(event)){
            result = true;
        }
    }
    ...
    return result;
}
```
因为View(叶子节点)没有子元素，所以它没有拦截的代码，只有处理的代码。首先它会判断有没有设置OnTouchListener，如果OnTouchListener.onTouch被调用且返回了true，那么result就是true了，!result就是false，所以onTouchEven不会执行。
接下来看下onTouchEvent的实现，首先看View处于不可见状态的时候对点击事件的处理。
```
if((viewFlags & ENABLED_MASK) == DISABLED){
    ...
    return ((viewFlags & CLICKABLE) == CLICKABLE || (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE));
}

```
可以看出即使不可见，只要View的CLICKABLE和LONG_CLICKABLE有一个为true，都会消耗事件。

下面再看下onTouchEvent对点击事件的具体处理
```
if((viewFlags & CLICKABLE) == CLICKABLE || (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE)){
    case MotionEvent-ACTION_UP:
        ...
        performClick();
        ...
        break;
     return true;
}
```
只要View的CLICKABLE和LONG_CLICKABLE有一个为true，都会消耗事件。即onTouchEvent返回true。ACTION_UP会触发performClick，如果View设置了OnCLickListener，那么performClick就会调用OnCLickListener的onClick方法
```
public boolean performClick(){
    final boolean result;
    final ListenerInfo li = mListenerInfo;
    if(li != null && li.mOnClickListener != null){
        playSoundEffect(SoundEffectConstants.CLICK);
        li.mOnClickListener.onClick(this);
        result = true;
    }else {
        result = false;
    }
}
```
