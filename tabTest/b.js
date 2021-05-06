window.opener.postMessage("inform", "http://127.0.0.1:5500");

console.log(navigator.serviceWorker);
navigator.serviceWorker.controller.postMessage("Hello C");
