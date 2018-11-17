---
layout: post # needs to be post
title: Activity的启动模式与IntentFilter
summary: 认识四种启动模式和IntentFilter
featured-img: work
categories: [Android]
---

 我们都知道Activity是运行在任务栈中的，是一个“后进先出”的结构，当栈里没有Activity的时候，系统就会回收这个栈。知道了这一点后，聪明的你一定会想到，如果我重复创建一个Activity，那么这个栈里不就有多个实例了吗？没错，如果按照默认模式创建Activity，的确会这样。但是，谷歌的工程师早就料到这种情况了，于是他们提出了四种启动模式。接下来，就让我们来认识一下这四种模式。顺便认识一下IntentFilter。

## Activity的启动模式
 ### Standard模式
 Standard模式就是默认模式，跟我们前面讲的一样，按照这种模式启动的Activity都会在栈里面新建一个实例，即使栈里已经有它的实例存在了。额外要讲的有两点
-  谁启动了Standard模式的Activity，这个Activity就运行在启动它的栈中。比如在栈A的Activity A启动了默认模式的Activity B，那么B就会运行在栈A里面
-  如果你使用ApplicationContext去启动默认模式的Activity会报错，原因就在上面。由于ApplicationContext是非Activity类型的Context，所以它没有任务栈，自然就会报错，解决办法就是给它创建一个新的任务栈，也就是指定一个FLAG_ACTIVITY_NEW_TASK标记位（其实这个标记位就是我们后面要讲的SingleTask模式）

### SingleTop模式
SingleTop模式即栈顶复用模式，顾名思义，如果启动一个SingleTop模式的Activity，而且这个Activity还在栈顶位置的话，那么我们就不会创建一个新的实例，而是复用这个Activity，并且，这个Activity的onCreate()，onStart()不会被调用。但是如果这个Acitvity不在栈顶的话，我们还是会重新创建这个Activity的实例的。

### SingleTask模式
SingleTask是单实例的栈内复用模式，如果启动一个SingleTask模式的Activity存在于栈内，但不是栈顶，那么它会被调到栈顶，不会再创建实例。如果Activity想要的栈不存在的话，系统会创建一个新的栈给它。前面说会被调到栈顶，根据栈的特性，这个操作其实就是把Activity前面的其它Activity清空出栈。

### SingleInstance模式
SingleInstance模式是加强版的SingleTask。具有SingleInstance模式的Activity会单独运行在一个栈中，而且这个栈只有它一个Activity，整个系统中只会存在一个这样的实例。前面说Standard模式的Activity会运行在启动它的那个Activity的栈中。但SingleInstance是个例外，被它开启的任何activity都会运行在其他任务中。

### 任务栈
前面我们说了最多的名词就是任务栈，但是你有没有探讨过什么才算Activity所需要的任务栈呢？这就要提出一个名词，TaskAffinity。它标识了一个Activity所需要的任务栈名字。默认情况下，所有Activity所对应的TaskAffinity就是包名。当你需要Activity运行在某一个确切名字的栈里，TaskAffinity就派上用场了。
- 比如说TaskAffinity与SingleTask配对使用的时候，对应的Activity就会运行在和TaskAffinity相同名字的任务栈里。
- 当TaskAffinity与allowTaskReparenting结合时，就比较复杂了，一般这种情景发生在应用与应用之间。例如应用A启动了应用B的Activity，如果这个Activity的allowTaskReparenting为true，那么当应用B启动后，这个Activity会从A的任务栈里转移到B的任务栈里。再具体来讲就是，如果应用A启动了应用B的Activity C，然后回到桌面，再点击B，那么这时候不会出现B的主Activity，而是出现Activity C。你可能很费解，应用A启动了应用B的Activity C，这个Activity应该运行在应用A的栈中，点击B出现的应该是应用B栈中的主Activity。这就是allowTaskReparenting的魔力了。C的确运行在应用A的栈中，但是他们不是一个应用的，所以TaskAffinity不相同，但这时应用B还没启动，过当应用B启动的时候，系统发现C所要的栈出现了（C是应用B的Activity），就把C转移到B中来了。


## IntentFilter
这里只讲隐式调用Acitvity。当隐式调用一个Activity的时候，我们需要匹配好IntentFilter内的所有信息，包括action、category、data，否则就无法调用。当然，一个Activity可以有多个Intent-Filter，只要能匹配任何一组Intent-Filter就可以成功启动Activity。
### aciton
一个过滤规则可以有多个action，能匹配任何一个action就算action匹配成功。注意action区分大小写。
### category
为了Activity能够被隐式调用，必须在Intent-Filter里加上“android.intent.category.DEFAULT”，否则无法被调用。在Intent里面，你可以写category也可以不写，不写的话系统会自动加上“android.intent.category.DEFAULT”，这样也能匹配。
### data
data的匹配规则也差不多，只要能匹配一条就可以视为data匹配。
