---
layout: post # needs to be post
title: 设计模式之桥接模式
summary: 桥接模式浅谈
featured-img: emile-perron-190221
categories: [设计模式]
---
桥接模式，顾名思义就是把两部分桥接起来。桥接模式的作用就是把被分离的抽象部分和实现部分搭桥。在生活中，有很多这样的例子，比如F1赛车有很多种，法拉利，雷诺等。而它们搭配的轮胎也不同，在雨天要换雨胎，在晴天就是硬胎。

桥接模式，作用是将一个系统的抽象部分和实现部分分离，使它们都可以独立地进行变化，对应到上面就是赛车的种类可以相对变化，轮胎的种类可以相对变化，形成一种交叉的关系，最后的结果就是一种赛车对应一种轮胎就能够成功产生一种结果和行为。

桥接模式的特点是：将抽象部分与实现部分分离，使他们都可以独立地进行变化。为了达到让抽象部分和实现部分独立变化的目的，抽象部分会拥有实现部分的接口对象，有了实现部分的接口对象之后，就能够通过这个接口来调用具体实现部分的功能。桥接在程序上就体现成了抽象部分拥有实现部分的接口对象，维护桥接就是维护这个关系，也就是说，桥接模式中的桥接是一个单方向的关系，只能够抽象部分去使用实现部分的对象，而不能反过来。

桥接模式的角色：

- Abstraction：抽象部分
该类保持一个对实现部分对象的引用，抽象部分中的方法需要调用实现部分的对象来实现，该类一般为抽象类；
- RefinedAbstraction：优化的抽象部分
抽象部分的具体实现，该类一般对抽象部分的方法进行完善和扩展；
- Implementor：实现部分
可以为接口或者是抽象类，其方法不一定要与抽象部分中的一致，一般情况下是由实现部分提供基本的操作，而抽象部分定义的则是基于实现部分基本操作的业务方法；
- ConcreteImplementorA 和 ConcreteImplementorB ：实现部分的具体实现
完善实现部分中定义的具体逻辑。

![桥接模式](https://i.loli.net/2019/01/09/5c35e6dad2dee.png)

（对比装饰模式，最大的区别就是这两部分是继承不同类/接口的，而装饰模式下两部分都是继承相同接口/接口）
例子：

抽象部分就是车子
```
public abstract class Car{
  private ITire tire;
  public Car(ITire tire){
    this.tire = tire;
  }

  public ITire getTire(){
    return tire;
  }

  public abstract void run(){

  }
}
```
优化的抽象部分：
```
public Falali extends Car{
  public Falali(ITire tire){
    super.(tire);
  }

  @Overr
  public void run(){
    System.out.println("Car is Falali Tire is "+ getTire().run() );
  }
}
```
实现部分：
```
public interface ITire {
    String run();
}
```
实现部分的具体实现：
```

public class RainyTire implements ITire{
    @Override
    public String run() {
        return "run on the rainy road.";
    }
}


public class SunnyTire implements ITire{
    @Override
    public String run() {
        return "run on the sunny road.";
    }
}
```
客户端：
```
public class Client{
  public static void main(String[] args){
    Car car1 = new Falali(new RainyTire());
    car2.run();

    Car car2 = new Falali(new SunnyTire());
    car2.run();
  }
}
```
