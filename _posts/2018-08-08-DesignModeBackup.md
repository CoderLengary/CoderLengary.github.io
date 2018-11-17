---
layout: post # needs to be post
title: 设计模式之备用录模式
summary: 备用录模式浅谈
featured-img: sleek #optional - if you want you can include hero image
categories: [设计模式]
---
备用录模式是一种行为型设计模式，用于保存对象当前的状态，以便之后可以再次恢复到此状态。

备忘录模式要保证保存的对象状态不能被对象从外部访问，保护好被保存的这些对象状态的完整性以及内部实现不向外部暴露。

![](http://opsprcvob.bkt.clouddn.com/%E5%A4%87%E5%BF%98%E5%BD%95%E6%A8%A1%E5%BC%8F.png)

- Originator：负责创建一个备忘录，可以记录，恢复自身内部的状态。同时可以决定哪些状态需要备忘。
- Memoto：备忘录角色，用于存储Originator的内部状态，并且可以防止Originator之外的对象直接访问到Memoto。
- Caretaker：负责存储备忘录，不能对备忘录的内容进行操作和访问，只能讲备忘录传递给其他对象。

简而言之，就是Originator用Memoto来保存自己的状态，然后通过一个方法暴露给Caretaker，Caretaker就可以通过Originator的方法获取到Memoto，将其储存。当Originator需要备忘录的时候，Caretaker会提供备忘录给它。

下面给一个打游戏备份的例子

Originator
```
public class Player{

  private int name;
  private int hp;
  private int mp;

  public Player(String name){
    this.name = name;
    hp = 100;
    mp = 100;
  }

  public void attack(){
    hp = hp - 10;
    mp = mp - 10;
  }

  public void attackBigBoss(){
    hp = hp - 80;
    mp = mp - 80;
  }

  public Memoto createMemoto(){
    return new Memoto(name,hp,mp);
  }

  public void restore(Memoto mo){
    String moName = mo.getName();
    if(check(name, moName)){
      hp = mo.getHp();
      mp = mo.getMp();
    }

  }

  private boolean check(String name, String moName){
    return name.equals(moName);
  }
}
```

Memoto
```
public class Memoto{

  private String name;
  private int hp;
  private int mp;

  public Memoto(String name, int hp, int mp){
    this.name = name;
    this.hp = hp;
    this.mp = mp;
  }

  public String getName(){
    return name;
  }

  public int getHp(){
    return hp;
  }

  public int getMp(){
    return mp;
  }

  @Override
    public String toString() {
        return   "当前状态：级别"+lv+" hp:"+hp+" mp:"+mp;
    }
}
```

Caretaker
```
public class Caretaker {
    private Memoto memoto;
    public void save(Memoto memoto){
        this.memoto=memoto;
    }
    public Memoto load(){
        return memoto;
    }
}
```
客户端
```
public class Client {
    public static void main(String[] args) {
        Player player = new Player();
        player.toString();
        player.attack();
        player.attack();
        player.toString();
        System.out.println("存档");
        Caretaker caretaker = new Caretaker();
        caretaker.save(player.createMemoto());
        player.attackBigBoss();
        player.toString();
        player.restore(caretaker.load());
        player.toString();
    }
}
```

Android中的备忘录方法是
```
@Override
public void onSaveInstanceState(Bundle outState, PersistableBundle outPersistentState) {
    super.onSaveInstanceState(outState, outPersistentState);
}

@Override
protected void onRestoreInstanceState(Bundle savedInstanceState) {
    super.onRestoreInstanceState(savedInstanceState);
}
```
