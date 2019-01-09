---
layout: post # needs to be post
title: View的工作原理
summary: View的工作原理浅谈
featured-img: raindrop_glass
categories: [Android]
---
要介绍View的三大流程：measure、layout、draw之前，我们需要先认识一下ViewRoot。ViewRoot对应于ViewRootImpl类，是连接WindowManager和DecorView的纽带，View的三大流程：measure、layout、draw都是由ViewRoot完成的。这个流程的开始是从ViewRoot的performTraversals方法开始的。具体如下
![View的绘制流程](https://i.loli.net/2019/01/09/5c35f9af80af0.png)
在Measure流程中，ViewGroup的performMeasure会调用measure，measure会调用onMeasure，在onMeasure里会调用所有子元素的Measure方法。这就是一次完整的遍历。
layout流程跟measure流程差不多。
Draw流程只是传递流程有区别，前两个方法的调用子View的Measure、Layout流程是在父容器的onMeasure、onLayout里进行的。而调用子View的Draw流程是在父容器的dispatchDraw里面进行的。
## 理解MeasureSpec
Measure参与了View的测量过程，在测量过程中，系统会将View的LayoutParams根据父容器施加的规则转换成MeasureSpec，然后根据这个MeasureSpec来测量出View的宽高。注意测量宽/高不等于最后的最终的宽/高。
### MeasureSpec
MeasureSpec是一个32位的int值。高2位代表SpecMode即测量模式，低30位代表SpecSize即在某种测量 模式下的规格大小。

```
private static final int MODE_SHIFT = 30;
private static final int MODE_MASK = 0x3 << MODE_SHIFT;
//0x3就是二进制的0000 0011，左移30位就是11加上后面30个0

public static final int UPSPECIFIED = 0 << MODE_SHIFT;
//就是00后面加上30个0（32个0）

public static final int EXACTLY= 1 << MODE_SHIFT;
//就是01后面加上30个0

public static final int AT_MOST = 2 << MODE_SHIFT;
//就是10后面加上30个0

public static int makeMeasure(int size, int mode){
    if(sUseBrokenMakeMeasureSpec){
        return size + mode ;
    }else {
        return (size & ~MODE_MASK) | (mode & MODE_MASK)；
        /*size & ~MODE_MASK
        ~MODE_MASK是取反，即00加上30个1
        按照两个数每一位判断，&计算中，只要有一个是0就算成0*/
        /*mode & MODE_MASK
         按照两个数每一位判断，&计算中，只要有一个是0就算成0
        */
        /*
        | 运算中，两边只要有一个是1就算成1.
        */
    }
}

public static int getMode(int measureSpec){
    return (measureSpec & MODE_MASK);
    //把measureSpec后30位变成0，这样就获取到了高2位的mode
}

public static int getSize(int measureSpec){
    return (measureSpec & ~MODE_MASK);
    //~MODE_MASK是00加上30个1，所以measureSpec高2位都变成了0，这样就获取了低30位的size
}
```
SpecMode有三类
- UPSPECIFIED 父容器不对View有任何限制，想多大给多大。
- EXACTLY 父容器已经检测出View所需要精确大小。这个时候View的大小就是SpecSize的值。对应的是中match_marent和具体数值这两种情况。
- AT_MOST 对应的是父容器中指定了一个最大可用的大小即SpecSize，View的大小不能超过这个值，它对应的是wrap_content

![MeasureSpec](https://i.loli.net/2019/01/09/5c35f9f77616b.png)
解释一下图片
1. 当子元素已经有确认宽高的时候，例如100dp等，无论父容器的SpecMode是什么，最后子元素的SpecMode都是EXACTLY，大小为子元素定义的大小
2. 而父容器素是EXACTLY，也就是说父容器是macth_parent或者是有确认值的，而子元素是mactch_parent，那么最后子元素的SpecMode是EXACTLY，SpecSize为父容器剩余的大小，表示子元素要占有这么大
3. 父容器素是EXACTLY，也就是说父容器是macth_parent或者是有确认值的，而子元素是wrap_content，那么最后子元素的SpecMode是AT_MOST，SpecSize为父容器剩余的大小，表示子元素最多只能占有这么大
4. 父容器素是AT_MOST，也就是说父容器没有一个确定的值，而子元素是mactch_parent，那么最后子元素的SpecMode是AT_MOST，SpecSize为父容器剩余的大小，表示子元素最多只能占有这么大
5. 父容器素是AT_MOST，也就是说父容器没有一个确定的值，而子元素是wrap_content，那么最后子元素的SpecMode是AT_MOST，SpecSize为父容器剩余的大小，表示子元素最多只能占有这么大
6. 不讨论UPSPECIFIED是因为这个是用于系统内部的测量过程，我们一般用不到。


## View的工作流程
### measure过程
```
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec){
    setMesuredDimension(
    getDefaultSize(getSuggestdMinimumWidth(),widthMeasureSpec),
    getDefaultSize(getSuggestdMinimumHeight(), heightMeasureSpec));
}

```

```
public static int getDefaultSize(int size, int measureSpec){
    int result = size;
    int specMode = MeasureSpec.getMode(measureSpec);
    int specSize = MeasureSpec.getSize(measureSpec);

    switch(specMode){
        ...
        case MeasureSpec.AT_MOST:
        case MeasureSpec.EXACTLY:
            result = specSize;
            break;
    }
    return result;
}
```
从getDefaultSize方法来看，View的宽/高由specSize决定。所以，我们可以得出，自定义控件需要重写onMeasure，并设置wrap_content的大小，否则specSize就是父容器剩余的大小，就相当于用match_parent。操作如下
```
protect void onMeasure(int widthMeasureSpec, int heightMeasureSpec){
    super.onMeasure(widthMeasureSpec,  heightMeasureSpec);

    //自己定义wrap_content想要的大小
    int mWidth = xx;
    int mHeight = yy;

    int widthSpecMode = MeasureSpec.getMode(widthMeasureSpec);
    int widthSpecSize = MeasureSpec.getSize(widthMeasureSpec);
    int heightSpecMode = MeasureSpec.getMode(heightMeasureSpec);
    int heightSpecSize = MeasureSpec.getSize(heightMeasureSpec);

    if(widthSpecMode == MeasureSpec.AT_MOST && heightSpecMode == MeasureSpec.AT_MOST){
        setMesuredDimension(mWidth, mHeight);
    }else if(widthSpecMode == MeasureSpec.AT_MOST){
        setMesuredDimension(mWidth, heightSpecSize);
    }else if(heightSpecMode == MeasureSpec.AT_MOST){
        setMesuredDimension(widthSpecMode, mHeight)
    }
}
```

### layout过程
layout的大致流程如下，先通过setFrame来设定View的四个顶点的位置，即初始化mLeft、mRight、mTop、mBottom。View的四个顶点一旦确定，View在父容器的位置也就确定了。接着会调用onLayout方法，目的是让父容器确定子元素的位置，因为onLayout的具体实现与具体布局有关，所以View和ViewGroup均没有真正实现onLayout方法。
```
public void layout(int l, int t, int r, int b) {
    if ((mPrivateFlags3 & PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT) != 0) {
        onMeasure(mOldWidthMeasureSpec, mOldHeightMeasureSpec);
        mPrivateFlags3 &= ~PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
    }

    int oldL = mLeft;
    int oldT = mTop;
    int oldB = mBottom;
    int oldR = mRight;

    boolean changed = isLayoutModeOptical(mParent) ?
            setOpticalFrame(l, t, r, b) : setFrame(l, t, r, b);

    if (changed || (mPrivateFlags & PFLAG_LAYOUT_REQUIRED) == PFLAG_LAYOUT_REQUIRED) {
        onLayout(changed, l, t, r, b);             // 2
        mPrivateFlags &= ~PFLAG_LAYOUT_REQUIRED;

        ListenerInfo li = mListenerInfo;
        if (li != null && li.mOnLayoutChangeListeners != null) {
            ArrayList<OnLayoutChangeListener> listenersCopy =
                    (ArrayList<OnLayoutChangeListener>)li.mOnLayoutChangeListeners.clone();
            int numListeners = listenersCopy.size();
            for (int i = 0; i < numListeners; ++i) {
                listenersCopy.get(i).onLayoutChange(this, l, t, r, b, oldL, oldT, oldR, oldB);
            }
        }
    }

    mPrivateFlags &= ~PFLAG_FORCE_LAYOUT;
    mPrivateFlags3 |= PFLAG3_IS_LAID_OUT;
}
```

如果你在自定义view的layout方法里对宽高进行修改，前面测量的宽高就不等于最后宽高。虽然这样做没有意义，但还是证明了一个问题就是view的测量宽高不一定就是最后宽高。
```
public void layout(int l, int t, int r, int b){
    super.layout(l, t, r + 100, b + 100);
}
```

### draw过程
draw过程遵循如下几步：
1. 绘制背景 background.draw(cancas)
2. 绘制自己 onDraw
3. 绘制children dispatchDraw
4. 绘制装饰 onDrawScrollBars

```
public void draw(Canvas canvas) {
    final int privateFlags = mPrivateFlags;
    final boolean dirtyOpaque = (privateFlags & PFLAG_DIRTY_MASK) == PFLAG_DIRTY_OPAQUE &&
            (mAttachInfo == null || !mAttachInfo.mIgnoreDirtyState);
    mPrivateFlags = (privateFlags & ~PFLAG_DIRTY_MASK) | PFLAG_DRAWN;

    /*
     * Draw traversal performs several drawing steps which must be executed
     * in the appropriate order:
     *
     *      1. Draw the background
     *      2. If necessary, save the canvas' layers to prepare for fading
     *      3. Draw view's content
     *      4. Draw children
     *      5. If necessary, draw the fading edges and restore layers
     *      6. Draw decorations (scrollbars for instance)
     */

    // Step 1, draw the background, if needed
    int saveCount;

    if (!dirtyOpaque) {
        drawBackground(canvas);
    }

    // skip step 2 & 5 if possible (common case)
    final int viewFlags = mViewFlags;
    boolean horizontalEdges = (viewFlags & FADING_EDGE_HORIZONTAL) != 0;
    boolean verticalEdges = (viewFlags & FADING_EDGE_VERTICAL) != 0;
    if (!verticalEdges && !horizontalEdges) {
        // Step 3, draw the content
        if (!dirtyOpaque) onDraw(canvas);

        // Step 4, draw the children
        dispatchDraw(canvas);

        // Step 6, draw decorations (foreground, scrollbars)
        onDrawForeground(canvas);

// Overlay is part of the content and draws beneath Foreground
        if (mOverlay != null && !mOverlay.isEmpty()) {
            mOverlay.getOverlayView().dispatchDraw(canvas);
        }
        // we're done...
        return;
    }
    ...
}


```
View的绘制流程的传递是通过diapatchDraw来实现的，diapatchDraw会调用子元素的draw方法，这样子元素就一层层传递下去了。
View有一个特殊的方法setWillNotDraw
```
/*
If this view doesn't do any drawing on its own, set this flag to allow further optimizations（优化计算）.

By default, this flag is not set on View, but could be set on some View subclasses such as ViewGroup.

Typically, if you override onDraw(android.graphics.Canvas) you should clear this flag.

@param willNotDraw whether or not this View draw on its own
*/
public void setWillNotDraw(boolean willNotDraw){
    setFlags(willNotDraw ? WILL_NOT_DRAW : 0, DRAW_MASK);
}
```
从setWillNotDraw的注释中可以看出，如果一个View不需要绘制任何内容，就可以设置这个标记位为true，系统会进行相应的优化。
默认情况下View没有启动这个标记位，但是ViewGroup默认开启。当我们的自定义ViewGroup需要通过onDraw来绘制内容时，就要关闭这个标记位。
