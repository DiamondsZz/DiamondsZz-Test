class APromise {
  status = "pending";
  value = "";
  reason = "";

  resolve = (value) => {
    if (this.status === "pending") {
      this.status = "fullFilled";
      this.value = value;
    }
  };
  reject = (reason) => {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
    }
  };
  then = (onResolve, onReject) => {
    onResolve(this.value);
  };
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
}

export default APromise;
