function skip(params) {
  window.open("b.html");
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js", {
      scope: "./",
    })
    .then(function (registration) {
      navigator.serviceWorker.controller.postMessage("hello");

      //registration.active.postMessage("hello");
    })
    .catch(function (error) {});
} else {
}

window.addEventListener("message", (e) => {
  console.log(e);
});
