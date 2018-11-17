---
layout: post # needs to be post
title: 设计模式之装饰模式
summary: 装饰模式浅谈
featured-img: raindrop_glass
categories: [设计模式]
---
装饰模式也是结构性设计模式之一。它在不必改变类文件和继承的情况下，动态地扩展一个对象的功能，是继承的替代方案之一。它通过创建一个包装对象，也就是装饰对象来包裹真实的对象。

它的定义是：动态地给一个对象添加一个额外的职责，就增加功能来说， 装饰模式比生成子类更加灵活。
![](http://opsprcvob.bkt.clouddn.com/%E8%A3%85%E9%A5%B0%E6%A8%A1%E5%BC%8F.png)
在装饰模式下有以下角色：
- Component： 抽象组件，可以是接口或者抽象类，被装饰的最原始的对象。
- ConcreteComponent：组件具体实现类。被装饰的具体对象
- Decorator：抽象装饰者，从外类来拓展Component类的功能，但对于Component来说无须知道Decorator的存在，而Decorator持有Decorator
- ConcreteDecorator： 装饰者的具体实现类

装饰模式在现实中都与很多例子，人要穿衣服，给手机贴膜等等。现在我们来举一个人学知识的例子

抽象组件：
作为人肯定要上学，我们先定义一个人的抽象类，里面有读书的抽象类
```
public abstract class People{
  public abstract void wear();
}
```
组件具体实现类：
```
public class Junjun extends People{
  @Override
  public void wear(){
    System.out.println("军军穿上衣服");
  }
}
```
抽象装饰者
```
public abstract class Parent extends People{
  private People son;
  public Parent(People son){
    this.son = son;
  }
  @Override
  public void wear(){
    son.wear();
  }
}
```
装饰者具体实现类
```

public class Father extends Parent {

  public Father(People son){
    super(son);
  }

  public void wearHat(){
    System.out.println("爸爸给军军戴帽子");
  }

  @Override
  public void wear(){
    son.wear();
    wearHat();
  }

}

public class Mother extends Parent {

  public Mother(People son){
    super(son);
  }

  public void wearShoes(){
    System.out.println("妈妈给军军穿鞋子");
  }

  @Override
  public void wear(){
    son.wear();
    wearShoes();
  }

}


```
客户端调用
```
public class Client{
  public static void main(String[] args){
    Junjun junjun = new Junjun();

    //爸爸给军军戴帽子
    Father father = new Father(junjun);
    father.wearHat();

    //妈妈给军军穿鞋子
    Mother mother = new Mother();
    mother.wearShoes();
  }
}
```
