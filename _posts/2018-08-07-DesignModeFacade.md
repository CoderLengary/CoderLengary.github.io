---
layout: post # needs to be post
title: 设计模式之外观模式
summary: 外观模式浅谈
featured-img: shane-rounce-205187
categories: [设计模式]
---
外观模式也叫门面模式。它的定义是：要求一个子系统外部与内部的通信必须通过一个统一的对象来进行。
在外观中有以下角色
- Facade：外观类，知道哪些子系统负责处理请求，将客户端的请求转发给适当的子系统对象
- SubSystem：子系统类，可以有一个或多个子系统，实现功能，注意子系统不含有外观类的引用

现在举一个小例子：
比如在玩FPS游戏中，你可以拿枪杀人，也可以拿刀杀人，还可以呼叫无人机。

子系统，也就是杀人的模式
```
//子系统1
public class Gun(){
  public void woQiang(){
    System.out.println("握住枪");
  }
  public void kaiQiang(){
    System.out.println("开枪");
  }
}

//子系统2
public class Knife(){
  public void woDao(){
    System.out.println("握住刀");
  }
  public void daoKan(){
    System.out.println("刀砍");
  }
}

//子系统3
public class Call(){
  public void kongXi(){
    System.out.println("呼叫空袭");
  }
  public void zhenCha(){
    System.out.println("呼叫无人机侦察");
  }
}
```
外观类，也就是人
```
public class People{
  private Gun gun;
  private Knife knife;
  private Call call;

  public People(){
    gun = new Gun();
    knife = new Knife();
    call = new Call();
  }


  public void tuXi(){
    //突袭模式
    gun.woQiang();
    gun.kaiQiang();
    call.kongXi();
  }

  public void qianXing(){
    //潜行模式
    call.zhenCha();
    knife.woDao();
    knife.zhenCha();
  }
}
```
客户端
```
public class Client{
  public static void main(String[] args){
    People people = new People();
    people.qianXing();
    people.tuXi();
  }
}
```
当玩家要使用潜行杀敌或突袭杀敌的时候，他已经计划好了怎么做了。他也可以改变潜行或突袭内部的具体步骤。客户端只需要调用突袭或潜行即可，对其内部的运作是一无所知的。外观模式本来就是把子系统的逻辑和交互隐藏起来，为用户提供一个高层次的接口，使得系统更加易用。同时也隐藏了具体的实现，即使子系统发生了变化，用户也不会感知到。

它的缺点也很明显，不符合开放封闭原则。
