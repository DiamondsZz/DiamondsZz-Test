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
  console.log("result1", User.action.getCount());
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

let cloneObj = deepClone(obj);

cloneObj.arr.push(4);

// console.log("obj", obj);

// console.log("cloneObj", cloneObj);
