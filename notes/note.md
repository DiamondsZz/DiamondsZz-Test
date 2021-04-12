
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






