---
layout: post # needs to be post
title: 设计模式之原型模式
summary: 原型模式浅谈
featured-img: shane-rounce-205187
categories: [设计模式]
---
原型模式主要用于对象的复制，它的核心是就是类图中的原型类Prototype。Prototype类需要具备以下两个条件：

1. 实现Cloneable接口。在java语言有一个Cloneable接口，它的作用只有一个，就是在运行时通知虚拟机可以安全地在实现了此接口的类上使用clone方法。在java虚拟机中，只有实现了这个接口的类才可以被拷贝，否则在运行时会抛出CloneNotSupportedException异常。

2. 重写Object类中的clone方法。Java中，所有类的父类都是Object类，Object类中有一个clone方法，作用是返回对象的一个拷贝，但是其作用域protected类型的，一般的类无法调用，因此，Prototype类需要将clone方法的作用域修改为public类型。

#### 原型模式的优点：
使用原型模式创建对象比直接new一个对象在性能上要好的多，因为Object类的clone方法是一个本地方法，它直接操作内存中的二进制流，特别是复制大对象时，性能的差别非常明显。

使用原型模式的另一个好处是简化对象的创建，使得创建对象就像我们在编辑文档时的复制粘贴一样简单。

因为以上优点，所以在需要重复地创建相似对象时可以考虑使用原型模式。比如需要在一个循环体内创建对象，假如对象创建过程比较复杂或者循环次数很多的话，使用原型模式不但可以简化创建过程，而且可以使系统的整体性能提高很多。

#### 原型模式的注意事项：
使用原型模式复制对象不会调用类的构造方法。因为对象的复制是通过调用Object类的clone方法来完成的，它直接在内存中复制数据，因此不会调用到类的构造方法。不但构造方法中的代码不会执行，甚至连访问权限都对原型模式无效。还记得单例模式吗？单例模式中，只要将构造方法的访问权限设置为private型，就可以实现单例。但是clone方法直接无视构造方法的权限，所以，单例模式与原型模式是冲突的，在使用时要特别注意。

深拷贝与浅拷贝。Object类的clone方法只会拷贝对象中的基本的数据类型，对于数组、容器对象、引用对象等都不会拷贝，这就是浅拷贝。如果要实现深拷贝，必须将原型模式中的数组、容器对象、引用对象等另行拷贝。
![](http://opsprcvob.bkt.clouddn.com/%E6%B7%B1%E5%85%8B%E9%9A%86%E5%92%8C%E6%B5%85%E5%85%8B%E9%9A%86.png)
下面给一个实例

Student类
```
public class Student implements Cloneable{
    private String name;
    private Teacher teacher;

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setTeacher(Teacher teacher){
        this.teacher=teacher;
    }
    public Teacher getTeacher(){
        return teacher;
    }
    public Student clone(){
        Student student = null;
        try {
            student = (Student) super.clone();
        } catch (CloneNotSupportedException ex) {
           ex.printStackTrace();
        }
        return student;
    }


}
```
老师类
```
public class Teacher implements Cloneable{

    private String name;


    public void setName(String name){
        this.name = name;
    }
    public String getName(){
        return name;
    }

     public Teacher clone(){
        Teacher teacher = null;
        try {
            teacher = (Teacher) super.clone();
        } catch (CloneNotSupportedException ex) {
           ex.printStackTrace();
        }
        return teacher;
    }

}
```
测试
```
public class JavaApplication49 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        //老师类
        Teacher teacher = new Teacher();
        teacher.setName("陈老师");

        //学生小明
        Student origin =new Student();
        origin.setName("小明");
        origin.setTeacher(teacher);

        //复制小明，改克隆实例名字为学生小红
        Student copy = origin.clone();
        copy.setName("小红");

        System.out.println("原来学生地址： "+origin);
        System.out.println("复制后学生地址： "+copy);
        System.out.println("---------------------------------");
        System.out.println("原来学生名字： "+ origin.getName()+" 原来学生老师名字： "+origin.getTeacher().getName());
        System.out.println("复制后学生名字： "+ copy.getName()+" 复制后学生老师名字： "+copy.getTeacher().getName());
        System.out.println("---------------------------------");
        //现在修改老师名字
        teacher.setName("白老师");
         System.out.println("原来学生名字： "+ origin.getName()+" 原来学生老师名字： "+origin.getTeacher().getName());
        System.out.println("复制后学生名字： "+ copy.getName()+" 复制后学生老师名字： "+copy.getTeacher().getName());
    }

}

```
结果
```
run:
原来学生地址： javaapplication49.Student@15db9742
复制后学生地址： javaapplication49.Student@6d06d69c
---------------------------------
原来学生名字： 小明 原来学生老师名字： 陈老师
复制后学生名字： 小红 复制后学生老师名字： 陈老师
---------------------------------
原来学生名字： 小明 原来学生老师名字： 白老师
复制后学生名字： 小红 复制后学生老师名字： 白老师
成功构建 (总时间: 0 秒)

```
我们发现对引用类型：Teacher进行修改是牵一发而动全身的，只要小明或小红对老师的名字进行修改，另一个对象的老师名字就会跟着改变。这就是浅克隆，即其对象内部的数组、引用对象等都不拷贝，还是指向原生对象的内部元素地址，两个对象共享了一个数组、引用对象等变量，你改我改大家都能改，是一个种非常不安全的方式（当然这里基本类型变量如int、String等不包括在内，基本类型的变量地址还是改变了的）。那么怎么办呢，这里就要对进行深克隆。

对学生类进行修改
```
public class Student implements Cloneable{
    private String name;
    private Teacher teacher;

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setTeacher(Teacher teacher){
        this.teacher=teacher;
    }
    public Teacher getTeacher(){
        return teacher;
    }
    public Student clone(){
        Student student = null;
        try {
            student = (Student) super.clone();
            student.setTeacher(teacher.clone());
        } catch (CloneNotSupportedException ex) {
           ex.printStackTrace();
        }
        return student;
    }


}
```
老师类，测试类不变，现在让我们看下结果
```
run:
原来学生地址： javaapplication49.Student@15db9742
复制后学生地址： javaapplication49.Student@6d06d69c
---------------------------------
原来学生名字： 小明 原来学生老师名字： 陈老师
复制后学生名字： 小红 复制后学生老师名字： 陈老师
---------------------------------
原来学生名字： 小明 原来学生老师名字： 白老师
复制后学生名字： 小红 复制后学生老师名字： 陈老师
成功构建 (总时间: 0 秒)
```
在这里，可以很明显地看出来小红的老师指向地址和小明的老师指向地址已经不一样了，这就是深克隆，即对对象内部的数组、引用对象等进行真正的拷贝，让它们的地址不共享。
