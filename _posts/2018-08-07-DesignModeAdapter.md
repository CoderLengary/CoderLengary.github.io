---
layout: post # needs to be post
title: 设计模式之适配器模式
summary: 适配器模式简谈
featured-img: work
categories: [设计模式]
---
适配器模式指的是将某个类的接口转换成客户端期望的另一个接口表示，主的目的是兼容性，让原本因接口不匹配不能一起工作的两个类可以协同工作。其别名为包装器(Wrapper)。

适配器模式下有以下角色：
- Source：资源，即需要被适配的对象
- Adaper：适配器，负责将Source转换成我们想要的输出，即Destination
- Destination：我们想要的最终输出

一句话来描述适配器模式：Source->Adaper->Destination

适配器模式有三种：类适配器模式、对象适配器模式、接口适配器模式

使用场景：
1. 系统需要使用现有的类，但现有的类却不兼容。
2. 需要建立一个可以重复使用的类，用于一些彼此关系不大的类，并易于扩展，以便于面对将来会出现的类。
3. 需要一个统一的输出接口，但是输入类型却诗不可预知的。

### 类适配器模式
Adapter类，通过继承Source类，实现Destination 类接口，完成src->dst的适配。

举个例子，日常生活中的手机充电，Source就是电网的220V交流电，Destination就是5V直流电，充电器就是Adaper

Source类
```
public class Voltage220 {
  public int output220V(){
    int src = 220;
    System.out.println("Source is "+src+" V");
    return src;
  }
}
```
Destination接口：
```
public interface Voltage5{
  int output5V();
}
```
适配器类：
```
public Adaper extends Voltage220 implements Voltage5{
  @Override
  public int output5V(){
    int source = output220V();
    int result = source/44;
    return result;
  }
}
```

### 对象适配器模式
Adapter类，通过持有Source类，实现Destination 类接口，完成src->dst的适配。

适配器类：
```
public Adaper implements Voltage5{
  private Voltage220 voltage220;

  public Adapter(Voltage220 voltage220){
    this.voltage220 = voltage220;
  }
  @Override
  public int output5V(){
    int result = 0 ;
    if(voltage220!=null){
      int source = voltage220.output220V();
      result = source/44;
    }
    return result;
  }
}
```

写Android的朋友看到这个是不是很熟悉，没错，就是RecyclerView的Adapter，还记得怎么写吗？
```

public class MyRecyclerViewAdapterextends RecyclerView.Adapter<MyAdapter.ViewHolder> {
    private List<String> list;

    public MyAdapter(List<String> list) {
        this.list = list;
    }

    @Override
    public MyAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_base_use, parent, false);
        MyAdapter.ViewHolder viewHolder = new MyAdapter.ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(MyAdapter.ViewHolder holder, int position) {
        holder.mText.setText(list.get(position));
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        TextView mText;
        ViewHolder(View itemView) {
            super(itemView);
            mText = itemView.findViewById(R.id.item_tx);
        }
    }
}
```

你看，这个Adapter就是采用持有Source对象的形式，也就是对象适配器模式。在这个Adapter中，Source是数据源，也就是list，而Destination呢？当然就是我们Recycler中每一项的View啊。也就是说RecyclerView.Adapter完成了数据源->Adapter->View的转变，这就是它存在的意义。我们知道有数据源，但数据源多种多样，有人会塞文字进去，有人会塞图片。但是它们最后产物一定是一个View，这就是使用场景3的情况：需要一个统一的输出接口，但是输入类型却是不可预知的。

### 接口适配模式
在日常开发中，常常会遇到这种情况，我们定义了一个接口，接口中有很多方法，但我们没必要全都实现。这时怎么办呢，我们怎样把这个接口转化成我们需要的呢（即选择性实现接口的方法）。这个时候，Source就是接口，Adapter需要实现这个接口，成为一个抽象类，那么我们在创建抽象类的继承类，只需要重写我们需要使用的那几个方法即可。

Source接口：
```
public interface ILetter{
  void A();
  void B();
  void C();
  void D();
  void E();
  void F();
}

```
适配器类：
```
public abstract Adapter implements ILetter{
  @Override
  public void A(){
    System.out.println("打印字母A");
  }
  @Override
  public void B(){
    System.out.println("打印字母B");
  }
  @Override
  public void C(){
    System.out.println("打印字母C");
  }
  @Override
  public void D(){
    System.out.println("打印字母D");
  }
  @Override
  public void E(){
    System.out.println("打印字母E");
  }
  @Override
  public void F(){
    System.out.println("打印字母F");
  }
}
```
使用方式，只实现ILetter接口中我需要的方法
```
//方式1
public class Printer extends Adapter{
  @Override
  public void F(){
    System.out.println("不要打印字母F");
  }
}

//方式2
new Adapter(){
  @Override
  public void F(){
    System.out.println("不要打印字母F");
  }
}
```

总结
类适配器，以 类 给到，在Adapter里，就是将source当做类，继承，
对象适配器，以 对象 给到，在Adapter里，将source作为一个对象，持有。
接口适配器，以 接口 给到，在Adapter里，将source作为一个接口，实现。（转化接口）
