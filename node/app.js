const express = require("express");
const app = express();
app.get("*", (req, res) => {
  res.send("hello");
});
app.listen(3333, () => {
  console.log("running");
  global.gc();
  console.log(process.memoryUsage());
  let arr = new Array(1000000);
  //let m = [[arr, 2]];
  let wm = new WeakMap();
  wm.set(arr, 1);
  console.log(process.memoryUsage());
  //arr = null;
  //m = null;
  //m[0] = null;
  //m[0][0] = null;
  global.gc();
  console.log(process.memoryUsage());
});
