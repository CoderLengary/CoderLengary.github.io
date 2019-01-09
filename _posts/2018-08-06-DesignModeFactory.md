---
layout: post # needs to be post
title: 设计模式之工厂模式
summary: 工厂模式浅谈
featured-img: raindrop_glass
categories: [设计模式]
---
### 简单工厂模式
简单工厂模式是由一个工厂对象决定创建出哪一种产品类的实例
![简单工厂模式](https://i.loli.net/2019/01/09/5c35ee96c23f0.png)
它有这三种角色
- Factory：工厂类，它负责实现创建所有实例。工厂类的创建产品类可以被外界调用，创建所需的对象。
- IProduct：抽象产品类，这是所有产品的父类，用于描述所有产品应该有的共同方法
- Product：具体产品类

举个例子，我们是一个电脑代工商，主要生产联想、华硕、惠普的电脑。
首先创建计算机抽象产品类，用来描述共同特征
```
public abstract class Computer{
  //所有电脑都有开机功能
  public abstract void start();
}
```
接下来创建具体产品类
```
public class LenvoComputer extends Computer{
  @Override
  public void start(){
    System.out.println("联想计算机启动");
  }
}

public class HpComputer extends Computer{
  @Override
  public void start(){
    System.out.println("惠普计算机启动");
  }
}

public class AsusComputer extends Computer{
  @Override
  public void start(){
    System.out.println("华硕计算机启动");
  }
}
```
创建一个工厂类，它提供一个createComputer来生产计算机。
```
public class ComputerFactory{
  public static Computer createComputer(String type){
    Computer mComputer = null;
    switch (type){
      case "lenovo":
        mComputer = new LenvoComputer();
        break;
      case "hp":
        mComputer = new HpComputer();
        break;
      case "asus":
        mComputer = new AsusComputer();   
        break;
    }
    return mComputer;
  }
}
```
客户端调用工厂类，创建一个惠普电脑，并开机
```
public class Client {
  public static void main(String[] args){
    ComputerFactory.createComputer("hp").start();
  }
}
```
在这里你们也觉察到了，这里电脑的类型是确定的，要增加新类型，就要修改工厂，这意味着它已经违背了开放封闭原则。当然它也有优点，就是让用户根据参数获得对应的类的实例，避免直接实例化类，降低耦合性。因此这个模式适用的场景是创建的对象类别比较少的情况。
### 工厂方法模式
定义一个用于创建对象的接口，让工厂决定实例化哪个类。工厂方法将一个类的实例化推迟到子类。
![工厂模式](https://i.loli.net/2019/01/09/5c35eec0ccb09.png)
首先创建计算机抽象产品类，用来描述共同特征
```
public abstract class Computer{
  //所有电脑都有开机功能
  public abstract void start();
}
```
接下来创建具体产品类
```
public class LenvoComputer extends Computer{
  @Override
  public void start(){
    System.out.println("联想计算机启动");
  }
}

public class HpComputer extends Computer{
  @Override
  public void start(){
    System.out.println("惠普计算机启动");
  }
}

public class AsusComputer extends Computer{
  @Override
  public void start(){
    System.out.println("华硕计算机启动");
  }
}
```
创建抽象工厂
```
public abstract class IComputerFactory{
  public abstract <T extends Computer> T createComputer(Class<T> clz);
}
```
创建具体工厂，通过反射来生产不同厂家的计算机
```
public class ComputerFactory extends IComputerFactory{
  @Override
  public  <T extends Computer> T createComputer(Class<T> clz){
    Computer computer = null;
    String className = clz.getName();
    try{
      computer = (Computer) Class.fromName(className).newInstance();
    }catch (Exception e) {
      e.printStackTrace();
    }
    return (T) computer;
  }
}
```
客户端调用
```
public class Client {
  public static void main(String[] args){
    ComputerFactory computerFactory = new ComputerFactory();
    LenvoComputer lenovo = computerFactory.createComputer(LenvoComputer.class);
    lenovo.start();
  }
}
```
对于简单工厂模式，实例化位于工厂类，当我们需要增加产品时，就需要在工厂类中加一个case，这就违背开放封闭原则。而在工厂模式，由于是通过反射的形式，我们不需要修改工厂的代码。
