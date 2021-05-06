console.log(this);
// main thread
// if (serviceWorker) {
//   // 创建信道
//   var channel = new MessageChannel();
//   // port1留给自己
//   channel.port1.onmessage = (e) => {
//     console.log("main thread receive message...");
//     console.log(e);
//   };

//   // port2给对方
//   serviceWorker.postMessage("hello world!", [channel.port2]);
//   serviceWorker.addEventListener("statechange", function (e) {
//     // logState(e.target.state);
//   });
// }

// // sw
// self.addEventListener("message", (ev) => {
//   console.log("sw receive message..");
//   console.log(ev);
//   // 取main thread传来的port2
//   ev.ports[0].postMessage("Hi, hello too");
// });
