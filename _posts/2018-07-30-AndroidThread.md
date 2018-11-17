---
layout: post # needs to be post
title: Andriod中的线程形态
summary: 浅谈Android中的线程形态
featured-img: design
categories: [Android]
---
线程在Android中是一个很重要的概念，。从大的方向说，线程有主线程和子线程。主线程主要负责处理和界面有关的事情。子线程就负责执行耗时操作。除了Thread之外，Android中扮演线程角色的还有很多，比如AsyncTask、IntentService和HandlerThread。

- AsyncTask封装了线程池和Handler
- HandlerThread是一个自带looper的线程
- IntentService内部采用了HandlerThread，它是一个服务，当执行任务完毕后它会自己退出。它比后台线程好的地方在于，由于它是一个服务，所以它不容易被系统杀死可以保证任务能执行。

### Andrid中的线程形态
### AsyncTask
AsyncTask是一种轻量级的异步任务类，它在线程池中执行任务，然后通过Handler把进度和结果传递给主线程并在主线程中更新UI。但是AsyncTask并不适合进行特别耗时的后台任务，对于特别耗时的任务建议使用线程池。

```
public abstract class AsyncTask<Params, Progress, Result>
```
Params表示参数的类型，Progress表示后台任务的执行进度的类型，Result则表示后台任务的返回结果类型。

AsyncTask提供了4个核心方法
1. onPreExecute()，在主线程中执行，在异步任务执行之前，这个方法会被调用，一般是用来做一些准备工作。
2. doInBackground(Params...params)，在线程池中执行，此方法用于执行异步任务。
3. onProgressUpdate(Progress...values)，在主线程中执行，用于反应后台任务的执行进度
4. onPostExecute(Result result)，在主线程中执行，在异步任务执行后，此方法会被调用。这里Result参数是doInBackground的返回值。

除了这四种方法之外，还有一个是onCancelled()方法，在主线程中执行，当异步任务被取消后，这个方法就会被调用，而onPostExecute不会被调用。
下面提供一个AsyncTask的例子：
```
private class DownloadFilesTask extends AsyncTask<URL, Integer, Long>{
  protect Long doInBackground(URL... urls){
    int count = urls.length;
    long totalSize = 0;
    for (int i = 0; i < count; i++){
      totalSize += Downloader.downloadFile(urls[i]);
      //此方法运行的时候，onProgressUpdate就会被调用
      publishProgress((int)((i / (float)count)* 100 ));
    }
    return totalSize;
  }

  protect void onProgressUpdate(Integer...progress){
    showDialg(progress[0]);
  }

  protect vid onPostExecute(Long result){
    showDialg(result);
  }
}
```

AsyncTask使用限制
1. AsyncTask必须在主线程中创建
2. 不要在程序中直接调用onPreExecute()，doInBackground()，onProgressUpdate()，onPostExecute()
3. 一个AsyncTask对象只能执行一次，即只能调用一次execute方法。
4. 在Android1.6之前，AsyncTask是串行执行任务，在Andrid1.6之后，AsyncTask采取并行任务，在Android3.0后，AsyncTask又采用串行来执行任务。但是我们仍然可以通过AsyncTask的executeOnExecutor方法来并行执行任务。

### AsyncTask的工作原理
分析AsyncTask的工作原理，我们先从它的execute方法开始分析，而execute又会调用executeOnExecutor
```
public final AsyncTask<Params, Progress, Result> execute(Params... params){
  return executeOnExecutor(sDefaultExecutor, params);
}

public final AsyncTask executeOnExecutor(Executor exec,  
            Params... params) {  
    if (mStatus != Status.PENDING) {  
        switch (mStatus) {  
            case RUNNING:  
                throw new IllegalStateException(Cannot execute task:  
                            +  the task is already running.);  
            case FINISHED:  
                throw new IllegalStateException(Cannot execute task:  
                            +  the task has already been executed   
                            + (a task can be executed only once));  
        }  
    }  

    mStatus = Status.RUNNING;  

    onPreExecute();  

    mWorker.mParams = params;  

    exec.execute(mFuture);  

    return this;  
}
```
上面的代码中sDefaultExecutor其实是一个串行的线程池，一个进程中所有的AsyncTask全都在这个线程池中排队执行（注意是进程不是线程，是AsyncTask不是任务）。下面分析线程池的执行过程

```
public static final Executor SERIAL_EXECUTOR =new SerialExecutor();
private static volatile Executor sDefaultExecutor = SERIAL_EXECUTOR;

private static class SerialExecutor implements Executor {
	final ArrayDeque<Runnable> mTasks = new ArrayDeque<Runnable>();
	Runnable mActive;

	public synchronized void execute(final Runnable r) {
		mTasks.offer(new Runnable() {
			public void run() {
				try {
					r.run();
				} finally {
          //这个AsyncTask自己的任务执行完了，就执行下一个AsyncTask自己的任务
					scheduleNext();
				}
			}
		});
    //如果没有活动的任务了，就执行下一个AsyncTask自己的任务
		if (mActive == null) {
			scheduleNext();
		}
	}

	protected synchronized void scheduleNext() {
		if ((mActive = mTasks.poll()) != null) {
			THREAD_POOL_EXECUTOR.execute(mActive);
		}
	}
}
```
我们可以看到这段代码里有两个线程池，一个是SerialExecutor，一个是THREAD_POOL_EXECUTOR，SerialExecutor是用来任务的排队的，真正执行任务的是THREAD_POOL_EXECUTOR。

我们可以先分析下AsyncTask的Params参数封装成FutureTask对象，的排队过程。首先系统会把AsyncTask的Params参数封装成FutureTask对象，FutureTask在这里充当了Runnable的作用。接着这个FutureTask会交给SerialExecutor的execute去处理。在execute方法里面会把FutureTask塞到任务队列中mTasks，注意这里只是把任务插进队列，还没有执行任务。如果这个时候没有活动的任务了，那么就执行下一个AsyncTask自己的任务。当一个AsyncTask自己的任务执行完了，就执行下一个AsyncTask自己的任务。从这点可以看出，默认情况下，AsyncTask是串行执行的。

下面举个例子
```
new MyAsyncTask("AsyncTask#1").execute("");
new MyAsyncTask("AsyncTask#2").execute("");
new MyAsyncTask("AsyncTask#3").execute("");
new MyAsyncTask("AsyncTask#4").execute("");
new MyAsyncTask("AsyncTask#5").execute("");
```
这些MyAsyncTask作用是打印自己的名字，最后的结果就是AsyncTask#1打印到AsyncTask#5，说明AsyncTask是串行执行的。

THREAD_POOL_EXECUTOR.execute(mActive);是执行AsyncTask的代码，它会执行Future的run方法，也就是
```
public void run() {
  try {
    r.run();
  } finally {
    scheduleNext();
  }
```
而run方法又会调用mWorker的call方法，因此，最终执行的方法是mWorker的call方法
```
mWorker = new WorkerRunnable<Params, Result>(){
  public Result call() throws Exeption{
    mTaskInvoked.set(true);

    return postResult(doInBackground(mParams));
  }
}
```
这里就转到doInBackground方法了，综上，最终就是THREAD_POOL_EXECUTOR这个线程池执行doInBackground方法的。

接下来会返回postResult，它的实现如下所示
```
private Result postResult(Result result){
  @SuppressWarnings("unchecked")
  Message message = sHandler.obtainMessage(MESSAGE_POST_RESULT, new AsyncTaskResult<Result>(this, result));
  message.sendToTarget();
  return result;
}
```

在前面我们说了AsyncTask封装了线程池和Handler，其中线程池是用来排队和执行任务的，而Handler是发送结果的，让UI更新相应的数据。
postResult里会用到一个sHandler，我们来看下这个sHandler的定义
```
private static final InternalHandler sHandler = new InternalHandler();

private static class InternalHandler extends Handler{
  @SuppressWarnings({}"unchecked", "RawUseOfParameterizedType"})
  @Override
  public vod handlerMessage(Message msg){
    AsyncTaskResult Result = (AsyncTaskResult)msg.obj;
    switch(msg.what){
      case MESSAGE_POST_RESULT:
        result.mTask.finish(result.mData[0]);
        break;
      case MESSAGE_POST_PROGRESS:
        result.mTask.onProgressUpdate(result.mData);
        break;  
    }
  }
}
```
可以看出，sHandler是一个静态的Handler对象，由于它的handlerMessage方法要在主线程调用，而且静态成员变量会在加载类的时候进行初始化，这就变相要求AsyncTask的类必须在主线程中加载。
sHandler在收到MESSAGE_POST_RESULT会调用AsyncTask的finish方法
```
private void finish(Result result){
  if(isCancellled()){
    onCancellled(result);
  }else {
    onPostExecute(result);
  }
}
```
这段代码很简单，逻辑是如果AsyncTask被取消执行了，那么久调用onCancellled方法，否则就调用onPostExecute。
![](http://opsprcvob.bkt.clouddn.com/AsyncTask%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.png)

### HandlerThread
HandlerThread继承了Thread，它是一种可以使用Handler的Thread。它的run方法中已经通过Looper.prepare()，Looper.loop()开启消息循环了。这样在实际的使用就允许在HandlerThread中创建Handler了。它的run方法如下
```
public void run(){
  ...
  Looper.prepare();
  synchronized (this){
    mLooper = Looper.myLooper();
    notifyAll();
  }
  onLooperPrepared();
  Looper.loop();
}
````
在主线程中我们可以新建一个Handler
```
handler = new Handler(myHandlerThread.getLooper());
```
虽然这个Handler是在主线程中创建的，但它的Looper是HandlerThread，所以它是一个子线程的Handler，最终的消息将在HandlerThread中处理。

从HandlerThread的实现来看，它和普通的Thread有十分大的不同。普通Thread主要用于在run方法中执行一个耗时任务。而HandlerThread则是在内部创建消息队列，外界需要通过Handler的消息方式通知HandlerThread处理一个具体任务。由于HandlerThread的run方法是一个无限循环，因此当不需要再使用它的时候，可以通过它的quit或quitSafely来终止线程的执行。

### IntentService
IntentService是一个特殊的Service，它继承了Service并且是一个抽象类，所以必须创建它的子类。由于IntentService系统优先级较高，所以它适合执行一些高优先级的后台任务。在实现上，IntentService封装了HandlerThread和Handler，从它的onCreate方法就可以看出来
```
public vid onCreate(){
  super.onCreate();
  HandlerThread thread = new HandlerThread("IntentService[" + mName +"]");
  thread.start();

  mServiceLooper = thread.getLooper();
  mServiceHandler = new ServiceHandler(mServiceLooper);
}
```
在onCreate中，会创建一个HandlerThread并使用HandlerThread的Looper去构建Handler，这就让所有的消息交给了HandlerThread执行。
在IntentService中，是用onStartCommand去接收每个后台任务的Intent的，而onStartCommand又调用了onStart
```
public void onStart(Intent intent, int stardId){
  Message msg = mServiceHandler.obtainMessage();
  msg.arg1 = stardId;
  msg.obj = intent;
  mServiceHandler.sendMessage(msg);
}
```
可以看出在onStart中仅仅是向mServiceHandler发送了一个消息，这个消息会在mServiceHandler的handlerMessage中处理，因为mServiceHandler使用的是HandlerThread的Looper，所以这个方法是运行在HandlerThread中的。
```
private final class ServiceHandler extends Handler{
  public ServiceHandler(Looper looper){
    super(looper);
  }

  @Override
  public void handlerMessage(Message msg){
    onHandleIntent((Intent)msg.obj);
    stopSelf(msg.arg1);
  }
}
```
在里面会调用onHandleIntent，这个方法是要我们自己实现的，当执行完onHandleIntent后，IntentService会通过stopSelf(int startId)来尝试停止服务，其实还有一个stopSelf()也是用来停止服务的，它们俩最大的区别就是，stopSelf()会立刻停止服务，而stopSelf(int startId)会等待所有的消息都处理完毕才停止服务。

onHandleIntent是一个抽象方法，它需要我们自己实现，它的作用是从Intent参数中区分具体的任务并执行这些任务。由于每执行一个后台任务就必须启动一次IntentService，而IntentSerive内部是通过消息的形式向HandleThread请求执行任务的，也就是通过Handler，而Handler是顺序处理消息的，这意味着IntentService是顺序处理消息的，当有多个后台任务同时存在时，会按照外界发起的顺序排队执行。

最后给一个例子
定义一个IntentService的子类
```
public class LocalIntentService extends IntentService{
  private static final String TAG = "LocalIntentService";

  public LocalIntentService(){
    super(TAG);
  }

  @Override
  protected void onHandleIntent(Intent intent){
    String action = intent.getStringExtra("task_action");
    Log.d(TAG, "receive task :"+ action);
    SystemClock.sleep(3000);
  }

  @Override
  public void onDestroy(){
    super.onDestroy();
    Log.d(TAG, "service destroyed);
  }
}
```
然后发送任务，这里用SystemClock休眠了3秒去模拟耗时任务
```
Intent service = new Intent(this, LocalIntentService.class);
service.putExtra("task_action", "#Task1");
startService(service);
service.putExtra("task_action", "#Task2");
startService(service);
service.putExtra("task_action", "#Task3");
startService(service);
```
最后LocalIntentService会每隔3秒打印一个Task，从Task1打到Task3，当Task3打印完毕后，打印service destroyed。
