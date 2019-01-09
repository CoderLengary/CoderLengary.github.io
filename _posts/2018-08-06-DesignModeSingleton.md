---
layout: post # needs to be post
title: 设计模式之单例模式
summary: 单例模式浅谈
featured-img: design
categories: [设计模式]
---
创建型设计模式，顾名思义，就是与对象的创建有关。它包括单例模式、工厂方法模式、抽象工厂模式、建造者模式、原型模式。
## 单例模式
定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

![单例模式](https://i.loli.net/2019/01/09/5c35e736d9fa5.png)

### 饿汉模式
```
public class Singleton(){
  private static Singleton INSTANCE = new Singleton();

  private Singleton(){

  }

  public static Singleton getInstance(){
    return INSTANCE;
  }

}
```
由于static的特性，这种方法在在类加载的时候就实例化INSTANCE了，避免了多线程的同步问题，获取对象的速度快。但是这种在类加载的时候就实例化的方法没有达到懒加载的效果，还会让类加载的速度变慢。如果从始至终都没有使用过这个类，就会造成内存的浪费。
### 懒汉模式（线程不安全）
```
public class Singleton{
  private static Singleton INSTANCE;

  private Singleton(){

  }

  public static Singleton getInstance(){
    if(INSTANCE == null){
      INSTANCE = new Singleton();
    }
    return INSTANCE;
  }

}
```
你可以看到，初始化是在用户调用的时候进行的。这虽然节约了资源，但是也造成了一个问题，如果两个线程同时调用了getInstance，那么就会产生了两个类。所以说这个方法在多线程下不能正常工作，它是线程不安全的。
### 懒汉模式（线程安全）
```
public class Singleton{
  private static Singleton INSTANCE;

  private Singleton(){

  }

  public static Synchronized Singleton getInstance(){
    if(INSTANCE == null){
      INSTANCE = new Singleton();
    }
    return INSTANCE;
  }

}
```
这种写法能在多线程中很好地工作，但是每次调用getInstance都要进行同步，造成不必要的同步开销，因为调用一次实例化后，继续调用，返回实例的时候还要进行同步就十分不合理了。所以不推荐这种模式。
### 双重检查模式
```
public class Singleton{
  private volatile static Singleton INSTANCE;

  private Singleton(){

  }

  public static Singleton getInstance(){
    if(INSTANCE == null){
      Synchronized(Singleton.class){
        if (INSTANCE == null){
          INSTANCE = new Singleton();
        }
      }
    }
    return INSTANCE;
  }

}
```
第一次判空是为了不必要的同步，第二次是在INSTANCE为null才创建实例，这种模式资源利用率高，在第一次同步创建实例后，接下来获得实例就不用再同步了。
### 静态内部类单例模式
```
public class Singleton{
  private Singleton(){

  }

  public static Singleton getInstance(){
    return SingletonHolder.INSTANCE;
  }

  private static class SingletonHolder{
    private static final Singleton INSTANCE = new Singleton();
  }

}
```
第一次加载Singleton类不会初始化INSTANCE，只有调用getInstance才会初始化，由于INSTANCE是处于内部类的，并且是内部类的全局变量。首先全局变量的特性，使得在SingletonHolder类在加载的时候就初始化了，INSTANCE所以在SingletonHolder是绝对单例的。加上内部类本身加载就是单例的，两者综合起来就保证了线程同步。并且后续再调用getInstance也是直接返回单例，资源利用率高。
### 枚举单例模式
```
public enum Singleton{
  INSTANCE;
}
```
创建枚举本身就是线程安全的，不用担心存在多个实例的问题。但是在日常应用开发很少用枚举，可读性不高。
