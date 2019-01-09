---
layout: post # needs to be post
title: 设计模式之策略模式
summary: 策略浅谈
featured-img: sleek #optional - if you want you can include hero image
categories: [设计模式]
---
行为型模式主要处理类或对象如何交互或如何分配职责。

### 策略模式
我们写代码的时候，总会处理很多逻辑，由此衍生出很多的if...else，或者case，如果一个条件语句中又包含了多个条件语句，代码就会变得臃肿。而策略模式就是来解决这个问题的。

它的定义是：定义一系列算法，把每一个算法封装起来，并且使它们相互可以替换。

![策略模式](https://i.loli.net/2019/01/09/5c358405ae462.png)
在策略模式中有以下角色：
- Context： 上下文角色，用来操作策略的上下文环境，起到承上启下的作用，屏蔽高层模块对策略、算法的直接访问。
- Stragety：抽象策略角色，策略、算法的抽象，通常为接口
- ConcreteStragety：具体的策略实现

模拟一下城市交通系统，假设情况如下：

公交：起步2元，超过5公里每公里加1元。

地铁：5公里内3元，5-10公里4元，最多5元。

出租：每公里2元。

先看下原来的写法
```
public class PriceCaculator {
    public static final int BUS = 1;
    public static final int SUBWAY = 2;
    public static final int TAXI =3;

    private int busPrice(int km){
        int busP = 2;
        if (km>5)
            busP = busP+km-5;
        return busP;
    }

    private int subwayPrice(int km){
        int subwayP=0;
        if (km<5)
            subwayP = 3;
        if (km>5&&km<=10)
            subwayP=4;
        if (km>10)
            subwayP=5;
        return subwayP;
    }

    private int taxiPrice(int km) {
        return  2 * km;
    }

    public int getPrice(int km,int type){
        if (type==BUS)
            return busPrice(km);
        if (type == SUBWAY)
            return subwayPrice(km);
        if (type==TAXI)
            return taxiPrice(km);
        return 0;
    }
}
```
客户端调用
```
public class Main {
    public static void main(String[] args) {
        PriceCaculator priceCaculator = new PriceCaculator();
        int price = priceCaculator.getPrice(10,2);
        System.out.println(price);
    }
}
```
当我们需要增加一种交通工具的时候，就需要到原来的类去改，违背了开放封闭原则

接下来我们用策略模式修改一下
定义策略接口
```
public interface CalculateStrategy {
    int calculatePrice(int km);
}
```
策略实现
```
public class BusCalculate implements CalculateStrategy {
    @Override
    public int calculatePrice(int km) {
        int busP = 2;
        if (km>5)
            busP = busP+km-5;
        return busP;
    }
}
public class SubwayCalculate implements CalculateStrategy {
    @Override
    public int calculatePrice(int km) {
        int subwayP=0;
        if (km<5)
            subwayP = 3;
        if (km>5&&km<=10)
            subwayP=4;
        if (km>10)
            subwayP=5;
        return subwayP;
    }
}
public class TaxiCalculate implements CalculateStrategy {
    @Override
    public int calculatePrice(int km) {
        return  2 * km;
    }
}
```
Context：
```
public class PriceCalculate2 {
    private  CalculateStrategy calculateStrategy;
    public void setCalculateStrategy(CalculateStrategy calculateStrategy){
        this.calculateStrategy=calculateStrategy;
    }

    public int getPrice(int km){
       return calculateStrategy.calculatePrice(km);
    }
}
```
客户端：
```
public class Client {
    public static void main(String[] args) {
        PriceCalculate2 priceCalculate2 = new PriceCalculate2();
        priceCalculate2.setCalculateStrategy(new SubwayCalculate());
        int price = priceCalculate2.getPrice(10);
        System.out.println(price);
    }
}
```

在Android中也有策略模式，具体的实例就是属性动画
```
Animation animation = new AlphaAnimation(1,0);
        animation.setInterpolator(new AccelerateDecelerateInterpolator());
        imageView.setAnimation(animation);
        animation.start();
```
animation.setInterpolator()其实用的就是策略模式，Android中有很多不同的插值器，都实现了Interpolator接口。
然后通过setInterpolator设置给Animation。

在动画执行的时候，会通过设置的计时器来在不同的动画时间执行不同的动画效果。

```
public void setInterpolator(Interpolator i) {
        mInterpolator = i;
    }

protected void ensureInterpolator() {
        if (mInterpolator == null) {
            //默认就是加速度插值器,在Animation初始化的时候执行。
            mInterpolator = new AccelerateDecelerateInterpolator();
        }
    }

public boolean getTransformation(long currentTime, Transformation outTransformation) {
        ......
            if ((normalizedTime >= 0.0f || mFillBefore) && (normalizedTime <= 1.0f || mFillAfter)) {
                ......
                //通过策略模式来获取不同的值。
                final float interpolatedTime = mInterpolator.getInterpolation(normalizedTime);
                applyTransformation(interpolatedTime, outTransformation);
        }

        ......
    }
```

![策略模式-Android](https://i.loli.net/2019/01/09/5c35842f2a3ab.png)
