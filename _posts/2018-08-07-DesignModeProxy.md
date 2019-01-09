---
layout: post # needs to be post
title: 设计模式之代理模式
summary: 代理模式浅谈
featured-img: work
categories: [设计模式]
---
代理模式也称为委托模式，它是结构型设计的一种。

它的定义是：为其它对象提供一种代理以控制对这个对象的访问。

![代理模式](https://i.loli.net/2019/01/09/5c3592fa68628.pngg)

在代理模式有如下角色：
1. Subject：抽象主题类，声明真实主题与代理的共同接口方法
2. RealSubject：真实主题类，代理类所代表的真实主题。客户端通过代理类间接地调用真实主题类的方法
3. Proxy：代理类，持有对真实主题类的引用，在其所实现的接口方法中调用真实主题类中相应的接口方法执行
4. Client：客户端

### 静态代理
这里举一个港代购买Macbook Pro的例子

抽象主题类：
抽象主题具有真实主题类和代理的共同接口方法，即够买
```
public interface IShop{
  viod buy();
}
```

真实主题类：
实现抽象主题类的方法
```
public class Lengary implements IShop{
  @Override
  public void buy() {
    System.out.println("购买");
  }
}
```
代理类：
代理类也要实现抽象主题类的方法，并且要持有真实主题（被代理者），并在方法中调用被代理者的方法
```
public class Friend implements IShop{
  private IShop mShop;

  public Friend(IShop mShop){
    this.mShop = mShop;
  }

  @Override
  public void buy() {
    mShop.buy();
  }
}
```
客户端类：
```
public class Client {
  public static viod main(String[] args){
    IShop lengary = new Lengary();
    IShop friend = new Friend(lengary);
    friend.buy();
  }
}
```

### 动态代理
上面的例子是静态代理，在代码运行的时候就已经存在了代理类的class编译文件；而动态代理则是在代码运行时通过反射来动态生成代理类对象。也就是说在编码阶段无须知道代理谁，代理谁将在代码运行的时候决定。Java提供了动态的代理接口InvocationHandler，实现该接口需要重写invoke方法。现在我们只需要修改代理类
```
public class Dyanamic implements InvocationHandler{
  private Object obj;

  public Dyanamic(Object obj){
    this.obj = obj;
  }

  @Override
  public Object invoke(Object proxy, Method method, Object[] args)throw Throwable {
    Object result = method.invoke(obj, args);
    if(method.getName().equals("buy")){
      System.out.println("Lengary在买")
    }
    return result;
  }

}
```
客户端代码：
```
public class Client {
  public static viod main(String[] args){

    IShop lengary = new Lengary();
    //创建动态代理
    Dyanamic dyanamic = new Dyanamic(lengary);

    ClassLoader loader = lengary.getClass().getClassLoader();

    //动态创建代理类
    IShop friend = (IShop)Proxy.newProxyInstance(loader, new Class[](IShop.class), dyanamic);

    friend.buy();
  }
}
```
