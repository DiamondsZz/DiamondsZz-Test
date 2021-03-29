
## 数据类型
1. 基础类型存储在栈内存，被引用或拷贝时，会创建一个完全相等的变量；
   > `Undefined` `Null` `String` `Number` `Boolean` `Symbol` `BigInt`
2. 引用类型存储在堆内存，存储的是地址，多个引用指向同一个地址，这里会涉及一个“共享”的概念。
   > `Object`
     > `Array` `Date` `RegExp` `Function` `Math`
	 
```
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

console.log(b.age); // 第一个console   30

console.log(a.age); // 第二个console   24
```


## 拷贝
#### 浅拷贝
1. Object.assign
*注意点*
* 它不会拷贝对象的继承属性；
* 它不会拷贝对象的不可枚举的属性；
* 可以拷贝 Symbol 类型的属性。
```
let obj1 = { a:{ b:1 }, sym:Symbol(1)}; 

Object.defineProperty(obj1, 'innumerable' ,{

    value:'不可枚举属性',

    enumerable:false

});

let obj2 = {};

Object.assign(obj2,obj1)

obj1.a.b = 2;

console.log('obj1',obj1);

console.log('obj2',obj2);

```
2. 扩展运算符
```
/* 对象的拷贝 */

let obj = {a:1,b:{c:1}}

let obj2 = {...obj}

obj.a = 2

console.log(obj)  //{a:2,b:{c:1}} console.log(obj2); //{a:1,b:{c:1}}

obj.b.c = 2

console.log(obj)  //{a:2,b:{c:2}} console.log(obj2); //{a:1,b:{c:2}}

/* 数组的拷贝 */

let arr = [1, 2, 3];

let newArr = [...arr]; //跟arr.slice()是一样的效果

```
* 扩展运算符 和 object.assign 有同样的缺陷，也就是实现的浅拷贝的功能差不多，但是如果属性都是基本类型的值，使用扩展运算符进行浅拷贝会更加方便。

3. concat 拷贝数组
```
let arr = [1, 2, 3];

let newArr = arr.concat();

newArr[1] = 100;

console.log(arr);  // [ 1, 2, 3 ]

console.log(newArr); // [ 1, 100, 3 ]

```
* concat 只能用于数组的浅拷贝，使用场景比较局限。
4. slice 拷贝数组 
* slice 方法也比较有局限性，因为它仅仅针对数组类型。
```
let arr = [1, 2, {val: 4}];

let newArr = arr.slice();

newArr[2].val = 1000;

console.log(arr);  //[ 1, 2, { val: 1000 } ]

```
* 浅拷贝只能拷贝一层对象。如果存在对象的嵌套，那么浅拷贝将无能为力。因此深拷贝就是为了解决这个问题而生的，它能解决多层对象嵌套问题，彻底实现拷贝。

5. 浅拷贝

```
const shallowClone = (target) => {

  if (typeof target === 'object' && target !== null) {

    const cloneTarget = Array.isArray(target) ? []: {};

    for (let prop in target) {

      //是否是自有属性
      if (target.hasOwnProperty(prop)) {

          cloneTarget[prop] = target[prop];

      }

    }

    return cloneTarget;

  } else {

    return target;

  }

}

```
#### 深拷贝
1. JSON.stringify()
*弊端*
* 拷贝的对象的值中如果有函数、undefined、symbol 这几种类型，经过 JSON.stringify 序列化之后的字符串中这个键值对会消失；
* 拷贝 Date 引用类型会变成字符串；
* 无法拷贝不可枚举的属性；
* 无法拷贝对象的原型链；
* 拷贝 RegExp 引用类型会变成空对象；
* 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；
* 无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)。
```
function Obj() { 

  this.func = function () { alert(1) }; 

  this.obj = {a:1};

  this.arr = [1,2,3];

  this.und = undefined; 

  this.reg = /123/; 

  this.date = new Date(0); 

  this.NaN = NaN;

  this.infinity = Infinity;

  this.sym = Symbol(1);

} 

let obj1 = new Obj();

Object.defineProperty(obj1,'innumerable',{ 

  enumerable:false,

  value:'innumerable'

});

console.log('obj1',obj1);

let str = JSON.stringify(obj1);

let obj2 = JSON.parse(str);

console.log('obj2',obj2);

```
* 使用 JSON.stringify 方法实现深拷贝对象，虽然到目前为止还有很多无法实现的功能，但是这种方法足以满足日常的开发需求，并且是最简单和快捷的。
2. 手写递归实现
```
let obj1 = {

  a:{

    b:1

  }

}

function deepClone(obj) { 

  let cloneObj = {}

  for(let key in obj) {                 //遍历

    if(typeof obj[key] ==='object') { 

      cloneObj[key] = deepClone(obj[key])  //是对象就再次调用该函数递归

    } else {

      cloneObj[key] = obj[key]  //基本类型的话直接复制值

    }

  }

  return cloneObj

}

let obj2 = deepClone(obj1);

obj1.a.b = 2;

console.log(obj2);   //  {a:{b:1}}

```
*弊端*
* 这个深拷贝函数并不能复制不可枚举的属性以及 Symbol 类型；
* 这种方法只是针对普通的引用类型的值做递归复制，而对于 Array、Date、RegExp、Error、Function 这样的引用类型并不能正确地拷贝；
* 对象的属性里面成环，即循环引用没有解决。
3. 改进后递归实现
*注意点*
* 针对能够遍历对象的不可枚举属性以及 Symbol 类型，我们可以使用 Reflect.ownKeys 方法；
* 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回；
* 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性，以及对应的特性，顺便结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链；
* 利用 WeakMap 类型作为 Hash 表，因为 WeakMap 是弱引用类型，可以有效防止内存泄漏（你可以关注一下 Map 和 weakMap 的关键区别，这里要用 weakMap），作为检测循环引用很有帮助，如果存在循环，则引用直接返回 WeakMap 存储的值。
```
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)

const deepClone = function (obj, hash = new WeakMap()) {

  if (obj.constructor === Date) 

  return new Date(obj)       // 日期对象直接返回一个新的日期对象

  if (obj.constructor === RegExp)

  return new RegExp(obj)     //正则对象直接返回一个新的正则对象

  //如果循环引用了就用 weakMap 来解决

  if (hash.has(obj)) return hash.get(obj)

  let allDesc = Object.getOwnPropertyDescriptors(obj)


  //遍历传入参数所有键的特性

  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)

  //继承原型链

  hash.set(obj, cloneObj)

  for (let key of Reflect.ownKeys(obj)) { 

    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]

  }

  return cloneObj

}

// 下面是验证代码

let obj = {

  num: 0,

  str: '',

  boolean: true,

  unf: undefined,

  nul: null,

  obj: { name: '我是一个对象', id: 1 },

  arr: [0, 1, 2],

  func: function () { console.log('我是一个函数') },

  date: new Date(0),

  reg: new RegExp('/我是一个正则/ig'),

  [Symbol('1')]: 1,

};

Object.defineProperty(obj, 'innumerable', {

  enumerable: false, value: '不可枚举属性' }

);

obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))

obj.loop = obj    // 设置loop成循环引用的属性

let cloneObj = deepClone(obj)

cloneObj.arr.push(4)

console.log('obj', obj)

console.log('cloneObj', cloneObj)

```

## 数据结构与算法
通常，复杂度的计算方法遵循以下几个原则：
1. 首先，复杂度与具体的常系数无关，例如 O(n) 和 O(2n) 表示的是同样的复杂度。
我们详细分析下，O(2n) 等于 O(n+n)，也等于 O(n) + O(n)。
也就是说，一段 O(n) 复杂度的代码只是先后执行两遍 O(n)，其复杂度是一致的。
2. 其次，多项式级的复杂度相加的时候，选择高者作为结果，例如 O(n²)+O(n) 和 O(n²) 表示的是同样的复杂度。
具体分析一下就是，O(n²)+O(n) = O(n²+n)。随着 n 越来越大，二阶多项式的变化率是要比一阶多项式更大的。
因此，只需要通过更大变化率的二阶多项式来表征复杂度就可以了。
3. 值得一提的是，O(1) 也是表示一个特殊复杂度，含义为某个任务通过有限可数的资源即可完成。
此处有限可数的具体意义是，与输入数据量 n 无关。
4. 一个顺序结构的代码，时间复杂度是 O(1)。
5. 二分查找，或者更通用地说是采用分而治之的二分策略，时间复杂度都是 O(logn)。这个我们会在后续课程讲到。
6. 一个简单的 for 循环，时间复杂度是 O(n)。
7. 两个顺序执行的 for 循环，时间复杂度是 O(n)+O(n)=O(2n)，其实也是 O(n)。
8. 两个嵌套的 for 循环，时间复杂度是 O(n²)。
9. 程序优化的最核心的思路，简单梳理如下：
第一步，暴力解法。在没有任何时间、空间约束下，完成代码任务的开发。
第二步，无效操作处理。将代码中的无效计算、无效存储剔除，降低时间或空间复杂度。
第三步，时空转换。设计合理数据结构，完成时间复杂度向空间复杂度的转移。
10. 链表和数组一样，都是 O(n) 空间复杂度的复杂数据结构。但其区别之一就是，数组有 index 的索引，而链表没有。
① 有了 index 的索引，所以我们就可以直接进行查找操作来，这里的时间复杂度为 O(1)。
② 链表因为没有索引，只能“一个接一个”地按照位置条件查找，在这种情况下时间复杂度就是 O (n)。
11. 数据处理的基本操作只有 3 个，分别是增、删、查。其中，增和删又可以细分为在数据结构中间的增和删，以及在数据结构最后的增和删。
区别就在于原数据的位置是否发生改变。查找又可以细分为按照位置条件的查找和按照数据数值特征的查找。
几乎所有的数据处理，都是这些基本操作的组合和叠加。