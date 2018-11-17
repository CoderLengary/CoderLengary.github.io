---
layout: post # needs to be post
title: 设计模式之观察者模式
summary: 观察者模式浅谈
featured-img: work
categories: [设计模式]
---
观察者模式又称发布-订阅模式，是行为型设计模式的一种。

它的定义如下：定义对象间一对多的关系，当一个变量改变状态时，则所有依赖于它的对象都会得到通知并被自动更新。

![](http://opsprcvob.bkt.clouddn.com/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F.png)


在观察者模式中有如下角色
- Subject：抽象主体（抽象被观察者）。抽象主题角色把所有观察者对象保存在一个集合里，每个主题可以有任意数量的观察者。抽象主题提供一个接口，可以增加和删除观察者对象。
- ConcreteSubject：具体主题（具体被观察者）。该角色将有关状态存入具体观察者对象，在具体被观察者的内部状态发生改变时，给所有注册过的观察者发送通知
- Observer：抽象观察者，定义了一个更新接口，使在得到通知的时候更新自己
- ConcreteObserver：具体观察者，实现抽象观察者的更新接口，使在得到通知的时候更新自己

我们就拿微信公众号来举例子吧，订阅号是被观察者，理所应当地，微信用户就是观察者，当订阅号更新的时候，微信用户就会得到通知

抽象被观察者
```
public interface Subject{
  public void attach(Observer observer);

  public void detach(Observer observer);

  public void notify(String message);
}
```

具体被观察者
```
public class ConcreteSubject implements Subject{
  private List<Observer> weixinUserList = new ArrayList<Observer>();

  @Override
  public void attach(Observer observer){
    weixinUserList.add(observer);
  }

  @Override
  public void detach(Observer observer){
    weixinUserList.remove(observer);
  }

  @Override
  public void notify(String message){
    for(Observer observer : weixinUserList){
      observer.update(message);
    }
  }
}
```

抽象观察者
```
public interface Observer{
  public void update(String message);
}
```
具体观察者
```
public class WeiXinUser implements Observer{
  private String name;

  public WeiXinUser(String name){
    this.name = name;
  }

  @Override
  public void update(String message){
    System.out.println(name + "-"+ message);
  }
}
```
客户端
```
public class Client{
  public static void main(String[] args){
    ConcreteSubject subject = new ConcreteSubject();

    WeiXinUser user1 = new WeiXinUser("小明");
    WeiXinUser user2 = new WeiXinUser("小军");
    WeiXinUser user3 = new WeiXinUser("小红");

    subject.attach(user1);
    subject.attach(user2);
    subject.attach(user3);

    subject.notify("订阅号更新");
  }
}
```
