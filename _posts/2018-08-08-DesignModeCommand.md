---
layout: post # needs to be post
title: 设计模式之命令模式
summary: 命令模式浅谈
featured-img: shane-rounce-205187
categories: [设计模式]
---
命令模式是行为型设计模式之一。命令模式没那么多条条框框，所以很灵活。命令模式简单的说就是给他下一个命令，然后他就会执行和这个命令的一系列操作。例如点击电脑的关机命令，系统会执行暂停，保存，关闭等一系列的命令，最后完成关机。

![命令模式](https://i.loli.net/2019/01/09/5c35925929485.png)
命令模式有以下角色

- Receiver : 命令接收者，负责具体执行一个请求。在接收者中封装的具体操作逻辑的方法叫行动方法。
- Command：命令角色，定义具体命令类的接口。
- ConcreteCommand : 具体的命令角色。，实现了Command接口，在excute()方法中调用接收者Receiver的相关方法，弱化了命令接收者和具体行为之间的耦合。
- Invoker：请求者角色，调用命令对象执行具体的请求。

在这里简单举一个玩俄罗斯方块的例子

Receiver：
```
public class Game{
  public void toLeft(){
        System.out.println("向左移动");
    }
    public  void toRight(){
        System.out.println("向右移动");
    }
    public void transform(){
        System.out.println("变形");
    }
}
```
Command：
```
public interface Command {
    void excute();
}
```
ConcreteCommand：
```
public class LeftCommand implements Command {
    private Game receiver;

    public LeftCommand(Game receiver) {
        this.receiver = receiver;
    }

    @Override
    public void excute() {
        receiver.toLeft();
    }
}

public class RightCommand implements Command {
    private Game receiver;

    public RightCommand(Game receiver) {
        this.receiver = receiver;
    }

    @Override
    public void excute() {
        receiver.toRight();
    }
}


public class TransformCommand implements Command {
    private Game receiver;

    public TransformCommand(Game receiver) {
        this.receiver = receiver;
    }

    @Override
    public void excute() {
        receiver.transform();
    }
}
```
Invoker：
```
public class Buttons {
    private LeftCommand leftCommand;
    private RightCommand rightCommand;
    private TransformCommand transformCommand;

    public void setLeftCommand(LeftCommand leftCommand) {
        this.leftCommand = leftCommand;
    }

    public void setRightCommand(RightCommand rightCommand) {
        this.rightCommand = rightCommand;
    }

    public void setTransformCommand(TransformCommand transformCommand) {
        this.transformCommand = transformCommand;
    }

    public void toLeft(){
        leftCommand.excute();
    }

    public void toRight(){
        rightCommand.excute();
    }
    public void transform(){
        transformCommand.excute();
    }

}
```
客户端：
```
public class Client {
    public static void main(String[] args) {
        Game game = new Game();
        LeftCommand leftCommand = new LeftCommand(game);
        RightCommand rightCommand = new RightCommand(game);
        TransformCommand transformCommand = new TransformCommand(game);
        Buttons buttons = new Buttons();
        buttons.setLeftCommand(leftCommand);
        buttons.setRightCommand(rightCommand);
        buttons.setTransformCommand(transformCommand);

        buttons.toRight();
        buttons.toLeft();
        buttons.transform();

    }
}
```

命令模式本质就是将命令进行封装，将命令的发起者和真正的执行者隔离，降低耦合度。

命令请求者只需要发起请求，命令的具体执行时什么用，由谁执行都不需要知道。
