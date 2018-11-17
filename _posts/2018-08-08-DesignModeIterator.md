---
layout: post # needs to be post
title: 设计模式之迭代器模式
summary: 迭代器模式浅谈
featured-img: design
categories: [设计模式]
---
迭代器模式：提供一种方法顺序的访问一个聚合对象中各个元素，而又不暴露该对象的内部表示。

实现：

```
public interface Iterator<T>{
  T next();
  boolean hasNext();
}
```

集合
```
public class MyCollection<T>{
  public List<T> list;

  public MyCollection(){
    list = new ArrayList<T>();
  }

  public void remove(T object){
    list.remove(object);
  }

  public void add(T object){
    list.add(object);
  }

  public Iterator<T> iterator(){
    return new MyIterator<T>(list);
  }

  public class MyIterator extends Iterator<T>{

    private List list;

    int currentIndex;

    public MyIterator(List list){
      this.list = list;
      currentIndex = 0;
    }

    @Override
    public T next(){
      T t = list.get(currentIndex);
      currentIndex ++;
      return t;
    }

    @Override
    public boolean hasNext(){
      reutrn currentIndex < list.size();
    }

  }

}
```
测试
```
public class Client {
  public static viod main(String[] args){
    MyCollection<Student> collection = new MyCollection<>();
    collection.add(new Sudent("张量"));
    collection.add(new Sudent("胡迪"));
    Iterator<Student> iterator = collection.iterator();

    while(iterator.hasNext()){
      System.out.println("Student Name is "+iterator.next().getName());
    }
  }
}
```
