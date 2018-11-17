---
layout: post # needs to be post
title: 设计模式的六大原则
summary: 浅谈Android中的ANR现象
featured-img: emile-perron-190221
categories: [设计模式]
---
要介绍设计模式，就要先介绍它的六大原则。它们分别是单一职责原则、开放封闭原则、里式替换原则、依赖倒置原则、迪米特原则（最少知识原则）、接口隔离原则（接口多样化、专业化）。
### 单一职责原则
通俗地讲就是我们不要让一个类承担太多的职责。如果一个类承担的职责太多，就等于把这些职责耦合在一起，这种耦合会导致脆弱设计，当变化发生时，设计会遭到破坏。

比如说在MVP模式里面，fragment类就只负责展示数据，如果里面还负责数据获取等，到时维护起来就会很麻烦。

### 开放封闭原则
开放封闭，阐释起来就两点：对于拓展是开放的，对于修改是封闭的。在程序开发中，需求是要变化的。如果有新需求的话，就要去更改原来的类，这样做的成本有点高。所以在设计程序的时候，面对需求的改变应尽可能地保证相对稳定，尽量通过扩展的方式去实现新功能。
这里给一个例子（来自网上）
我们现在在经营一家书店，书店里自然售卖书籍。所以我们定义了以下类。

![](http://opsprcvob.bkt.clouddn.com/%E5%BC%80%E6%94%BE%E5%B0%81%E9%97%AD%E5%8E%9F%E5%88%99-%E4%B9%A6%E5%BA%971.png)
书籍接口以及书籍类别：
![](http://opsprcvob.bkt.clouddn.com/%E5%BC%80%E6%94%BE%E5%B0%81%E9%97%AD%E5%8E%9F%E5%88%99-%E4%B9%A6%E5%BA%972.png)
书店实现：
![](http://opsprcvob.bkt.clouddn.com/%E5%BC%80%E6%94%BE%E5%B0%81%E9%97%AD%E5%8E%9F%E5%88%99-%E4%B9%A6%E5%BA%973.png)
运行结果：
![](http://opsprcvob.bkt.clouddn.com/%E5%BC%80%E6%94%BE%E5%B0%81%E9%97%AD%E5%8E%9F%E5%88%99-%E4%B9%A6%E5%BA%974.png)

项目投产，书店盈利，但为扩大市场，书店决定，40元以上打8折，40元以下打9 折。如何解决这个问题呢？

第一个办法：修改接口。在IBook上新增加一个方法getOffPrice()，专门进行打折，所有实现类实现这个方法。
但是这样修改的后果就是实现类NovelBook要修改,BookStore中的main方法也修改，同时Ibook作为接口应该是稳定且可靠的，不应该经常发生变化，否则接口做为契约的作用就失去了效能，其他不想打折的书籍也会因为实现了书籍的接口必须打折，因此该方案被否定。

第二个办法：修改实现类。修改NovelBook 类中的方法，直接在getPrice()中实现打折处理，这个应该是大家在项目中经常使用的就是这样办法，通过class文件替换的方式可以完成部分业务（或是缺陷修复）变化，该方法在项目有明确的章程（团队内约束）或优良的架构设计时，是一个非常优秀的方法。
但是该方法还是有缺陷的，例如采购书籍人员也是要看价格的，由于该方法已经实现了打折处理价格，因此采购人员看到的也是打折后的价格，这就产生了信息的蒙蔽效果，导致信息不对称而出现决策失误的情况。该方案也不是一个最优的方案。
也就是我们既需要能够获取它的原价格也需要获取它的打折价格。这个方法只能获取一种价格

第三个办法：最优方案，通过扩展实现变化。增加一个子类 OffNovelBook，覆写getPrice方法，高层次的模块（也就是static静态模块区）通过OffNovelBook类产生新的对象，完成对业务变化开发任务。好办法，风险也小，我们来看类图：

![](http://opsprcvob.bkt.clouddn.com/%E5%BC%80%E6%94%BE%E5%B0%81%E9%97%AD%E5%8E%9F%E5%88%99-%E4%B9%A6%E5%BA%975.png)

书籍接口以及书籍类别：
![](http://opsprcvob.bkt.clouddn.com/%E5%BC%80%E6%94%BE%E5%B0%81%E9%97%AD%E5%8E%9F%E5%88%99-%E4%B9%A6%E5%BA%976.png)

书店实现：
![](http://opsprcvob.bkt.clouddn.com/%E5%BC%80%E6%94%BE%E5%B0%81%E9%97%AD%E5%8E%9F%E5%88%99-%E4%B9%A6%E5%BA%977.png)

运行结果：
![](http://opsprcvob.bkt.clouddn.com/%E5%BC%80%E6%94%BE%E5%B0%81%E9%97%AD%E5%8E%9F%E5%88%99-%E4%B9%A6%E5%BA%978.png)

### 里氏替换原则
里氏替换原则就是，将一个基类对象替换成其子类对象，程序就不会产生任何错误和异常。反之则不成立，如果一个子类替换成基类，程序可能会产生错误。
我们来看一个违反里氏替换原则的例子。
我们需要完成一个两数相减的功能，由类Subtraction来负责：
![](http://opsprcvob.bkt.clouddn.com/%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8D%A2%E5%8E%9F%E5%88%991.png)
运行结果：
![](http://opsprcvob.bkt.clouddn.com/%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8D%A2%E5%8E%9F%E5%88%992.png)
后来，我们需要增加一个新的功能：完成两数相加，然后再与100求和，由类Add来负责。所以类Add继承类Subtraction后，代码如下：
![](http://opsprcvob.bkt.clouddn.com/%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8D%A2%E5%8E%9F%E5%88%993.png)
我们发现原来运行正常的相减功能发生了错误。原因就是类Add在给方法起名时无意中重写了父类的方法，造成所有运行相减功能的代码全部调用了类Add的重写后的方法，造成原本运行正常的功能出现了错误。
在这里，父类被子类替换后，原来的程序出现了错误。

在实际编程中，我们常会通过重写父类的方法来完成新的功能，这样写起来虽然简单，但是整个继承体系的可复用性会比较差，特别是运用多态比较频繁时，程序运行出错的几率非常大。如果非要重写父类的方法，比较通用的做法是：原来的父类和子类都继承一个更通俗的基类，如接口、抽象类。

所以我们在运用里氏替换原则时，应该尽量把父类设计成抽象类或者接口。

### 依赖倒置原则
依赖倒置原则指的是：模块间的依赖通过抽象（抽象类或者接口）发生，实体类不应该直接发生依赖关系。如果类与类产生直接依赖，就会直接耦合，修改的时候就会同时修改依赖者的代码，限制了可扩展性。
一句话概括就是，模块与模块之间的依赖应该是通过接口或者抽象类。
例如MVP里面的Present模块和View模块

### 迪米特原则
迪米特原则要求我们在设计系统时，就应该尽量减少对象之间的交互，这两个对象对彼此要尽可能地少去了解。如果两个对象不必直接通信，就不应当发生直接的相互作用。如果其中一个对象需要调用另一个对象的某一个方法，则可以通过第三者转发这个调用。
一句话概括就是，通过引入一个合适的第三者来降低现有对象之间的耦合度。
例如MVP里面的MVP，第三者是Present

### 接口隔离原则
建立单一接口，而不是建立庞大的接口。尽量细化接口，接口中的方法应当尽量少。也就是说我们要对每个类建立专用接口，而不是建立一个庞大的接口供所有依赖它的类调用。注意接口尽量小，但是要有限度，不要过小造成设计复杂化。
例如MVP里面的契约接口。