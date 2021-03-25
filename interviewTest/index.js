/**
 * 1. 已知如下对象，请基于es6的proxy方法设计一个属性拦截读取操作的例子，
 * 要求实现去访问目标对象example中不存在的属性时，抛出错误：Property “$(property)” does not exist    （2018 今日头条）
 */

// const man = {
//   name: "jscoder",
//   age: 23,
// };

// const manProxy = new Proxy(man, {
//   //拦截对象属性的读取
//   get(target, propKey) {
//     if (target[propKey]) return target[propKey];
//     else return `property ${propKey} does not exist`
//   },
// });
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

// var User = {
//   count: 1,
//   action: {
//     getCount: function () {
//       //console.log(this);
//       return this.count;
//     },
//   },
// };

// var getCount = User.action.getCount;

// setTimeout(() => {
//   console.log("result1", User.action.getCount());
// },2000);

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
  //关键
  o = {
    name: "Kath",
    age: 30,
  };

  return o;
}

let b = change(a);

console.log(b.age); // 第一个console   30

console.log(a.age); // 第二个console   24
