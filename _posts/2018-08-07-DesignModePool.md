---
layout: post # needs to be post
title: 设计模式之享元模式
summary: 享元模式浅谈
featured-img: design
categories: [设计模式]
---
结构型设计模式：顾名思义，它是从结构上解决模块之间的耦合问题。包括适配器模式、代理模式、装饰模式、外观模式、桥接模式、组合模式和享元模式。
### 享元模式

享元模式是池技术的重要实现方式，它可以减少应用程序创建的对象，降低程序内存的占用，提高程序的性能。

它的定义是：使用共享对象能有效地支持大量细粒度的对象

要求细粒度的对象，那么不可避免地使得对象数量多且性质相近。这些对象分为两个部分：内部状态和外部状态。内部状态是对象可以共享的信息，它存储在享元对象的内部且不会随着环境的改变而改变。外都对象则是会随环境改变而改变的并且不可共享的状态。

在享元模式下有以下角色
- Flyweight：抽象享元角色，同时定义出对象的外部状态和内部状态的接口或实现。
- ConcreteFlyweight：具体享元角色，实现抽象享元角色定义的业务
- FlyweightFactory：享元工厂，负责管理对象池和创建享元对象

现在我们来举一个例子说明这个模式，我们要在商城售卖手机，每款手机有不同的存储版本，比如16G，32G等。所以我们可以先看出手机品牌是内部状态，而它的外部状态是存储规格。

抽象享元角色：
```
public interface IGoods{
  public void showGoodsPrice(String name);
}
```
具体享元角色：
```
public class Goods implements IGoods{

  private String name;

  private String version;

  Goods(String name){
    this.name = name;
  }

  @Override
  public void showGoodsPrice(String version){
    if(version.equals("32G")){
      System.out.println("价格为5199元");
    }else if(version.equals("128G")){
      System.out.println("价格为5999元");
    }
  }

}
```
享元工厂：
```
public class GoodsFactory{
  private static Map<String,Goods> pool = new HashMap<String,Goods>();

  public static Goods getGoods(String name){
    if(pool.containsKey(name)){
      System.put.println("使用缓存，key为+ "+name);
      return pool.get(name);
    }else {
      Goods goods = new Goods(name);
      pool.put(name, goods);
      System.put.println("创建商品，key为+ "+name);
      retun goods;
    }
  }
}
```
客户端调用：
```
public class Client{
  public static void main(String[] args){
    Goods goods1 = GoodsFactory.getGoods("iphone7");
    goods1.showGoodsPrice("32G");
    Goods goods2 = GoodsFactory.getGoods("iphone7");
    goods1.showGoodsPrice("32G");
    Goods goods3 = GoodsFactory.getGoods("iphone7");
    goods1.showGoodsPrice("128G");
  }
}
```
从代码中可以看出，除了第一次是创建iphone7，后面均因为key值相同，所以均使用了对象池中的iphone7对象。在这里例子中，name作为内部状态是不变的，并且作为Map的key值是可以共享的，而showGoodsPrice传入的version则是外部状态，它的值是变化的。

其实在Java中就存在这种类型的实例：String。

Java中将String类定义为final（不可改变的），JVM中字符串一般保存在字符串常量池中，这个字符串常量池在jdk 6.0以前是位于常量池中，位于永久代，而在JDK 7.0中，JVM将其从永久代拿出来放置于堆中。

我们使用如下代码定义的两个字符串指向的其实是同一个字符串常量池中的字符串值。
```
public class JavaApplication50 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        String s1= "abc";
        String s2="abc";
        System.out.println(s1.hashCode());
        System.out.println(s2.hashCode());
    }

}
```
打印结果
```
run:
96354
96354
```
