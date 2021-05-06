const mc = new MessageChannel();
mc.port1.onmessage = (e) => {
  console.log(e.data);
};
//mc.port2.postMessage("hello");

// setInterval(() => {
//   if (navigator.serviceWorker.controller) {
//     navigator.serviceWorker.controller.postMessage("hello");
//   }
// }, 2000);
