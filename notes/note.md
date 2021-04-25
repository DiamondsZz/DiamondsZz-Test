
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
### 时间、空间复杂度
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
### 增删查
1. 链表和数组一样，都是 O(n) 空间复杂度的复杂数据结构。但其区别之一就是，数组有 index 的索引，而链表没有。
① 有了 index 的索引，所以我们就可以直接进行查找操作来，这里的时间复杂度为 O(1)。
② 链表因为没有索引，只能“一个接一个”地按照位置条件查找，在这种情况下时间复杂度就是 O (n)。
2. 数据处理的基本操作只有 3 个，分别是增、删、查。其中，增和删又可以细分为在数据结构中间的增和删，以及在数据结构最后的增和删。
区别就在于原数据的位置是否发生改变。查找又可以细分为按照位置条件的查找和按照数据数值特征的查找。
几乎所有的数据处理，都是这些基本操作的组合和叠加。
### 线性表-链表 
* 最常用的是链式表达，通常也叫作线性链表或者链表。
1. 虽然链表在新增和删除数据上有优势，但仔细思考就会发现，这个优势并不实用。这主要是因为，在新增数据时，通常会伴随一个查找的动作。例如，在第五个结点后，新增一个新的数据结点，那么执行的操作就包含两个步骤：
①第一步，查找第五个结点；
②第二步，再新增一个数据结点。整体的复杂度就是 O(n) + O(1)，也就是O(n)。
2. 线性表真正的价值在于，它对数据的存储方式是按照顺序的存储。
如果数据的元素个数不确定，且需要经常进行数据的新增和删除时，那么链表会比较合适。
如果数据元素大小确定，删除插入的操作并不多，那么数组可能更适合些。
```
例 1，链表的翻转。给定一个链表，输出翻转后的链表。例如，输入1 ->2 -> 3 -> 4 ->5，输出 5 -> 4 -> 3 -> 2 -> 1。
我们来仔细看一下这个问题的难点在哪里，这里有两种情况：
如果是数组的翻转，这会非常容易。原因在于，数组在连续的空间进行存储，可以直接求解出数组的长度。而且，数组可以通过索引值去查找元素，然后对相应的数据进行交换操作而完成翻转。
但对于某个单向链表，它的指针结构造成了它的数据通路有去无回，一旦修改了某个指针，后面的数据就会造成失联的状态。为了解决这个问题，我们需要构造三个指针 prev、curr 和 next，对当前结点、以及它之前和之后的结点进行缓存，再完成翻转动作。


例 2，给定一个奇数个元素的链表，查找出这个链表中间位置的结点的数值。
这个问题也是利用了链表的长度无法直接获取的不足做文章，解决办法如下：
一个暴力的办法是，先通过一次遍历去计算链表的长度，这样我们就知道了链表中间位置是第几个。接着再通过一次遍历去查找这个位置的数值。
除此之外，还有一个巧妙的办法，就是利用快慢指针进行处理。其中快指针每次循环向后跳转两次，而慢指针每次向后跳转一次。


例 3，判断链表是否有环。
假设链表有环，这个环里面就像是一个跑步赛道的操场一样。经过多次循环之后，快指针和慢指针都会进入到这个赛道中，就好像两个跑步选手在比赛。
快指针每次走两格，而慢指针每次走一格，相对而言，快指针每次循环会多走一步。
这就意味着：如果链表存在环，快指针和慢指针一定会在环内相遇，即 fast == slow 的情况一定会发生。
反之，则最终会完成循环，二者从未相遇。
```
### 栈
#### 顺序栈
1. 栈的顺序存储可以借助数组来实现。一般来说，会把数组的首元素存在栈底，最后一个元素放在栈顶。
然后定义一个 top 指针来指示栈顶元素在数组中的位置。假设栈中只有一个数据元素，则 top = 0。
一般以 top 是否为 -1 来判定是否为空栈。
当定义了栈的最大容量为 StackSize 时，则栈顶 top 必须小于 StackSize。
2. 对于查找操作，栈没有额外的改变，跟线性表一样，它也需要遍历整个栈来完成基于某些条件的数值查找。
3. 删除数据元素，即出栈操作，只需要 top - 1 就可以了。
#### 链栈
1. 关于链式栈，就是用链表的方式对栈的表示。
2. 在链式栈中进行删除操作时，只能在栈顶进行操作。因此，将栈顶的 top 指针指向栈顶元素的 next 指针即可完成删除。
3. 对于链式栈来说，新增删除数据元素没有任何循环操作，其时间复杂度均为 O(1)。
* 不管是顺序栈还是链栈，数据的新增、删除、查找与线性表的操作原理极为相似，时间复杂度完全一样，都依赖当前位置的指针来进行数据对象的操作。区别仅仅在于新增和删除的对象，只能是栈顶的数据结点。
### 数组
实际上数组是一种相当简单的数据结构，其增删查的时间复杂度相对于链表来说整体上是更优的。那么链表存在的价值又是什么呢？
1. 首先，链表的长度是可变的，数组的长度是固定的，在申请数组的长度时就已经在内存中开辟了若干个空间。如果没有引用 ArrayList 时，数组申请的空间永远是我们在估计了数据的大小后才执行，所以在后期维护中也相当麻烦。
2. 其次，链表不会根据有序位置存储，进行插入数据元素时，可以用指针来充分利用内存空间。数组是有序存储的，如果想充分利用内存的空间就只能选择顺序存储，而且需要在不取数据、不删除数据的情况下才能实现。
### 树
* 树是由结点和边组成的，不存在环的一种数据结构。
* 没有父结点，则可以称为根结点
* 没有子结点，则称为叶子结点
* 树中结点的最大层次数，就是这棵树的树深（称为深度，也称为高度）
* 树数据的查找操作和链表一样，都需要遍历每一个数据去判断，所以时间复杂度是 O(n)。
#### 二叉树
* 在二叉树中，每个结点最多有两个分支，即每个结点最多有两个子结点，分别称作左子结点和右子结点。
* 满二叉树，定义为除了叶子结点外，所有结点都有 2 个子结点。
* 完全二叉树，定义为除了最后一层以外，其他层的结点个数都达到最大，并且最后一层的叶子结点都靠左排列。之所以称为完全二叉树，是从存储空间利用效率的视角来看的。对于一棵完全二叉树而言，仅仅浪费了下标为 0 的存储位置。而如果是一棵非完全二叉树，则会浪费大量的存储空间。
* 存储二叉树有两种办法，一种是基于指针的链式存储法，另一种是基于数组的顺序存储法。
* 根据基于数组的顺序存储法，我们可以发现如果结点 X 的下标为 i，那么 X 的左子结点总是存放在 2 * i 的位置，X 的右子结点总是存放在 2 * i + 1 的位置。
##### 二叉查找树（二叉搜索树）
* 在二叉查找树中的任意一个结点，其左子树中的每个结点的值，都要小于这个结点的值。
* 在二叉查找树中的任意一个结点，其右子树中每个结点的值，都要大于这个结点的值。
* 在二叉查找树中，会尽可能规避两个结点数值相等的情况。
* 对二叉查找树进行中序遍历，就可以输出一个从小到大的有序数据队列。
* 在利用二叉查找树执行查找操作时，我们可以进行以下判断：
1. 首先判断根结点是否等于要查找的数据，如果是就返回。
2. 如果根结点大于要查找的数据，就在左子树中递归执行查找动作，直到叶子结点。
3. 如果根结点小于要查找的数据，就在右子树中递归执行查找动作，直到叶子结点。
4. 这样的“二分查找”所消耗的时间复杂度就可以降低为 O(logn)。
* 二叉查找树插入数据的时间复杂度是 O(logn)。但这并不意味着它比普通二叉树要复杂。原因在于这里的时间复杂度更多是消耗在了遍历数据去找到查找位置上，真正执行插入动作的时间复杂度仍然是 O(1)。

### 递归
* 递归的核心思想是把规模大的问题转化为规模小的相似的子问题来解决。
* 当一个问题同时满足以下 2 个条件时，就可以使用递归的方法求解：
1. 可以拆解为除了数据规模以外，求解思路完全相同的子问题；
2. 存在终止条件。
### 分治
* 分治法的核心思想就是“分而治之”。
* 利用分而治之的思想，就可以把一个大规模、高难度的问题，分解为若干个小规模、低难度的小问题。随后，开发者将面对多个简单的问题，并很快地找到答案各个击破。在把这些简单问题解决好之后，我们通过把这些小问题的答案合并，就得到了原问题的答案。
* 二分查找，则是利用分治法去解决查找问题。通常二分查找需要一个前提，那就是输入的数列是有序的。
* 二分查找的时间复杂度是 O(logn)，这也是分治法普遍具备的特性。当你面对某个代码题，而且约束了时间复杂度是 O(logn) 或者是 O(nlogn) 时，可以想一下分治法是否可行。
* 二分查找的循环次数并不确定。一般是达到某个条件就跳出循环。因此，编码的时候，多数会采用 while 循环加 break 跳出的代码结构。
* 二分查找处理的原问题必须是有序的。因此，当你在一个有序数据环境中处理问题时，可以考虑分治法。相反，如果原问题中的数据并不是有序的，则使用分治法的可能性就会很低了。
### 排序
* 衡量一个排序算法的优劣，我们主要会从以下 3 个角度进行分析：
1. 时间复杂度，具体包括，最好时间复杂度、最坏时间复杂度以及平均时间复杂度。
2. 空间复杂度，如果空间复杂度为 1，也叫作原地排序。
3. 稳定性，排序的稳定性是指相等的数据对象，在排序之后，顺序是否能保证不变。
4. 排序最暴力的方法，时间复杂度是 O(n*n)。这恰如冒泡排序和插入排序。
5. 当我们利用算法思维去解决问题时，就会想到尝试分治法。此时，利用归并排序就能让时间复杂度降低到 O(nlogn)。然而，归并排序需要额外开辟临时空间。一方面是为了保证稳定性，另一方面则是在归并时，由于在数组中插入元素导致了数据挪移的问题。
6. 为了规避因此而带来的时间损耗，此时我们采用快速排序。通过交换操作，可以解决插入元素导致的数据挪移问题，而且降低了不必要的空间开销。但是由于其动态二分的交换数据，导致了由此得出的排序结果并不稳定。
7. 如果对数据规模比较小的数据进行排序，可以选择时间复杂度为 O(n*n) 的排序算法。因为当数据规模小的时候，时间复杂度 O(nlogn) 和 O(n*n) 的区别很小，它们之间仅仅相差几十毫秒，因此对实际的性能影响并不大。
8. 但对数据规模比较大的数据进行排序，就需要选择时间复杂度为 O(nlogn) 的排序算法了。归并排序的空间复杂度为 O(n)，也就意味着当排序 100M 的数据，就需要 200M 的空间，所以对空间资源消耗会很多。快速排序在平均时间复杂度为 O(nlogn)，但是如果分区点选择不好的话，最坏的时间复杂度也有可能逼近 O(n*n)。而且快速排序不具备稳定性，这也需要看你所面对的问题是否有稳定性的需求。
#### 冒泡排序
* 冒泡排序最好时间复杂度是 O(n)，也就是当输入数组刚好是顺序的时候，只需要挨个比较一遍就行了，不需要做交换操作，所以时间复杂度为 O(n)。
* 冒泡排序最坏时间复杂度会比较惨，是 O(n*n)。也就是说当数组刚好是完全逆序的时候，每轮排序都需要挨个比较 n 次，并且重复 n 次，所以时间复杂度为 O(n*n)。
* 很显然，当输入数组杂乱无章时，它的平均时间复杂度也是 O(n*n)。
* 冒泡排序不需要额外的空间，所以空间复杂度是 O(1)。冒泡排序过程中，当元素相同时不做交换，所以冒泡排序是稳定的排序算法。
#### 插入排序
* 选取未排序的元素，插入到已排序区间的合适位置，直到未排序区间为空。插入排序顾名思义，就是从左到右维护一个已经排好序的序列。直到所有的待排数据全都完成插入的动作。
* 插入排序最好时间复杂度是 O(n)，即当数组刚好是完全顺序时，每次只用比较一次就能找到正确的位置。这个过程重复 n 次，就可以清空未排序区间。
* 插入排序最坏时间复杂度则需要 O(n*n)。即当数组刚好是完全逆序时，每次都要比较 n 次才能找到正确位置。这个过程重复 n 次，就可以清空未排序区间，所以最坏时间复杂度为 O(n*n)。
* 插入排序的平均时间复杂度是 O(n*n)。这是因为往数组中插入一个元素的平均时间复杂度为 O(n)，而插入排序可以理解为重复 n 次的数组插入操作，所以平均时间复杂度为 O(n*n)。
* 插入排序不需要开辟额外的空间，所以空间复杂度是 O(1)。
#### 归并排序
* 归并排序法的原理是分治法。
* 对于归并排序，它采用了二分的迭代方式，复杂度是 logn。
* 每次的迭代，需要对两个有序数组进行合并，这样的动作在 O(n) 的时间复杂度下就可以完成。因此，归并排序的复杂度就是二者的乘积 O(nlogn)。同时，它的执行频次与输入序列无关，因此，归并排序最好、最坏、平均时间复杂度都是 O(nlogn)。
* 空间复杂度方面，由于每次合并的操作都需要开辟基于数组的临时内存空间，所以空间复杂度为 O(n)。归并排序合并的时候，相同元素的前后顺序不变，所以归并是稳定的排序算法。
#### 快速排序
* 快速排序法的原理也是分治法。
* 的每轮迭代，会选取数组中任意一个数据作为分区点，将小于它的元素放在它的左侧，大于它的放在它的右侧。再利用分治思想，继续分别对左右两侧进行同样的操作，直至每个区间缩小为 1，则完成排序。
* 在快排的最好时间的复杂度下，如果每次选取分区点时，都能选中中位数，把数组等分成两个，那么此时的时间复杂度和归并一样，都是 O(n*logn)。
* 而在最坏的时间复杂度下，也就是如果每次分区都选中了最小值或最大值，得到不均等的两组。那么就需要 n 次的分区操作，每次分区平均扫描 n / 2 个元素，此时时间复杂度就退化为 O(n*n) 了。
* 快速排序法在大部分情况下，统计上是很难选到极端情况的。因此它平均的时间复杂度是 O(n*logn)。
* 快速排序法的空间方面，使用了交换法，因此空间复杂度为 O(1)。
* 很显然，快速排序的分区过程涉及交换操作，所以快排是不稳定的排序算法。
### 动态规划
* 从数学的视角来看，动态规划是一种运筹学方法，是在多轮决策过程中的最优方法。
* 从分治法的视角来看，每个子问题必须相互独立。但在多轮决策中，这个假设显然不成立。这也是动态规划方法产生的原因之一。
* 动态规划有一个重要概念叫作状态。
*一般而言，具有如下几个特征的问题，可以采用动态规划求解：
1. 最优子结构。它的含义是，原问题的最优解所包括的子问题的解也是最优的。例如，某个策略使得 A 到 G 是最优的。假设它途径了 Fi，那么它从 A 到 Fi 也一定是最优的。
2. 无后效性。某阶段的决策，无法影响先前的状态。可以理解为今天的动作改变不了历史。
3. 有重叠子问题。也就是，子问题之间不独立。这个性质是动态规划区别于分治法的条件。如果原问题不满足这个特征，也是可以用动态规划求解的，无非就是杀鸡用了宰牛刀。



## 事件循环
### 浏览器
* 各种浏览器事件同时触发时，肯定有一个先来后到的排队问题。决定这些事件如何排队触发的机制，就是事件循环。这个排队行为以 JavaScript 开发者的角度来看，主要是分成两个队列：
1. 一个是 JavaScript 外部的队列。外部的队列主要是浏览器协调的各类事件的队列，标准文件中称之为 Task Queue。下文中为了方便理解统一称为外部队列。
2. 另一个是 JavaScript 内部的队列。这部分主要是 JavaScript 内部执行的任务队列，标准中称之为 Microtask Queue。下文中为了方便理解统一称为内部队列。
* 值得注意的是，虽然为了好理解我们管这个叫队列 (Queue)，但是本质上是有序集合 (Set)，因为传统的队列都是先进先出（FIFO）的，而这里的队列则不然，排到最前面但是没有满足条件也是不会执行的（比如外部队列里只有一个 setTimeout 的定时任务，但是时间还没有到，没有满足条件也不会把他出列来执行）。
#### 外部队列
* 外部队列（Task Queue  关于 Task，常有人称它为 Marcotask (宏任务)，但 HTML 标准中没有这种说法。），顾名思义就是 JavaScript 外部的事件的队列，这里我们可以先列举一下浏览器中这些外部事件源（Task Source），他们主要有：
1. DOM 操作 (页面渲染)
2. 用户交互 (鼠标、键盘)
3. 网络请求 (Ajax 等)
4. History API 操作
5. 定时器 (setTimeout 等)
* HTML 标准中明确指出一个事件循环由一个或多个外部队列，而每一个外部事件源都有一个对应的外部队列。不同事件源的队列可以有不同的优先级（例如在网络事件和用户交互之间，浏览器可以优先处理鼠标行为，从而让用户感觉更加流程）。
* scripts 执行也是一个事件，我们只要归类一下就会发现 JavaScript 的执行也是一个浏览器发起的外部事件。
#### 内部队列
* 内部队列（Microtask Queue），即 JavaScript 语言内部的事件队列，在 HTML 标准中，并没有明确规定这个队列的事件源，通常认为有以下几种：
1. Promise 的成功 (.then) 与失败 (.catch)
2. MutationObserver
3. Object.observe (已废弃)
### Node 
*  HTML (浏览器端) 与 libuv (服务端) 面对的场景有很大的差异。首先能直观感受到的区别是：
1. 事件循环的过程没有 HTML 渲染。只剩下了外部队列和内部队列这两个部分。
2. 外部队列的事件源不同。Node.js 端没有了鼠标等外设但是新增了文件等 IO。
3. 内部队列的事件仅剩下 Promise 的 then 和 catch。
* 至于内在的差异，有一个很重要的地方是 Node.js （libuv）在最初设计的时候是允许执行多次外部的事件再切换到内部队列的，而浏览器端一次事件循环只允许执行一次外部事件。
* setImmediate 的引入是为了解决 setTimeout 的精度问题，由于 setTimeout 指定的延迟时间是毫秒（ms）但实际一次事件循环的时间可能是纳秒级的，所以在一次事件循环的多个外部队列中，找到某一个队列直接执行其中的 callback 可以得到比 setTimeout 更早执行的效果。我们继续以开始的场景构造一个例子，并在 Node.js 10.x 的版本上执行（存在一次事件循环执行多次外部事件）。这里 setTimeout 在 setImmediate 后面执行的原因是因为 ms 精度的问题，想要手动 fix 这个精度可以插入一段 const now = Date.now(); wihle (Date.now() < now + 1) {} 即可看到 setTimeout 在 setImmediate 之前执行了。
* 我们可以推测出 Node.js 中的事件循环与浏览器类似，也是外部队列与内部队列的循环，而 setImmediate 在另外一个外部队列中。
* 其中主要有两点需要关注，一是外部列队在每次事件循环只执行了一个，另一个是 Node.js 的固定了多个外部队列的优先级。setImmediate 的外部队列没有执行完的时候，是不会执行 timeout 的外部队列的。
* timer（setTimeout）是第一阶段的原因在 libuv 的文档中有描述 —— 为了减少时间相关的系统调用（System Call）。setImmediate 出现在 check 阶段是蹭了 libuv 中 poll 阶段之后的检查过程（这个过程放在 poll 中也很奇怪，放在 poll 之后感觉比较合适）。
* idle, prepare 对应的是 libuv 中的两个叫做 idle 和 prepare 的句柄。由于 I/O 的 poll 过程可能阻塞住事件循环，所以这两个句柄主要是用来触发 poll （阻塞）之前需要触发的回调
* 由于 poll 可能 block 住事件循环，所以应当有一个外部队列专门用于执行 I/O 的 callback ，并且优先级在 poll 以及 prepare to poll 之前。
* 另外我们知道网络 IO 可能有非常多的请求同时进来，如果该阶段如果无限制的执行这些 callback，可能导致 Node.js 的进程卡死该阶段，其他外部队列的代码都没发执行了。所以当前外部队列在执行一定数量的 callback 之后会截断。由于截断的这个特性，这个专门执行 I/O callbacks 的外部队列也叫 pengding callbacks


### 宏任务、微任务
* 宏任务和微任务的执行顺序基本是，在 EventLoop 中，每一次循环称为一次 tick，主要的任务顺序如下：
1. 执行栈选择最先进入队列的宏任务，执行其同步代码直至结束；
2. 检查是否有微任务，如果有则执行直到微任务队列为空；
3. 如果是在浏览器端，那么基本要渲染页面了；
4. 开始下一轮的循环（tick），执行宏任务中的一些异步代码，例如 setTimeout 等。
* Call-Stack（调用栈）也就是执行栈，它是一个栈的结构，符合先进后出的机制，每次一个循环，先执行最先入队的宏任务，然后再执行微任务。不管微任务还是宏任务，它们只要按照顺序进入了执行栈，那么执行栈就还是按照先进后出的规则，一步一步执行。因此根据这个原则，最先进行调用栈的宏任务，一般情况下都是最后返回执行的结果。

```
async function async1() {

  console.log("async1 start");

  await async2();

  console.log("async1 end");

}

async function async2() {

  console.log("async2");

}

async1();

setTimeout(() => {

  console.log("timeout");

}, 0);

new Promise(function (resolve) {

  console.log("promise1");

  resolve();

}).then(function () {

  console.log("promise2");

});

console.log("script end");




运行结果：
async1 start
async2
promise1
script end
async1 end
promise2
timeout


```


#### 宏任务
* 如果在浏览器的环境下，宏任务主要分为下面这几个大类：
1. 渲染事件（比如解析 DOM、计算布局、绘制）；
2. 用户交互事件（比如鼠标点击、滚动页面、放大缩小等）；
3. setTimeout、setInterval 等；
4. 网络请求完成、文件读写完成事件。
* 为了让这些任务在主线程上执行，页面进程引入了消息队列和事件循环机制，我们把这些消息队列中的任务称为宏任务。
* 宏任务基本上满足了日常的开发需求，而对于时间精度有要求的宏任务就不太能满足了，比如渲染事件、各种 I/O、用户交互的事件等，都随时有可能被添加到消息队列中，JS 代码不能准确掌控任务要添加到队列中的位置，控制不了任务在消息队列中的位置，所以很难控制开始执行任务的时间。
```
function callback2(){

    console.log(2)

}

function callback(){

    console.log(1)

    setTimeout(callback2,0)

}

setTimeout(callback,0)
在上面这段代码中，我的目的是想通过 setTimeout 来设置两个回调任务，并让它们按照前后顺序来执行，中间也不要再插入其他的任务。
但是实际情况我们难以控制，比如在你调用 setTimeout 来设置回调任务的间隙，消息队列中就有可能被插入很多系统级的任务。
如果中间被插入的任务执行时间过久的话，那么就会影响到后面任务的执行了。所以说宏任务的时间粒度比较大，执行的间隔是不能精确控制的。
这就不适用于一些高实时性的需求了，比如后面要讲到的监听 DOM 变化。
```
#### 微任务
* 微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。
* 当 JavaScript 执行一段脚本的时候，V8 会为其创建一个全局执行上下文，同时 V8 引擎也会在内部创建一个微任务队列。这个微任务队列就是用来存放微任务的，因为在当前宏任务执行的过程中，有时候会产生多个微任务，这时候就需要使用这个微任务队列来保存这些微任务了。不过这个微任务队列是给 V8 引擎内部使用的，所以你是无法通过 JavaScript 直接访问的。
* 在现代浏览器里面，产生微任务有两种方式
1. 使用 MutationObserver 监控某个 DOM 节点，或者为这个节点添加、删除部分子节点，当 DOM 节点发生变化时，就会产生 DOM 变化记录的微任务。
2. 使用 Promise，当调用 Promise.resolve() 或者 Promise.reject() 的时候，也会产生微任务
* 如果在执行微任务的过程中，产生了新的微任务，一样会将该微任务添加到微任务队列中，V8 引擎一直循环执行微任务队列中的任务，直到队列清空才算执行结束。也就是说在执行微任务过程中产生的新的微任务并不会推迟到下一个循环中执行，而是在当前的循环中继续执行，这点是需要注意的。
* 微任务和宏任务是绑定的，每个宏任务在执行时，会创建自己的微任务队列。
* 微任务的执行时长会影响当前宏任务的时长。比如一个宏任务在执行过程中，产生了 10 个微任务，执行每个微任务的时间是 10ms，那么执行这 10 个微任务的时间就是 100ms，也可以说这 10 个微任务让宏任务的执行时间延长了 100ms。
* 在一个宏任务中，分别创建一个用于回调的宏任务和微任务，无论什么情况下，微任务都早于宏任务执行。

#### MutationObserver

* MutationObserver API 可以用来监视 DOM 的变化，包括属性的变更、节点的增加、内容的改变等。因为上面我们分析过，在两个任务之间，可能会被渲染进程插入其他的事件，从而影响到响应的实时性。这时候，微任务就可以上场了，在每次 DOM 节点发生变化的时候，渲染引擎将变化记录封装成微任务，并将微任务添加进当前的微任务队列中。这样当执行到检查点的时候，V8 引擎就会按照顺序执行微任务了。
* MutationObserver 采用了“异步 + 微任务”的策略：
1. 通过异步操作解决了同步操作的性能问题；
2. 通过微任务解决了实时性的问题。

#### Process.nextTick

* Process.nextick 的运行逻辑：
1. Process.nextick 会将 callback 添加到“next tick queue”；
2. “next tick queue”会在当前 JavaScript stack 执行完成后，下一次 event loop 开始执行前按照 FIFO 出队；
3. 如果递归调用 Process.nextick 可能会导致一个无限循环，需要去适时终止递归。
* 可能你已经注意到 Process.nextick 其实是微任务，同时也是异步 API 的一部分。但是从技术上来说 Process.nextick 并不是事件循环（eventloop）的一部分，相反地，“next tick queue”将会在当前操作完成之后立即被处理，而不管当前处于事件循环的哪个阶段。
* 如果任何时刻你在一个给定的阶段调用 Process.nextick，则所有被传入 Process.nextick 的回调将在事件循环继续往下执行前被执行。这可能会导致一些很糟的情形，因为它允许用户递归调用 Process.nextick 来挂起 I/O 进程的进行，这会导致事件循环永远无法到达轮询阶段。
```
let bar;

function someAsyncApiCall(callback) { callback(); }

someAsyncApiCall(() => {

  console.log('bar', bar);   // undefined

});

bar = 1;

用户定义函数 someAsyncApiCall() 有一个异步签名，但实际上它是同步执行的。
当它被调用时，提供给 someAsyncApiCall() 的回调函数会在执行 someAsyncApiCall() 本身的同一个事件循环阶段被执行，因为 someAsyncApiCall() 实际上并未执行任何异步操作。
结果就是，即使回调函数尝试引用变量 bar，但此时在作用域中并没有改变量。因为程序还没运行到对 bar 赋值的部分。

将回调放到 Process.nextick 中，程序依然可以执行完毕，且所有的变量、函数等都在执行回调之前被初始化，它还具有不会被事件循环打断的优点。以下是将上面的例子改用 Process.nextick 的代码：

let bar;

 

function someAsyncApiCall(callback) {

  process.nextTick(callback);

}

 

someAsyncApiCall(() => {

  console.log('bar', bar); // 1

});

 

bar = 1;

-------------------------------------------------



const EventEmitter = require('events');

const util = require('util');

 

function MyEmitter() {

EventEmitter.call(this);

this.emit('event');

}

util.inherits(MyEmitter, EventEmitter);

 

const myEmitter = new MyEmitter();

myEmitter.on('event', () => {

console.log('an event occurred!');

});


你无法在构造函数中立即触发一个事件，因为此时程序还未运行到将回调赋值给事件的那段代码。


因此，在构造函数内部，你可以使用 Process.nextick 设置一个回调以在构造函数执行完毕后触发事件，下面的代码满足了我们的预期。

const EventEmitter = require('events');

const util = require('util');

 

function MyEmitter() {

EventEmitter.call(this);

process.nextTick(() => {

  this.emit('event');

});

}

util.inherits(MyEmitter, EventEmitter);

 

const myEmitter = new MyEmitter();

  myEmitter.on('event', () => {

  console.log('an event occurred!');

});


通过上面的改造可以看出，使用 Process.nextick 就可以解决问题了，即使 event 事件还没进行绑定，但也可以让代码在前面进行触发，因为根据代码执行顺序，Process.nextick 是在每一次的事件循环最后执行的。
因此这样写，代码也不会报错，同样又保持了代码的逻辑。



```
#### Vue的nextick
```
<template>

  <div class="app">

    <div ref="msg">{{msg}}</div>

    <div v-if="msg1">Message got outside $nextTick: {{msg1}}</div>

    <div v-if="msg2">Message got inside $nextTick: {{msg2}}</div>

    <button @click="changeMsg">

      Change the Message

    </button>

  </div>

</template>

<script>

new Vue({

  el: '.app',

  data: {

    msg: 'Vue',

    msg1: '',

    msg2: '',

  },

  methods: {

    changeMsg() {

      this.msg = "Hello world."

      this.msg1 = this.$refs.msg.innerHTML

      this.$nextTick(() => {

        this.msg2 = this.$refs.msg.innerHTML

      })

    }

  }

})

</script>

通过按钮点击之后，div 里面的 msg1 和 msg2 的变化情况。你会发现第一次点击按钮调用 changeMsg 方法时，其实 msg2 并没有变化，因为 msg2 的变化是在下一个 tick 才进行执行的。

```

## JS 代码是如何被浏览器引擎编译、执行的？
### V8 引擎
* 编译型语言和解释型语言
1. 编译型语言的特点是在代码运行前编译器直接将对应的代码转换成机器码，运行时不需要再重新翻译，直接可以使用编译后的结果。
2. 解释型语言也是需要将代码转换成机器码，但是和编译型的区别在于运行时需要转换。比较显著的特点是，解释型语言的执行速度要慢于编译型语言，因为解释型语言每次执行都需要把源码转换一次才能执行。
* V8是众多浏览器的 JS 引擎中性能表现最好的一个，并且它是 Chrome 的内核，Node.js 也是基于 V8 引擎研发的。
* V8引擎执行 JS 代码要经过以下阶段
1. Parse 阶段：V8 引擎负责将 JS 代码转换成 AST（抽象语法树）；
2. Ignition 阶段：解释器将 AST 转换为字节码，解析执行字节码也会为下一个阶段优化编译提供需要的信息；
3. TurboFan 阶段：编译器利用上个阶段收集的信息，将字节码优化为可以执行的机器码；
4. Orinoco 阶段：垃圾回收阶段，将程序中不再使用的内存空间进行回收。
### 生成 AST
* Eslint 和 Babel 这两个工具都和 AST 脱不了干系。V8 引擎就是通过编译器（Parse）将源代码解析成 AST 的
* AST 在实际工作中应用场景也比较多，大致有下面几个：
1. JS 反编译，语法解析；
2. Babel 编译 ES6 语法；
3. 代码高亮；
4. 关键字匹配；
5. 代码压缩。
* 生成 AST 分为两个阶段，一是词法分析，二是语法分析
1. 词法分析：这个阶段会将源代码拆成最小的、不可再分的词法单元，称为 token。比如这行代码 var a =1；通常会被分解成 var 、a、=、2、; 这五个词法单元。另外刚才代码中的空格在 JavaScript 中是直接忽略的。
2. 语法分析：这个过程是将词法单元转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树，这个树被称为抽象语法树。
```
// 第一段代码

var a = 1;

// 第二段代码

function sum (a,b) {

  return a + b;

}


第一段代码，编译后的结果：
{

  "type": "Program",

  "start": 0,

  "end": 10,

  "body": [

    {

      "type": "VariableDeclaration",

      "start": 0,

      "end": 10,

      "declarations": [

        {

          "type": "VariableDeclarator",

          "start": 4,

          "end": 9,

          "id": {

            "type": "Identifier",

            "start": 4,

            "end": 5,

            "name": "a"

          },

          "init": {

            "type": "Literal",

            "start": 8,

            "end": 9,

            "value": 1,

            "raw": "1"

          }

        }

      ],

      "kind": "var"

    }

  ],

  "sourceType": "module"

}

第二段代码，编译出来的结果：
{

  "type": "Program",

  "start": 0,

  "end": 38,

  "body": [

    {

      "type": "FunctionDeclaration",

      "start": 0,

      "end": 38,

      "id": {

        "type": "Identifier",

        "start": 9,

        "end": 12,

        "name": "sum"

      },

      "expression": false,

      "generator": false,

      "async": false,

      "params": [

        {

          "type": "Identifier",

          "start": 14,

          "end": 15,

          "name": "a"

        },

        {

          "type": "Identifier",

          "start": 16,

          "end": 17,

          "name": "b"

        }

      ],

      "body": {

        "type": "BlockStatement",

        "start": 19,

        "end": 38,

        "body": [

          {

            "type": "ReturnStatement",

            "start": 23,

            "end": 36,

            "argument": {

              "type": "BinaryExpression",

              "start": 30,

              "end": 35,

              "left": {

                "type": "Identifier",

                "start": 30,

                "end": 31,

                "name": "a"

              },

              "operator": "+",

              "right": {

                "type": "Identifier",

                "start": 34,

                "end": 35,

                "name": "b"

              }

            }

          }

        ]

      }

    }

  ],

  "sourceType": "module"

}
从上面编译出的结果可以看到，AST 只是源代码语法结构的一种抽象的表示形式，计算机也不会去直接去识别 JS 代码，转换成抽象语法树也只是识别这一过程中的第一步。
```
* 现在浏览器还不支持 ES6 语法，需要将其转换成 ES5 语法，这个过程就要借助 Babel 来实现。将 ES6 源码解析成 AST，再将 ES6 语法的抽象语法树转成 ES5 的抽象语法树，最后利用它来生成 ES5 的源代码。另外 ESlint 的原理也大致相同，检测流程也是将源码转换成抽象语法树，再利用它来检测代码规范。
### 生成字节码
* 之前的 V8 版本不会经过这个过程，最早只是通过 AST 直接转换成机器码，而后面几个版本中才对此进行了改进。如果将 AST 直接转换为机器码还是会有一些问题存在的，例如：
1. 直接转换会带来内存占用过大的问题，因为将抽象语法树全部生成了机器码，而机器码相比字节码占用的内存多了很多；
2. 某些 JavaScript 使用场景使用解释器更为合适，解析成字节码，有些代码没必要生成机器码，进而尽可能减少了占用内存过大的问题。
* 官方在 V8 的 v5.6 版本中还是将抽象语法树转换成字节码这一过程又加上了，重新加入了字节码的处理过程。再然后，V8 重新引进了 Ignition 解释器，将抽象语法树转换成字节码后，内存占用显著下降了，同时也可以使用 JIT 编译器做进一步的优化。
* 字节码是介于 AST 和机器码之间的一种代码，需要将其转换成机器码后才能执行，字节码可以理解为是机器码的一种抽象。Ignition 解释器除了可以快速生成没有优化的字节码外，还可以执行部分字节码。
### 生成机器码
* 在 Ignition 解释器处理完之后，如果发现一段代码被重复执行多次的情况，生成的字节码以及分析数据会传给 TurboFan 编译器，它会根据分析数据的情况生成优化好的机器码。再执行这段代码之后，只需要直接执行编译后的机器码，这样性能就会更好。
* TurboFan 编译器，它是 JIT 优化的编译器，因为 V8 引擎是多线程的，TurboFan 的编译线程和生成字节码不会在同一个线程上，这样可以和 Ignition 解释器相互配合着使用，不受另一方的影响。
* 由 Ignition 解释器收集的分析数据被 TurboFan 编译器使用，主要是通过一种推测优化的技术，生成已经优化的机器码来执行。




#### thunk 函数
```
let isString = (obj) => {

  return Object.prototype.toString.call(obj) === '[object String]';

};

let isFunction = (obj) => {

  return Object.prototype.toString.call(obj) === '[object Function]';

};

let isArray = (obj) => {

  return Object.prototype.toString.call(obj) === '[object Array]';

};


可以看到，其中出现了非常多重复的数据类型判断逻辑，平常业务开发中类似的重复逻辑的场景也同样会有很多。我们将它们做一下封装，如下所示。
let isType = (type) => {

  return (obj) => {

    return Object.prototype.toString.call(obj) === `[object ${type}]`;

  }

}

let isString = isType('String');

let isArray = isType('Array');

isString("123");    // true

isArray([1,2,3]);   // true
像 isType 这样的函数我们称为 thunk 函数，它的基本思路都是接收一定的参数，会生产出定制化的函数，最后使用定制化的函数去完成想要实现的功能。

```
#### Generator 和 thunk 结合
```
const readFileThunk = (filename) => {

  return (callback) => {

    fs.readFile(filename, callback);

  }

}

const gen = function* () {

  const data1 = yield readFileThunk('1.txt')

  console.log(data1.toString())

  const data2 = yield readFileThunk('2.txt')

  console.log(data2.toString)

}

let g = gen();

g.next().value((err, data1) => {

  g.next(data1).value((err, data2) => {

    g.next(data2);

  })

})
上面第三段代码执行起来嵌套的情况还算简单，如果任务多起来，就会产生很多层的嵌套，可读性不强，
function run(gen){

  const next = (err, data) => {

    let res = gen.next(data);

    if(res.done) return;

    res.value(next);

  }

  next();

}

run(g);

```
#### Generator 和 Promise 结合
```
// 最后包装成 Promise 对象进行返回

const readFilePromise = (filename) => {

  return new Promise((resolve, reject) => {

    fs.readFile(filename, (err, data) => {

      if(err) {

        reject(err);

      }else {

        resolve(data);

      }

    })

  }).then(res => res);

}

 let g = gen();

// 这块和上面 thunk 的方式一样

const gen = function* () {

  const data1 = yield readFilePromise('1.txt')

  console.log(data1.toString())

  const data2 = yield readFilePromise('2.txt')

  console.log(data2.toString)

}

// 这块和上面 thunk 的方式一样

function run(gen){

  const next = (err, data) => {

    let res = gen.next(data);

    if(res.done) return;

    res.value.then(next);

  }

  next();

}

run(g);


```

#### co 函数库
* 为什么 co 函数库可以自动执行 Generator 函数，它的处理原理是什么呢？
1. 因为 Generator 函数就是一个异步操作的容器，它需要一种自动执行机制，co 函数接受 Generator 函数作为参数，并最后返回一个 Promise 对象。
2. 在返回的 Promise 对象里面，co 先检查参数 gen 是否为 Generator 函数。如果是，就执行该函数；如果不是就返回，并将 Promise 对象的状态改为 resolved。
3. co 将 Generator 函数的内部指针对象的 next 方法，包装成 onFulfilled 函数。这主要是为了能够捕捉抛出的错误。
4. 关键的是 next 函数，它会反复调用自身。
### async/await
```
// readFilePromise 依旧返回 Promise 对象

const readFilePromise = (filename) => {

  return new Promise((resolve, reject) => {

    fs.readFile(filename, (err, data) => {

      if(err) {

        reject(err);

      }else {

        resolve(data);

      }

    })

  }).then(res => res);

}

// 这里把 Generator的 * 换成 async，把 yield 换成 await

const gen = async function() {

  const data1 = await readFilePromise('1.txt')

  console.log(data1.toString())

  const data2 = await readFilePromise('2.txt')

  console.log(data2.toString)

}


```
* async 函数对 Generator 函数的改进，主要体现在以下三点
内置执行器：Generator 函数的执行必须靠执行器，因为不能一次性执行完成，所以之后才有了开源的 co 函数库。但是，async 函数和正常的函数一样执行，也不用 co 函数库，也不用使用 next 方法，而 async 函数自带执行器，会自动执行。
适用性更好：co 函数库有条件约束，yield 命令后面只能是 Thunk 函数或 Promise 对象，但是 async 函数的 await 关键词后面，可以不受约束。
可读性更好：async 和 await，比起使用 * 号和 yield，语义更清晰明了。
```
async function func() {

  return 100;

}

console.log(func());

// Promise {<fulfilled>: 100}
从执行的结果可以看出，async 函数 func 最后返回的结果直接是 Promise 对象，比较方便让开发者继续往后处理。而之前 Generator 并不会自动执行，需要通过 next 方法控制，最后返回的也并不是 Promise 对象，而是需要通过 co 函数库来实现最后返回 Promise 对象。
```
### EventEmitter 
* Node.js的events 模块对外提供了一个 EventEmitter 对象，用于对 Node.js 中的事件进行统一管理。
```
var events = require('events');

var eventEmitter = new events.EventEmitter();

eventEmitter.on('say',function(name){

    console.log('Hello',name);

})

eventEmitter.emit('say','Jonh');

```
#### addListener 和 removeListener、on 和 off 方法对比
```
addListener 方法的作用是为指定事件添加一个监听器，其实和 on 方法实现的功能是一样的，on 其实就是 addListener 方法的一个别名。
二者实现的作用是一样的，同时 removeListener 方法的作用是为移除某个事件的监听器，同样 off 也是 removeListener 的别名。
var events = require('events');

var emitter = new events.EventEmitter();

function hello1(name){

  console.log("hello 1",name);

}

function hello2(name){

  console.log("hello 2",name);

}

emitter.addListener('say',hello1);

emitter.addListener('say',hello2);

emitter.emit('say','John');

//输出hello 1 John 

//输出hello 2 John

emitter.removeListener('say',hello1);

emitter.emit('say','John');

//相应的，监听say事件的hello1事件被移除

//只输出hello 2 John

```
#### removeListener 和 removeAllListeners
```
var events = require('events');

var emitter = new events.EventEmitter();

function hello1(name){

  console.log("hello 1",name);

}

function hello2(name){

  console.log("hello 2",name);

}

emitter.addListener('say',hello1);

emitter.addListener('say',hello2);

emitter.removeAllListeners('say');

emitter.emit('say','John');

//removeAllListeners 移除了所有关于 say 事件的监听

//因此没有任何输出

```
#### on 和 once 方法区别
```
var events = require('events');

var emitter = new events.EventEmitter();

function hello(name){

  console.log("hello",name);

}

emitter.on('say',hello);

emitter.emit('say','John');

emitter.emit('say','Lily');

emitter.emit('say','Lucy');

//会输出 hello John、hello Lily、hello Lucy，之后还要加也可以继续触发

emitter.once('see',hello);

emitter.emit('see','Tom');

//只会输出一次 hello Tom

```
#### 实现一个 EventEmitter
* 自己封装一个能在浏览器中跑的EventEmitter，并应用在你的业务代码中还是能带来不少方便的，它可以帮你实现自定义事件的订阅和发布，从而提升业务开发的便利性。
* EventEmitter 采用的正是发布-订阅模式。
* 发布-订阅模式在观察者模式的基础上，在目标和观察者之间增加了一个调度中心。
* 在 Vue 框架中不同组件之间的通讯里，有一种解决方案叫 EventBus。和 EventEmitter的思路类似，它的基本用途是将 EventBus 作为组件传递数据的桥梁，所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，所有组件都可以收到通知，使用起来非常便利，其核心其实就是发布-订阅模式的落地实现。
```

function EventEmitter() {

    this.__events = {}

}

EventEmitter.VERSION = '1.0.0';

从上面的代码中可以看到，我们先初始化了一个内部的__events 的对象，用来存放自定义事件，以及自定义事件的回调函数。

EventEmitter.prototype.on = function(eventName, listener){

	  if (!eventName || !listener) return;

      // 判断回调的 listener 是否为函数

	  if (!isValidListener(listener)) {

	       throw new TypeError('listener must be a function');

	  }

	   var events = this.__events;

	   var listeners = events[eventName] = events[eventName] || [];

	   var listenerIsWrapped = typeof listener === 'object';

       // 不重复添加事件，判断是否有一样的

       if (indexOf(listeners, listener) === -1) {

           listeners.push(listenerIsWrapped ? listener : {

               listener: listener,

               once: false

           });

       }

	   return this;

};

// 判断是否是合法的 listener

 function isValidListener(listener) {

     if (typeof listener === 'function') {

         return true;

     } else if (listener && typeof listener === 'object') {

         return isValidListener(listener.listener);

     } else {

         return false;

     }

}

// 顾名思义，判断新增自定义事件是否存在

function indexOf(array, item) {

     var result = -1

     item = typeof item === 'object' ? item.listener : item;

     for (var i = 0, len = array.length; i < len; i++) {

         if (array[i].listener === item) {

             result = i;

             break;

         }

     }

     return result;

}
从上面的代码中可以看出，on 方法的核心思路就是，当调用订阅一个自定义事件的时候，只要该事件通过校验合法之后，就把该自定义事件 push 到 this.__events 这个对象中存储，等需要出发的时候，则直接从通过获取 __events 中对应事件的 listener 回调函数，而后直接执行该回调方法就能实现想要的效果。



EventEmitter.prototype.emit = function(eventName, args) {

     // 直接通过内部对象获取对应自定义事件的回调函数

     var listeners = this.__events[eventName];

     if (!listeners) return;

     // 需要考虑多个 listener 的情况

     for (var i = 0; i < listeners.length; i++) {

         var listener = listeners[i];

         if (listener) {

             listener.listener.apply(this, args || []);

             // 给 listener 中 once 为 true 的进行特殊处理

             if (listener.once) {

                 this.off(eventName, listener.listener)

             }

         }

     }

     return this;

};



EventEmitter.prototype.off = function(eventName, listener) {

     var listeners = this.__events[eventName];

     if (!listeners) return;

     var index;

     for (var i = 0, len = listeners.length; i < len; i++) {

	    if (listeners[i] && listeners[i].listener === listener) {

           index = i;

           break;

        }

    }

    // off 的关键

    if (typeof index !== 'undefined') {

         listeners.splice(index, 1, null)

    }

    return this;

};
从上面的代码中可以看出 emit 的处理方式，其实就是拿到对应自定义事件进行 apply 执行，在执行过程中对于一开始 once 方法绑定的自定义事件进行特殊的处理，当once 为 true的时候，再触发 off 方法对该自定义事件进行解绑，从而实现自定义事件一次执行的效果。



EventEmitter.prototype.once = function(eventName, listener）{

    // 直接调用 on 方法，once 参数传入 true，待执行之后进行 once 处理

     return this.on(eventName, {

         listener: listener,

         once: true

     })

 };

EventEmitter.prototype.allOff = function(eventName) {

     // 如果该 eventName 存在，则将其对应的 listeners 的数组直接清空

     if (eventName && this.__events[eventName]) {

         this.__events[eventName] = []

     } else {

         this.__events = {}

     }

};

从上面的代码中可以看到，once 方法的本质还是调用 on 方法，只不过传入的参数区分和非一次执行的情况。当再次触发 emit 方法的时候，once 绑定的执行一次之后再进行解绑。

这样，alloff 方法也很好理解了，其实就是对内部的__events 对象进行清空，清空之后如果再次触发自定义事件，也就无法触发回调函数了。












---------------------------Low逼版，见笑了-----------------------------




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



```
### 实现符合 Promise/A+ 规范的 Promise
#### Promise/A+ 规范
* Promise/A+ 规范的基本术语，如下所示
1. “promise”：是一个具有 then 方法的对象或者函数，它的行为符合该规范。
2. “thenable”：是一个定义了 then 方法的对象或者函数。
3. “value”：可以是任何一个合法的 JavaScript 的值（包括 undefined、thenable 或 promise）。
4. “exception”：是一个异常，是在 Promise 里面可以用 throw 语句抛出来的值。
5. “reason”：是一个 Promise 里 reject 之后返回的拒绝原因。
* Promise/A+ 规范中，对 Promise 的内部状态的描述，如下所示
1. 一个 Promise 有三种状态：pending、fulfilled 和 rejected。
2. 当状态为 pending 状态时，即可以转换为 fulfilled 或者 rejected 其中之一。
3. 当状态为 fulfilled 状态时，就不能转换为其他状态了，必须返回一个不能再改变的值。
4. 当状态为 rejected 状态时，同样也不能转换为其他状态，必须有一个原因的值也不能改变
* 一个 Promise 必须拥有一个 then 方法来访问它的值或者拒绝原因。
1. `promise.then(onFulfilled, onRejected)` then 方法有两个参数：onFulfilled 和 onRejected 都是可选参数。
2. 如果 onFulfilled 是函数，则当 Promise 执行结束之后必须被调用，最终返回值为 value，其调用次数不可超过一次。
3. 而 onRejected 除了最后返回的是 reason 外，其他方面和 onFulfilled 在规范上的表述基本一样。
* then 方法其实可以被一个 Promise 调用多次，且必须返回一个 Promise 对象。
#### 一步步实现 Promise


```
// MyPromise.js

// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 存储成功回调函数
  onFulfilledCallbacks = [];
  // 存储失败回调函数
  onRejectedCallbacks = [];

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () =>  {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = realOnFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        })  
      }

      const rejectedMicrotask = () => { 
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = realOnRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      }
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask() 
      } else if (this.status === REJECTED) { 
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    }) 
    
    return promise2;
  }

  // resolve 静态方法
  static resolve (parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise === x) {
    return reject(new TypeError('The promise and the return value are the same'));
  }

  if (typeof x === 'object' || typeof x === 'function') {
    // x 为 null 直接返回，走后面的逻辑会报错
    if (x === null) {
      return resolve(x);
    }

    let then;
    try {
      // 把 x.then 赋值给 then 
      then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
      return reject(error);
    }

    // 如果 then 是函数
    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          y => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          r => {
            if (called) return;
            called = true;
            reject(r);
          });
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return;

        // 否则以 error 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}


module.exports = MyPromise;
```




----------------------------------------------------------------------------------




## encodeURI encodeURIComponent 
```
var set1 = ";,/?:@&=+$";  // 保留字符
var set2 = "-_.!~*'()";   // 不转义字符
var set3 = "#";           // 数字标志
var set4 = "ABC abc 123"; // 字母数字字符和空格

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // -_.!~*'()
console.log(encodeURI(set3)); // #
console.log(encodeURI(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // -_.!~*'()
console.log(encodeURIComponent(set3)); // %23
console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (the space gets encoded as %20)
```
### encodeURI
* encodeURI 会替换所有的字符，但不包括以下字符:
; , / ? : @ & = + $ 字母 数字 - _ . ! ~ * ' ( ) #
* encodeURI 自身无法产生能适用于HTTP GET 或 POST 请求的URI，例如对于 XMLHTTPRequests, 因为 "&", "+", 和 "=" 不会被编码，然而在 GET 和 POST 请求中它们是特殊字符。然而encodeURIComponent这个方法会对这些字符编码。
### encodeURIComponent
* encodeURIComponent 转义除了如下所示外的所有字符：
 A-Z a-z 0-9 - _ . ! ~ * ' ( )
## img标签
* loading属性：eager 立即加载   lazy延迟加载
* onload事件在图片加载完成后立即执行
* 可以通过getBoundingClientRect().top<window.innerHeight来判断是否加载图片
## dataset
```
<div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth>John Doe
</div>

var el = document.querySelector('#user');

// el.id == 'user'
// el.dataset.id === '1234567890'
// el.dataset.user === 'johndoe'
// el.dataset.dateOfBirth === ''

el.dataset.dateOfBirth = '1960-10-03'; // set the DOB.

// 'someDataAttr' in el.dataset === false

el.dataset.someDataAttr = 'mydata';
// 'someDataAttr' in el.dataset === true
```
## load DOMContentLoaded
* 当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发load事件。它与DOMContentLoaded不同，后者只要页面DOM加载完成就触发，无需等待依赖资源的加载。
## script
* async 该属性能够消除解析阻塞的 Javascript。解析阻塞的 Javascript 会导致浏览器必须加载并且执行脚本，之后才能继续解析。defer 在这一点上也有类似的作用。
* defer 这个布尔属性被设定用来通知浏览器该脚本将在文档完成解析后，触发 DOMContentLoaded (en-US) 事件前执行。有 defer 属性的脚本会阻止 DOMContentLoaded 事件，直到脚本被加载并且解析完成。defer 属性对模块脚本没有作用 —— 他们默认 defer。
## 位运算
```
操作	结果	等同于	结果
5 & 1	1	0101 & 0001	0001
5 | 1	5	0101 | 0001	0101
5 ^ 1	4	0101 ^ 0001	0100    如果两位只有一位为 1 则设置为 1
~ 5	    10	~0101	    1010    反转所有位
5 << 1	10	0101 << 1	1010    通过从右推入零向左位移，并使最左边的位脱落。
5 >> 1	2	0101 >> 1	0010    通过从左推入最左位的拷贝来向右位移，并使最右边的位脱落。
5 >>> 1	2	0101 >>> 1	0010    通过从左推入零来向右位移，并使最右边的位脱落。
```
* x >>> 0有什么意义
1. 移位操作符在移位前做了两种转换，第一将不是number类型的数据转换为number，第二将number转换为无符号的32bit数据，也就是Uint32类型。这些与移位的位数无关，移位0位主要就是用了js的内部特性做了前两种转换。
2. x >>> 0本质上就是保证x有意义（为数字类型），且为正整数，在有效的数组范围内（0 ～ 0xFFFFFFFF），且在无意义的情况下缺省值为0。





## JavaScript引擎如何执行JavaScript代码
* JavaScript 代码是需要在 JavaScript 引擎中运行的。我们在说到 JavaScript 运行的时候，常常会提到执行环境、词法环境、作用域、执行上下文、闭包等内容。
* JavaScript引擎执行JavaScript代码时会进行词法分析、语法分析、语义分析等处理，最终生成抽象语法树，根据抽象语法树生成机器码
* 在 V8 引擎中 JavaScript 代码的运行过程主要分成三个阶段：
1. 语法分析阶段：对代码进行语法分析，检查是否有语法错误
2. 编译阶段：会创建执行上下文，包括变量对象的创建、作用域链的建立、this指向的确立等。每进入一个不同的运行环境，V8引擎都会创建一个执行上下文。
3. 执行阶段：将编译阶段的执行上下文压入调用栈，代码执行结束后，将其弹出调用栈
* 前面提到的执行环境、词法环境、作用域、执行上下文等内容都是在编译和执行阶段中产生的概念。
### 执行上下文创建
* 全局环境和函数环境的创建过程如下
1. 第一次载入JavaScript代码时会创建一个全局环境。全局环境位于最外层，直到应用程序结束后（浏览器、网页关闭等）才会被销毁。
2. 每个函数有自己的运行环境，当函数被调用时，会进入该函数的运行环境。当该环境中的代码全部执行完毕后，该环境会被销毁。不同函数运行环境不一样，同一个函数多次被调用会创建不同的函数环境。
* 每进入一个不同的运行环境时，JavaScript 都会创建一个新的执行上下文，该过程包括：
1. 建立作用域链（Scope Chain）；
2. 创建变量对象（Variable Object，简称 VO）；
3. 确定 this 的指向。
### 创建变量对象
* 每个执行上下文都会有一个关联的变量对象，该对象上会保存这个上下文中定义的所有变量和函数。
* 而在浏览器中，全局环境的变量对象是window对象，因此所有的全局变量和函数都是作为window对象的属性和方法创建的。相应的，在 Node 中全局环境的变量对象则是global对象。
* 创建变量对象将会创建arguments对象（仅函数环境下），同时会检查当前上下文的函数声明和变量声明。
1. 对于变量声明：此时会给变量分配内存，并将其初始化为undefined（该过程只进行定义声明，执行阶段才执行赋值语句）。
2. 对于函数声明：此时会在内存里创建函数对象，并且直接初始化为该函数对象。
* 变量声明和函数声明的处理过程，便是我们常说的变量提升和函数提升，其中函数声明提升会优先于变量声明提升。因为变量提升容易带来变量在预期外被覆盖掉的问题，同时还可能导致本应该被销毁的变量没有被销毁等情况。因此 ES6 中引入了let和const关键字，从而使 JavaScript 也拥有了块级作用域。
* 在 JavaScript 中，词法环境又分为词法环境（Lexical Environment）和变量环境（Variable Environment）两种，其中：
1. 变量环境用来记录var/function等变量声明；
2. 词法环境是用来记录let/const/class等变量声明。
### 建立作用域链
* 作用域就是词法环境，而词法环境由两个成员组成。
1. 环境记录（Environment Record）：用于记录自身词法环境中的变量对象。
2. 外部词法环境引用（Outer Lexical Environment）：记录外层词法环境的引用。
* 通过外部词法环境的引用，作用域可以层层拓展，建立起从里到外延伸的一条作用域链。当某个变量无法在自身词法环境记录中找到时，可以根据外部词法环境引用向外层进行寻找，直到最外层的词法环境中外部词法环境引用为null，这便是作用域链的变量查询。
* 通过外部词法环境的引用，作用域可以层层拓展，建立起从里到外延伸的一条作用域链。当某个变量无法在自身词法环境记录中找到时，可以根据外部词法环境引用向外层进行寻找，直到最外层的词法环境中外部词法环境引用为null，这便是作用域链的变量查询。
```
function foo(a) {

  var b = 2;

  function c() {}

  var d = function() {};

}


foo(1);


在执行foo(1)时，首先进入定义期，此时：
参数变量a的值为1
变量b和d初始化为undefined
函数c创建函数并初始化


AO = {

  arguments: {

    0: 1,

    length: 1

  },

  a: 1,

  b: undefined,

  c: reference to function c(){},

  d: undefined

}


进入执行期之后，会执行赋值语句进行赋值，此时变量b和d会被赋值为 2 和函数表达式：
AO = {

   arguments: {

    0: 1,

    length: 1

  },

  a: 1,

  b: 2,

  c: reference to function c(){},

  d: reference to FunctionExpression "d"

}


```
* 一般来说，当函数执行结束之后，执行期上下文将被销毁（作用域链和活动对象均被销毁）。但有时候我们想要保留其中一些变量对象，不想被销毁，此时就会使用到闭包。
```
function foo() {

  var a = 1;

  function bar() {

    return a;

  }

  return bar;

}

var b = foo();

console.log(b()); // 1

在这个例子中，当b()执行时，foo函数上下文包括作用域都已经被销毁了，为什么foo作用域下的a依然可以被访问到呢？

这是因为bar函数引用了foo函数变量对象中的值，此时即使创建bar函数的foo函数执行上下文被销毁了，但它的变量对象依然会保留在 JavaScript 内存中，bar函数依然可以通过bar函数的作用域链找到它，并进行访问。这便是我们常说的闭包，即使创建它的上下文已经销毁，它仍然被保留在内存中。

```
* 闭包使得我们可以从外部读取局部变量，在大多数项目中都会被使用到，常见的用途包括：
1. 用于从外部读取其他函数内部变量的函数；
2. 可以使用闭包来模拟私有方法；
3. 让这些变量的值始终保持在内存中。
### 确定 this 的指向
* 根据 JavaScript 中函数的调用方式不同，this的指向分为以下情况。
1. 在全局环境中，this指向全局对象（在浏览器中为window）
2. 在函数内部，this的值取决于函数被调用的方式
函数作为对象的方法被调用，this指向调用这个方法的对象
函数用作构造函数时（使用new关键字），它的this被绑定到正在构造的新对象
3. 在类的构造函数中，this是一个常规对象，类中所有非静态的方法都会被添加到this的原型中
4. 在箭头函数中，this指向它被创建时的环境
5. 使用apply、call、bind等方式调用：根据 API 不同，可切换函数执行的上下文环境，即this绑定的对象


## 浏览器工作原理
## Chrome架构：仅仅打开了1个页面，为什么有4个进程？
### 什么是并行处理？
* 计算机中的并行处理就是同一时刻处理多个任务，比如我们要计算下面这三个表达式的值，并显示出结果。
```

A = 1+2
B = 20/5
C = 7*8

在编写代码的时候，我们可以把这个过程拆分为四个任务：
任务 1 是计算 A=1+2；
任务 2 是计算 B=20/5；
任务 3 是计算 C=7*8；
任务 4 是显示最后计算的结果。


正常情况下程序可以使用单线程来处理，也就是分四步按照顺序分别执行这四个任务。
如果采用多线程，会怎么样呢？我们只需分“两步走”：第一步，使用三个线程同时执行前三个任务；第二步，再执行第四个显示任务。

通过对比分析，你会发现用单线程执行需要四步，而使用多线程只需要两步。因此，使用并行处理能大大提升性能。

```
### 线程 VS 进程
* 多线程可以并行处理任务，但是线程是不能单独存在的，它是由进程来启动和管理的
* 一个进程就是一个程序的运行实例。详细解释就是，启动一个程序的时候，操作系统会为该程序创建一块内存，用来存放代码、运行中的数据和一个执行任务的主线程，我们把这样的一个运行环境叫进程。
* 线程是依附于进程的，而进程中使用多线程并行处理能提升运算效率。
* 进程中的任意一线程执行出错，都会导致整个进程的崩溃。
* 线程之间共享进程中的数据。
* 当一个进程关闭之后，操作系统会回收进程所占用的内存。
1. 当一个进程退出时，操作系统会回收该进程所申请的所有资源；即使其中任意线程因为操作不当导致内存泄漏，当进程退出时，这些内存也会被正确回收。
2. 比如之前的 IE 浏览器，支持很多插件，而这些插件很容易导致内存泄漏，这意味着只要浏览器开着，内存占用就有可能会越来越多，但是当关闭浏览器进程时，这些内存就都会被系统回收掉。
* 进程之间的内容相互隔离。
1. 进程隔离是为保护操作系统中进程互不干扰的技术，每一个进程只能访问自己占有的数据，也就避免出现进程 A 写入数据到进程 B 的情况。
2. 正是因为进程之间的数据是严格隔离的，所以一个进程如果崩溃了，或者挂起了，是不会影响到其他进程的。
3. 如果进程之间需要进行数据的通信，这时候，就需要使用用于进程间通信（IPC）的机制了。
### 多进程
* 采用多进程架构的额外好处是可以使用安全沙箱，你可以把沙箱看成是操作系统给进程上了一把锁，沙箱里面的程序可以运行，但是不能在你的硬盘上写入任何数据，也不能在敏感位置读取任何数据，例如你的文档和桌面。Chrome 把插件进程和渲染进程锁在沙箱里面，这样即使在渲染进程或者插件进程里面执行了恶意程序，恶意程序也无法突破沙箱去获取系统权限。
* 最新的 Chrome 浏览器包括：1 个浏览器（Browser）主进程、1 个 GPU 进程、1 个网络（NetWork）进程、多个渲染进程和多个插件进程。
1. 浏览器进程。主要负责界面显示、用户交互、子进程管理，同时提供存储等功能。
2. 渲染进程。核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程。出于安全考虑，渲染进程都是运行在沙箱模式下。
3. GPU 进程。其实，Chrome 刚开始发布的时候是没有 GPU 进程的。而 GPU 的使用初衷是为了实现 3D CSS 的效果，只是随后网页、Chrome 的 UI 界面都选择采用 GPU 来绘制，这使得 GPU 成为浏览器普遍的需求。最后，Chrome 在其多进程架构上也引入了 GPU 进程。
4. 网络进程。主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面的，直至最近才独立出来，成为一个单独的进程。
5. 插件进程。主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响。
* 因为每个进程都会包含公共基础结构的副本（如 JavaScript 运行环境），这就意味着浏览器会消耗更多的内存资源。
## TCP协议：如何保证页面文件能被完整送达浏览器？








## 尾调用(http://www.ruanyifeng.com/)

### 什么是尾调用？
* 尾调用的概念非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。

```
function f(x){
  return g(x);
}
上面代码中，函数f的最后一步是调用函数g，这就叫尾调用。

以下两种情况，都不属于尾调用。


// 情况一
function f(x){
  let y = g(x);
  return y;
}

// 情况二
function f(x){
  return g(x) + 1;
}
上面代码中，情况一是调用函数g之后，还有别的操作，所以不属于尾调用，即使语义完全一样。情况二也属于调用后还有操作，即使写在一行内。

尾调用不一定出现在函数尾部，只要是最后一步操作即可。


function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
上面代码中，函数m和n都属于尾调用，因为它们都是函数f的最后一步操作。

```
### 尾调用优化

* 我们知道，函数调用会在内存形成一个"调用记录"，又称"调用帧"（call frame），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用记录上方，还会形成一个B的调用记录。等到B运行结束，将结果返回到A，B的调用记录才会消失。如果函数B内部还调用函数C，那就还有一个C的调用记录栈，以此类推。所有的调用记录，就形成一个"调用栈"（call stack）。


```
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用记录，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了。

上面代码中，如果函数g不是尾调用，函数f就需要保存内部变量m和n的值、g的调用位置等信息。但由于调用g之后，函数f就结束了，所以执行到最后一步，完全可以删除 f() 的调用记录，只保留 g(3) 的调用记录。

这就叫做"尾调用优化"（Tail call optimization），即只保留内层函数的调用记录。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存。这就是"尾调用优化"的意义。
```

### 尾递归
* 递归非常耗费内存，因为需要同时保存成千上百个调用记录，很容易发生"栈溢出"错误（stack overflow）。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生"栈溢出"错误。
```

function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120
上面代码是一个阶乘函数，计算n的阶乘，最多需要保存n个调用记录，复杂度 O(n) 。

如果改写成尾递归，只保留一个调用记录，复杂度 O(1) 。

function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5, 1) // 120
```
### 严格模式
* ES6的尾调用优化只在严格模式下开启，正常模式是无效的。这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。arguments：返回调用时函数的参数。func.caller：返回调用当前函数的那个函数。
* 尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式禁用这两个变量，所以尾调用模式仅在严格模式下生效。











### 用户输入
* 当用户在地址栏中输入一个查询关键字时，地址栏会判断输入的关键字是搜索内容，还是请求的 URL。
* 当用户输入关键字并键入回车之后，这意味着当前页面即将要被替换成新的页面，不过在这个流程继续之前，浏览器还给了当前页面一次执行 beforeunload 事件的机会，beforeunload 事件允许页面在退出之前执行一些数据清理操作，还可以询问用户是否要离开当前页面，比如当前页面可能有未提交完成的表单等情况，因此用户可以通过 beforeunload 事件来取消导航，让浏览器不再执行任何后续工作。
### URL 请求过程
* 浏览器进程会通过进程间通信（IPC）把 URL 请求发送至网络进程，网络进程接收到 URL 请求后，会在这里发起真正的 URL 请求流程。
* 网络进程会查找本地缓存是否缓存了该资源。如果有缓存资源，那么直接返回资源给浏览器进程；如果在缓存中没有查找到资源，那么直接进入网络请求流程。
* 请求前的第一步是要进行 DNS 解析，以获取请求域名的服务器 IP 地址。如果请求协议是 HTTPS，那么还需要建立 TLS 连接。
* 接下来就是利用 IP 地址和服务器建立 TCP 连接。连接建立之后，浏览器端会构建请求行、请求头等信息，并把和该域名相关的 Cookie 等数据附加到请求头中，然后向服务器发送构建的请求信息。
* 服务器接收到请求信息后，会根据请求信息生成响应数据（包括响应行、响应头和响应体等信息），并发给网络进程。等网络进程接收了响应行和响应头之后，就开始解析响应头的内容了。
* 在接收到服务器返回的响应头后，网络进程开始解析响应头，如果发现返回的状态码是 301 或者 302，那么说明服务器需要浏览器重定向到其他 URL。这时网络进程会从响应头的 Location 字段里面读取重定向的地址，然后再发起新的 HTTP 或者 HTTPS 请求，一切又重头开始了。
* 在导航过程中，如果服务器响应行的状态码包含了 301、302 一类的跳转信息，浏览器会跳转到新的地址继续导航；如果响应行是 200，那么表示浏览器可以继续处理该请求。
* Content-Type 是 HTTP 头中一个非常重要的字段， 它告诉浏览器服务器返回的响应体数据是什么类型，然后浏览器会根据 Content-Type 的值来决定如何显示响应体的内容。
* Content-Type 的值是 application/octet-stream，显示数据是字节流类型的，通常情况下，浏览器会按照下载类型来处理该请求。
* 如果 Content-Type 字段的值被浏览器判断为下载类型，那么该请求会被提交给浏览器的下载管理器，同时该 URL 请求的导航流程就此结束。但如果是 HTML，那么浏览器则会继续进行导航流程。由于 Chrome 的页面渲染是运行在渲染进程中的，所以接下来就需要准备渲染进程了。
### 渲染进程
* 默认情况下，Chrome 会为每个页面分配一个渲染进程，也就是说，每打开一个新页面就会配套创建一个新的渲染进程。但是，也有一些例外，在某些情况下，浏览器会让多个页面直接运行在同一个渲染进程中。
* 那什么情况下多个页面会同时运行在一个渲染进程中呢？
```
https://time.diamonds.org
https://www.diamonds.org
https://www.diamonds.org:8080

它们都是属于同一站点，因为它们的协议都是 HTTPS，而且根域名也都是 diamonds.org。
```
1. Chrome 的默认策略是，每个标签对应一个渲染进程。但如果从一个页面打开了另一个新页面，而新页面和当前页面属于同一站点的话，那么新页面会复用父页面的渲染进程。官方把这个默认策略叫 process-per-site-instance。
* 总结来说，打开一个新页面采用的渲染进程策略就是：
1. 通常情况下，打开新的页面都会使用单独的渲染进程；如果从 A 页面打开 B 页面，且 A 和 B 都属于同一站点的话，那么 B 页面复用 A 页面的渲染进程；
2. 如果是其他情况，浏览器进程则会为 B 创建一个新的渲染进程。
* 渲染进程准备好之后，还不能立即进入文档解析状态，因为此时的文档数据还在网络进程中，并没有提交给渲染进程，所以下一步就进入了提交文档阶段。
### 提交文档
* 所谓提交文档，就是指浏览器进程将网络进程接收到的 HTML 数据提交给渲染进程，具体流程是这样的：
1. 首先当浏览器进程接收到网络进程的响应头数据之后，便向渲染进程发起“提交文档”的消息；
2. 渲染进程接收到“提交文档”的消息后，会和网络进程建立传输数据的“管道”；
3. 等文档数据传输完成之后，渲染进程会返回“确认提交”的消息给浏览器进程；
4. 浏览器进程在收到“确认提交”的消息后，会更新浏览器界面状态，包括了安全状态、地址栏的 URL、前进后退的历史状态，并更新 Web 页面。
* 这也就解释了为什么在浏览器的地址栏里面输入了一个地址后，之前的页面没有立马消失，而是要加载一会儿才会更新页面。
### 渲染阶段
* 一旦文档被提交，渲染进程便开始页面解析和子资源加载了


## 渲染流程（上）：HTML、CSS和JavaScript，是如何变成页面的？
* HTML 的内容是由标记和文本组成。标记也称为标签，每个标签都有它自己的语义，浏览器会根据标签的语义来正确展示 HTML 内容。
* CSS 又称为层叠样式表，是由选择器和属性组成
* 至于 JavaScript（简称为 JS），使用它可以使网页的内容“动”起来
* 由于渲染机制过于复杂，所以渲染模块在执行过程中会被划分为很多子阶段，输入的 HTML 经过这些子阶段，最后输出像素。我们把这样的一个处理流程叫做渲染流水线
* 按照渲染的时间顺序，流水线可分为如下几个子阶段：构建 DOM 树、样式计算、布局阶段、分层、绘制、分块、光栅化和合成。
### 构建 DOM 树
* 为什么要构建 DOM 树呢？这是因为浏览器无法直接理解和使用 HTML，所以需要将 HTML 转换为浏览器能够理解的结构——DOM 树。
### 样式计算（Recalculate Style）
* 样式计算的目的是为了计算出 DOM 节点中每个元素的具体样式，这个阶段大体可分为三步来完成。
* 把 CSS 转换为浏览器能够理解的结构
```
CSS 样式来源主要有三种：
通过 link 引用的外部 CSS 文件
<style>标记内的 CSS
元素的 style 属性内嵌的 CSS
```
1.  和 HTML 文件一样，浏览器也是无法直接理解这些纯文本的 CSS 样式，所以当渲染引擎接收到 CSS 文本时，会执行一个转换操作，将 CSS 文本转换为浏览器可以理解的结构——styleSheets。
* 转换样式表中的属性值，使其标准化
```
现在我们已经把现有的 CSS 文本转化为浏览器可以理解的结构了，那么接下来就要对其进行属性值的标准化操作。
要理解什么是属性值标准化，你可以看下面这样一段 CSS 文本：

body { font-size: 2em }  => body { font-size: 32px }
p {color:blue;}  => p {rgba(0,0,255)}
span  {display: none}
div {font-weight: bold}  => div {font-weight: 700)}
div  p {color:green;} => div {rgba(0,128,0)}
div {color:red; }  => div {rgba(255,0,0)}

可以看到上面的 CSS 文本中有很多属性值，如 2em、blue、bold，这些类型数值不容易被渲染引擎理解，所以需要将所有值转换为渲染引擎容易理解的、标准化的计算值，这个过程就是属性值标准化。

```

* 计算出 DOM 树中每个节点的具体样式
* 涉及到 CSS 的继承规则和层叠规则
1. 首先是 CSS 继承。CSS 继承就是每个 DOM 节点都包含有父节点的样式。
```

body { font-size: 20px }
p {color:blue;}
span  {display: none}
div {font-weight: bold;color:red}
div  p {color:green;}
所有子节点都继承了父节点样式。
比如 body 节点的 font-size 属性是 20，那 body 节点下面的所有节点的 font-size 都等于 20。
```
2. 样式计算过程中的第二个规则是样式层叠。层叠是 CSS 的一个基本特征，它是一个定义了如何合并来自多个源的属性值的算法。它在 CSS 处于核心地位，CSS 的全称“层叠样式表”正是强调了这一点。

* 总之，样式计算阶段的目的是为了计算出 DOM 节点中每个元素的具体样式，在计算过程中需要遵守 CSS 的继承和层叠两个规则。这个阶段最终输出的内容是每个 DOM 节点的样式，并被保存在 ComputedStyle 的结构内。
### 布局阶段
* 有 DOM 树和 DOM 树中元素的样式，但这还不足以显示页面，因为我们还不知道 DOM 元素的几何位置信息。那么接下来就需要计算出 DOM 树中可见元素的几何位置，我们把这个计算过程叫做布局。
* Chrome 在布局阶段需要完成两个任务：创建布局树和布局计算。
* 创建布局树
1. DOM 树还含有很多不可见的元素，比如 head 标签，还有使用了 display:none 属性的元素。所以在显示之前，我们还要额外地构建一棵只包含可见元素布局树。
2. DOM 树中所有不可见的节点都没有包含到布局树中。
3. 为了构建布局树，浏览器大体上完成了下面这些工作：
遍历 DOM 树中的所有可见节点，并把这些节点加到布局树中；
而不可见的节点会被布局树忽略掉，如 head 标签下面的全部内容，再比如 body.p.span 这个元素，因为它的属性包含 dispaly:none，所以这个元素也没有被包进布局树。
* 布局计算
1. 有了一棵完整的布局树。那么接下来，就要计算布局树节点的坐标位置了。
2. 在执行布局操作的时候，会把布局运算的结果重新写回布局树中，所以布局树既是输入内容也是输出内容，这是布局阶段一个不合理的地方，因为在布局阶段并没有清晰地将输入内容和输出内容区分开来。
针对这个问题，Chrome 团队正在重构布局代码，下一代布局系统叫 LayoutNG，试图更清晰地分离输入和输出，从而让新设计的布局算法更加简单。
### 总结
* 渲染流程的前三个阶段：DOM 生成、样式计算和布局。要点可大致总结为如下：
1. 浏览器不能直接理解 HTML 数据，所以第一步需要将其转换为浏览器能够理解的 DOM 树结构；
2. 生成 DOM 树后，还需要根据 CSS 样式表，来计算出 DOM 树所有节点的样式；
3. 最后计算 DOM 元素的布局信息，使其都保存在布局树中。
```
当从服务器接收HTML页面的第一批数据时，DOM解析器就开始工作了，在解析过程中，如果遇到了JS脚本，如下所示：
<html>
    <body>
        极客时间
        <script>
        document.write("--foo")
        </script>
    </body>
</html>
那么DOM解析器会先执行JavaScript脚本，执行完成之后，再继续往下解析。

那么第二种情况复杂点了，我们内联的脚本替换成js外部文件，如下所示：
<html>
    <body>
        极客时间
        <script type="text/javascript" src="foo.js"></script>
    </body>
</html>
这种情况下，当解析到JavaScript的时候，会先暂停DOM解析，并下载foo.js文件，下载完成之后执行该段JS文件，然后再继续往下解析DOM。这就是JavaScript文件为什么会阻塞DOM渲染。

我们再看第三种情况，还是看下面代码：
<html>
    <head>
        <style type="text/css" src = "theme.css" />
    </head>
    <body>
        <p>极客时间</p>
        <script>
            let e = document.getElementsByTagName('p')[0]
            e.style.color = 'blue'
        </script>
    </body>
</html>
当我在JavaScript中访问了某个元素的样式，那么这时候就需要等待这个样式被下载完成才能继续往下执行，所以在这种情况下，CSS也会阻塞DOM的解析。


所以JS和CSS都有可能会阻塞DOM解析
```

## 渲染流程（下）：HTML、CSS和JavaScript，是如何变成页面的？

### 分层
* 页面中有很多复杂的效果，如一些复杂的 3D 变换、页面滚动，或者使用 z-indexing 做 z 轴排序等，为了更加方便地实现这些效果，渲染引擎还需要为特定的节点生成专用的图层，并生成一棵对应的图层树（LayerTree）。
* 如果你熟悉 PS，相信你会很容易理解图层的概念，正是这些图层叠加在一起构成了最终的页面图像。
* 浏览器的页面实际上被分成了很多图层，这些图层叠加后合成了最终的页面。
* 通常情况下，并不是布局树的每个节点都包含一个图层，如果一个节点没有对应的层，那么这个节点就从属于父节点的图层
* 拥有层叠上下文属性的元素会被提升为单独的一层。页面是个二维平面，但是层叠上下文能够让 HTML 元素具有三维概念，这些 HTML 元素按照自身属性的优先级分布在垂直于这个二维平面的 z 轴上。
* 明确定位属性的元素、定义透明属性的元素、使用 CSS 滤镜的元素等，都拥有层叠上下文属性。
* 需要剪裁（clip）的地方也会被创建为图层。
### 图层绘制
* 在完成图层树的构建之后，渲染引擎会对图层树中的每个图层进行绘制
### 栅格化（raster）操作
* 绘制列表只是用来记录绘制顺序和绘制指令的列表，而实际上绘制操作是由渲染引擎中的合成线程来完成的。
* 当图层的绘制列表准备好之后，主线程会把该绘制列表提交（commit）给合成线程
* 通常一个页面可能很大，但是用户只能看到其中的一部分，我们把用户可以看到的这个部分叫做视口（viewport）。
* 在有些情况下，有的图层可以很大，比如有的页面你使用滚动条要滚动好久才能滚动到底部，但是通过视口，用户只能看到页面的很小一部分，所以在这种情况下，要绘制出所有图层内容的话，就会产生太大的开销，而且也没有必要。基于这个原因，合成线程会将图层划分为图块（tile）。
* 合成线程会按照视口附近的图块来优先生成位图，实际生成位图的操作是由栅格化来执行的。所谓栅格化，是指将图块转换为位图。而图块是栅格化执行的最小单位。渲染进程维护了一个栅格化的线程池，所有的图块栅格化都是在线程池内执行的
* 通常，栅格化过程都会使用 GPU 来加速生成，使用 GPU 生成位图的过程叫快速栅格化，或者 GPU 栅格化，生成的位图被保存在 GPU 内存中。GPU 操作是运行在 GPU 进程中，如果栅格化操作使用了 GPU，那么最终生成位图的操作是在 GPU 中完成的，这就涉及到了跨进程操作
* 渲染进程把生成图块的指令发送给 GPU，然后在 GPU 中执行生成图块的位图，并保存在 GPU 的内存中。
### 合成和显示
* 一旦所有图块都被光栅化，合成线程就会生成一个绘制图块的命令——“DrawQuad”，然后将该命令提交给浏览器进程。
* 浏览器进程里面有一个叫 viz 的组件，用来接收合成线程发过来的 DrawQuad 命令，然后根据 DrawQuad 命令，将其页面内容绘制到内存中，最后再将内存显示在屏幕上。
### 渲染总结
* 一个完整的渲染流程大致可总结为如下：
1. 渲染进程将 HTML 内容转换为能够读懂的 DOM 树结构。
2. 渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets，计算出 DOM 节点的样式。
3. 创建布局树，并计算元素的布局信息。
4. 对布局树进行分层，并生成分层树。
5. 为每个图层生成绘制列表，并将其提交到合成线程。
6. 合成线程将图层分成图块，并在光栅化线程池中将图块转换成位图。
7. 合成线程发送绘制图块命令 DrawQuad 给浏览器进程。
8. 浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上。
### 相关概念
* 更新了元素的几何属性（重排）
1. 如果你通过 JavaScript 或者 CSS 修改元素的几何位置属性，例如改变元素的宽度、高度等，那么浏览器会触发重新布局，解析之后的一系列子阶段，这个过程就叫重排。
2. 无疑，重排需要更新完整的渲染流水线，所以开销也是最大的。
* 更新元素的绘制属性（重绘）
1. 如果修改了元素的背景颜色，那么布局阶段将不会被执行，因为并没有引起几何位置的变换，所以就直接进入了绘制阶段，然后执行之后的一系列子阶段，这个过程就叫重绘。
2. 相较于重排操作，重绘省去了布局和分层阶段，所以执行效率会比重排操作要高一些。
* 直接合成阶段
1. 使用 CSS 的 transform 来实现动画效果，可以避开重排和重绘阶段，直接在非主线程上执行合成动画操作。
2. 这样的效率是最高的，因为是在非主线程上合成，并没有占用主线程的资源，另外也避开了布局和绘制两个子阶段，
3. 所以相对于重绘和重排，合成能大大提升绘制效率。


## 变量提升：JavaScript代码是按顺序执行的吗？

### 变量提升（Hoisting）
```

var myname = 'diamonds'
这段代码你可以把它看成是两行代码组成的：
var myname    //声明部分
myname = 'diamonds'  //赋值部分




function foo(){
  console.log('foo')
}

var bar = function(){
  console.log('bar')
}
第一个函数 foo 是一个完整的函数声明，也就是说没有涉及到赋值操作；
第二个函数是先声明变量 bar，再把function(){console.log('bar')}赋值给 bar。
```
* 所谓的变量提升，是指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的“行为”。
* 变量被提升后，会给变量设置默认值，这个默认值就是我们熟悉的 undefined。
### JavaScript 代码的执行流程
* 实际上变量和函数声明在代码里的位置是不会改变的，而且是在编译阶段被 JavaScript 引擎放入内存中。
#### 编译阶段
* 输入一段代码，经过编译后，会生成两部分内容：执行上下文（Execution context）和可执行代码。
* 执行上下文是 JavaScript 执行一段代码时的运行环境，比如调用一个函数，就会进入这个函数的执行上下文，确定该函数在执行期间用到的诸如 this、变量、对象以及函数等。
* 在执行上下文中存在一个变量环境的对象（Viriable Environment），该对象中保存了变量提升的内容
```

showName()
console.log(myname)
var myname = 'diamonds'
function showName() {
    console.log('函数showName被执行');
}
第 1 行和第 2 行，由于这两行代码不是声明操作，所以 JavaScript 引擎不会做任何处理；
第 3 行，由于这行是经过 var 声明的，因此 JavaScript 引擎将在环境对象中创建一个名为 myname 的属性，并使用 undefined 对其初始化；
第 4 行，JavaScript 引擎发现了一个通过 function 定义的函数，所以它将函数定义存储到堆 (HEAP）中，并在环境对象中创建一个 showName 的属性，然后将该属性值指向堆中函数的位置（不了解堆也没关系，JavaScript 的执行堆和执行栈我会在后续文章中介绍）。

 JavaScript 引擎会把声明以外的代码编译为字节码
```
#### 执行阶段
```

showName()
console.log(myname)
var myname = 'diamonds'
function showName() {
    console.log('函数showName被执行');
}

当执行到 showName 函数时，JavaScript 引擎便开始在变量环境对象中查找该函数，由于变量环境对象中存在该函数的引用，所以 JavaScript 引擎便开始执行该函数，并输出“函数 showName 被执行”结果。
接下来打印“myname”信息，JavaScript 引擎继续在变量环境对象中查找该对象，由于变量环境存在 myname 变量，并且其值为 undefined，所以这时候就输出 undefined。
接下来执行第 3 行，把“diamonds”赋给 myname 变量，赋值后变量环境中的 myname 属性值改变为“diamonds


```
* 实际上，编译阶段和执行阶段都是非常复杂的，包括了词法分析、语法解析、代码优化、代码生成等
### 代码中出现相同的变量或者函数怎么办？

```

function showName() {
    console.log('diamond');
}
showName();
function showName() {
    console.log('diamonds');
}
showName(); 



首先是编译阶段。遇到了第一个 showName 函数，会将该函数体存放到变量环境中。
接下来是第二个 showName 函数，继续存放至变量环境中，但是变量环境中已经存在一个 showName 函数了，此时，第二个 showName 函数会将第一个 showName 函数覆盖掉。这样变量环境中就只存在第二个 showName 函数了。
接下来是执行阶段。先执行第一个 showName 函数，但由于是从变量环境中查找 showName 函数，而变量环境中只保存了第二个 showName 函数，所以最终调用的是第二个函数，打印的内容是“diamonds”。第二次执行 showName 函数也是走同样的流程，所以输出的结果也是“diamonds”。


```


## 调用栈：为什么JavaScript代码会出现栈溢出？
* 当一段代码被执行时，JavaScript 引擎先会对其进行编译，并创建执行上下文。
1. 当 JavaScript 执行全局代码的时候，会编译全局代码并创建全局执行上下文，而且在整个页面的生存周期内，全局执行上下文只有一份。
2. 当调用一个函数的时候，函数体内的代码会被编译，并创建函数执行上下文，一般情况下，函数执行结束之后，创建的函数执行上下文会被销毁。
3. 当使用 eval 函数的时候，eval 的代码也会被编译，并创建执行上下文。
* 用栈就是用来管理函数调用关系的一种数据结构。

### 什么是函数调用
```

var a = 2
function add(){
var b = 10
return  a+b
}
add()


在执行到函数 add() 之前，JavaScript 引擎会为上面这段代码创建全局执行上下文，包含了声明的函数和变量。
代码中全局变量和函数都保存在全局上下文的变量环境中。


执行上下文准备好之后，便开始执行全局代码，当执行到 add 这儿时，JavaScript 判断这是一个函数调用，那么将执行以下操作：
1.首先，从全局执行上下文中，取出 add 函数代码。
2.其次，对 add 函数的这段代码进行编译，并创建该函数的执行上下文和可执行代码。
3.最后，执行代码，输出结果。

当执行到 add 函数的时候，我们就有了两个执行上下文了——全局执行上下文和 add 函数的执行上下文。也就是说在执行 JavaScript 时，可能会存在多个执行上下文。

JavaScript 引擎通过一种叫栈的数据结构来管理执行上下文。
```
### 什么是 JavaScript 的调用栈
* JavaScript 引擎正是利用栈的这种结构来管理执行上下文的。在执行上下文创建好后，JavaScript 引擎会将执行上下文压入栈中，通常把这种用来管理执行上下文的栈称为执行上下文栈，又称调用栈。
```

var a = 2
function add(b,c){
  return b+c
}
function addAll(b,c){
var d = 10
result = add(b,c)
return  a+result+d
}
addAll(3,6)

第一步，创建全局上下文，并将其压入栈底
变量 a、函数 add 和 addAll 都保存到了全局上下文的变量环境对象中。
全局执行上下文压入到调用栈后，JavaScript 引擎便开始执行全局代码了。
首先会执行 a=2 的赋值操作，执行该语句会将全局上下文变量环境中 a 的值设置为 2。


第二步是调用 addAll 函数。
当调用该函数时，JavaScript 引擎会编译该函数，并为其创建一个执行上下文，最后还将该函数的执行上下文压入栈中
addAll 函数的执行上下文创建好之后，便进入了函数代码的执行阶段了，这里先执行的是 d=10 的赋值操作，执行语句会将 addAll 函数执行上下文中的 d 由 undefined 变成了 10。



第三步，当执行到 add 函数调用语句时，同样会为其创建执行上下文，并将其压入调用栈
当 add 函数返回时，该函数的执行上下文就会从栈顶弹出，并将 result 的值设置为 add 函数的返回值，也就是 9
紧接着 addAll 执行最后一个相加操作后并返回，addAll 的执行上下文也会从栈顶部弹出，此时调用栈中就只剩下全局上下文了。
至此，整个 JavaScript 流程执行结束了。

```
* 调用栈是 JavaScript 引擎追踪函数执行的一个机制，当一次有多个函数被调用时，通过调用栈就能够追踪到哪个函数正在被执行以及各函数之间的调用关系。


### 总结
1. 每调用一个函数，JavaScript 引擎会为其创建执行上下文，并把该执行上下文压入调用栈，然后 JavaScript 引擎开始执行函数代码。
2. 如果在一个函数 A 中调用了另外一个函数 B，那么 JavaScript 引擎会为 B 函数创建执行上下文，并将 B 函数的执行上下文压入栈顶。
3. 当前函数执行完毕后，JavaScript 引擎会将该函数的执行上下文弹出栈。
4. 当分配的调用栈空间被占满时，会引发“堆栈溢出”问题。



## 块级作用域：var缺陷以及为什么要引入let和const？
* 作用域是指在程序中定义变量的区域，该位置决定了变量的生命周期。通俗地理解，作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。
* 在 ES6 之前，ES 的作用域只有两种：全局作用域和函数作用域。
1. 全局作用域中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期。
2. 函数作用域就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁。
```

function foo(){
  for (var i = 0; i < 7; i++) {
  }
  console.log(i); 
}
foo()
如果你使用 C 语言或者其他的大部分语言实现类似代码，在 for 循环结束之后，i 就已经被销毁了，
但是在 JavaScript 代码中，i 的值并未被销毁，所以最后打印出来的是 7。
这同样也是由变量提升而导致的，在创建执行上下文阶段，变量 i 就已经被提升了，所以当 for 循环结束之后，变量 i 并没有被销毁。
```
### JavaScript 是如何支持块级作用域的
```

function foo(){
    var a = 1
    let b = 2
    {
      let b = 3
      var c = 4
      let d = 5
      console.log(a)
      console.log(b)
    }
    console.log(b) 
    console.log(c)
    console.log(d)
}   
foo()

第一步是编译并创建执行上下文
函数内部通过 var 声明的变量，在编译阶段全都被存放到变量环境里面了。
通过 let 声明的变量，在编译阶段会被存放到词法环境（Lexical Environment）中。
在函数的作用域块内部，通过 let 声明的变量并没有被存放到词法环境中。

第二步继续执行代码，当执行到代码块里面时，变量环境中 a 的值已经被设置成了 1，词法环境中 b 的值已经被设置成了 2
当进入函数的作用域块时，作用域块中通过 let 声明的变量，会被存放在词法环境的一个单独的区域中，这个区域中的变量并不影响作用域块外面的变量，比如在作用域外面声明了变量 b，在该作用域块内部也声明了变量 b，当执行到作用域内部时，它们都是独立的存在。
其实，在词法环境内部，维护了一个小型栈结构，栈底是函数最外层的变量，进入一个作用域块后，就会把该作用域块内部的变量压到栈顶；当作用域执行完成之后，该作用域的信息就会从栈顶弹出，这就是词法环境的结构。
需要注意下，我这里所讲的变量是指通过 let 或者 const 声明的变量。


再接下来，当执行到作用域块中的console.log(a)这行代码时，就需要在词法环境和变量环境中查找变量 a 的值了，
具体查找方式是：沿着词法环境的栈顶向下查询，如果在词法环境中的某个块中查找到了，就直接返回给 JavaScript 引擎，
如果没有查找到，那么继续在变量环境中查找。



```



## 作用域链和闭包 ：代码中出现相同的变量，JavaScript引擎是如何选择的？
* ES6 是如何通过变量环境和词法环境来同时支持变量提升和块级作用域
* 在每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为 outer。
```

function bar() {
    console.log(myName)
}
function foo() {
    var myName = "diamonds"
    bar()
}
var myName = "diamond"
foo()

上面那段代码在查找 myName 变量时，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续在 outer 所指向的执行上下文中查找。
bar 函数和 foo 函数的 outer 都是指向全局上下文的，这也就意味着如果在 bar 函数或者 foo 函数中使用了外部变量，那么 JavaScript 引擎会去全局执行上下文中查找。我们把这个查找的链条就称为作用域链。



foo 函数调用的 bar 函数，那为什么 bar 函数的外部引用是全局执行上下文，而不是 foo 函数的执行上下文？
要回答这个问题，你还需要知道什么是词法作用域。这是因为在 JavaScript 执行过程中，其作用域链是由词法作用域决定的。
这是因为根据词法作用域，foo 和 bar 的上级作用域都是全局作用域，所以如果 foo 或者 bar 函数使用了一个它们没有定义的变量，那么它们会到全局作用域去查找。








```
### 词法作用域
* 词法作用域就是指作用域是由代码中函数声明的位置来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符。
```
let count=1
function main(){
let count=2
function bar(){
let count=3
function foo(){
let count=4
}
}

词法作用域就是根据代码的位置来决定的，其中 main 函数包含了 bar 函数，bar 函数中包含了 foo 函数，因为 JavaScript 作用域链是由词法作用域决定的，所以整个词法作用域链的顺序是：foo 函数作用域—>bar 函数作用域—>main 函数作用域—> 全局作用域。



```
* 词法作用域是代码编译阶段就决定好的，和函数是怎么调用的没有关系。

### 闭包
```

function foo() {
    var myName = "diamond"
    let test1 = 1
    const test2 = 2
    var innerBar = {
        getName:function(){
            console.log(test1)
            return myName
        },
        setName:function(newName){
            myName = newName
        }
    }
    return innerBar
}
var bar = foo()
bar.setName("diamonds")
bar.getName()
console.log(bar.getName())


在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。
比如外部函数是 foo，那么这些变量的集合就称为 foo 函数的闭包。
```
* 如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量。

## this：从JavaScript执行上下文的视角讲清楚this
* this 是和执行上下文绑定的，也就是说每个执行上下文中都有一个 this
* 执行上下文主要分为三种——全局执行上下文、函数执行上下文和 eval 执行上下文，所以对应的 this 也只有这三种——全局执行上下文中的 this、函数中的 this 和 eval 中的 this。
### this 的设计缺陷以及应对方案
* 嵌套函数中的 this 不会从外层函数中继承
```

var myObj = {
  name : "diamonds", 
  showThis: function(){
    console.log(this)
    function bar(){console.log(this)}
    bar()
  }
}
myObj.showThis()

执行这段代码后，你会发现函数 bar 中的 this 指向的是全局 window 对象，而函数 showThis 中的 this 指向的是 myObj 对象。



var myObj = {
  name : "diamond", 
  showThis: function(){
    console.log(this)
    var bar = ()=>{
      this.name = "diamonds"
      console.log(this)
    }
    bar()
  }
}
myObj.showThis()
console.log(myObj.name)
console.log(window.name)

ES6 中的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 this 取决于它的外部函数。
因为箭头函数没有自己的执行上下文，所以箭头函数的 this 就是它外层函数的 this。
```
* 普通函数中的 this 默认指向全局对象 window
1. 在严格模式下，默认执行一个函数，其函数的执行上下文中的 this 值是 undefined



## 栈空间和堆空间：数据是如何存储的？
* 我们把这种在使用之前就需要确认其变量数据类型的称为静态语言。
* 相反地，我们把在运行过程中需要检查数据类型的语言称为动态语言。
* JavaScript 就是动态语言，因为在声明变量之前并不需要确认其数据类型。
* 支持隐式类型转换的语言称为弱类型语言，不支持隐式类型转换的语言称为强类型语言。
* JavaScript 是一种弱类型的、动态的语言。
1. 弱类型，意味着你不需要告诉 JavaScript 引擎这个或那个变量是什么数据类型，JavaScript 引擎在运行代码的时候自己会计算出来。
2. 动态，意味着你可以使用同一个变量保存不同类型的数据。
* 使用 typeof 检测 Null 类型时，返回的是 Object。这是当初 JavaScript 语言的一个 Bug，一直保留至今，之所以一直没修改过来，主要是为了兼容老的代码。
* Object 类型比较特殊，Object 是由 key-value 组成的，其中的 vaule 可以是任何类型，包括函数，这也就意味着你可以通过 Object 来存储函数，Object 中的函数又称为方法
*  在 JavaScript 的执行过程中， 主要有三种类型内存空间，分别是代码空间、栈空间和堆空间。代码空间主要是存储可执行代码的。
### 栈空间和堆空间
* 调用栈，是用来存储执行上下文的
* 对象类型是存放在堆空间的，在栈空间中只是保留了对象的引用地址，当 JavaScript 需要访问该数据的时候，是通过栈中的引用地址来访问的
* JavaScript 引擎需要用栈来维护程序执行期间上下文的状态，如果栈空间大了话，所有的数据都存放在栈空间里面，那么会影响到上下文切换的效率，进而又影响到整个程序的执行效率。
* 通常情况下，栈空间都不会设置太大，主要用来存放一些原始类型的小数据。而引用类型的数据占用的空间都比较大，所以这一类数据会被存放到堆中，堆空间很大，能存放很多大的数据，不过缺点是分配内存和回收内存都会占用一定的时间
* 原始类型的赋值会完整复制变量值，而引用类型的赋值是复制引用地址。

## 垃圾回收：垃圾数据是如何自动回收的？
* 有些数据被使用之后，可能就不再需要了，我们把这种数据称为垃圾数据。如果这些垃圾数据一直保存在内存中，那么内存会越用越多，所以我们需要对这些垃圾数据进行回收，以释放有限的内存空间。
* 通常情况下，垃圾数据回收分为手动回收和自动回收两种策略。
### 调用栈中的数据是如何回收的
* 当一个函数执行结束之后，JavaScript 引擎会通过向下移动 ESP（记录当前执行状态的指针） 来销毁该函数保存在栈中的执行上下文。
### 堆中的数据是如何回收的
* 要回收堆中的垃圾数据，就需要用到 JavaScript 中的垃圾回收器了。
### 代际假说和分代收集
* 代际假说（The Generational Hypothesis）的内容，这是垃圾回收领域中一个重要的术语，后续垃圾回收的策略都是建立在该假说的基础之上的，所以很是重要。
* 代际假说有以下两个特点：
1. 第一个是大部分对象在内存中存在的时间很短，简单来说，就是很多对象一经分配内存，很快就变得不可访问；
2. 第二个是不死的对象，会活得更久。
* 通常，垃圾回收算法有很多种，但是并没有哪一种能胜任所有的场景，你需要权衡各种场景，根据对象的生存周期的不同而使用不同的算法，以便达到最好的效果。
* 在 V8 中会把堆分为新生代和老生代两个区域，新生代中存放的是生存时间短的对象，老生代中存放的生存时间久的对象。
* 新生区通常只支持 1～8M 的容量，而老生区支持的容量就大很多了。对于这两块区域，V8 分别使用两个不同的垃圾回收器，以便更高效地实施垃圾回收。
* 副垃圾回收器，主要负责新生代的垃圾回收。主垃圾回收器，主要负责老生代的垃圾回收。
### 垃圾回收器的工作流程
* V8 把堆分成两个区域——新生代和老生代，并分别使用两个不同的垃圾回收器。其实不论什么类型的垃圾回收器，它们都有一套共同的执行流程。
1. 第一步是标记空间中活动对象和非活动对象。所谓活动对象就是还在使用的对象，非活动对象就是可以进行垃圾回收的对象。
2. 第二步是回收非活动对象所占据的内存。其实就是在所有的标记完成之后，统一清理内存中所有被标记为可回收的对象。
3. 第三步是做内存整理。一般来说，频繁回收对象后，内存中就会存在大量不连续空间，我们把这些不连续的内存空间称为内存碎片。当内存中出现了大量的内存碎片之后，如果需要分配较大连续内存的时候，就有可能出现内存不足的情况。所以最后一步需要整理这些内存碎片，但这步其实是可选的，因为有的垃圾回收器不会产生内存碎片，比如接下来我们要介绍的副垃圾回收器。
#### 副垃圾回收器
* 副垃圾回收器主要负责新生区的垃圾回收。而通常情况下，大多数小的对象都会被分配到新生区，所以说这个区域虽然不大，但是垃圾回收还是比较频繁的。
* 新生代中用 Scavenge 算法来处理。所谓 Scavenge 算法，是把新生代空间对半划分为两个区域，一半是对象区域，一半是空闲区域
* 新加入的对象都会存放到对象区域，当对象区域快被写满时，就需要执行一次垃圾清理操作。
* 在垃圾回收过程中，首先要对对象区域中的垃圾做标记；标记完成之后，就进入垃圾清理阶段，副垃圾回收器会把这些存活的对象复制到空闲区域中，同时它还会把这些对象有序地排列起来，所以这个复制过程，也就相当于完成了内存整理操作，复制后空闲区域就没有内存碎片了。
* 完成复制后，对象区域与空闲区域进行角色翻转，也就是原来的对象区域变成空闲区域，原来的空闲区域变成了对象区域。这样就完成了垃圾对象的回收操作，同时这种角色翻转的操作还能让新生代中的这两块区域无限重复使用下去。
* 由于新生代中采用的 Scavenge 算法，所以每次执行清理操作时，都需要将存活的对象从对象区域复制到空闲区域。但复制操作需要时间成本，如果新生区空间设置得太大了，那么每次清理的时间就会过久，所以为了执行效率，一般新生区的空间会被设置得比较小。
* 也正是因为新生区的空间不大，所以很容易被存活的对象装满整个区域。为了解决这个问题，JavaScript 引擎采用了对象晋升策略，也就是经过两次垃圾回收依然还存活的对象，会被移动到老生区中。
#### 主垃圾回收器
* 主垃圾回收器主要负责老生区中的垃圾回收。除了新生区中晋升的对象，一些大的对象会直接被分配到老生区。因此老生区中的对象有两个特点，一个是对象占用空间大，另一个是对象存活时间长。
* 由于老生区的对象比较大，若要在老生区中使用 Scavenge 算法进行垃圾回收，复制这些大的对象将会花费比较多的时间，从而导致回收执行效率不高，同时还会浪费一半的空间。因而，主垃圾回收器是采用标记 - 清除（Mark-Sweep）的算法进行垃圾回收的。
* 首先是标记过程阶段。标记阶段就是从一组根元素开始，递归遍历这组根元素，在这个遍历过程中，能到达的元素称为活动对象，没有到达的元素就可以判断为垃圾数据。
```

function foo(){
    var a = 1
    var b = {name:"diamond"}  堆地址：  1050
    function showName(){
      var c = 2
      var d = {name:"diamonds"} 堆地址：   1003
    }
    showName()
}
foo()


当 showName 函数执行结束之后，ESP 向下移动，指向了 foo 函数的执行上下文，这时候如果遍历调用栈，是不会找到引用 1003 地址的变量，也就意味着 1003 这块数据为垃圾数据，被标记为红色。
由于 1050 这块数据被变量 b 引用了，所以这块数据会被标记为活动对象。这就是大致的标记过程。
```
* 接下来就是垃圾的清除过程。它和副垃圾回收器的垃圾清除过程完全不同
* 对一块内存多次执行标记 - 清除算法后，会产生大量不连续的内存碎片。而碎片过多会导致大对象无法分配到足够的连续内存，于是又产生了另外一种算法——标记 - 整理（Mark-Compact），这个标记过程仍然与标记 - 清除算法里的是一样的，但后续步骤不是直接对可回收对象进行清理，而是让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。
### 全停顿
* 由于 JavaScript 是运行在主线程之上的，一旦执行垃圾回收算法，都需要将正在执行的 JavaScript 脚本暂停下来，待垃圾回收完毕后再恢复脚本执行。我们把这种行为叫做全停顿（Stop-The-World）。
* 比如堆中的数据有 1.5GB，V8 实现一次完整的垃圾回收需要 1 秒以上的时间，这也是由于垃圾回收而引起 JavaScript 线程暂停执行的时间，若是这样的时间花销，那么应用的性能和响应能力都会直线下降。
* 在 V8 新生代的垃圾回收中，因其空间较小，且存活对象较少，所以全停顿的影响不大
* 老生代就不一样了。如果在执行垃圾回收的过程中，占用主线程时间过久，主线程是不能做其他事情的。比如页面正在执行一个 JavaScript 动画，因为垃圾回收器在工作，就会导致这个动画在这 200 毫秒内无法执行的，这将会造成页面的卡顿现象。
* 为了降低老生代的垃圾回收而造成的卡顿，V8 将标记过程分为一个个的子标记过程，同时让垃圾回收标记和 JavaScript 应用逻辑交替进行，直到标记阶段完成，我们把这个算法称为增量标记（Incremental Marking）算法
* 使用增量标记算法，可以把一个完整的垃圾回收任务拆分为很多小的任务，这些小的任务执行时间比较短，可以穿插在其他的 JavaScript 任务中间执行，这样当执行上述动画效果时，就不会让用户因为垃圾回收任务而感受到页面的卡顿了。
### 总结
* 无论是垃圾回收的策略，还是处理全停顿的策略，往往都没有一个完美的解决方案，你需要花一些时间来做权衡，而这需要牺牲当前某几方面的指标来换取其他几个指标的提升。
* 其实站在工程师的视角，我们经常需要在满足需求的前提下，权衡各个指标的得失，把系统设计得尽可能适应最核心的需求。
* 生活中处理事情的原则也与之类似，古人很早就说过“两害相权取其轻，两利相权取其重”，所以与其患得患失，不如冷静地分析哪些才是核心诉求，然后果断决策牺牲哪些以使得利益最大化。


## 编译器和解释器：V8是如何执行一段JavaScript代码的？
* 要深入理解 V8 的工作原理，你需要搞清楚一些概念和原理，比如编译器（Compiler）、解释器（Interpreter）、抽象语法树（AST）、字节码（Bytecode）、即时编译器（JIT）等概念
### 编译器和解释器
* 之所以存在编译器和解释器，是因为机器不能直接理解我们所写的代码，所以在执行程序之前，需要将我们所写的代码“翻译”成机器能读懂的机器语言。
* 按语言的执行流程，可以把语言划分为编译型语言和解释型语言。
* 编译型语言在程序执行之前，需要经过编译器的编译过程，并且编译之后会直接保留机器能读懂的二进制文件，这样每次运行程序时，都可以直接运行该二进制文件，而不需要再次重新编译了。比如 C/C++、GO 等都是编译型语言。
* 解释型语言编写的程序，在每次运行时都需要通过解释器对程序进行动态解释和执行。比如 Python、JavaScript 等都属于解释型语言。
* 在编译型语言的编译过程中，编译器首先会依次对源代码进行词法分析、语法分析，生成抽象语法树（AST），然后是优化代码，最后再生成处理器能够理解的机器码。如果编译成功，将会生成一个可执行的文件。但如果编译过程发生了语法或者其他的错误，那么编译器就会抛出异常，最后的二进制文件也不会生成成功。
* 在解释型语言的解释过程中，同样解释器也会对源代码进行词法分析、语法分析，并生成抽象语法树（AST），不过它会再基于抽象语法树生成字节码，最后再根据字节码来执行程序、输出结果。
### V8 是如何执行一段 JavaScript 代码的
* V8 在执行过程中既有解释器 Ignition，又有编译器 TurboFan
#### 生成抽象语法树（AST）和执行上下文
* 将源代码转换为抽象语法树，并生成执行上下文
* 高级语言是开发者可以理解的语言，但是让编译器或者解释器来理解就非常困难了。
* 对于编译器或者解释器来说，它们可以理解的就是 AST 了。所以无论你使用的是解释型语言还是编译型语言，在编译过程中，它们都会生成一个 AST。这和渲染引擎将 HTML 格式文件转换为计算机可以理解的 DOM 树的情况类似。
* AST 的结构和代码的结构非常相似，其实你也可以把 AST 看成代码的结构化的表示，编译器或者解释器后续的工作都需要依赖于 AST，而不是源代码。
* AST 是非常重要的一种数据结构，在很多项目中有着广泛的应用。其中最著名的一个项目是 Babel。
* Babel 是一个被广泛使用的代码转码器，可以将 ES6 代码转为 ES5 代码，这意味着你可以现在就用 ES6 编写程序，而不用担心现有环境是否支持 ES6。Babel 的工作原理就是先将 ES6 源码转换为 AST，然后再将 ES6 语法的 AST 转换为 ES5 语法的 AST，最后利用 ES5 的 AST 生成 JavaScript 源代码。
* 除了 Babel 外，还有 ESLint 也使用 AST。ESLint 是一个用来检查 JavaScript 编写规范的插件，其检测流程也是需要将源码转换为 AST，然后再利用 AST 来检查代码规范化的问题。
* 通常，生成 AST 需要经过两个阶段。
1. 第一阶段是分词（tokenize），又称为词法分析，其作用是将一行行的源码拆解成一个个 token。所谓 token，指的是语法上不可能再分的、最小的单个字符或字符串
```
var myName = “diamond”

通过var myName = “diamond”简单地定义了一个变量，
其中关键字“var”、标识符“myName” 、赋值运算符“=”、字符串“极客时间”四个都是 token，而且它们代表的属性还不一样。

```
2. 第二阶段是解析（parse），又称为语法分析，其作用是将上一步生成的 token 数据，根据语法规则转为 AST。如果源码符合语法规则，这一步就会顺利完成。但如果源码存在语法错误，这一步就会终止，并抛出一个“语法错误”。
3. 这就是 AST 的生成过程，先分词，再解析。有了 AST 后，那接下来 V8 就会生成该段代码的执行上下文。
#### 生成字节码
* 有了 AST 和执行上下文后，那接下来的第二步，解释器 Ignition 就登场了，它会根据 AST 生成字节码，并解释执行字节码。
* 其实一开始 V8 并没有字节码，而是直接将 AST 转换为机器码，由于执行机器码的效率是非常高效的，所以这种方式在发布后的一段时间内运行效果是非常好的。但是随着 Chrome 在手机上的广泛普及，特别是运行在 512M 内存的手机上，内存占用问题也暴露出来了，因为 V8 需要消耗大量的内存来存放转换后的机器码。
* 为了解决内存占用问题，V8 团队大幅重构了引擎架构，引入字节码，并且抛弃了之前的编译器，最终花了将进四年的时间，实现了现在的这套架构。
* 字节码就是介于 AST 和机器码之间的一种代码。但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码后才能执行。机器码所占用的空间远远超过了字节码，所以使用字节码可以减少系统的内存使用。
#### 执行代码
* 生成字节码之后，接下来就要进入执行阶段了。
* 解释器 Ignition 除了负责生成字节码之外，它还有另外一个作用，就是解释执行字节码。
* 在 Ignition 执行字节码的过程中，如果发现有热点代码（HotSpot），比如一段代码被重复执行多次，这种就称为热点代码，那么后台的编译器 TurboFan 就会把该段热点的字节码编译为高效的机器码，然后当再次执行这段被优化的代码时，只需要执行编译后的机器码就可以了，这样就大大提升了代码的执行效率。
* 字节码配合解释器和编译器是最近一段时间很火的技术，比如 Java 和 Python 的虚拟机也都是基于这种技术实现的，我们把这种技术称为即时编译（JIT）。具体到 V8，就是指解释器 Ignition 在解释执行字节码的同时，收集代码信息，当它发现某一部分代码变热了之后，TurboFan 编译器便闪亮登场，把热点的字节码转换为机器码，并把转换后的机器码保存起来，以备下次使用。
### JavaScript 的性能优化
* 对于优化 JavaScript 执行效率，你应该将优化的中心聚焦在单次脚本的执行时间和脚本的网络下载上，主要关注以下三点内容：
1. 提升单次脚本的执行速度，避免 JavaScript 的长任务霸占主线程，这样可以使得页面快速响应交互；
2. 避免大的内联脚本，因为在解析 HTML 的过程中，解析和编译也会占用主线程；
3. 减少 JavaScript 文件的容量，因为更小的文件会提升下载速度，并且占用更低的内存。































































