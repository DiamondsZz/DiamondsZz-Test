/**
 * 1. 已知如下对象，请基于es6的proxy方法设计一个属性拦截读取操作的例子，
 * 要求实现去访问目标对象example中不存在的属性时，抛出错误：Property “$(property)” does not exist    （2018 今日头条）
 */

const man = {
  name: "jscoder",
  age: 23,
};

const manProxy = new Proxy(man, {
  //拦截对象属性的读取
  get(target, propKey) {
    if (target[propKey]) return target[propKey];
    else return `property ${propKey} does not exist`;
  },
});
// console.log(manProxy.name);
// console.log(manProxy.age);
// console.log(manProxy.location);

/**
 *
 * 2.
 */

//红
function red() {
  console.log("red");
}
//绿
function green() {
  console.log("green");
}
//黄
function yellow() {
  console.log("yellow");
}

function greenYellowRed() {
  return new Promise((resolve, reject) => {
    const timerGreen = setTimeout(() => {
      green();
      resolve();
      clearTimeout(timerGreen);
    }, 1000);
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        const timerYellow = setTimeout(() => {
          yellow();
          resolve();
          clearTimeout(timerYellow);
        }, 1000);
      });
    })
    .then(() => {
      const timerRed = setTimeout(() => {
        red();
        clearTimeout(timerRed);
        greenYellowRed();
      }, 1000);
    });
}

/**
 * 3.
 */

var User = {
  count: 1,
  action: {
    getCount: function () {
      //console.log(this);
      return this.count;
    },
  },
};

var getCount = User.action.getCount;

setTimeout(() => {
  // console.log("result1", User.action.getCount());
}, 2000);

// console.log("result2", getCount());

/**
 *
 * 4.
 */
let a = {
  name: "Julia",

  age: 20,
};

function change(o) {
  o.age = 24;
  //关键   变量o改变内存指向 跟a已经没有关系
  o = {
    name: "Kath",
    age: 30,
  };
  return o;
}

let b = change(a);

// console.log(b.age); // 第一个console   30

// console.log(a.age); // 第二个console   24

/**
 *
 * 5.
 */
/* 对象的拷贝 */

const isComplexDataType = (obj) =>
  (typeof obj === "object" || typeof obj === "function") && obj !== null;

const deepClone = function (obj, hash = new WeakMap()) {
  if (obj.constructor === Date) return new Date(obj); // 日期对象直接返回一个新的日期对象

  if (obj.constructor === RegExp) return new RegExp(obj); //正则对象直接返回一个新的正则对象

  //如果循环引用了就用 weakMap 来解决

  if (hash.has(obj)) return hash.get(obj);

  let allDesc = Object.getOwnPropertyDescriptors(obj);

  //遍历传入参数所有键的特性

  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);

  //继承原型链

  hash.set(obj, cloneObj);

  for (let key of Reflect.ownKeys(obj)) {
    cloneObj[key] =
      isComplexDataType(obj[key]) && typeof obj[key] !== "function"
        ? deepClone(obj[key], hash)
        : obj[key];
  }

  return cloneObj;
};

// 下面是验证代码

let obj = {
  num: 0,

  str: "",

  boolean: true,

  unf: undefined,

  nul: null,

  obj: { name: "我是一个对象", id: 1 },

  arr: [0, 1, 2],

  func: function () {
    console.log("我是一个函数");
  },

  date: new Date(0),

  reg: new RegExp("/我是一个正则/ig"),

  [Symbol("1")]: 1,
};

Object.defineProperty(obj, "innumerable", {
  enumerable: false,
  value: "不可枚举属性",
});

obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj));

obj.loop = obj; // 设置loop成循环引用的属性

// let cloneObj = deepClone(obj);

// cloneObj.arr.push(4);

//console.log("obj", obj);

// console.log("cloneObj", cloneObj);

/**
 * 6.1 圆形链继承
 */

//  function Parent1() {

//   this.name = 'parent1';

//   this.play = [1, 2, 3]

// }

// function Child1() {

//   this.type = 'child2';

// }

// Child1.prototype = new Parent1();
// let c1=new Child1()
// let c2=new Child1()
//console.log(Parent1.prototype);
//console.log(c1.__proto__===c2.__proto__); //true

/**
 * 6.2 构造函数继承（借助 call）
 */

//  function Parent1(){

//   this.name = 'parent1';

// }

// Parent1.prototype.getName = function () {

//   return this.name;

// }

// function Child1(){

//   Parent1.call(this);

//   this.type = 'child1'

// }

// let child = new Child1();

// console.log(child);  // 没问题

// console.log(child.getName());  // 会报错

/**
 * 6.3 组合继承（前两种组合）
 */

// function Parent3 () {

//   this.name = 'parent3';

//   this.play = [1, 2, 3];

// }

// Parent3.prototype.getName = function () {

//   return this.name;

// }

// function Child3() {

//   // 第二次调用 Parent3()

//   Parent3.call(this);

//   this.type = 'child3';

// }

// // 第一次调用 Parent3()

// Child3.prototype = new Parent3();

// // 手动挂上构造器，指向自己的构造函数
// //console.log(Child3.prototype);
// Child3.prototype.constructor = Child3;

// var s3 = new Child3();

// var s4 = new Child3();

// s3.play.push(4);

// console.log(s3.play, s4.play);  // 不互相影响

// console.log(s3.getName()); // 正常输出'parent3'

// console.log(s4.getName()); // 正常输出'parent3'

/**
 * 7.new
 */
function Person() {
  this.name = "Jack";

  // return {age: 18}
}

//var p = new Person();

// console.log(p)  // {age: 18}

// console.log(p.name) // undefined

// console.log(p.age) // 18
// Person()
// console.log(this.name);

function _new(ctor, ...args) {
  if (typeof ctor !== "function") {
    throw "ctor must be a function";
  }

  let obj = new Object();

  obj.__proto__ = Object.create(ctor.prototype);

  //关键  this指向
  let res = ctor.apply(obj, [...args]);

  let isObject = typeof res === "object" && res !== null;

  let isFunction = typeof res === "function";

  return isObject || isFunction ? res : obj;
}

//console.log(_new(Person));

/**
 * call apply
 */

Function.prototype.call = function (context, ...args) {
  var context = context || window;

  //当前this指向Function.prototype上面的方法
  context.fn = this;

  var result = eval("context.fn(...args)");

  delete context.fn;

  return result;
};

//Math.max.call()
// Function.prototype.apply = function (context, args) {

//   let context = context || window;

//   context.fn = this;

//   let result = eval('context.fn(...args)');

//   delete context.fn

//   return result;

// }

/**
 *
 * bind
 */
Function.prototype.bind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("this must be a function");
  }

  var self = this;
  var fbound = function () {
    self.apply(
      this instanceof fbound ? this : context,
      args.concat(Array.prototype.slice.call(arguments))
    );
  };

  if (this.prototype) {
    fbound.prototype = Object.create(this.prototype);
  }

  return fbound;
};
//new (Math.max.bind(this))();
/**
 * 闭包
 */
// var a22 = 2;

// (function IIFE(){
//   a22=33
//   console.log(a22);  // 输出2

// })();
// for(var i = 1;i <= 5;i++){

//   (function(j){

//     setTimeout(function timer(){

//       console.log(j)

//     }, 0)

//   })(i)

// }

//console.log([1,2,3,4].toString());

/**
 * JSON
 */
const json = '{"result":true, "count":2}';

const obj2 = JSON.parse(json);

//console.log(obj2.count);

// 2

//console.log(obj2.result);

// true

/* 带第二个参数的情况 */

JSON.parse('{"p": 5,"p2": 52}', function (k, v) {
  //console.log(k, v);
  if (k === "") return v; // 如果k不是空，

  return v * 2; // 就将属性值变为原来的2倍返回
}); // { p: 10 }

JSON.stringify({ x: 1, y: 2 });

// "{"x":1,"y":2}"

JSON.stringify({ x: [10, undefined, function () {}, Symbol("")] });

// "{"x":[10,null,null,null]}"

/* 第二个参数的例子 */

function replacer(key, value) {
  if (typeof value === "string") {
    return undefined;
  }

  return value;
}

var foo = {
  foundation: "Mozilla",
  model: "box",
  week: 4,
  transport: "car",
  month: 7,
};

var jsonString = JSON.stringify(foo, replacer);

//console.log(jsonString);

// "{"week":4,"month":7}"

/* 第三个参数的例子 */

JSON.stringify({ a: 2 }, null, " ");

/* "{

 "a": 2

}"*/

JSON.stringify({ a: 2 }, null, "");

//console.log(JSON.stringify({ a: 2, b: 6 }, null, "                  "));
// "{"a":2}"

function jsonStringify(data) {
  let type = typeof data;

  if (type !== "object") {
    let result = data;

    //data 可能是基础数据类型的情况在这里处理

    if (Number.isNaN(data) || data === Infinity) {
      //NaN 和 Infinity 序列化返回 "null"

      result = "null";
    } else if (
      type === "function" ||
      type === "undefined" ||
      type === "symbol"
    ) {
      // 由于 function 序列化返回 undefined，因此和 undefined、symbol 一起处理

      return undefined;
    } else if (type === "string") {
      result = '"' + data + '"';
    }

    return String(result);
  } else if (type === "object") {
    if (data === null) {
      return "null"; // 第01讲有讲过 typeof null 为'object'的特殊情况
    } else if (data.toJSON && typeof data.toJSON === "function") {
      return jsonStringify(data.toJSON());
    } else if (data instanceof Array) {
      let result = [];

      //如果是数组，那么数组里面的每一项类型又有可能是多样的

      data.forEach((item, index) => {
        if (
          typeof item === "undefined" ||
          typeof item === "function" ||
          typeof item === "symbol"
        ) {
          result[index] = "null";
        } else {
          result[index] = jsonStringify(item);
        }
      });

      result = "[" + result + "]";

      return result.replace(/'/g, '"');
    } else {
      // 处理普通对象

      let result = [];

      Object.keys(data).forEach((item, index) => {
        if (typeof item !== "symbol") {
          //key 如果是 symbol 对象，忽略

          if (
            data[item] !== undefined &&
            typeof data[item] !== "function" &&
            typeof data[item] !== "symbol"
          ) {
            //键值如果是 undefined、function、symbol 为属性值，忽略

            result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
          }
        }
      });

      return ("{" + result + "}").replace(/'/g, '"');
    }
  }
}

//console.log(JSON.stringify([2,5,'ggg']));

/**
 * 任务
 */

// async function async1() {
//   console.log("async1 start");

//   await async2();

//   console.log("async1 end");
// }

// async function async2() {
//   console.log("async2");
// }

// async1();

// setTimeout(() => {
//   console.log("timeout");
// }, 0);

// new Promise(function (resolve) {
//   console.log("promise1");

//   resolve();
// }).then(function () {
//   console.log("promise2");
// });

// console.log("script end");

const readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    resolve(223);
  }).then((res) => res);
};

// const gen = function* () {
//   yield readFilePromise();
//   yield 252;
//   return 2282;
// };

// console.log(
//   gen()
//     .next()
//     .value.then((res) => console.log(res))
// );
// let g = gen();

// g.next().value.then((res) => console.log(g.next()));
// console.log(g.next());
function* gen() {
  console.log("enter");

  let a = yield 1;
  let b = yield (function () {
    return 2;
  })();

  return 3;
}

var g = gen(); // 阻塞住，不会执行任何语句

// console.log(g.next());

// console.log(g.next());

// console.log(g.next());

// console.log(g.next());

// output:

// { value: 1, done: false }

// { value: 2, done: false }

// { value: 3, done: true }

// { value: undefined, done: true }

/**
 *EventEmitter
 */

function EventEmitter() {
  this.__events = {};
}

EventEmitter.VERSION = "1.0.0";

//绑定事件
EventEmitter.prototype.on = function (eventName, event) {
  let events = (this.__events[eventName] = this.__events[eventName] || []);
  //是否存在该事件
  let isExist = events.find((ev) => ev.listener === (event.listener || event));
  if (!isExist) {
    events.push(
      //对象或函数
      event.listener
        ? event
        : {
            once: false,
            listener: event,
          }
    );
  }

  return this;
};
//触发事件
EventEmitter.prototype.emit = function (eventName, args) {
  let events = this.__events[eventName] || [];

  //多个事件
  for (let event of events) {
    event.listener.apply(this, args || []);
    if (event.once) {
      this.off(eventName, event);
    }
  }
};
//执行一次
EventEmitter.prototype.once = function (eventName, event) {
  return this.on(eventName, {
    once: true,
    listener: event.listener || event,
  });
};
//移除事件
EventEmitter.prototype.off = function (eventName, event) {
  let events = this.__events[eventName] || [];
  //事件下标
  let eventIndex = events.findIndex(
    (ev) => ev.listener === (event.listener || event)
  );
  //存在该事件时
  if (eventIndex !== -1) events.splice(eventIndex, 1);
};
//移除所有事件
EventEmitter.prototype.allOff = function (eventName) {
  if (this.__events[eventName]) this.__events[eventName] = [];
};

// let em = new EventEmitter();

// const fn1 = () => {
//   console.log(6666);
// };
// const fn2 = () => {
//   console.log(666776);
// };
// em.on("test", fn1);
// em.on("test", fn2);
// em.allOff("test");
// em.emit("test");

// Promise.resolve()
//   .then(() => {
//     console.log(0);
//   })
//   .then((res) => {
//     console.log(res);
//     //console.log("tt");
//   })
//   .then(() => {
//     //console.log(res);
//     console.log("ttt");
//   })
//   .then(() => {
//     //console.log(res);
//     console.log("tttt");
//   });

// Promise.resolve()
//   .then(() => {
//     console.log(1);
//   })
//   .then(() => {
//     console.log(2);
//   })
//   .then(() => {
//     console.log(3);
//   })
//   .then(() => {
//     console.log(5);
//   })
//   .then(() => {
//     console.log(6);
//   });

// Promise.resolve()
//   .then(() => {
//     console.log(31);
//   })
//   .then(() => {
//     console.log(32);
//   })
//   .then(() => {
//     console.log(33);
//   })
//   .then(() => {
//     console.log(35);
//   })
//   .then(() => {
//     console.log(36);
//   });

import APromise from "./promise.js";
new APromise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  });
}).then((res) => {
  console.log(res);
});
