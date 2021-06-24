(function init() {
  let obj = {};
  let obj2 = { a: obj };
  obj.a = obj2;
  console.log(
    new WeakMap([
      [{}, "3"],
      [{}, "6"],
    ]),
    new WeakSet([{ 2: 3 }])
  );
})();
