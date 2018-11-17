---
layout: post # needs to be post
title: Andriod中的线程池
summary: 浅谈Android中的线程池
featured-img: work
categories: [Android]
---
提到线程池就要说一下它的好处
1. 重用线程池中的线程，避免因为线程的创建和销毁带来额外的性能开销
2. 能有效控制线程池的最大并发数，避免大量线程因互相抢占系统资源导致阻塞
3. 能对线程进行简单的管理，并提供定时执行和指定间隔循环执行的功能

Android线程池的概念来自于Java的Executor，Executor是一个接口，真正的实现是ThreadPoolExecutor。ThreadPoolExecutor提供了一系列参数来配置线程池。

## ThreadPoolExecutor
ThreadPoolExecutor的构造方法就是它的配置方法。构造方法里面的参数将直接影响线程池的功能特性。下面是ThreadPoolExecutor一个较为常用的构造方法。
```
public ThreadPoolExecutor(int corePoolSize,
  int maximumPoolSize,
  long keepAliveTime,
  TimeUnit unit,
  BlockingQueue<Runnable> workQueue,
  ThreadFactory threadFactory)
```
- corePoolSize :
它指的是线程池的核心线程数。默认情况下，核心线程会在线程池中一直存活。
- maximumPoolSize :
线程池所能容纳的最大线程数。当超过这个数目后，后续的新任务会被阻塞。
- keepAliveTime :
非核心线程在闲置时的超时时长，超过这个时长，非核心线程就会被回收。如果把ThreadPoolExecutor的allowCoreThreadTimeOut设置为true，那么超时时长同样会作用于核心线程。
- unit :
keepAliveTime的时间单位
- workQueue :
线程池中的任务队列，通过线程池的execute方法提交的Runnale对象对存储在这个参数中
- threadFactory :
线程工厂，为线程池提供创建新线程的功能。ThreadFactory是一个接口，它只有一个方法 Thread newThread(Runnable r)

ThreadPoolExecutor执行任务大致遵循以下规则：
1. 如果线程池中的线程数量未达到核心线程的数量，那么会直接启动一个核心线程来处理任务
2. 如果线程池中的线程数量已经达到或超过核心线程的数量，那么任务就直接插入到任务队列中等待执行，注意是等待执行，并不是直接执行
3. 如果已经无法插入任务队列中了，这一般是因为任务队列已满，入股这时候线程数量还没有达到线程池的最大线程数量，那么就启动一个非核心线程来执行任务
4. 如果已经达到最大线程数量，还有新任务到来的话，就拒绝执行这个任务。

### 线程池的分类
Android中有四种线程池，它们都是通过直接或者间接的方式去配置ThreadPoolExecutor实现的。
#### FixThreadPool
通过Executors的newFixThreadPool方法来创建，它是一种线程数量固定的线程池，并且只有核心线程。当线程处于空闲状态的时候，它们不会被回收，这意味着它能够快速对外界的请求进行响应。而且FixThreadPool的任务队列没有大小限制。
```
public static ExecutorService newFixThreadPool(int nThreads){
  return new ThreadPoolExecutor(nThreads, nThreads,
    0L, TimeUnit.MILLISECONDS,
    new LinkdBlockingQueue<Runnable>());
}
```

#### CacheThreadPool
通过Executors的newCacheThreadPool方法来创建。它是一种线程数量不定的线程，理论上说它的线程数量可以无限大。它只有非核心线程，而且最大线程数目是Integer.MAX_VALUE。当线程池中的线程都处于活动状态时，线程池会创建新的线程来处理新任务，否则就用空闲的线程来处理新任务。线程池中线程的超时机制是60秒，超过60秒闲置线程就会被回收。CacheThreadPool的任务队列是一个空集合，这会让它的任何任务都被立即执行。它采用的队列其实是SynchronousQueue，它是一个十分特殊的队列，在很多情况下可以把它简单理解为一个无法存储元素的队列。从CacheThreadPool的特性来看，它比较适合执行大量耗时较少的任务。当整个线程池都处于闲置状态时，线程池中的线程都会超时而被停止。这个时候CacheThreadPool是几乎不占用系统资源的。
```
public static ExecutorService newCacheThreadPool(){
  return new CacheThreadPool(0, Integer.MAX_VALUE,
    60L, TimeUnit.MILLISECONDS,
    new SynchronousQueue<Runnable>());
}
```

####  ScheduledThreadPool
通过Executors的newScheduledThreadPool方法来创建，它的核心线程是固定的，而且非核心线程是没有限制的。超时为0，这意味着非核心线程闲置时会被立刻回收。ScheduledThreadPool这种线程池主要是用于执行定时任务和固定周期的任务。
```
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize){
  return new ScheduledThreadPoolExecutor(corePoolSize);
}

public ScheduledThreadPoolExecutor(int corePoolSize){
  super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS，
    new DelayedWordQueue());
}
```


#### SingleThreadExecutor
通过Executors的newSingleThreadExecutor方法来创建。这类线程池的内部只有一个核心线程。他确保所有的任务都在同一个线程中按顺序执行。SingleThreadExecutor的意义是统一所有外界任务在一个线程里面，这就让在这些任务之间不需要处理线程同步的问题。
```
public static ExecutorService newSingleThreadExecutor(){
  return new FinalizebleDelegatedExecutorService(1, 1,
    0L, TimeUnit.MILLISECONDS,
    new LinkdBlockingQueue<Runnable>());
}
```
