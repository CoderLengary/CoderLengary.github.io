---
layout: post # needs to be post
title: 设计模式之组合模式
summary: 组合模式浅谈
featured-img: sleek #optional - if you want you can include hero image
categories: [设计模式]
---
组合模式也叫合成模式，是用来描述整体和部分之间的关系的。

![组合模式](https://i.loli.net/2019/01/09/5c35e69fdc370.png)

在组合模式里面有以下角色：
- Component：抽象的组件对象，为组合中的对象声明接口，让客户端可以通过这个接口来访问和管理整个对象结构，可以在里面为定义的功能提供缺省的实现。

- Leaf：叶子节点对象，定义和实现叶子对象的行为，不再包含其它的子节点对象。

- Composite：组合对象，通常会存储子组件，定义包含子组件的那些组件的行为，并实现在组件接口中定义的与子组件有关的操作。

- Client：客户端，通过组件接口来操作组合结构里面的组件对象。

说了这么多，还是用一个例子来说明一下

我们是一个卖电脑的集团。我们有总店，总店之下是分店，分店之下有加盟店。这时候，有一个新品牌开发了出来，准备在我们这里售卖，总部要把这个消息传递下去。
Component：
```
public abstract class Company{
  public abstract void add(Company company);

  public abstract void remove(Company company);

  public abstract void arrive(String computer);
}
```
Composite：
```
//总部
public class ZongGongSi extends Company{
  List<Company> fenDianList = new ArrayList<Company>();


  @Override
  public void add(Company company){
    fenDianList.add(company);

  }

  @Override
  public void remove(Company company){
    fenDianList.remove(company);
  }

  @Override
  public void arrive(String computer){
    System.out.println("总部： 新电脑到来： "+computer)
    for(Company fenDian: fenDianList){
      fenDian.arrive(computer);
    }
  }

}

//分店
public class FenDian extends Company{
  List<Company> jiaMengDianList = new ArrayList<Company>();


  @Override
  public void add(Company company){
    jiaMengDianList.add(company);

  }

  @Override
  public void remove(Company company){
    jiaMengDianList.remove(company);
  }

  @Override
  public void arrive(String computer){
    System.out.println("分店： 新电脑到来： "+computer)
    for(Company jiaMengDian: jiaMengDianList){
      jiaMengDian.arrive(computer);
    }
  }

}

//加盟店
public class JiaMengDian extends Company{



  @Override
  public void add(Company company){


  }

  @Override
  public void remove(Company company){

  }

  @Override
  public void arrive(String computer){
    System.out.println("加盟店： 新电脑到来： "+computer)
  }

}
```
客户端：
```
public class Client {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here

        ZongGongSi zongGongSi =new ZongGongSi();
        FenDian fenDian = new FenDian();
        JiaMengDian jiaMengDian = new JiaMengDian();
        fenDian.add(jiaMengDian);
        zongGongSi.add(fenDian);
        String computer = "MacBook Pro 2018";
        zongGongSi.arrive(computer);
    }

}
```
