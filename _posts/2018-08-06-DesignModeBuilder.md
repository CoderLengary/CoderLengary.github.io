---
layout: post # needs to be post
title: 设计模式之建造者模式
summary: 建造者浅谈
featured-img: sleek #optional - if you want you can include hero image
categories: [设计模式]
---
建造者模式是创建一个复杂对象的创建者模式，将构建复杂对象的过程和它的部件解耦。

在Android中我们经常我看到建造者模式，当你看到Builder这个英文单词的时候就应该意识到这个对象使用的就是建造者模式。

我们先提出一个简单的例子。
如果我们有一个类Student，他有很多的属性，但是仅仅姓名和学号是必须赋值的，其他的属性都是可选项，比如像下面代码中所示
```
public class Student {
    private final int stuId;//必须
    private final String name;//必须
    private final int age;//可选
    private final int gender;//可选
    private final int address;//可选
    ...//还有很多可选属性
}
```

那么我们怎么来创建一个Student对象呢？我们看到每个属性都用final来修饰了，说明每个属性都要在构造方法中被初始化，我们又必须提供各种参数数量的构造方法，我们看如下代码
```
public class Student {
    private final int stuId;//必须
    private final String name;//必须
    private final int age;//可选
    private final int gender;//可选
    private final String address;//可选

    public Student(int stuId,String name){
        this(stuId,name,0,1,"");
    }
    public Student(int stuId,String name,int age){
        this(stuId,name,age,1,"");
    }
    public Student(int stuId,String name,int age,int gender){
        this(stuId,name,age,gender,"");
    }
    public Student(int stuId,String name,int age,int gender,String address){
        this.stuId = stuId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.address = address;
    }
}
```
这样做确实可以解决我们的需求，但这还是可选参数不多的情况，如果有很多可选参数，我们就必须要写很多个构造函数，这将导致代码的可读性和维护性变差，更重要的是，当我们要用到这个类的时候会感觉无从下手，我到底应该用哪个构造方法呢？应该用两个参数的构造方法还是用三个参数的呢？如果我用两个参数的构造方法，那么可选参数的默认值是多少？

更棘手的是，如果我只想给Student对象设置address属性而不设置age和gender属性的话怎么办？我们显然还得再继续添加构造方法，或者我们只能调用全参的构造方法，然后给age和gender属性设置个默认值。

还有一点，我们看到stuId，age，gender都是int类型的，那么我们在创建Student对象时，哪一个int类型的对象代表stuId，哪一个代表age，这还进一步增加了使用成本。

那么我们还有没有其他的办法？答案是有！我们可以只设置一个默认的无参构造方法，然后给每个属性添加getter和setter方法，代码如下
```
public class Student {
    private int stuId;//必须
    private String name;//必须
    private int age;//可选
    private int gender;//可选
    private String address;//可选

    public Student(){

    }

    public int getStuId() {
        return stuId;
    }

    public void setStuId(int stuId) {
        this.stuId = stuId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
```

这种方法看上去可读性和维护性比较好，当我们使用这个类的时候只需要创建一个空的对象并且设置我们需要的属性就可以了。比如这样：

```
Student stu = new Student();
stu.setStuId(1);
stu.setName("小明");
stu.setAge(12);
```
这样做有两个问题，第一个问题是我们的stu对象没有一个创建完毕的标识，上面的stu对象我们设置了三个属性，但当别人看到这段代码时，他不确定这个stu对象是只需要这三个属性还是当时作者忘了写完整，除非所有的属性都给set上，别人才能确保你这个对象创建完毕；另一个问题是任何人都可以在我们创建好的基础上继续改变它，也就是继续给它set新的属性或者删除某个已经set的属性，这就会使我们的stu对象具有可变性，这会引起潜在的风险。

好在我们还有第三种方法，那就是builder设计模式了。
```
public class Student {
    private final int stuId;//必须
    private final String name;//必须
    private final int age;//可选
    private final int gender;//可选
    private final String address;//可选

    private Student(StudentBuilder builder){
        this.stuId = builder.stuId;
        this.name = builder.name;
        this.age = builder.age;
        this.gender = builder.gender;
        this.address = builder.address;
    }

    public int getStuId() {
        return stuId;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public int getGender() {
        return gender;
    }

    public String getAddress() {
        return address;
    }

    public static class StudentBuilder{
        private final int stuId;
        private final String name;
        private int age;
        private int gender;
        private String address;

        public StudentBuilder(int stuId,String name){
            this.stuId = stuId;
            this.name = name;
        }
        public StudentBuilder setAge(int age){
            this.age = age;
            return this;
        }
        public StudentBuilder setGender(int gender){
            this.gender = gender;
            return this;
        }
        public StudentBuilder setAddress(String address){
            this.address = address;
            return this;
        }
        public Student build(){
            return new Student(this);
        }
    }

}
```
值得注意的几点：
1.Student的构造方法是私有的，也就是说我们不能直接new出Student对象
2.我们又将Student的属性用final修饰了，并且我们在构造方法中都为他们进行了初始化操作，我们只提供了getter方法
3.使用builder模式构造出来的对象有更好的可读性，等下我们会看到
4.StudentBuilder的属性中只给我们必须的属性添加的final修饰，所以我们必须在StudentBuilder的构造方法中为他们初始化

使用builder设计模式完美的解决了方法一和方法二的不足，并且兼具他们的优点：具有必填属性和可选属性的区分，更重要的是：可读性很强。唯一的不足是我们要在StudentBuilder中重复的写一遍Student中的属性。

好，现在我们来创建一个Student对象吧
```
public Student getStudent(){
        return new Student.StudentBuilder(1,"小明")//必填属性在构造方法中赋值
                    .setAge(1)//设置可选属性 年龄
                    .setGender(1)//设置可选属性 性别 默认1为男
                    .build();//对象构建完毕的标识，返回Student对象
}
```
非常优雅有木有？他是一个链式的调用，我们可以1行代码就搞定，更重要的是，他的可读性非常强，而且通过build（）我们可以很明确的告诉别人我们的Student已经创建完毕。

builder设计模式非常灵活，一个builder可以创建出各种各样的对象，我们只需要在build（）之前调用set方法来为我们的对象赋值。

builder模式另一个重要特性是：它可以对参数进行合法性验证，如果我们传入的参数无效，我们可以抛出一个IllegalStateException异常，但是我们在哪里进行参数合法性验证也是有讲究的：那就是在对象创建之后进行合法性验证。我们修改StudentBuilder的build（）方法

```
public Student build(){
            Student student = new Student(this);
            if (student.getAge()>120){
                throw  new IllegalStateException("年龄超出限制");
            }
            return student;
        }
```

为什么要先创建对象，再进行参数验证？因为我们的StudentBuilder是线程不安全的，如果我们先进行参数验证后创建对象，那么创建对象的时候对象的属性可能已经被其他线程改变了，例如下面的代码就是错误的

```
public Student build(){
    if (age>120){
        throw  new IllegalStateException("年龄超出限制");
    }
    return new Student(this);
  }
```
介绍了这个，我们来看下完整版的建造者模式。
![建造者模式](https://i.loli.net/2019/01/09/5c35eef8ec414.png)
在建造者模式中有以下角色：
- Director：导演类，负责安排已有模块的顺序，然后通知Builder进行建造
- Builder：抽象Builder类，规范产品的组件，一般由子类实现
- ConcreteBuilder：具体建造者，实现抽象Builder类定义的所有方法，并返回一个建造好的对象。
- 产品类

这里我们就用DIY一个组装的计算机来实现一下建造者模式

建造一个产品类
```
public class Computer{
  private String mCpu;
  private String mMainboard;
  private String mRam;

  public void setmCpu(String mCpu){
    this.mCpu = mCpu;

  }
  public void setmMainboard(String mMainboard){
    this.mMainboard = mMainboard;
  }
  public void setmRam(String mRam){
    this.mRam = mRam;
  }
}
```
创建Builder类来规范产品的创建
```
public abstract class Builder{
  public abstract void buildCpu(String cpu);
  public abstract void buildMainboard(String mainboard);
  public abstract void buildRam(String ram);
  public abstract Computer create();
}
```
商家实现了抽象的Builder，用于组装计算机
```
public class ComputerBuilder extends Builder{
  private Computer mComputer = new Computer();

  @Override
  public void buildCpu(String cpu){
    mComputer.setmCpu(cpu);
  }
  @Override
  public void buildMainboard(String mainboard){
    mComputer.setmMainboard(mainboard);
  }
  @Override
  public void buildRam(String ram){
    mComputer.setmRam(ram);
  }
  @Override
  public Computer create(){
    retun mComputer;
  }
}
```
用导演类来控制计算机安装流程。先安装主板，再安装CPU，在安装内存。
```
public class Director {
  Builder mBuilder = null;

  public Director(Builder builder){
    mBuilder = builder;
  }

  public Computer createComputet(String cpu, String mainboard, String ram){
    mBuilder.buildMainboard(mainboard);
    mBuilder.buildCpu(cpu);
    mBuilder.buildRam(ram);
    mBuilder.create();
  }
}
```
客户端调用导演类
```
public class Client{
  public static void main(String[] args){
    Builder mBuilder = new ComputerBuilder();
    Director director = new Director(mBuilder);
    director.createComputet("i7-3200","玩家至尊","三星DDR4");
  }
}
```
