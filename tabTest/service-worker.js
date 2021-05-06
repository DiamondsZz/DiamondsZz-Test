// main thread
if (serviceWorker) {
  // 创建信道
  const channel = new MessageChannel();
  // port1留给自己
  channel.port1.onmessage = (e) => {
    console.log("main thread receive message...");
  };

  // port2给对方
  serviceWorker.postMessage("hello world!", [channel.port2]);
}
console.log(this);
// sw
this.addEventListener("message", (ev) => {
  console.log("sw receive message..");
  // 取main thread传来的port2
  ev.ports[0].postMessage("Hi, hello too");
});
