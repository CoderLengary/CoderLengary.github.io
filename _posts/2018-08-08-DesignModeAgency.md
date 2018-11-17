---
layout: post # needs to be post
title: 设计模式之中介者模式
summary: 中介者模式浅谈
featured-img: emile-perron-190221
categories: [设计模式]
---
中介者模式
生活中的中介者的作用就是连接两方的一个桥梁，比如房产中介，买房的只需跟中介打交道，然后买房的也跟着中介打交道。

所有买房的和卖房的都只需要跟中介者一个人打交道，买房的不需要知道卖房的是什么人，有多少卖房的等等。都省事了很多。

它的定义是通过中介者包装一系列对象的交互，使得这些对象不必相互显式引用，从而使它们可以松散耦合。中介者模式将多对多的相互作用转化为一堆多的相互作用。

- Mediator: 抽象的中介者角色，定义了同事对象到中介者的接口。
- ConcreteMediator：具体的中介者角色，从具体的同事对象接收消息，同时向具体的同事对象发出命令。
- Colleague：抽象同事类角色，定义了中介者对象的接口，只知道中介而不知道其他同事对象。
- ConcreteColleagueA，B：具体的同事类角色，每个具体同事类都知道本身在小范围内的行为，而不知道他在大范围中的行为。

按照刚刚的例子，我们来看一下具体代码

抽象的中介者
```
public abstract class Mediator{
  public abstract void change(People people);
}
```
具体的中介者
```
public class ConcreteMediator{

  private Comsumer comsumer;
  private Seller seller;

  public ConcreteMediator(Comsumer comsumer, Seller seller){
    this.comsumer = comsumer;
    this.seller = seller;
  }

  public void change(People people){

    if(people instanceof Comsumer){
      //如果是消费者发来的消息，就让卖家处理
      seller.getConsumer(people);

    }else if(people instanceof Seller){
      //如果是卖家发来的消息，就让消费者处理
      comsumer.getSeller(people);

    }

  }


}
```
抽象同事类角色
```
public abstract class Colleague {
  private Mediator mediator;

  public Colleague(Mediator mediator){
    this.mediator = mediator;
  }
}
```
具体的同事类角色
```
public class Seller{
  public Seller(Mediator mediator){
    super.Seller(mediator);
  }
  public void getConsumer(People people){
    System.out.println("有新客户");
    mediator.change(this);
  }
}

public class Comsumer{
  public Comsumer(Mediator mediator){
    super.Comsumer(mediator);
  }

  public void request(){
    //向中介发出买房请求
    mediator.change(this);
  }
  public void getSeller(People people){
    System.out.println("有卖房的了);
  }
}
```
