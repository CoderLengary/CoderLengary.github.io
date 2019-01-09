---
layout: post # needs to be post
title: 设计模式之责任链模式
summary: 责任链模式浅谈
featured-img: raindrop_glass
categories: [设计模式]
---
职责链模式（Chain of Responsibility）：使多个对象都有机会处理同一个请求，从而避免请求的发送者和接收者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

 在日常生活中，这种情景处处可见，我们向上级请假，一旦天数超过上级的限制，上机就要再向他的上级请求批示。一级一级往上传。

 ![责任链](https://i.loli.net/2019/01/09/5c3592a99b639.png)

 ![责任链-custom](https://i.loli.net/2019/01/09/5c35928fd49f8.png)

 责任链模式有如下角色：
 - Ratify：处理事务的抽象角色
 - Chain：抽象链，传递事务的抽象角色
 - RealChain：抽象链的具体实现


 我们举一个请假的例子，当组里一个成员要请假的时候，由他的小组领导人先处理，小组领导人批不了假，就交给经理处理，经理处理不了，就交给部门领导人处理。

 假条类：
 ```
 public class Request {
     private String name;

     private int days;

     public Request(String name, int days){
         this.name = name;
         this.days = days;
     }

     public int getDays(){
         return days;
     }
}
 ```
 请假结果类：
 ```
 public class Result {
     public boolean isRatify;
     public String info;

     public Result() {

     }

     public Result(boolean isRatify, String info) {
          super();
          this.isRatify = isRatify;
          this.info = info;
     }

     public boolean isRatify() {
          return isRatify;
     }

     public void setRatify(boolean isRatify) {
          this.isRatify = isRatify;
     }

     public String getReason() {
          return info;
     }

     public void setReason(String info) {
          this.info = info;
     }

     @Override
     public String toString() {
          return "Result [isRatify=" + isRatify + ", info=" + info + "]";
     }
}
 ```

 链接口：
 ```
 public interface Chain {

    Request getRequest();
    Result proceed(Request request, int index);

    int getCurrentIndex();
}
 ```
 具体链：
 ```
 public class RealChain implements Chain{

    private Request request;
    private List<Ratify> ratifyList;
    private int index;

    public RealChain(List<Ratify> ratifyList, Request request){
        this.ratifyList = ratifyList;
        this.request = request;

    }


    //分发方法
    @Override
    public Result proceed(Request request, int index) {
        this.index = index;
        Result result = null;
        if(index < ratifyList.size()){
            Ratify ratify = ratifyList.get(index);
            result = ratify.deal(this);
        }
        return result;
    }

    @Override
    public Request getRequest(){
        return request;
    }
    @Override
    public int getCurrentIndex(){
        return index;
    }

}

 ```

Ratify接口：
 ```
 public interface Ratify{
    Result deal(Chain chain);
}
 ```

Ratify具体实现：
```
public class GroupLeader implements Ratify {

    @Override
    public Result deal(Chain chain) {
       Result result = null;
       Request request = chain.getRequest();
       if(request.getDays()>2){
            System.out.println("GroupLeader无法解决，转交给上级");
            int currentIndex = chain.getCurrentIndex()+1;
            return chain.proceed(request, currentIndex);
        }
       return new Result(true, "已经由GroupLeader解决");
    }

}

public class Manager implements Ratify {

    @Override
    public Result deal(Chain chain) {
       Result result = null;
       Request request = chain.getRequest();
       if(request.getDays()>5){
            System.out.println("Manager无法解决，转交给上级");
            int currentIndex = chain.getCurrentIndex()+1;
            return chain.proceed(request, currentIndex);
        }
       return new Result(true, "已经由DepartmentHeader解决");

    }

}

public class DepartmentHeader implements Ratify {

    @Override
    public Result deal(Chain chain) {
         Request request = chain.getRequest();
         if(request.getDays()>7){
             return new Result(true, "不接受请假");

         }
         return new Result(true, "已经由DepartmentHeader解决");
    }

}

```

责任链模模式工具类：
```
public class ChainOfResponsibilityClient {
    private ArrayList<Ratify> ratifies;

    public ChainOfResponsibilityClient(){
        ratifies = new ArrayList<Ratify>();
    }

    public void add(Ratify ratify){
        ratifies.add(ratify);
    }

    public Result execute(Request request){
        ArrayList<Ratify> arrayList = new ArrayList<Ratify>();
        arrayList.addAll(ratifies);
        arrayList.add(new GroupLeader());
        arrayList.add(new Manager());
        arrayList.add(new DepartmentHeader());
        RealChain realChain = new RealChain(arrayList, request);
        return realChain.proceed(request, 0);
    }
}
```
客户端：
```
public class JavaApplication51 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        Request request = new Request("张三",6);
         ChainOfResponsibilityClient client = new ChainOfResponsibilityClient();
         Result result = client.execute(request);

         System.out.println("结果：" + result.toString());
    }

}
```

结果：
```
GroupLeader无法解决，转交给上级
Manager无法解决，转交给上级
结果：Result [isRatify=true, info=已经由DepartmentHeader解决]
```
