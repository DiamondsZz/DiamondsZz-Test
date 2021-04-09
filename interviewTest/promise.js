class APromise {
  //容器状态
  status = "pending";
  //处理成功时的容器值
  value = "";
  //处理失败时的原因
  reason = "";
  //处理成功回调函数     then方法被多次调用时，采用数组进行存储回调函数
  fullFilledCallbacks = [];
  //处理失败回调函数
  rejectedCallBacks = [];
  //处理成功
  resolve = (value) => {
    if (this.status === "pending") {
      this.status = "fullFilled";
      this.value = value;

      //处理成功回调
      while (this.fullFilledCallbacks.length) {
        this.fullFilledCallbacks.shift()(value);
      }
    }
  };
  //处理成败
  reject = (reason) => {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;

      //处理失败回调
      while (this.rejectedCallBacks.length) {
        this.rejectedCallBacks.shift()(reason);
      }
    }
  };
  //处理then方法回调函数返回值
  resolvePromise = (res, resolve, reject) => {
    //返回值为promise（这里的promise指then方法成功回调时返回的promise）时
    if (res instanceof APromise) {
      //对返回的promise（这里的promise指then方法成功回调时返回的promise）的处理结果进行处理
      //通过resolve/reject对返回的promise（这里的promise指调用then方法时返回的promise）状态进行处理
      res.then(resolve, reject);
    }
    //普通值
    else {
      resolve(res);
    }
  };
  //处理完成
  then = (onFullFilled, onRejected) => {
    const promise = new APromise((resolve, reject) => {
      //成功回调
      if (this.status === "fullFilled") {
        const res = onFullFilled(this.value);
        this.resolvePromise(res, resolve, reject);
      }
      //失败回调
      if (this.status === "rejected") {
        onRejected(this.reason);
      }

      //处理异步任务
      if (this.status === "pending") {
        //对成功、失败回调进行存储。异步任务执行成功后再进行处理

        //对成功处理函数存储
        this.fullFilledCallbacks.push(onFullFilled);
        //对失败处理函数进行存储
        this.rejectedCallBacks.push(onRejected);
      }
    });

    return promise;
  };
  constructor(executor) {
    //异常捕获
    try {
      //执行器
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
}

export default APromise;
