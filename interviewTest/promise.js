class APromise {
  //容器状态
  status = "pending";
  //处理成功时的容器值
  value = "";
  //处理失败时的原因
  reason = "";
  //处理成功回调函数
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
  //处理完成
  then = (onFullFilled, onRejected) => {
    //成功回调
    if (this.status === "fullFilled") {
      onFullFilled(this.value);
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
  };
  constructor(executor) {
    try {
      //执行器
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
}

export default APromise;
