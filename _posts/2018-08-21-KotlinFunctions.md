---
layout: post # needs to be post
title: (译)掌握Kotlin的标准函数
summary: run，with，T.run，T.let，T.also和T.apply
featured-img: emile-perron-190221
categories: [Kotlin]
---
我们一定遇到过这种情况，一些Kotlin的标准函数是十分相似的，以致于我们很难选择要用哪一个。在这篇文章中我将分享一个简单的诀窍，让你们能够清楚地分辨它们的不同，这样你们就知道在哪种情景下该用哪一个函数。

### 范围函数
在这里我们关注以下几个函数：run，with，T.run，T.let，T.also和T.apply。我称它们为范围函数，因为它们主要的功能就是在函数调用中去提供一个范围。

为了能够最为简单直观地解释，我们就拿run这个函数来说明。
```
fun test() {
  var mood = "I am sad"

  run {
    val mood = "I am happy"
    println(mood) //I am happy
  }

  println(mood) //I am sad
}
```
在这个test()函数中，通过run，你可以有一个独立的范围，在这个范围里我们新定义了一个mood，并且这段代码只在run的范围里面有效，你可以直观地看出两个String的变量名都是mood，但是它们不冲突。

看到这，你可能会说，在一个函数内run的确提供了一个独立的范围，但是它看起来好像没多大用。其实run还有一个优点是：它会返回run代码块内最后一个对象。

下面这段简洁的代码展示了这一点，通过run我们可以给两个view应用一个show()，而不是分别给两个view调用两个show()
```
run {
  if (firstTimeView) introView else normalView
}.show ()
```
### 范围函数的三个特性
为了让范围函数这个概念更加生动，我们用三个特性来区分它们的行为。接下来我们将用这些特性来两两区分

#### 1.普通函数 VS 拓展函数
如果我们仔细观察with和T.run的话，我们会发现这两个函数功能十分相似。下面这段代码将解释这一点
```
with(webView.setttings) {
  javaScriptEnabled = true
  databaseEnabled = true
}

webView.setttings.run {
  javaScriptEnabled = true
  databaseEnabled = true
}
```
我们能看出的最大不同就是一个是普通函数 with，另一个是拓展函数  T.run

好吧，那么现在问题就很简单了，那一个更具有优势？

想象一下，当webView.setttings可以为Null时，它们将会变成这样：
```
with(webView.setttings) {
  this?.javaScriptEnabled = true
  this?.databaseEnabled = true
}

webView.setttings?.run {
  javaScriptEnabled = true
  databaseEnabled = true
}
```
在这个情景下，很明显T.run更具有优势，因为我们可以在使用它之前判空

#### 2.This VS it 参数
如果我们仔细看下T.run和T.let，这两个函数都几近相同除了一点：它们接受参数的方式。下面这段代码将展示两个相同逻辑的代码
```
stringVariable?.run {
  println("The length of this String is $length")
}

stringVariable?.let {
  println("The length of this String is {it.length}")
}
```
如果你看过了T.run的函数说明，你就会意识到T.run本质就是提供了一个叫block: T.()的拓展函数。因此，在T.run的范围内，T可以被引用成this，并且在多数情况下这个this可以被省略。因此在我们的代码里，我们可以在println里使用$length而不是{this.length}.我把这种情况称为传递this参数

然而在T.let函数说明文档中，你可以看到T.let是把它自己传递到函数里的，也就是block: (T)。因此这就像传递一个lambda参数。它可以在T.let的范围内被引用成it。我把这种情况成为传递it参数。

在上面的代码中，T.run看起来比T.let更具有优势，因为T.run更加隐式。但是下面这几点揭示了T.let微妙的优势
- T.let提供了一个明显的分界线，在使用变量函数/成员的同时和外部的函数/成员划分了清晰的界限，比如你可以清楚地分辨出哪个是外部的成员，哪个是T.let中的成员
- 在this不能被省略的情况下，比如它在函数内传递了自己作为参数，"it"写起来比"this"更短且更清晰明了
- T.let允许你更好地去重命名已经存在的变量，也就是你可以把it转换成别的名字

```
stringVariable?.let {
  notNullString ->
  println("The length of this String is $notNullString")
}
```

### 3.返回当前类型 VS 返回其它类型
现在，我们看下T.let和T.also，在以下的代码中，它们两个就是一样的
```
stringVariable?.let {
  println("The length of this String is {it.length}")
}

stringVariable?.also {
  println("The length of this String is {it.length}")
}
```
然而它们微妙的不同之处就是它们返回的类型。T.let返回了一个完全不同的类型，而T.also返回了T自己，也就是this

在链式函数中这两者都十分有用，T.let让你可以修改执行逻辑，T.also让你可以通过相同的变量（比如this）执行操作

我们就拿下面的代码举例子
```
val original = "abc"

// 改变当前值并传递到下一个链式函数中
original.let {

  println("The original String is $it") //"abc"

  it.reverse() //改变it的变量，并把它作为参数传递到下一个let。it.reverse返回一个全新变量

}.let {

  println("The reverse String is $it") //"cba"

  it.length //我们还可以改变返回it类型

}.let {

  println("The length of the String is $it") //3

}

val original = "abc"

original.also {

  println("The original String is $it") //"abc"

  it.reverse() //即使我们改变返回的变量，返回的变量依旧不变。it.reverse返回一个全新变量

}.also {

  println("The reverse String is ${it}") //"abc"

  it.length //即使我们改变了返回类型，返回的变量依旧不变

}.also {

  println("The length of the String is $it") //"abc"

}

//如果我们要达到T.let的效果
original.also {

  println("The original String is $it") //"abc"


}.also {

  println("The reverse String is ${it.reverse()}") //"cba"


}.also {

  println("The length of the String is ${it.length}") //3

}
```

看过了上面的代码，你也许会觉得T.also看起来没有多大的意义，因为我们可以把三个println放在一个函数区间就好，比如
```
original.also {
  println("The original String is $it") //"abc"
  println("The reverse String is ${it.reverse()}") //"cba"
  println("The length of the String is ${it.length}") //3
}
```
但是想得再深一点的话，它的确有一些优点：
- 它可以给同一个对象提供一个清晰的分离过程，比如实现一些小的功能块
- 在被使用之前，它可以实现十分有用的自我操作，比如实现一个链式建造过程

需要注意的是在T.also的返回中，我们可以改变原来变量的值，只要返回的是同一个变量就可以。比如
```
data class Data (
        var id: Int,
        var name: String
)

fun test() {
        var data = Data(2, "Ming")
        data.also {
            data.name = "Hong"
        }.also {
            println(it) //data: id = 2, name = "Hong"
        }
    }
```
当在链式调用时，需要一个要改变原来变量，一个要保持原来变量，结合T.let，T.also就十有用，在下面的例子中，我们将通过路径创建一个文件，并通过这个文件创建文件夹，最后返回文件
```
//通常操作
fun makeDir(path: String): File {
  val result = File(path)
  result.mkdirs()
  return result
}

//进阶操作
fun makeDir(path: String) = path.let{ File(it) }.also{ it.mkdirs() }
```

### 回顾所有的特性
通过回顾这3个特性，我们可以更了解函数逻辑。现在我们来关注T.apply这个函数，因为之前我们都没怎么提起过它。T.apply的三个特性如下：
- 它是一个拓展函数
- 它传递this为它的参数
- 它返回的对象是this

因此，你可以这样使用它，下面展示了一个创建Fragment的例子
```
//通常操作
fun createInstance(args: Bundle) : MyFragment {
  val fragment = MyFragment()
  fragment.arguments = args
  return fragment
}
//进阶操作
fun createInstance(args: Bundle) = MyFragment().apply( arguments = args)
```
或者我们可以把一个不是链式调用的对象转换成链式调用
```
//正常操作
fun createIntent(intentData: String, intentAction: String): Intent {
  val intent = Intent()
  intent.action = intentAction
  intent.data = Uri.parse(intentData)
  return intent
}
//进阶操作
fun createIntent(intentData: String, intentAction: String) =
    Intent().apply( action = intentAction ).apply{ data = Uri.parse(intentData) }
```
### 函数选择
因此，通过这三个特性，我们可以清楚地将这些函数归类。如下，我们可以建立一个决策树，它可以帮助我们决定使用哪种函数，这一切都依赖于我们的需求。

![Kotlin函数](https://i.loli.net/2019/01/09/5c3577a28c196.jpg)

希望这个决策树能帮助你更好地理解这些函数，能够简化你的决策，让你能很好地掌握这些函数的用法

原文链接：[Mastering Kotlin standard functions: run, with, let, also and apply](https://medium.com/@elye.project/mastering-kotlin-standard-functions-run-with-let-also-and-apply-9cd334b0ef84)
