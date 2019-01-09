---
layout: post # needs to be post
title: 设计模式之模板方法模式
summary: 模板方法浅谈
featured-img: emile-perron-190221
categories: [设计模式]
---
在软件开发中，有时会遇到这种情况，某个方法的实现需要多个步骤，其中有些步骤是固定的，有些步骤不固定，存在可变性。这个时候我们就可以使用模板方法模式。

它的定义是：定义一个操作的算法框架，而将一些步骤延迟到子类中，使得子类不改变一个算法的结构就可以重新定义算法的某些特定的步骤。
![模板方法模式](https://i.loli.net/2019/01/09/5c35919937197.png)
在模板方法模式下有以下角色
- AbstractClass：抽象类，定义了一套算法框架
- ConcreteClass：具体实现类

在了解模板方法前我们先理解一下钩子方法。
- 抽象方法：由抽象类声明，由具体子类实现。在java语言里一个抽象方法以abstract关键字标示出来。
- 具体方法：由抽象类声明并实现，而子类并不实现或覆盖。其实就是一般的方法，但是不需要子类来实现。
- 钩子方法：由抽象类声明并实现，而子类也会加以扩展。通常抽象类给出的是一个空的钩子方法，也就是没有实现的方法。其实它和具体方法在代码上没有区别，不过是意识上的一种区别。

我们来举一个打仗的例子。每个士兵都要穿戴盔甲，默认派发步枪，他们也可以选择不带枪（医疗兵），他们都需要在战场上移动，但是每个人路线是不一样的。

```
public abstract class AbstractSoilder{

  //穿戴盔甲，具体方法
  protected void wear(){
    System.out.println("士兵穿戴盔甲");
  }

  //路线，抽象方法
  protected abstract void route();

  //带不带枪，钩子方法，子类可以选择覆盖，默认是false
  protected boolean isHaveGun(){
    return false;
  }



  //开枪，钩子方法，子类可以选择覆盖
  protected void shoot(){

  }

  //框架
  public final void fighting(){

    wear();

    route();

    if(isHaveGun()){
      shoot();
    }
  }
}
```

具体实现类
```


public class Medic extends AbstractSoilder{
  @Override
  protected void route(){
    System.out.println("医疗兵跑向受伤队友");
  }
}




public class Soilder extends AbstractSoilder{
  @Override
  protected void route(){
    System.out.println("士兵冲锋陷阵");
  }

  @Override
  protected boolean isHaveGun(){
    return true;
  }

  @Override
  protected void shoot(){
    System.out.println("士兵开枪");
  }
}
```
