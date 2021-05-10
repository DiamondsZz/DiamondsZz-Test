
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



## 消息队列和事件循环：页面是怎么“活”起来的？
* 主线程非常繁忙，既要处理 DOM，又要计算样式，还要处理布局，同时还需要处理 JavaScript 任务以及各种输入事件。要让这么多不同类型的任务在主线程中有条不紊地执行，这就需要一个系统来统筹调度这些任务，这个统筹调度系统就是我们今天要讲的消息队列和事件循环系统。
* 消息队列中的任务类型：如输入事件（鼠标滚动、点击、移动）、微任务、文件读写、WebSocket、JavaScript 定时器等等。除此之外，消息队列中还包含了很多与页面相关的事件，如 JavaScript 执行、解析 DOM、样式计算、布局计算、CSS 动画等。以上这些事件都是在主线程中执行的，所以在编写 Web 应用时，你还需要衡量这些事件所占用的时长，并想办法解决单个任务占用主线程过久的问题。
* 如何安全退出？确定要退出当前页面时，页面主线程会设置一个退出标志的变量，在每次执行完一个任务时，判断是否有设置退出标志。如果设置了，那么就直接中断当前的所有任务，退出线程
* 通常我们把消息队列中的任务称为宏任务，每个宏任务中都包含了一个微任务队列，在执行宏任务的过程中，如果 DOM 有变化，那么就会将该变化添加到微任务列表中，这样就不会影响到宏任务的继续执行，因此也就解决了执行效率的问题。
* 等宏任务中的主要功能都直接完成之后，这时候，渲染引擎并不着急去执行下一个宏任务，而是执行当前宏任务中的微任务，因为 DOM 变化的事件都保存在这些微任务队列中，这样也就解决了实时性问题。
## WebAPI：setTimeout是如何实现的？
* 定时器，用来指定某个函数在多少毫秒之后执行。它会返回一个整数，表示定时器的编号，同时你还可以通过该编号来取消这个定时器。
### 浏览器怎么实现 setTimeout
* 渲染进程中所有运行在主线程上的任务都需要先添加到消息队列，然后事件循环系统再按照顺序执行消息队列中的任务。下面我们来看看那些典型的事件：
1. 当接收到 HTML 文档数据，渲染引擎就会将“解析 DOM”事件添加到消息队列中，
2. 当用户改变了 Web 页面的窗口大小，渲染引擎就会将“重新布局”的事件添加到消息队列中。
3. 当触发了 JavaScript 引擎垃圾回收机制，渲染引擎会将“垃圾回收”任务添加到消息队列中。
4. 同样，如果要执行一段异步 JavaScript 代码，也是需要将执行任务添加到消息队列中。
* 在 Chrome 中除了正常使用的消息队列之外，还有另外一个消息队列（其实是一个hashmap结构，等到执行这个结构的时候，会计算hashmap中的每个任务是否到期了，到期了就去执行，直到所有到期的任务都执行结束，才会进入下一轮循环！），这个队列中维护了需要延迟执行的任务列表，包括了定时器和 Chromium 内部一些需要延迟执行的任务。所以当通过 JavaScript 创建一个定时器时，渲染进程会将该定时器的回调任务添加到延迟队列中。
* 浏览器内部实现取消定时器的操作也是非常简单的，就是直接从延迟队列中，通过 ID 查找到对应的任务，然后再将其从队列中删除掉就可以了。
* 使用 setTimeout 的一些注意事项
1. 如果当前任务执行时间过久，会影响定时器任务的执行
2. 如果 setTimeout 存在嵌套调用，那么系统会设置最短时间间隔为 4 毫秒。在 Chrome 中，定时器被嵌套调用 5 次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于 4 毫秒，那么浏览器会将每次调用的时间间隔设置为 4 毫秒。所以，一些实时性较高的需求就不太适合使用 setTimeout 了，比如你用 setTimeout 来实现 JavaScript 动画就不是一个很好的主意。
3. 未激活的页面，setTimeout 执行最小间隔是 1000 毫秒，目的是为了优化后台页面的加载损耗以及降低耗电量。
4. 延时执行时间有最大值。Chrome、Safari、Firefox 都是以 32 个 bit 来存储延时值的，32bit 最大只能存放的数字是 2147483647 毫秒，这就意味着，如果 setTimeout 设置的延迟值大于 2147483647 毫秒（大约 24.8 天）时就会溢出，那么相当于延时值被设置为 0 了，这导致定时器会被立即执行。
5. 使用 setTimeout 设置的回调函数中的 this 不符合直觉。如果被 setTimeout 推迟执行的回调函数是某个对象的方法，那么该方法中的 this 关键字将指向全局环境，而不是定义时所在的那个对象。
```

var name= 1;
var MyObj = {
  name: 2,
  showName: function(){
    console.log(this.name);
  }
}
setTimeout(MyObj.showName,1000)
这里输出的是 1，因为这段代码在编译的时候，执行上下文中的 this 会被设置为全局 window，如果是严格模式，会被设置为 undefined。
那么该怎么解决这个问题呢？通常可以使用下面这两种方法。


//箭头函数
setTimeout(() => {
    MyObj.showName()
}, 1000);
//或者function函数
setTimeout(function() {
  MyObj.showName();
}, 1000)



setTimeout(MyObj.showName.bind(MyObj), 1000)
```

## WebAPI：XMLHttpRequest是怎么实现的？

### 回调函数 VS 系统调用栈
* 将一个函数作为参数传递给另外一个函数，那作为参数的这个函数就是回调函数。
```


let callback = function(){
    console.log('i am do homework')
}
function doWork(cb) {
    console.log('start do work')
    cb()
    console.log('end do work')
}
doWork(callback)

上面的回调方法有个特点，就是回调函数 callback 是在主函数 doWork 返回之前执行的，我们把这个回调过程称为同步回调。



let callback = function(){
    console.log('i am do homework')
}
function doWork(cb) {
    console.log('start do work')
    setTimeout(cb,1000)   
    console.log('end do work')
}
doWork(callback)

在这个例子中，我们使用了 setTimeout 函数让 callback 在 doWork 函数执行结束后，又延时了 1 秒再执行，
这次 callback 并没有在主函数 doWork 内部被调用，我们把这种回调函数在主函数外部执行的过程称为异步回调。
```
* 消息队列和主线程循环机制保证了页面有条不紊地运行。那就是当循环系统在执行一个任务的时候，都要为这个任务维护一个系统调用栈。这个系统调用栈类似于 JavaScript 的调用栈，只不过系统调用栈是 Chromium 的开发语言 C++ 来维护的
### XMLHttpRequest 运作机制
```


 function GetWebData(URL){
    /**
     * 1:新建XMLHttpRequest请求对象
     */
    let xhr = new XMLHttpRequest()

    /**
     * 2:注册相关事件回调处理函数 
     */
    xhr.onreadystatechange = function () {
        switch(xhr.readyState){
          case 0: //请求未初始化
            console.log("请求未初始化")
            break;
          case 1://OPENED
            console.log("OPENED")
            break;
          case 2://HEADERS_RECEIVED
            console.log("HEADERS_RECEIVED")
            break;
          case 3://LOADING  
            console.log("LOADING")
            break;
          case 4://DONE
            if(this.status == 200||this.status == 304){
                console.log(this.responseText);
                }
            console.log("DONE")
            break;
        }
    }

    xhr.ontimeout = function(e) { console.log('ontimeout') }
    xhr.onerror = function(e) { console.log('onerror') }

    /**
     * 3:打开请求
     */
    xhr.open('Get', URL, true);//创建一个Get请求,采用异步


    /**
     * 4:配置参数
     */
    xhr.timeout = 3000 //设置xhr请求的超时时间
    xhr.responseType = "text" //设置响应返回的数据格式
    xhr.setRequestHeader("X_TEST","time.geekbang")

    /**
     * 5:发送请求
     */
    xhr.send();
}

```
* 渲染进程会将请求发送给网络进程，然后网络进程负责资源的下载，等网络进程接收到数据之后，就会利用 IPC 来通知渲染进程；渲染进程接收到消息之后，会将 xhr 的回调函数封装成任务并添加到消息队列中，等主线程循环系统执行到该任务的时候，就会根据相关的状态来调用对应的回调函数。
### XMLHttpRequest 使用过程中的“坑”
* 跨域问题
* HTTPS 混合内容的问题
1. HTTPS 混合内容是 HTTPS 页面中包含了不符合 HTTPS 安全要求的内容，比如包含了 HTTP 资源，通过 HTTP 加载的图像、视频、样式表、脚本等，都属于混合内容。
2. 通过 HTML 文件加载的混合资源，虽然给出警告，但大部分类型还是能加载的。而使用 XMLHttpRequest 请求时，浏览器认为这种请求可能是攻击者发起的，会阻止此类危险的请求。


## 宏任务和微任务：不是所有任务都是一个待遇

### 宏任务
* 页面中的大部分任务都是在主线程上执行的，这些任务包括了：
1. 渲染事件（如解析 DOM、计算布局、绘制）；
2. 用户交互事件（如鼠标点击、滚动页面、放大缩小等）；
3. JavaScript 脚本执行事件；
4. 网络请求完成、文件读写完成事件。
* 为了协调这些任务有条不紊地在主线程上执行，页面进程引入了消息队列和事件循环机制，渲染进程内部会维护多个消息队列，比如延迟执行队列和普通的消息队列。
* 然后主线程采用一个 for 循环，不断地从这些任务队列中取出任务并执行任务。我们把这些消息队列中的任务称为宏任务。
* 页面的渲染事件、各种 IO 的完成事件、执行 JavaScript 脚本的事件、用户交互的事件等都随时有可能被添加到消息队列中，而且添加事件是由系统操作的，JavaScript 代码不能准确掌控任务要添加到队列中的位置，控制不了任务在消息队列中的位置，所以很难控制开始执行任务的时间。
* 宏任务的时间粒度比较大，执行的时间间隔是不能精确控制的，对一些高实时性的需求就不太符合了，比如后面要介绍的监听 DOM 变化的需求。
### 微任务
* 异步回调的概念，其主要有两种方式
1. 第一种是把异步回调函数封装成一个宏任务，添加到消息队列尾部，当循环系统执行到该任务的时候执行回调函数。这种比较好理解，我们前面介绍的 setTimeout 和 XMLHttpRequest 的回调函数都是通过这种方式来实现的。
2. 第二种方式的执行时机是在主函数执行结束之后、当前宏任务结束之前执行回调函数，这通常都是以微任务形式体现的。
* 微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。
* 当 JavaScript 执行一段脚本的时候，V8 会为其创建一个全局执行上下文，在创建全局执行上下文的同时，V8 引擎也会在内部创建一个微任务队列。顾名思义，这个微任务队列就是用来存放微任务的，因为在当前宏任务执行的过程中，有时候会产生多个微任务，这时候就需要使用这个微任务队列来保存这些微任务了。不过这个微任务队列是给 V8 引擎内部使用的，所以你是无法通过 JavaScript 直接访问的。
* 在现代浏览器里面，产生微任务有两种方式。
1. 第一种方式是使用 MutationObserver 监控某个 DOM 节点，然后再通过 JavaScript 来修改这个节点，或者为这个节点添加、删除部分子节点，当 DOM 节点发生变化时，就会产生 DOM 变化记录的微任务。
2. 第二种方式是使用 Promise，当调用 Promise.resolve() 或者 Promise.reject() 的时候，也会产生微任务。
* 通常情况下，在当前宏任务中的 JavaScript 快执行完成时，也就在 JavaScript 引擎准备退出全局执行上下文并清空调用栈的时候，JavaScript 引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务。WHATWG 把执行微任务的时间点称为检查点。当然除了在退出全局执行上下文式这个检查点之外，还有其他的检查点。
* 如果在执行微任务的过程中，产生了新的微任务，同样会将该微任务添加到微任务队列中，V8 引擎一直循环执行微任务队列中的任务，直到队列为空才算执行结束。也就是说在执行微任务过程中产生的新的微任务并不会推迟到下个宏任务中执行，而是在当前的宏任务中继续执行。
### 监听 DOM 变化方法演变
* 早期页面并没有提供对监听的支持，所以那时要观察 DOM 是否变化，唯一能做的就是轮询检测，比如使用 setTimeout 或者 setInterval 来定时检测 DOM 是否有改变。这种方式简单粗暴，但是会遇到两个问题：如果时间间隔设置过长，DOM 变化响应不够及时；反过来如果时间间隔设置过短，又会浪费很多无用的工作量去检查 DOM，会让页面变得低效。
* 直到 2000 年的时候引入了 Mutation Event，Mutation Event 采用了观察者的设计模式，当 DOM 有变动时就会立刻触发相应的事件，这种方式属于同步回调。
* 采用 Mutation Event 解决了实时性的问题，因为 DOM 一旦发生变化，就会立即调用 JavaScript 接口。但也正是这种实时性造成了严重的性能问题，因为每次 DOM 变动，渲染引擎都会去调用 JavaScript，这样会产生较大的性能开销。
* 为了解决了 Mutation Event 由于同步调用 JavaScript 而造成的性能问题，从 DOM4 开始，推荐使用 MutationObserver 来代替 Mutation Event。MutationObserver API 可以用来监视 DOM 的变化，包括属性的变化、节点的增减、内容的变化等。
1. MutationObserver 将响应函数改成异步调用，可以不用在每次 DOM 变化都触发异步调用，而是等多次 DOM 变化后，一次触发异步调用，并且还会使用一个数据结构来记录这期间所有的 DOM 变化。这样即使频繁地操纵 DOM，也不会对性能造成太大的影响。
2. 在每次 DOM 节点发生变化的时候，渲染引擎将变化记录封装成微任务，并将微任务添加进当前的微任务队列中。这样当执行到检查点的时候，V8 引擎就会按照顺序执行微任务了。
3. 综上所述， MutationObserver 采用了“异步 + 微任务”的策略。通过异步操作解决了同步操作的性能问题；通过微任务解决了实时性的问题。



## async/await：使用同步的方式去写异步代码
* ES7 引入了 async/await，这是 JavaScript 异步编程的一个重大改进，提供了在不阻塞主线程的情况下使用同步代码实现异步访问资源的能力，并且使得代码逻辑更加清晰。
* async 是一个通过异步执行并隐式返回 Promise 作为结果的函数。

### 生成器 VS 协程
* 生成器函数是一个带星号函数，而且是可以暂停执行和恢复执行的。
```

function* genDemo() {
    console.log("开始执行第一段")
    yield 'generator 2'

    console.log("开始执行第二段")
    yield 'generator 2'

    console.log("开始执行第三段")
    yield 'generator 2'

    console.log("执行结束")
    return 'generator 2'
}

console.log('main 0')
let gen = genDemo()
console.log(gen.next().value)
console.log('main 1')
console.log(gen.next().value)
console.log('main 2')
console.log(gen.next().value)
console.log('main 3')
console.log(gen.next().value)
console.log('main 4')
执行上面这段代码，观察输出结果，你会发现函数 genDemo 并不是一次执行完的，全局代码和 genDemo 函数交替执行。其实这就是生成器函数的特性，可以暂停执行，也可以恢复执行。




可以看出来协程的四点规则：
1.通过调用生成器函数 genDemo 来创建一个协程 gen，创建之后，gen 协程并没有立即执行。
2.要让 gen 协程执行，需要通过调用 gen.next。
3.当协程正在执行的时候，可以通过 yield 关键字来暂停 gen 协程的执行，并返回主要信息给父协程。
4.如果协程在执行期间，遇到了 return 关键字，那么 JavaScript 引擎会结束当前协程，并将 return 后面的内容返回给父协程。




gen 协程和父协程是在主线程上交互执行的，并不是并发执行的，它们之前的切换是通过 yield 和 gen.next 来配合完成的。
当在 gen 协程中调用了 yield 方法时，JavaScript 引擎会保存 gen 协程当前的调用栈信息，并恢复父协程的调用栈信息。同样，当在父协程中执行 gen.next 时，JavaScript 引擎会保存父协程的调用栈信息，并恢复 gen 协程的调用栈信息。



```
* 一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程，比如当前执行的是 A 协程，要启动 B 协程，那么 A 协程就需要将主线程的控制权交给 B 协程，这就体现在 A 协程暂停执行，B 协程恢复执行；同样，也可以从 B 协程中启动 A 协程。通常，如果从 A 协程启动 B 协程，我们就把 A 协程称为 B 协程的父协程。
* 正如一个进程可以拥有多个线程一样，一个线程也可以拥有多个协程。最重要的是，协程不是被操作系统内核所管理，而完全是由程序所控制（也就是在用户态执行）。这样带来的好处就是性能得到了很大的提升，不会像线程切换那样消耗资源。
```


//foo函数
function* foo() {
    let response1 = yield fetch('https://www.geekbang.org')
    console.log('response1')
    console.log(response1)
    let response2 = yield fetch('https://www.geekbang.org/test')
    console.log('response2')
    console.log(response2)
}

//执行foo函数的代码
let gen = foo()
function getGenPromise(gen) {
    return gen.next().value
}
getGenPromise(gen).then((response) => {
    console.log('response1')
    console.log(response)
    return getGenPromise(gen)
}).then((response) => {
    console.log('response2')
    console.log(response)
})


面我们就来分析下这段代码是如何工作的。
1.首先执行的是let gen = foo()，创建了 gen 协程。
2.然后在父协程中通过执行 gen.next 把主线程的控制权交给 gen 协程。
3.gen 协程获取到主线程的控制权后，就调用 fetch 函数创建了一个 Promise 对象 response1，然后通过 yield 暂停 gen 协程的执行，并将 response1 返回给父协程。
4.父协程恢复执行后，调用 response1.then 方法等待请求结果。
5.等通过 fetch 发起的请求完成之后，会调用 then 中的回调函数，then 中的回调函数拿到结果之后，通过调用 gen.next 放弃主线程的控制权，将控制权交 gen 协程继续执行下个请求。




```
* 通常，我们把执行生成器的代码封装成一个函数，并把这个执行生成器代码的函数称为执行器（可参考著名的 co 框架），如下面这种方式：
```


function* foo() {
    let response1 = yield fetch('https://www.geekbang.org')
    console.log('response1')
    console.log(response1)
    let response2 = yield fetch('https://www.geekbang.org/test')
    console.log('response2')
    console.log(response2)
}
co(foo());


```

## Chrome开发者工具：利用网络面板做性能分析

### 单个资源的时间线
* 我们介绍过发起一个 HTTP 请求之后，浏览器首先查找缓存，如果缓存没有命中，那么继续发起 DNS 请求获取 IP 地址，然后利用 IP 地址和服务器端建立 TCP 连接，再发送 HTTP 请求，等待服务器响应；不过，如果服务器响应头中包含了重定向的信息，那么整个流程就需要重新再走一遍。这就是在浏览器中一个 HTTP 请求的基础流程。
* 当浏览器发起一个请求的时候，会有很多原因导致该请求不能被立即执行，而是需要排队等待。导致请求处于排队状态的原因有很多。
1. 首先，页面中的资源是有优先级的，比如 CSS、HTML、JavaScript 等都是页面中的核心文件，所以优先级最高；而图片、视频、音频这类资源就不是核心资源，优先级就比较低。通常当后者遇到前者时，就需要“让路”，进入待排队状态。
2. 其次，我们前面也提到过，浏览器会为每个域名最多维护 6 个 TCP 连接，如果发起一个 HTTP 请求时，这 6 个 TCP 连接都处于忙碌状态，那么这个请求就会处于排队状态
3. 最后，网络进程在为数据分配磁盘空间时，新的 HTTP 请求也需要短暂地等待磁盘分配结束。
* 等待排队完成之后，就要进入发起连接的状态了。不过在发起连接之前，还有一些原因可能导致连接过程被推迟，这个推迟就表现在面板中的 Stalled 上，它表示停滞的意思。
* 这里需要额外说明的是，如果你使用了代理服务器，还会增加一个 Proxy Negotiation 阶段，也就是代理协商阶段，它表示代理服务器连接协商所用的时间。
* 接下来，就到了 Initial connection/SSL 阶段了，也就是和服务器建立连接的阶段，这包括了建立 TCP 连接所花费的时间；不过如果你使用了 HTTPS 协议，那么还需要一个额外的 SSL 握手时间，这个过程主要是用来协商一些加密信息的。
* 和服务器建立好连接之后，网络进程会准备请求数据，并将其发送给网络，这就是 Request sent 阶段。通常这个阶段非常快，因为只需要把浏览器缓冲区的数据发送出去就结束了，并不需要判断服务器是否接收到了，所以这个时间通常不到 1 毫秒。
* 数据发送出去了，接下来就是等待接收服务器第一个字节的数据，这个阶段称为 Waiting (TTFB)，通常也称为“第一字节时间”。 TTFB 是反映服务端响应速度的重要指标，对服务器来说，TTFB 时间越短，就说明服务器响应越快。
* 接收到第一个字节之后，进入陆续接收完整数据的阶段，也就是 Content Download 阶段，这意味着从第一字节时间到接收到全部响应数据所用的时间。
### 优化时间线上耗时项
* 排队（Queuing）时间过久
1. 排队时间过久，大概率是由浏览器为每个域名最多维护 6 个连接导致的。那么基于这个原因，你就可以让 1 个站点下面的资源放在多个域名下面，比如放到 3 个域名下面，这样就可以同时支持 18 个连接了，这种方案称为域名分片技术。
2. 还可以把站点升级到 HTTP2，因为 HTTP2 已经没有每个域名最多维护 6 个 TCP 连接的限制了。
* 第一字节时间（TTFB）时间过久，这可能的原因有如下：
1. 服务器生成页面数据的时间过久。对于动态网页来说，服务器收到用户打开一个页面的请求时，首先要从数据库中读取该页面需要的数据，然后把这些数据传入到模板中，模板渲染后，再返回给用户。服务器在处理这个数据的过程中，可能某个环节会出问题。
2. 网络的原因。比如使用了低带宽的服务器，或者本来用的是电信的服务器，可联通的网络用户要来访问你的服务器，这样也会拖慢网速。
3. 发送请求头时带上了多余的用户信息。比如一些不必要的 Cookie 信息，服务器接收到这些 Cookie 信息之后可能需要对每一项都做处理，这样就加大了服务器的处理时长
* Content Download 时间过久
1. 如果单个请求的 Content Download 花费了大量时间，有可能是字节数太多的原因导致的。这时候你就需要减少文件大小，比如压缩、去掉源码中不必要的注释等方法。




##  DOM树：JavaScript是如何影响DOM树构建的？

### 什么是 DOM
* 在渲染引擎中，DOM 有三个层面的作用。
1. 从页面的视角来看，DOM 是生成页面的基础数据结构。
2. 从 JavaScript 脚本视角来看，DOM 提供给 JavaScript 脚本操作的接口，通过这套接口，JavaScript 可以对 DOM 结构进行访问，从而改变文档的结构、样式和内容
3. 从安全视角来看，DOM 是一道安全防护线，一些不安全的内容在 DOM 解析阶段就被拒之门外了。
### DOM 树如何生成
* 在渲染引擎内部，有一个叫 HTML 解析器（HTMLParser）的模块，它的职责就是负责将 HTML 字节流转换为 DOM 结构。
* HTML 解析器并不是等整个文档加载完成之后再解析的，而是网络进程加载了多少数据，HTML 解析器便解析多少数据。
* 网络进程接收到响应头之后，会根据响应头中的 content-type 字段来判断文件的类型，比如 content-type 的值是“text/html”，那么浏览器就会判断这是一个 HTML 类型的文件，然后为该请求选择或者创建一个渲染进程。渲染进程准备好之后，网络进程和渲染进程之间会建立一个共享数据的管道，网络进程接收到数据后就往这个管道里面放，而渲染进程则从管道的另外一端不断地读取数据，并同时将读取的数据“喂”给 HTML 解析器。你可以把这个管道想象成一个“水管”，网络进程接收到的字节流像水一样倒进这个“水管”，而“水管”的另外一端是渲染进程的 HTML 解析器，它会动态接收字节流，并将其解析为 DOM。
* 字节流转换为 DOM 需要三个阶段：
1. 第一个阶段，通过分词器将字节流转换为 Token。V8 编译 JavaScript 过程中的第一步是做词法分析，将 JavaScript 先分解为一个个 Token。解析 HTML 也是一样的，需要通过分词器先将字节流转换为一个个 Token，分为 Tag Token 和文本 Token。
Tag Token 又分 StartTag 和 EndTag，比如<body>就是 StartTag ，</body>就是EndTag。
* 至于后续的第二个和第三个阶段是同步进行的，需要将 Token 解析为 DOM 节点，并将 DOM 节点添加到 DOM 树中。
* HTML 解析器维护了一个 Token 栈结构，该 Token 栈主要用来计算节点之间的父子关系，在第一个阶段中生成的 Token 会被按照顺序压到这个栈中。具体的处理规则如下所示：
1. 如果压入到栈中的是 StartTag Token，HTML 解析器会为该 Token 创建一个 DOM 节点，然后将该节点加入到 DOM 树中，它的父节点就是栈中相邻的那个元素生成的节点。
2. 如果分词器解析出来是文本 Token，那么会生成一个文本节点，然后将该节点加入到 DOM 树中，文本 Token 是不需要压入到栈中，它的父节点就是当前栈顶 Token 所对应的 DOM 节点。
3. 如果分词器解析出来的是 EndTag 标签，比如是 EndTag div，HTML 解析器会查看 Token 栈顶的元素是否是 StarTag div，如果是，就将 StartTag  div 从栈中弹出，表示该 div 元素解析完成。
* 通过分词器产生的新 Token 就这样不停地压栈和出栈，整个解析过程就这样一直持续下去，直到分词器将所有字节流分词完成。
* 为了更加直观地理解整个过程，下面我们结合一段 HTML 代码（如下），来一步步分析 DOM 树的生成过程。
```

<html>
<body>
    <div>1</div>
    <div>test</div>
</body>
</html>


这段代码以字节流的形式传给了 HTML 解析器，经过分词器处理，解析出来的第一个 Token 是 StartTag html，解析出来的 Token 会被压入到栈中，并同时创建一个 html 的 DOM 节点，将其加入到 DOM 树中。

HTML 解析器开始工作时，会默认创建了一个根为 document 的空 DOM 结构，同时会将一个 StartTag document 的 Token 压入栈底。然后经过分词器解析出来的第一个 StartTag html Token 会被压入到栈中，并创建一个 html 的 DOM 节点，添加到 document 上

然后按照同样的流程解析出来 StartTag body 和 StartTag div，

接下来解析出来的是第一个 div 的文本 Token，渲染引擎会为该 Token 创建一个文本节点，并将该 Token 添加到 DOM 中，它的父节点就是当前 Token 栈顶元素对应的节点

再接下来，分词器解析出来第一个 EndTag div，这时候 HTML 解析器会去判断当前栈顶的元素是否是 StartTag div，如果是则从栈顶弹出 StartTag div

不过在实际生产环境中，HTML 源文件中既包含 CSS 和 JavaScript，又包含图片、音频、视频等文件，所以处理过程远比上面这个示范 Demo 复杂。
```
### JavaScript 是如何影响 DOM 生成的
```

<html>
<body>
    <div>1</div>
    <script>
    let div1 = document.getElementsByTagName('div')[0]
    div1.innerText = 'time.geekbang'
    </script>
    <div>test</div>
</body>
</html>



在两段 div 中间插入了一段 JavaScript 脚本，这段脚本的解析过程就有点不一样了。<script>标签之前，所有的解析流程还是和之前介绍的一样，但是解析到<script>标签时，渲染引擎判断这是一段脚本，此时 HTML 解析器就会暂停 DOM 的解析，因为接下来的 JavaScript 可能要修改当前已经生成的 DOM 结构。

这时候 HTML 解析器暂停工作，JavaScript 引擎介入，并执行 script 标签中的这段脚本，因为这段 JavaScript 脚本修改了 DOM 中第一个 div 中的内容，所以执行这段脚本之后，div 节点内容已经修改为 time.geekbang 了。脚本执行完成之后，HTML 解析器恢复解析过程，继续解析后续的内容，直至生成最终的 DOM。






//foo.js
let div1 = document.getElementsByTagName('div')[0]
div1.innerText = 'time.geekbang'

<html>
<body>
    <div>1</div>
    <script type="text/javascript" src='foo.js'></script>
    <div>test</div>
</body>
</html>

这段代码的功能还是和前面那段代码是一样的，不过这里把内嵌 JavaScript 脚本修改成了通过 JavaScript 文件加载。其整个执行流程还是一样的，执行到 JavaScript 标签时，暂停整个 DOM 的解析，执行 JavaScript 代码，不过这里执行 JavaScript 时，需要先下载这段 JavaScript 代码。

这里需要重点关注下载环境，因为 JavaScript 文件的下载过程会阻塞 DOM 解析，而通常下载又是非常耗时的，会受到网络环境、JavaScript 文件大小等因素的影响。

不过 Chrome 浏览器做了很多优化，其中一个主要的优化是预解析操作。当渲染引擎收到字节流之后，会开启一个预解析线程，用来分析 HTML 文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件。




再回到 DOM 解析上，我们知道引入 JavaScript 线程会阻塞 DOM，不过也有一些相关的策略来规避，比如使用 CDN 来加速 JavaScript 文件的加载，压缩 JavaScript 文件的体积。另外，如果 JavaScript 文件中没有操作 DOM 相关代码，就可以将该 JavaScript 脚本设置为异步加载，通过 async 或 defer 来标记代码，使用方式如下所示：


<script async type="text/javascript" src='foo.js'></script>

<script defer type="text/javascript" src='foo.js'></script>


async 和 defer 虽然都是异步的，不过还有一些差异，使用 async 标志的脚本文件一旦加载完成，会立即执行；
而使用了 defer 标记的脚本文件，需要在 DOMContentLoaded 事件之前执行。










现在我们知道了 JavaScript 是如何阻塞 DOM 解析的了，那接下来我们再来结合文中代码看看另外一种情况：


//theme.css
div {color:blue}


<html>
    <head>
        <style src='theme.css'></style>
    </head>
<body>
    <div>1</div>
    <script>
            let div1 = document.getElementsByTagName('div')[0]
            div1.innerText = 'time.geekbang' //需要DOM
            div1.style.color = 'red'  //需要CSSOM
        </script>
    <div>test</div>
</body>
</html>

该示例中，JavaScript 代码出现了 div1.style.color = ‘red' 的语句，它是用来操纵 CSSOM 的，所以在执行 JavaScript 之前，需要先解析 JavaScript 语句之上所有的 CSS 样式。所以如果代码里引用了外部的 CSS 文件，那么在执行 JavaScript 之前，还需要等待外部的 CSS 文件下载完成，并解析生成 CSSOM 对象之后，才能执行 JavaScript 脚本。

而 JavaScript 引擎在解析 JavaScript 之前，是不知道 JavaScript 是否操纵了 CSSOM 的，所以渲染引擎在遇到 JavaScript 脚本时，不管该脚本是否操纵了 CSSOM，都会执行 CSS 文件下载，解析操作，再执行 JavaScript 脚本。

所以说 JavaScript 脚本是依赖样式表的，这又多了一个阻塞过程。JavaScript 会阻塞 DOM 生成，而样式文件又会阻塞 JavaScript 的执行。


```

## 渲染流水线：CSS如何影响首次加载时的白屏时间？

### 渲染流水线视角下的 CSS
```

//theme.css
div{ 
    color : coral;
    background-color:black
}

<html>
<head>
    <link href="theme.css" rel="stylesheet">
</head>
<body>
    <div>geekbang com</div>
</body>
</html>


首先是发起主页面的请求，这个发起请求方可能是渲染进程，也有可能是浏览器进程，发起的请求被送到网络进程中去执行。
网络进程接收到返回的 HTML 数据之后，将其发送给渲染进程，渲染进程会解析 HTML 数据并构建 DOM。
这里你需要特别注意下，请求 HTML 数据和构建 DOM 中间有一段空闲时间，这个空闲时间有可能成为页面渲染的瓶颈。


当渲染进程接收 HTML 文件字节流时，会先开启一个预解析线程，如果遇到 JavaScript 文件或者 CSS 文件，那么预解析线程会提前下载这些数据。对于上面的代码，预解析线程会解析出来一个外部的 theme.css 文件，并发起 theme.css 的下载。
这里也有一个空闲时间需要你注意一下，就是在 DOM 构建结束之后、theme.css 文件还未下载完成的这段时间内，渲染流水线无事可做，因为下一步是合成布局树，而合成布局树需要 CSSOM 和 DOM，所以这里需要等待 CSS 加载结束并解析成 CSSOM。

```
#### 那渲染流水线为什么需要 CSSOM 呢？
* 和 HTML 一样，渲染引擎也是无法直接理解 CSS 文件内容的，所以需要将其解析成渲染引擎能够理解的结构，这个结构就是 CSSOM。
* 和 DOM 一样，CSSOM 也具有两个作用，第一个是提供给 JavaScript 操作样式表的能力，第二个是为布局树的合成提供基础的样式信息。这个 CSSOM 体现在 DOM 中就是document.styleSheets。
* 等 DOM 和 CSSOM 都构建好之后，渲染引擎就会构造布局树。布局树的结构基本上就是复制 DOM 树的结构，不同之处在于 DOM 树中那些不需要显示的元素会被过滤掉，如 display:none 属性的元素、head 标签、script 标签等。
* 复制好基本的布局树结构之后，渲染引擎会为对应的 DOM 元素选择对应的样式信息，这个过程就是样式计算。
* 样式计算完成之后，渲染引擎还需要计算布局树中每个元素对应的几何位置，这个过程就是计算布局。
* 通过样式计算和计算布局就完成了最终布局树的构建。再之后，就该进行后续的绘制操作了。

```

//theme.css
div{ 
    color : coral;
    background-color:black
}

<html>
<head>
    <link href="theme.css" rel="stylesheet">
</head>
<body>
    <div>geekbang com</div>
    <script>
        console.log('time.geekbang.org')
    </script>
    <div>geekbang com</div>
</body>
</html>


在解析 DOM 的过程中，如果遇到了 JavaScript 脚本，那么需要先暂停 DOM 解析去执行 JavaScript，因为 JavaScript 有可能会修改当前状态下的 DOM。
不过在执行 JavaScript 脚本之前，如果页面中包含了外部 CSS 文件的引用，或者通过 style 标签内置了 CSS 内容，那么渲染引擎还需要将这些内容转换为 CSSOM，因为 JavaScript 有修改 CSSOM 的能力，所以在执行 JavaScript 之前，还需要依赖 CSSOM。
也就是说 CSS 在部分情况下也会阻塞 DOM 的生成。







//theme.css
div{ 
    color : coral;
    background-color:black
}

//foo.js
console.log('time.geekbang.org')

<html>
<head>
    <link href="theme.css" rel="stylesheet">
</head>
<body>
    <div>geekbang com</div>
    <script src='foo.js'></script>
    <div>geekbang com</div>
</body>
</html>

在接收到 HTML 数据之后的预解析过程中，HTML 预解析器识别出来了有 CSS 文件和 JavaScript 文件需要下载，然后就同时发起这两个文件的下载请求，需要注意的是，这两个文件的下载过程是重叠的，所以下载时间按照最久的那个文件来算。

后面的流水线就和前面是一样的了，不管 CSS 文件和 JavaScript 文件谁先到达，都要先等到 CSS 文件下载完成并生成 CSSOM，然后再执行 JavaScript 脚本，最后再继续构建 DOM，构建布局树，绘制页面。


```
### 影响页面展示的因素以及优化策略
* 为什么要花这么多文字来分析渲染流水线呢？主要原因就是渲染流水线影响到了首次页面展示的速度，而首次页面展示的速度又直接影响到了用户体验
* 从发起 URL 请求开始，到首次显示页面的内容，在视觉上经历的三个阶段。
1. 第一个阶段，等请求发出去之后，到提交数据阶段，这时页面展示出来的还是之前页面的内容。
2. 第二个阶段，提交数据之后渲染进程会创建一个空白页面，我们通常把这段时间称为解析白屏，并等待 CSS 文件和 JavaScript 文件的加载完成，生成 CSSOM 和 DOM，然后合成布局树，最后还要经过一系列的步骤准备首次渲染。
3. 第三个阶段，等首次渲染完成之后，就开始进入完整页面的生成阶段了，然后页面会一点点被绘制出来。
* 影响第一个阶段的因素主要是网络或者是服务器处理这块儿,
* 第二个阶段，这个阶段的主要问题是白屏时间，通常情况下的瓶颈主要体现在下载 CSS 文件、下载 JavaScript 文件和执行 JavaScript。所以要想缩短白屏时长，可以有以下策略：
1. 通过内联 JavaScript、内联 CSS 来移除这两种类型的文件下载，这样获取到 HTML 文件之后就可以直接开始渲染流程了。
2. 并不是所有的场合都适合内联，那么还可以尽量减少文件大小，比如通过 webpack 等工具移除一些不必要的注释，并压缩 JavaScript 文件。
3. 还可以将一些不需要在解析 HTML 阶段使用的 JavaScript 标记上 async 或者 defer。
4. 对于大的 CSS 文件，可以通过媒体查询属性，将其拆分为多个不同用途的 CSS 文件，这样只有在特定的场景下才会加载特定的 CSS 文件。

## 分层和合成机制：为什么CSS动画比JavaScript高效？

### 显示器是怎么显示图像的
* 每个显示器都有固定的刷新频率，通常是 60HZ，也就是每秒更新 60 张图片，更新的图片都来自于显卡中一个叫前缓冲区的地方，显示器所做的任务很简单，就是每秒固定读取 60 次前缓冲区中的图像，并将读取的图像显示到显示器上。
* 显卡的职责就是合成新的图像，并将图像保存到后缓冲区中，一旦显卡把合成的图像写到后缓冲区，系统就会让后缓冲区和前缓冲区互换，这样就能保证显示器能读取到最新显卡合成的图像。通常情况下，显卡的更新频率和显示器的刷新频率是一致的。但有时候，在一些复杂的场景中，显卡处理一张图片的速度会变慢，这样就会造成视觉上的卡顿。
### 帧 VS 帧率
* 当你通过滚动条滚动页面，或者通过手势缩放页面时，屏幕上就会产生动画的效果。之所以你能感觉到有动画的效果，是因为在滚动或者缩放操作时，渲染引擎会通过渲染流水线生成新的图片，并发送到显卡的后缓冲区。
* 大多数设备屏幕的更新频率是 60 次 / 秒，这也就意味着正常情况下要实现流畅的动画效果，渲染引擎需要每秒更新 60 张图片到显卡的后缓冲区。
* 我们把渲染流水线生成的每一副图片称为一帧，把渲染流水线每秒更新了多少帧称为帧率，比如滚动过程中 1 秒更新了 60 帧，那么帧率就是 60Hz（或者 60FPS）
* 由于用户很容易观察到那些丢失的帧，如果在一次动画过程中，渲染引擎生成某些帧的时间过久，那么用户就会感受到卡顿，这会给用户造成非常不好的印象。
* 要解决卡顿问题，就要解决每帧生成时间过久的问题，为此 Chrome 对浏览器渲染方式做了大量的工作，其中最卓有成效的策略就是引入了分层和合成机制。
### 如何生成一帧图像
* 重排、重绘和合成这三种方式的渲染路径是不同的，通常渲染路径越长，生成图像花费的时间就越多。
1. 比如重排，它需要重新根据 CSSOM 和 DOM 来计算布局树，这样生成一幅图片时，会让整个渲染流水线的每个阶段都执行一遍，如果布局复杂的话，就很难保证渲染的效率了。
2. 而重绘因为没有了重新布局的阶段，操作效率稍微高点，但是依然需要重新计算绘制信息，并触发绘制操作之后的一系列操作。
3. 相较于重排和重绘，合成操作的路径就显得非常短了，并不需要触发布局和绘制两个阶段，如果采用了 GPU，那么合成的效率会非常高。
* 所以，关于渲染引擎生成一帧图像的几种方式，按照效率我们推荐合成方式优先，若实在不能满足需求，那么就再退后一步使用重绘或者重排的方式。
* Chrome 中的合成技术，可以用三个词来概括总结：分层、分块和合成。
### 分层和合成
* 通常页面的组成是非常复杂的，有的页面里要实现一些复杂的动画效果，如果没有采用分层机制，从布局树直接生成目标图片的话，那么每次页面有很小的变化时，都会触发重排或者重绘机制，这种“牵一发而动全身”的绘制策略会严重影响页面的渲染效率。
* 为了提升每帧的渲染效率，Chrome 引入了分层和合成的机制。那该怎么来理解分层和合成机制呢？
1. 你可以把一张网页想象成是由很多个图片叠加在一起的，每个图片就对应一个图层，Chrome 合成器最终将这些图层合成了用于显示页面的图片。
2. 如果你熟悉 PhotoShop 的话，就能很好地理解这个过程了，PhotoShop 中一个项目是由很多图层构成的，每个图层都可以是一张单独图片，可以设置透明度、边框阴影，可以旋转或者设置图层的上下位置，将这些图层叠加在一起后，就能呈现出最终的图片了。
3. 在这个过程中，将素材分解为多个图层的操作就称为分层，最后将这些图层合并到一起的操作就称为合成。所以，分层和合成通常是一起使用的。
4. 考虑到一个页面被划分为两个层，当进行到下一帧的渲染时，上面的一帧可能需要实现某些变换，如平移、旋转、缩放、阴影或者 Alpha 渐变，这时候合成器只需要将两个层进行相应的变化操作就可以了，显卡处理这些操作驾轻就熟，所以这个合成过程时间非常短。
* 理解了为什么要引入合成和分层机制，下面我们再来看看 Chrome 是怎么实现分层和合成机制的。
1. 在 Chrome 的渲染流水线中，分层体现在生成布局树之后，渲染引擎会根据布局树的特点将其转换为层树（Layer Tree），层树是渲染流水线后续流程的基础结构。
2. 层树中的每个节点都对应着一个图层，下一步的绘制阶段就依赖于层树中的节点。
3. 绘制阶段其实并不是真正地绘出图片，而是将绘制指令组合成一个列表，比如一个图层要设置的背景为黑色，并且还要在中间画一个圆形，那么绘制过程会生成|Paint BackGroundColor:Black | Paint Circle|这样的绘制指令列表，绘制过程就完成了。
4. 有了绘制列表之后，就需要进入光栅化阶段了，光栅化就是按照绘制列表中的指令生成图片。每一个图层都对应一张图片，合成线程有了这些图片之后，会将这些图片合成为“一张”图片，并最终将生成的图片发送到后缓冲区。这就是一个大致的分层、合成流程。
5. 合成操作是在合成线程上完成的，这也就意味着在执行合成操作时，是不会影响到主线程执行的。这就是为什么经常主线程卡住了，但是 CSS 动画依然能执行的原因。
### 分块
* 如果说分层是从宏观上提升了渲染效率，那么分块则是从微观层面提升了渲染效率。
* 通常情况下，页面的内容都要比屏幕大得多，显示一个页面时，如果等待所有的图层都生成完毕，再进行合成的话，会产生一些不必要的开销，也会让合成图片的时间变得更久。
* 因此，合成线程会将每个图层分割为大小固定的图块，然后优先绘制靠近视口的图块，这样就可以大大加速页面的显示速度。不过有时候， 即使只绘制那些优先级最高的图块，也要耗费不少的时间，因为涉及到一个很关键的因素——纹理上传，这是因为从计算机内存上传到 GPU 内存的操作会比较慢。
* 为了解决这个问题，Chrome 又采取了一个策略：在首次合成图块的时候使用一个低分辨率的图片。比如可以是正常分辨率的一半，分辨率减少一半，纹理就减少了四分之三。在首次显示页面内容的时候，将这个低分辨率的图片显示出来，然后合成器继续绘制正常比例的网页内容，当正常比例的网页内容绘制完成后，再替换掉当前显示的低分辨率内容。这种方式尽管会让用户在开始时看到的是低分辨率的内容，但是也比用户在开始时什么都看不到要好。
### 如何利用分层技术优化代码
* 你可以使用 will-change 来告诉渲染引擎你会对该元素做一些特效变换，CSS 代码如下：
```

.box {
will-change: transform, opacity;
}

这段代码就是提前告诉渲染引擎 box 元素将要做几何变换和透明度变换操作，这时候渲染引擎会将该元素单独实现一帧，
等这些变换发生时，渲染引擎会通过合成线程直接去处理变换，这些变换并没有涉及到主线程，这样就大大提升了渲染的效率。
这也是 CSS 动画比 JavaScript 动画高效的原因。


```
* 所以，如果涉及到一些可以使用合成线程来处理 CSS 特效或者动画的情况，就尽量使用 will-change 来提前告诉渲染引擎，让它为该元素准备独立的层。但是凡事都有两面性，每当渲染引擎为一个元素准备一个独立层的时候，它占用的内存也会大大增加，因为从层树开始，后续每个阶段都会多一个层结构，这些都需要额外的内存，所以你需要恰当地使用 will-change。

## 页面性能：如何系统地优化页面？
* 通常一个页面有三个阶段：加载阶段、交互阶段和关闭阶段。
1. 加载阶段，是指从发出请求到渲染出完整页面的过程，影响到这个阶段的主要因素有网络和 JavaScript 脚本。
2. 交互阶段，主要是从页面加载完成到用户交互的整合过程，影响到这个阶段的主要因素是 JavaScript 脚本。
3. 关闭阶段，主要是用户发出关闭指令后页面所做的一些清理操作。
### 加载阶段
* 图片、音频、视频等文件就不会阻塞页面的首次渲染；而 JavaScript、首次请求的 HTML 资源文件、CSS 文件是会阻塞首次渲染的，因为在构建 DOM 的过程中需要 HTML 和 JavaScript 文件，在构造渲染树的过程中需要用到 CSS 文件。
* 我们把这些能阻塞网页首次渲染的资源称为关键资源。基于关键资源，我们可以继续细化出来三个影响页面首次渲染的核心因素。
1. 第一个是关键资源个数。关键资源个数越多，首次页面的加载时间就会越长。比如上图中的关键资源个数就是 3 个，1 个 HTML 文件、1 个 JavaScript 和 1 个 CSS 文件。
2. 第二个是关键资源大小。通常情况下，所有关键资源的内容越小，其整个资源的下载时间也就越短，那么阻塞渲染的时间也就越短。上图中关键资源的大小分别是 6KB、8KB 和 9KB，那么整个关键资源大小就是 23KB。
3. 第三个是请求关键资源需要多少个 RTT（Round Trip Time）。那什么是 RTT 呢？
当使用 TCP 协议传输一个文件时，比如这个文件大小是 0.1M，由于 TCP 的特性，这个数据并不是一次传输到服务端的，而是需要拆分成一个个数据包来回多次进行传输的。
RTT 就是这里的往返时延。它是网络中一个重要的性能指标，表示从发送端发送数据开始，到发送端收到来自接收端的确认，总共经历的时延。
通常 1 个 HTTP 的数据包在 14KB 左右，所以 1 个 0.1M 的页面就需要拆分成 8 个包来传输了，也就是说需要 8 个 RTT。
```

首先是请求 HTML 资源，大小是 6KB，小于 14KB，所以 1 个 RTT 就可以解决了。
至于 JavaScript 和 CSS 文件，这里需要注意一点，由于渲染引擎有一个预解析的线程，在接收到 HTML 数据之后，预解析线程会快速扫描 HTML 数据中的关键资源，一旦扫描到了，会立马发起请求，你可以认为 JavaScript 和 CSS 是同时发起请求的，所以它们的请求是重叠的，那么计算它们的 RTT 时，只需要计算体积最大的那个数据就可以了。这里最大的是 CSS 文件（9KB），所以我们就按照 9KB 来计算，同样由于 9KB 小于 14KB，所以 JavaScript 和 CSS 资源也就可以算成 1 个 RTT。也就是说，关键资源请求共花费了 2 个 RTT。

```
* 总的优化原则就是减少关键资源个数，降低关键资源大小，降低关键资源的 RTT 次数。
1. 如何减少关键资源的个数？一种方式是可以将 JavaScript 和 CSS 改成内联的形式，比如上图的 JavaScript 和 CSS，若都改成内联模式，那么关键资源的个数就由 3 个减少到了 1 个。另一种方式，如果 JavaScript 代码没有 DOM 或者 CSSOM 的操作，则可以改成 async 或者 defer 属性；同样对于 CSS，如果不是在构建页面之前加载的，则可以添加媒体取消阻止显现的标志。当 JavaScript 标签加上了 async 或者 defer、CSSlink 属性之前加上了取消阻止显现的标志后，它们就变成了非关键资源了。
2. 如何减少关键资源的大小？可以压缩 CSS 和 JavaScript 资源，移除 HTML、CSS、JavaScript 文件中一些注释内容，也可以通过前面讲的取消 CSS 或者 JavaScript 中关键资源的方式。
3. 如何减少关键资源 RTT 的次数？可以通过减少关键资源的个数和减少关键资源的大小搭配来实现。除此之外，还可以使用 CDN 来减少每次 RTT 时长
### 交互阶段
* 如果在计算样式阶段发现有布局信息的修改，那么就会触发重排操作，然后触发后续渲染流水线的一系列操作，这个代价是非常大的。
* 同样如果在计算样式阶段没有发现有布局信息的修改，只是修改了颜色一类的信息，那么就不会涉及到布局相关的调整，所以可以跳过布局阶段，直接进入绘制阶段，这个过程叫重绘。不过重绘阶段的代价也是不小的。
* 还有另外一种情况，通过 CSS 实现一些变形、渐变、动画等特效，这是由 CSS 触发的，并且是在合成线程上执行的，这个过程称为合成。因为它不会触发重排或者重绘，而且合成操作本身的速度就非常快，所以执行合成是效率最高的方式。
* 分析下在交互阶段渲染流水线中有哪些因素影响了帧的生成速度以及如何去优化。
1. 减少 JavaScript 脚本执行时间，针对这种情况我们可以采用以下两种策略：一种是将一次执行的函数分解为多个任务，使得每次的执行时间不要过久。另一种是采用 Web Workers。你可以把 Web Workers 当作主线程之外的一个线程，在 Web Workers 中是可以执行 JavaScript 脚本的，不过 Web Workers 中没有 DOM、CSSOM 环境，这意味着在 Web Workers 中是无法通过 JavaScript 来访问 DOM 的，所以我们可以把一些和 DOM 操作无关且耗时的任务放到 Web Workers 中去执行。
2. 避免强制同步布局
所谓强制同步布局，是指 JavaScript 强制将计算样式和布局操作提前到当前的任务中。
```

<html>
<body>
    <div id="mian_div">
        <li id="time_li">time</li>
        <li>geekbang</li>
    </div>

    <p id="demo">强制布局demo</p>
    <button onclick="foo()">添加新元素</button>

    <script>
        function foo() {
            let main_div = document.getElementById("mian_div")      
            let new_node = document.createElement("li")
            let textnode = document.createTextNode("time.geekbang")
            new_node.appendChild(textnode);
            document.getElementById("mian_div").appendChild(new_node);
        }
    </script>
</body>
</html>

执行 JavaScript 添加元素是在一个任务中执行的，重新计算样式布局是在另外一个任务中执行，这就是正常情况下的布局操作。






function foo() {
    let main_div = document.getElementById("mian_div")
    let new_node = document.createElement("li")
    let textnode = document.createTextNode("time.geekbang")
    new_node.appendChild(textnode);
    document.getElementById("mian_div").appendChild(new_node);
    //由于要获取到offsetHeight，
    //但是此时的offsetHeight还是老的数据，
    //所以需要立即执行布局操作
    console.log(main_div.offsetHeight)
}

将新的元素添加到 DOM 之后，我们又调用了main_div.offsetHeight来获取新 main_div 的高度信息。
如果要获取到 main_div 的高度，就需要重新布局，所以这里在获取到 main_div 的高度之前，JavaScript 还需要强制让渲染引擎默认执行一次布局操作。
我们把这个操作称为强制同步布局。

```
3.  避免布局抖动
所谓布局抖动，是指在一次 JavaScript 执行过程中，多次执行强制布局和抖动操作。
```

function foo() {
    let time_li = document.getElementById("time_li")
    for (let i = 0; i < 100; i++) {
        let main_div = document.getElementById("mian_div")
        let new_node = document.createElement("li")
        let textnode = document.createTextNode("time.geekbang")
        new_node.appendChild(textnode);
        new_node.offsetHeight = time_li.offsetHeight;
        document.getElementById("mian_div").appendChild(new_node);
    }
}

在 foo 函数内部重复执行计算样式和布局，这会大大影响当前函数的执行效率。这种情况的避免方式和强制同步布局一样，都是尽量不要在修改 DOM 结构时再去查询一些相关值。
```
4. 合理利用 CSS 合成动画
合成动画是直接在合成线程上执行的，这和在主线程上执行的布局、绘制等操作不同，如果主线程被 JavaScript 或者一些布局任务占用，CSS 动画依然能继续执行。所以要尽量利用好 CSS 合成动画，如果能让 CSS 处理动画，就尽量交给 CSS 来操作。
另外，如果能提前知道对某个元素执行动画操作，那就最好将其标记为 will-change，这是告诉渲染引擎需要将该元素单独生成一个图层。
5. 避免频繁的垃圾回收
如果在一些函数中频繁创建临时对象，那么垃圾回收器也会频繁地去执行垃圾回收策略。这样当垃圾回收操作发生时，就会占用主线程，从而影响到其他任务的执行，严重的话还会让用户产生掉帧、不流畅的感觉。












## 虚拟DOM：虚拟DOM和实际的DOM有何不同？

### DOM 的缺陷
* 调用document.body.appendChild(node)往 body 节点上添加一个元素，调用该 API 之后会引发一系列的连锁反应。首先渲染引擎会将 node 节点添加到 body 节点之上，然后触发样式计算、布局、绘制、栅格化、合成等任务，我们把这一过程称为重排。除了重排之外，还有可能引起重绘或者合成操作，形象地理解就是“牵一发而动全身”。另外，对于 DOM 的不当操作还有可能引发强制同步布局和布局抖动的问题，这些操作都会大大降低渲染效率。因此，对于 DOM 的操作我们时刻都需要非常小心谨慎。
* 为 DOM 结构复杂，所生成的页面结构也会很复杂，对于这些复杂的页面，执行一次重排或者重绘操作都是非常耗时的，这就给我们带来了真正的性能问题。
### 什么是虚拟 DOM
* 将页面改变的内容应用到虚拟 DOM 上，而不是直接应用到 DOM 上。
* 变化被应用到虚拟 DOM 上时，虚拟 DOM 并不急着去渲染页面，而仅仅是调整虚拟 DOM 的内部状态，这样操作虚拟 DOM 的代价就变得非常轻了。
* 在虚拟 DOM 收集到足够的改变时，再把这些变化一次性应用到真实的 DOM 上。
### 虚拟 DOM 到底怎么运行的
* 创建阶段。首先依据 JSX 和基础数据创建出来虚拟 DOM，它反映了真实的 DOM 树的结构。然后由虚拟 DOM 树创建出真实 DOM 树，真实的 DOM 树生成完后，再触发渲染流水线往屏幕输出页面。
* 新阶段。如果数据发生了改变，那么就需要根据新的数据创建一个新的虚拟 DOM 树；然后 React 比较两个树，找出变化的地方，并把变化的地方一次性更新到真实的 DOM 树上；最后渲染引擎更新渲染流水线，并生成新的页面。
###  React Fiber 更新机制。
* 最开始的时候，比较两个虚拟 DOM 的过程是在一个递归函数里执行的，其核心算法是 reconciliation。
* 常情况下，这个比较过程执行得很快，不过当虚拟 DOM 比较复杂的时候，执行比较函数就有可能占据主线程比较久的时间，这样就会导致其他任务的等待，造成页面卡顿。
* 为了解决这个问题，React 团队重写了 reconciliation 算法，新的算法称为 Fiber reconciler，之前老的算法称为 Stack reconciler。
* 其实协程的另外一个称呼就是 Fiber，所以在这里我们可以把 Fiber 和协程关联起来，那么所谓的 Fiber reconciler ，就是在执行算法的过程中出让主线程，这样就解决了 Stack reconciler 函数占用时间过久的问题。
#### 双缓存
* 在开发游戏或者处理其他图像的过程中，屏幕从前缓冲区读取数据然后显示。但是很多图形操作都很复杂且需要大量的运算，比如一幅完整的画面，可能需要计算多次才能完成，如果每次计算完一部分图像，就将其写入缓冲区，那么就会造成一个后果，那就是在显示一个稍微复杂点的图像的过程中，你看到的页面效果可能是一部分一部分地显示出来，因此在刷新页面的过程中，会让用户感受到界面的闪烁。
* 而使用双缓存，可以让你先将计算的中间结果存放在另一个缓冲区中，等全部的计算结束，该缓冲区已经存储了完整的图形之后，再将该缓冲区的图形数据一次性复制到显示缓冲区，这样就使得整个图像的输出非常稳定。
* 双缓存是一种经典的思路，应用在很多场合，能解决页面无效刷新和闪屏的问题，虚拟 DOM 就是双缓存思想的一种体现。
#### MVC 模式
* 其核心思想就是将数据和视图分离，也就是说视图和模型之间是不允许直接通信的，它们之间的通信都是通过控制器来完成的。
* 基于 MVC 又能衍生出很多其他的模式，如 MVP、MVVM 等，不过万变不离其宗，它们的基础骨架都是基于 MVC 而来。
* 我们可以把虚拟 DOM 看成是 MVC 的视图部分，其控制器和模型都是由 Redux 提供的。其具体实现过程如下：
1. 控制器是用来监控 DOM 的变化，一旦 DOM 发生变化，控制器便会通知模型，让其更新数据；
2. 模型数据更新好之后，控制器会通知视图，告诉它模型的数据发生了变化；
3. 视图接收到更新消息之后，会根据模型所提供的数据来生成新的虚拟 DOM；
4. 新的虚拟 DOM 生成好之后，就需要与之前的虚拟 DOM 进行比较，找出变化的节点；
5. 比较出变化的节点之后，React 将变化的虚拟节点应用到 DOM 上，这样就会触发 DOM 节点的更新；
6. DOM 节点的变化又会触发后续一系列渲染流水线的变化，从而实现页面的更新





## 渐进式网页应用（PWA）：它究竟解决了Web应用的哪些问题？
* 它是一套理念，渐进式增强 Web 的优势，并通过技术手段渐进式缩短和本地应用或者小程序的距离。
* Web 应用缺少离线使用能力，在离线或者在弱网环境下基本上是无法使用的。而用户需要的是沉浸式的体验，在离线或者弱网环境下能够流畅地使用是用户对一个应用的基本要求。
* Web 应用还缺少了消息推送的能力，因为作为一个 App 厂商，需要有将消息送达到应用的能力。
* Web 应用缺少一级入口，也就是将 Web 应用安装到桌面，在需要的时候直接从桌面打开 Web 应用，而不是每次都需要通过浏览器来打开。
* 针对以上 Web 缺陷，PWA 提出了两种解决方案：通过引入 Service Worker 来试着解决离线存储和消息推送的问题，通过引入 manifest.json 来解决一级入口的问题。
* 另外，PWA 还提供了 manifest.json 配置文件，可以让开发者自定义桌面的图标、显示名称、启动方式等信息，还可以设置启动画面、页面主题颜色等信息。
### 什么是 Service Worker
* 它的主要思想是在页面和网络之间增加一个拦截器，用来缓存和拦截请求。
* 在没有安装 Service Worker 之前，WebApp 都是直接通过网络模块来请求资源的。安装了 Service Worker 模块之后，WebApp 请求资源时，会先通过 Service Worker，让它判断是返回 Service Worker 缓存的资源还是重新去网络请求资源。一切的控制权都交由 Service Worker 来处理。
* 为了避免 JavaScript 过多占用页面主线程时长的情况，浏览器实现了 Web Worker 的功能。Web Worker 的目的是让 JavaScript 能够运行在页面主线程之外，不过由于 Web Worker 中是没有当前页面的 DOM 环境的，所以在 Web Worker 中只能执行一些和 DOM 无关的 JavaScript 脚本，并通过 postMessage 方法将执行的结果返回给主线程。所以说在 Chrome 中， Web Worker 其实就是在渲染进程中开启的一个新线程，它的生命周期是和页面关联的。
* “让其运行在主线程之外”就是 Service Worker 来自 Web Worker 的一个核心思想。不过 Web Worker 是临时的，每次 JavaScript 脚本执行完成之后都会退出，执行结果也不能保存下来，如果下次还有同样的操作，就还得重新来一遍。所以 Service Worker 需要在 Web Worker 的基础之上加上储存功能。
* 由于 Service Worker 还需要会为多个页面提供服务，所以还不能把 Service Worker 和单个页面绑定起来。在目前的 Chrome 架构中，Service Worker 是运行在浏览器进程中的，因为浏览器进程生命周期是最长的，所以在浏览器的生命周期内，能够为所有的页面提供服务。
* 消息推送也是基于 Service Worker 来实现的。因为消息推送时，浏览器页面也许并没有启动，这时就需要 Service Worker 来接收服务器推送的消息，并将消息通过一定方式展示给用户
* HTTP 采用的是明文传输信息，存在被窃听、被篡改和被劫持的风险，在项目中使用 HTTP 来传输数据无疑是“裸奔”。所以在设计之初，就考虑对 Service Worker 采用 HTTPS 协议，因为采用 HTTPS 的通信数据都是经过加密的，即便拦截了数据，也无法破解数据内容，而且 HTTPS 还有校验机制，通信双方很容易知道数据是否被篡改。
* 除了必须要使用 HTTPS，Service Worker 还需要同时支持 Web 页面默认的安全策略、储入同源策略、内容安全策略（CSP）等




## WebComponent：像搭积木一样构建Web应用
* WebComponent 是一套技术的组合，具体涉及到了 Custom elements（自定义元素）、Shadow DOM（影子 DOM）和HTML templates（HTML 模板）
* 要使用 WebComponent，通常要实现下面三个步骤。
1. 首先，使用 template 属性来创建模板。
利用 DOM 可以查找到模板的内容，但是模板元素是不会被渲染到页面上的，也就是说 DOM 树中的 template 节点不会出现在布局树中，所以我们可以使用 template 来自定义一些基础的元素结构，这些基础的元素结构是可以被重复使用的。一般模板定义好之后，我们还需要在模板的内部定义样式信息。
2. 其次，我们需要创建一个类。在该类的构造函数中要完成三件事：查找模板内容；创建影子 DOM；再将模板添加到影子 DOM 上。
影子 DOM 的作用是将模板中的内容与全局 DOM 和 CSS 进行隔离，这样我们就可以实现元素和样式的私有化了。
你可以把影子 DOM 看成是一个作用域，其内部的样式和元素是不会影响到全局的样式和元素的，而在全局环境下，要访问影子 DOM 内部的样式或者元素也是需要通过约定好的接口的。
通过影子 DOM，我们就实现了 CSS 和元素的封装，在创建好封装影子 DOM 的类之后，我们就可以使用 customElements.define 来自定义元素了
3. 最后，就很简单了，可以像正常使用 HTML 元素一样使用该元素
影子 DOM 内部的样式是不会影响到全局 CSSOM 的。另外，使用 DOM 接口也是无法直接查询到影子 DOM 内部元素的，比如你可以使用document.getElementsByTagName('div')来查找所有 div 元素，这时候你会发现影子 DOM 内部的元素都是无法查找的，因为要想查找影子 DOM 内部的元素需要专门的接口，所以通过这种方式又将影子内部的 DOM 和外部的 DOM 进行了隔离。
影子 DOM 的 JavaScript 脚本是不会被隔离的，比如在影子 DOM 定义的 JavaScript 函数依然可以被外部访问，这是因为 JavaScript 语言本身已经可以很好地实现组件化了。
### 浏览器如何实现影子 DOM
* 影子 DOM 的作用主要有以下两点：
1. 影子 DOM 中的元素对于整个网页是不可见的；
2. 影子 DOM 的 CSS 不会影响到整个网页的 CSSOM，影子 DOM 内部的 CSS 只对内部的元素起作用。
* 每个影子 DOM 都有一个 shadow root 的根节点，我们可以将要展示的样式或者元素添加到影子 DOM 的根节点上，每个影子 DOM 你都可以看成是一个独立的 DOM，它有自己的样式、自己的属性，内部样式不会影响到外部样式，外部样式也不会影响到内部样式。




## HTTP/1：HTTP性能优化

### 超文本传输协议 HTTP/0.9
* HTTP/0.9 的实现有以下三个特点。
1. 第一个是只有一个请求行，并没有 HTTP 请求头和请求体，因为只需要一个请求行就可以完整表达客户端的需求了。
2. 第二个是服务器也没有返回头信息，这是因为服务器端并不需要告诉客户端太多信息，只需要返回数据就可以了。
3. 第三个是返回的文件内容是以 ASCII 字符流来传输的，因为都是 HTML 格式的文件，所以使用 ASCII 字节码来传输是最合适的。
### 被浏览器推动的 HTTP/1.0
* 浏览器中展示的不单是 HTML 文件了，还包括了 JavaScript、CSS、图片、音频、视频等不同类型的文件。因此支持多种类型的文件下载是 HTTP/1.0 的一个核心诉求，而且文件格式不仅仅局限于 ASCII 编码，还有很多其他类型编码的文件。
* HTTP/1.0 引入了请求头和响应头，它们都是以为 Key-Value 形式保存的，在 HTTP 发送请求时，会带上请求头信息，服务器返回数据时，会先返回响应头信息。
* HTTP/1.0 是怎么通过请求头和响应头来支持多种不同类型的数据呢？
1. 首先，浏览器需要知道服务器返回的数据是什么类型的，然后浏览器才能根据不同的数据类型做针对性的处理。
2. 其次，由于万维网所支持的应用变得越来越广，所以单个文件的数据量也变得越来越大。为了减轻传输性能，服务器会对数据进行压缩后再传输，所以浏览器需要知道服务器压缩的方法。
3. 再次，由于万维网是支持全球范围的，所以需要提供国际化的支持，服务器需要对不同的地区提供不同的语言版本，这就需要浏览器告诉服务器它想要什么语言版本的页面。
4. 最后，由于增加了各种不同类型的文件，而每种文件的编码形式又可能不一样，为了能够准确地读取文件，浏览器需要知道文件的编码类型。
```
HTTP/1.0 的方案是通过请求头和响应头来进行协商，在发起请求时候会通过 HTTP 请求头告诉服务器它期待服务器返回什么类型的文件、采取什么形式的压缩、提供什么语言的文件以及文件的具体编码。
最终发送出来的请求头内容如下：
accept: text/html   表示期望服务器返回 html 类型的文件
accept-encoding: gzip, deflate, br   期望服务器可以采用 gzip、deflate 或者 br 其中的一种压缩方式
accept-Charset: ISO-8859-1,utf-8  期望返回的文件编码是 UTF-8 或者 ISO-8859-1
accept-language: zh-CN,zh  望页面的优先语言是中文。





服务器接收到浏览器发送过来的请求头信息之后，会根据请求头的信息来准备响应数据。
不过有时候会有一些意外情况发生，比如浏览器请求的压缩类型是 gzip，但是服务器不支持 gzip，只支持 br 压缩，那么它会通过响应头中的 content-encoding 字段告诉浏览器最终的压缩类型，也就是说最终浏览器需要根据响应头的信息来处理数据。
下面是一段响应头的数据信息：


content-encoding: br   表示服务器采用了 br 的压缩方法
content-type: text/html; charset=UTF-8   表示服务器返回的是 html 文件，并且该文件的编码类型是 UTF-8



有了响应头的信息，浏览器就会使用 br 方法来解压文件，
再按照 UTF-8 的编码格式来处理原始文件，最后按照 HTML 的方式来解析该文件。
这就是 HTTP/1.0 支持多文件的一个基本的处理流程。
```
* HTTP/1.0 除了对多文件提供良好的支持外，还依据当时实际的需求引入了很多其他的特性，这些特性都是通过请求头和响应头来实现的。
1. 有的请求服务器可能无法处理，或者处理出错，这时候就需要告诉浏览器服务器最终处理该请求的情况，这就引入了状态码。状态码是通过响应行的方式来通知浏览器的。
2. 为了减轻服务器的压力，在 HTTP/1.0 中提供了 Cache 机制，用来缓存已经下载过的数据。
3. 服务器需要统计客户端的基础信息，比如 Windows 和 macOS 的用户数量分别是多少，所以 HTTP/1.0 的请求头中还加入了用户代理的字段。
### 缝缝补补的 HTTP/1.1
* 改进持久连接
1. HTTP/1.0 每进行一次 HTTP 通信，都需要经历建立 TCP 连接、传输 HTTP 数据和断开 TCP 连接三个阶段
2. 随着浏览器普及，单个页面中的图片文件越来越多，有时候一个页面可能包含了几百个外部引用的资源文件，如果在下载每个文件的时候，都需要经历建立 TCP 连接、传输数据和断开连接这样的步骤，无疑会增加大量无谓的开销。
为了解决这个问题，HTTP/1.1 中增加了持久连接的方法，它的特点是在一个 TCP 连接上可以传输多个 HTTP 请求，只要浏览器或者服务器没有明确断开连接，那么该 TCP 连接会一直保持。
3. HTTP 的持久连接可以有效减少 TCP 建立连接和断开连接的次数，这样的好处是减少了服务器额外的负担，并提升整体 HTTP 的请求时长。
4. 持久连接在 HTTP/1.1 中是默认开启的，所以你不需要专门为了持久连接去 HTTP 请求头设置信息，如果你不想要采用持久连接，可以在 HTTP 请求头中加上Connection: close。
5. 目前浏览器中对于同一个域名，默认允许同时建立 6 个 TCP 持久连接。
* 不成熟的 HTTP 管线化
1. 持久连接虽然能减少 TCP 的建立和断开次数，但是它需要等待前面的请求返回之后，才能进行下一次请求。
如果 TCP 通道中的某个请求因为某些原因没有及时返回，那么就会阻塞后面的所有请求，这就是著名的队头阻塞的问题。
2. HTTP/1.1 中试图通过管线化的技术来解决队头阻塞的问题。HTTP/1.1 中的管线化是指将多个 HTTP 请求整批提交给服务器的技术，虽然可以整批发送请求，不过服务器依然需要根据请求顺序来回复浏览器的请求。
FireFox、Chrome 都做过管线化的试验，但是由于各种原因，它们最终都放弃了管线化技术。
* 提供虚拟主机的支持
1. 在 HTTP/1.0 中，每个域名绑定了一个唯一的 IP 地址，因此一个服务器只能支持一个域名。但是随着虚拟主机技术的发展，需要实现在一台物理主机上绑定多个虚拟主机，每个虚拟主机都有自己的单独的域名，这些单独的域名都公用同一个 IP 地址。
2. HTTP/1.1 的请求头中增加了 Host 字段，用来表示当前的域名地址，这样服务器就可以根据不同的 Host 值做不同的处理。
* 对动态生成的内容提供了完美支持
1. 在设计 HTTP/1.0 时，需要在响应头中设置完整的数据大小，如Content-Length: 901，这样浏览器就可以根据设置的数据大小来接收数据。
2. 随着服务器端的技术发展，很多页面的内容都是动态生成的，因此在传输数据之前并不知道最终的数据大小，这就导致了浏览器不知道何时会接收完所有的文件数据。
3. HTTP/1.1 通过引入 Chunk transfer 机制来解决这个问题，服务器会将数据分割成若干个任意大小的数据块，每个数据块发送时会附上上个数据块的长度，最后使用一个零长度的块作为发送数据完成的标志。这样就提供了对动态内容的支持。
* 客户端 Cookie、安全机制
1. HTTP/1.1 还引入了客户端 Cookie 机制和安全机制。

## HTTP/2：如何提升网络速度？
* HTTP/1.1 为网络效率做了大量的优化，最核心的有如下三种方式：
1. 增加了持久连接；
2. 浏览器为每个域名最多同时维护 6 个 TCP 持久连接；
3. 使用 CDN 的实现域名分片机制。
引入了 CDN，并同时为每个域名维护 6 个连接，这样就大大减轻了整个资源的下载时间。
这里我们可以简单计算下：如果使用单个 TCP 的持久连接，下载 100 个资源所花费的时间为 100 * n * RTT；
若通过上面的技术，就可以把整个时间缩短为 100 * n * RTT/(6 * CDN 个数)。
从这个计算结果来看，我们的页面加载速度变快了不少。
### HTTP/1.1 的主要问题
* HTTP/1.1对带宽的利用率却并不理想，这也是 HTTP/1.1 的一个核心问题。
* 带宽是指每秒最大能发送或者接收的字节数。我们把每秒能发送的最大字节数称为上行带宽，每秒能够接收的最大字节数称为下行带宽。
* 之所以说 HTTP/1.1 对带宽的利用率不理想，是因为 HTTP/1.1 很难将带宽用满。比如我们常说的 100M 带宽，实际的下载速度能达到 12.5M/S，而采用 HTTP/1.1 时，也许在加载页面资源时最大只能使用到 2.5M/S，很难将 12.5M 全部用满。
* 主要是由以下三个原因导致的。
1. TCP 的慢启动。
一旦一个 TCP 连接建立之后，就进入了发送数据状态，刚开始 TCP 协议会采用一个非常慢的速度去发送数据，
然后慢慢加快发送数据的速度，直到发送数据的速度达到一个理想状态，我们把这个过程称为慢启动。

慢启动是 TCP 为了减少网络拥塞的一种策略，我们是没有办法改变的。
之所以说慢启动会带来性能问题，是因为页面中常用的一些关键资源文件本来就不大，如 HTML 文件、CSS 文件和 JavaScript 文件，通常这些文件在 TCP 连接建立好之后就要发起请求的，但这个过程是慢启动，所以耗费的时间比正常的时间要多很多，这样就推迟了宝贵的首次渲染页面的时长了。
2. 同时开启了多条 TCP 连接，那么这些连接会竞争固定的带宽。
系统同时建立了多条 TCP 连接，当带宽充足时，每条连接发送或者接收速度会慢慢向上增加；
而一旦带宽不足时，这些 TCP 连接又会减慢发送或者接收的速度。

比如一个页面有 200 个文件，使用了 3 个 CDN，那么加载该网页的时候就需要建立 6 * 3，也就是 18 个 TCP 连接来下载资源；
在下载过程中，当发现带宽不足的时候，各个 TCP 连接就需要动态减慢接收数据的速度。

这样就会出现一个问题，因为有的 TCP 连接下载的是一些关键资源，如 CSS 文件、JavaScript 文件等，而有的 TCP 连接下载的是图片、视频等普通的资源文件，
但是多条 TCP 连接之间又不能协商让哪些关键资源优先下载，这样就有可能影响那些关键资源的下载速度了。
3. HTTP/1.1 队头阻塞的问题。
HTTP/1.1 中使用持久连接时，虽然能公用一个 TCP 管道，但是在一个管道中同一时刻只能处理一个请求，在当前的请求没有结束之前，其他的请求只能处于阻塞状态。
这意味着我们不能随意在一个管道中发送请求和接收内容。

这是一个很严重的问题，因为阻塞请求的因素有很多，并且都是一些不确定性的因素，
假如有的请求被阻塞了 5 秒，那么后续排队的请求都要延迟等待 5 秒，
在这个等待的过程中，带宽、CPU 都被白白浪费了。
### HTTP/2 的多路复用
* HTTP/2 的思路就是一个域名只使用一个 TCP 长连接来传输数据，这样整个页面资源的下载过程只需要一次慢启动，同时也避免了多个 TCP 连接竞争带宽所带来的问题。
* HTTP/2 需要实现资源的并行请求，也就是任何时候都可以将请求发送给服务器，而并不需要等待其他请求的完成，然后服务器也可以随时返回处理好的请求资源给浏览器。
* HTTP/2 最核心、最重要且最具颠覆性的多路复用机制。
1. 每个请求都有一个对应的 ID，如 stream1 表示 index.html 的请求，stream2 表示 foo.css 的请求。这样在浏览器端，就可以随时将请求发送给服务器了。
2. 服务器端接收到这些请求后，会根据自己的喜好来决定优先返回哪些内容，
比如服务器可能早就缓存好了 index.html 和 bar.js 的响应头信息，
那么当接收到请求的时候就可以立即把 index.html 和 bar.js 的响应头信息返回给浏览器，
然后再将 index.html 和 bar.js 的响应体数据返回给浏览器。
3. 之所以可以随意发送，是因为每份数据都有对应的 ID，浏览器接收到之后，会筛选出相同 ID 的内容，将其拼接为完整的 HTTP 响应数据。
4. HTTP/2 使用了多路复用技术，可以将请求分成一帧一帧的数据去传输，
这样带来了一个额外的好处，就是当收到一个优先级高的请求时，比如接收到 JavaScript 或者 CSS 关键资源的请求，服务器可以暂停之前的请求来优先处理关键资源的请求。

### 多路复用的实现
* HTTP/2 添加了一个二进制分帧层
1. 首先，浏览器准备好请求数据，包括了请求行、请求头等信息，如果是 POST 方法，那么还要有请求体。
2. 这些数据经过二进制分帧层处理之后，会被转换为一个个带有请求 ID 编号的帧，通过协议栈将这些帧发送给服务器。
3. 服务器接收到所有帧之后，会将所有相同 ID 的帧合并为一条完整的请求信息。
4. 然后服务器处理该条请求，并将处理的响应行、响应头和响应体分别发送至二进制分帧层。
5. 同样，二进制分帧层会将这些响应数据转换为一个个带有请求 ID 编号的帧，经过协议栈发送给浏览器。
6. 浏览器接收到响应帧之后，会根据 ID 编号将帧的数据提交给对应的请求。
* 通过引入二进制分帧层，就实现了 HTTP 的多路复用技术。

### HTTP/2 其他特性
* 可以设置请求的优先级
1. HTTP/2 提供了请求优先级，可以在发送请求时，标上该请求的优先级，这样服务器接收到请求之后，会优先处理优先级高的请求。
* 服务器推送
1. HTTP/2 还可以直接将数据提前推送到浏览器。
当用户请求一个 HTML 页面之后，服务器知道该 HTML 页面会引用几个重要的 JavaScript 文件和 CSS 文件，
那么在接收到 HTML 请求之后，附带将要使用的 CSS 文件和 JavaScript 文件一并发送给浏览器，
这样当浏览器解析完 HTML 文件之后，就能直接拿到需要的 CSS 文件和 JavaScript 文件，
这对首次打开页面的速度起到了至关重要的作用。
* 头部压缩
1. HTTP/2 对请求头和响应头进行了压缩
你可能觉得一个 HTTP 的头文件没有多大，压不压缩可能关系不大，
但你这样想一下，在浏览器发送请求的时候，基本上都是发送 HTTP 请求头，很少有请求体的发送，
通常情况下页面也有 100 个左右的资源，如果将这 100 个请求头的数据压缩为原来的 20%，那么传输效率肯定能得到大幅提升。



## HTTP/3：甩掉TCP、TLS 的包袱，构建高效网络
* 从目前的情况来看，HTTP/2 似乎可以完美取代 HTTP/1 了，不过 HTTP/2 依然存在一些缺陷，于是就有了 HTTP/3。和通常一样，介绍 HTTP/3 之前，我们先来看看 HTTP/2 到底有什么缺陷。
### TCP 的队头阻塞
* 虽然 HTTP/2 解决了应用层面的队头阻塞问题，不过和 HTTP/1.1 一样，HTTP/2 依然是基于 TCP 协议的，而 TCP 最初就是为了单连接而设计的
* 你可以把 TCP 连接看成是两台计算机之前的一个虚拟管道，计算机的一端将要传输的数据按照顺序放入管道，最终数据会以相同的顺序出现在管道的另外一头。
* HTTP/1.1 协议栈中 TCP 是如何传输数据的
1. 从一端发送给另外一端的数据会被拆分为一个个按照顺序排列的数据包
2. 这些数据包通过网络传输到了接收端，接收端再按照顺序将这些数据包组合成原始数据，这样就完成了数据传输。
3. 如果在数据传输的过程中，有一个数据因为网络故障或者其他原因而丢包了，那么整个 TCP 的连接就会处于暂停状态，需要等待丢失的数据包被重新传输过来。
4. 你可以把 TCP 连接看成是一个按照顺序传输数据的管道，管道中的任意一个数据丢失了，那之后的数据都需要等待该数据的重新传输。
* 在 TCP 传输过程中，由于单个数据包的丢失而造成的阻塞称为 TCP 上的队头阻塞。
* HTTP/2 是怎么传输多路请求的
1. 在 HTTP/2 中，多个请求是跑在一个 TCP 管道中的，如果其中任意一路数据流中出现了丢包的情况，那么就会阻塞该 TCP 连接中的所有请求。
2. 这不同于 HTTP/1.1，使用 HTTP/1.1 时，浏览器为每个域名开启了 6 个 TCP 连接，如果其中的 1 个 TCP 连接发生了队头阻塞，那么其他的 5 个连接依然可以继续传输数据。
3. 所以随着丢包率的增加，HTTP/2 的传输效率也会越来越差。有测试数据表明，当系统达到了 2% 的丢包率时，HTTP/1.1 的传输效率反而比 HTTP/2 表现得更好
### TCP 建立连接的延时
* 网络延迟又称为 RTT（Round Trip Time）。我们把从浏览器发送一个数据包到服务器，再从服务器返回数据包到浏览器的整个往返时间称为 RTT。RTT 是反映网络性能的一个重要指标。
* 建立 TCP 连接时，需要花费多少个 RTT 呢？下面我们来计算下。
1. 如果使用 HTTPS 的话，还需要使用 TLS 协议进行安全传输，而使用 TLS 也需要一个握手过程，这样就需要有两个握手延迟过程。
2. 在建立 TCP 连接的时候，需要和服务器进行三次握手来确认连接成功，也就是说需要在消耗完 1.5 个 RTT 之后才能进行数据传输。
3. 进行 TLS 连接，TLS 有两个版本——TLS1.2 和 TLS1.3，每个版本建立连接所花的时间不同，大致是需要 1～2 个 RTT
4. 总之，在传输数据之前，我们需要花掉 3～4 个 RTT。如果浏览器和服务器的物理距离较近，那么 1 个 RTT 的时间可能在 10 毫秒以内，也就是说总共要消耗掉 30～40 毫秒。这个时间也许用户还可以接受，但如果服务器相隔较远，那么 1 个 RTT 就可能需要 100 毫秒以上了，这种情况下整个握手过程需要 300～400 毫秒，这时用户就能明显地感受到“慢”了。
### TCP 协议僵化
* 中间设备的僵化。
1. 我们知道互联网是由多个网络互联的网状结构，为了能够保障互联网的正常工作，我们需要在互联网的各处搭建各种设备，这些设备就被称为中间设备。
2. 这些中间设备有很多种类型，并且每种设备都有自己的目的，这些设备包括了路由器、防火墙、NAT、交换机等。它们通常依赖一些很少升级的软件，这些软件使用了大量的 TCP 特性，这些功能被设置之后就很少更新了。
3. 所以，如果我们在客户端升级了 TCP 协议，但是当新协议的数据包经过这些中间设备时，它们可能不理解包的内容，于是这些数据就会被丢弃掉。这就是中间设备僵化，它是阻碍 TCP 更新的一大障碍。
* 除了中间设备僵化外，操作系统也是导致 TCP 协议僵化的另外一个原因。
1. 因为 TCP 协议都是通过操作系统内核来实现的，应用程序只能使用不能修改。通常操作系统的更新都滞后于软件的更新，因此要想自由地更新内核中的 TCP 协议也是非常困难的。QUIC 协议
### QUIC 协议
* HTTP/3 选择了一个折衷的方法——UDP 协议，基于 UDP 实现了类似于 TCP 的多路数据流、传输可靠性等功能，我们把这套功能称为 QUIC 协议。
* HTTP/3 中的 QUIC 协议集合了以下几点功能。
1. 实现了类似 TCP 的流量控制、传输可靠性的功能。虽然 UDP 不提供可靠性的传输，但 QUIC 在 UDP 的基础之上增加了一层来保证数据可靠性传输。它提供了数据包重传、拥塞控制以及其他一些 TCP 中存在的特性。
2. 集成了 TLS 加密功能。目前 QUIC 使用的是 TLS1.3，相较于早期版本 TLS1.3 有更多的优点，其中最重要的一点是减少了握手所花费的 RTT 个数。
3. 实现了 HTTP/2 中的多路复用功能。和 TCP 不同，QUIC 实现了在同一物理连接上可以有多个独立的逻辑数据流。实现了数据流的单独传输，就解决了 TCP 中队头阻塞的问题。
4. 实现了快速握手功能。由于 QUIC 是基于 UDP 的，所以 QUIC 可以实现使用 0-RTT 或者 1-RTT 来建立连接，这意味着 QUIC 可以用最快的速度来发送和接收数据，这样可以大大提升首次打开页面的速度。
### 总结
* HTTP/3 正是基于 QUIC 协议的，你可以把 QUIC 看成是集成了“TCP+HTTP/2 的多路复用 +TLS 等功能”的一套协议。
* 这是集众家所长的一个协议，从协议最底层对 Web 的文件传输做了比较彻底的优化，所以等生态相对成熟时，可以用来打造比现在的 HTTP/2 还更加高效的网络。

## 同源策略：为什么XMLHttpRequest不能跨域请求资源？

### 什么是同源策略
* 如果两个 URL 的协议、域名和端口都相同，我们就称这两个 URL 同源。
* 浏览器默认两个相同的源之间是可以相互访问资源和操作 DOM 的。两个不同的源之间若想要相互访问资源或者操作 DOM，那么会有一套基础的安全策略的制约，我们把这称为同源策略。
* 同源策略主要表现在 DOM、Web 数据和网络这三个层面。
1. 第一个，DOM 层面。同源策略限制了来自不同源的 JavaScript 脚本对当前 DOM 对象读和写的操作。
```

{
let pdom = opener.document
pdom.body.style.display = "none"
}
该代码中，对象 opener 就是指向第一个页面的 window 对象，我们可以通过操作 opener 来控制第一个页面中的 DOM。
```
2. 第二个，数据层面。同源策略限制了不同源的站点读取当前站点的 Cookie、IndexDB、LocalStorage 等数据。
3. 第三个，网络层面。同源策略限制了通过 XMLHttpRequest 等方式将站点的数据发送给不同源的站点。

### 安全和便利性的权衡
* 页面中可以嵌入第三方资源
1. 为了解决 XSS 攻击，浏览器中引入了内容安全策略，称为 CSP。
2.  CSP 的核心思想是让服务器决定浏览器能够加载哪些资源，让服务器决定浏览器是否能够执行内联 JavaScript 代码。通过这些手段就可以大大减少 XSS 攻击。
* 跨域资源共享和跨文档消息机制
1. 跨域资源共享（CORS），使用该机制可以进行跨域访问控制，从而使跨域数据传输得以安全进行。
2. 在实际应用中，经常需要两个不同源的 DOM 之间进行通信，于是浏览器中又引入了跨文档消息机制，可以通过 window.postMessage 的 JavaScript 接口来和不同源的 DOM 进行通信。


## 跨站脚本攻击（XSS）：为什么Cookie中有HttpOnly属性？

### 什么是 XSS 攻击
* XSS 全称是 Cross Site Scripting，为了与“CSS”区分开来，故简称 XSS，翻译过来就是“跨站脚本”。
* XSS 攻击是指黑客往 HTML 文件中或者 DOM 中注入恶意脚本，从而在用户浏览页面时利用注入的恶意脚本对用户实施攻击的一种手段。
* 如果页面被注入了恶意 JavaScript 脚本，恶意脚本都能做哪些事情
1. 可以窃取 Cookie 信息。恶意 JavaScript 可以通过“document.cookie”获取 Cookie 信息，然后通过 XMLHttpRequest 或者 Fetch 加上 CORS 功能将数据发送给恶意服务器；恶意服务器拿到用户的 Cookie 信息之后，就可以在其他电脑上模拟用户的登录，然后进行转账等操作。
2. 可以监听用户行为。恶意 JavaScript 可以使用“addEventListener”接口来监听键盘事件，比如可以获取用户输入的信用卡等信息，将其发送到恶意服务器。黑客掌握了这些信息之后，又可以做很多违法的事情。
3. 可以通过修改 DOM 伪造假的登录窗口，用来欺骗用户输入用户名和密码等信息。
4. 还可以在页面内生成浮窗广告，这些广告会严重地影响用户体验。
### 恶意脚本是怎么注入的
* 通常情况下，主要有存储型 XSS 攻击、反射型 XSS 攻击和基于 DOM 的 XSS 攻击三种方式来注入恶意脚本。
1. 存储型 XSS 攻击
①首先黑客利用站点漏洞将一段恶意 JavaScript 代码提交到网站的数据库中；
②然后用户向网站请求包含了恶意 JavaScript 脚本的页面；
③当用户浏览该页面的时候，恶意脚本就会将用户的 Cookie 信息等数据上传到服务器
```
下面我们来看个例子，2015 年喜马拉雅就被曝出了存储型 XSS 漏洞。
起因是在用户设置专辑名称时，服务器对关键字过滤不严格，比如可以将专辑名称设置为一段 JavaScript，

当黑客将专辑名称设置为一段 JavaScript 代码并提交时，喜马拉雅的服务器会保存该段 JavaScript 代码到数据库中。
然后当用户打开黑客设置的专辑时，这段代码就会在用户的页面里执行，这样就可以获取用户的 Cookie 等数据信息。
当用户打开黑客设置的专辑页面时，服务器也会将这段恶意 JavaScript 代码返回给用户，因此这段恶意脚本就在用户的页面中执行了。

恶意脚本可以通过 XMLHttpRequest 或者 Fetch 将用户的 Cookie 数据上传到黑客的服务器。
黑客拿到了用户 Cookie 信息之后，就可以利用 Cookie 信息在其他机器上登录该用户的账号，并利用用户账号进行一些恶意操作。

以上就是存储型 XSS 攻击的一个典型案例，这是乌云网在 2015 年曝出来的。
```
### 反射型 XSS 攻击
* 在一个反射型 XSS 攻击过程中，恶意 JavaScript 脚本属于用户发送给网站请求中的一部分，随后网站又把恶意 JavaScript 脚本返回给用户。当恶意 JavaScript 脚本在用户页面中被执行时，黑客就可以利用该脚本做一些恶意操作。
* 下面我们结合一个简单的 Node 服务程序来看看什么是反射型 XSS。
```
首先我们使用 Node 来搭建一个简单的页面环境，搭建好的服务代码如下所示：
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',xss:req.query.xss });
});


module.exports = router;







<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <link rel='stylesheet' href='/stylesheets/style.css' />
</head>
<body>
  <h1><%= title %></h1>
  <p>Welcome to <%= title %></p>
  <div>
      <%- xss %>
  </div>
</body>
</html>



上面这两段代码，第一段是路由，第二段是视图，作用是将 URL 中 xss 参数的内容显示在页面。我们可以在本地演示下，比如打开http://localhost:3000/?xss=123这个链接，这样在页面中展示就是“123”了，是正常的，没有问题的。
但当打开http://localhost:3000/?xss=<script>alert('你被xss攻击了')</script>这段 URL 时

通过这个操作，我们会发现用户将一段含有恶意代码的请求提交给 Web 服务器，Web 服务器接收到请求时，又将恶意代码反射给了浏览器端，这就是反射型 XSS 攻击。
在现实生活中，黑客经常会通过 QQ 群或者邮件等渠道诱导用户去点击这些恶意链接，所以对于一些链接我们一定要慎之又慎。
```
* 另外需要注意的是，Web 服务器不会存储反射型 XSS 攻击的恶意脚本，这是和存储型 XSS 攻击不同的地方。

### 基于 DOM 的 XSS 攻击
* 基于 DOM 的 XSS 攻击是不牵涉到页面 Web 服务器的。具体来讲，黑客通过各种手段将恶意脚本注入用户的页面中，比如通过网络劫持在页面传输过程中修改 HTML 页面的内容，这种劫持类型很多，有通过 WiFi 路由器劫持的，有通过本地恶意软件来劫持的，它们的共同点是在 Web 资源传输过程或者在用户使用页面的过程中修改 Web 页面的数据。


### 如何阻止 XSS 攻击
* 存储型 XSS 攻击和反射型 XSS 攻击都是需要经过 Web 服务器来处理的，因此可以认为这两种类型的漏洞是服务端的安全漏洞。
* 而基于 DOM 的 XSS 攻击全部都是在浏览器端完成的，因此基于 DOM 的 XSS 攻击是属于前端的安全漏洞。
* 无论是何种类型的 XSS 攻击，它们都有一个共同点，那就是首先往浏览器中注入恶意脚本，然后再通过恶意脚本将用户信息发送至黑客部署的恶意服务器上。
* 一些常用的阻止 XSS 攻击的策略。
1. 服务器对输入脚本进行过滤或转码
```
不管是反射型还是存储型 XSS 攻击，我们都可以在服务器端将一些关键的字符进行转码，比如最典型的：
code:<script>alert('你被xss攻击了')</script>
这段代码过滤后，只留下了：
code:
这样，当用户再次请求该页面时，由于<script>标签的内容都被过滤了，所以这段脚本在客户端是不可能被执行的。
除了过滤之外，服务器还可以对这些内容进行转码，还是上面那段代码，经过转码之后，效果如下所示：
code:&lt;script&gt;alert(&#39;你被xss攻击了&#39;)&lt;/script&gt;
经过转码之后的内容，如<script>标签被转换为&lt;script&gt;，因此即使这段脚本返回给页面，页面也不会执行这段脚本。

```
2. 充分利用 CSP
虽然在服务器端执行过滤或者转码可以阻止 XSS 攻击的发生，但完全依靠服务器端依然是不够的，我们还需要把 CSP 等策略充分地利用起来，以降低 XSS 攻击带来的风险和后果。
实施严格的 CSP 可以有效地防范 XSS 攻击，具体来讲 CSP 有如下几个功能：
①限制加载其他域下的资源文件，这样即使黑客插入了一个 JavaScript 文件，这个 JavaScript 文件也是无法被加载的；
②禁止向第三方域提交数据，这样用户数据也不会外泄；
③禁止执行内联脚本和未授权的脚本；
④还提供了上报机制，这样可以帮助我们尽快发现有哪些 XSS 攻击，以便尽快修复问题
3. 使用 HttpOnly 属性
由于很多 XSS 攻击都是来盗用 Cookie 的，因此还可以通过使用 HttpOnly 属性来保护我们 Cookie 的安全。
```
通常服务器可以将某些 Cookie 设置为 HttpOnly 标志，HttpOnly 是服务器通过 HTTP 响应头来设置的，下面是打开 Google 时，HTTP 响应头中的一段：

set-cookie: NID=189=M8q2FtWbsR8RlcldPVt7qkrqR38LmFY9jUxkKo3-4Bi6Qu_ocNOat7nkYZUTzolHjFnwBw0izgsATSI7TZyiiiaV94qGh-BzEYsNVa7TZmjAYTxYTOM9L_-0CN9ipL6cXi8l6-z41asXtm2uEwcOC5oh9djkffOMhWqQrlnCtOI; expires=Sat, 18-Apr-2020 06:52:22 GMT; path=/; domain=.google.com; HttpOnly

我们可以看到，set-cookie 属性值最后使用了 HttpOnly 来标记该 Cookie。顾名思义，使用 HttpOnly 标记的 Cookie 只能使用在 HTTP 请求过程中，所以无法通过 JavaScript 来读取这段 Cookie。


由于 JavaScript 无法读取设置了 HttpOnly 的 Cookie 数据，所以即使页面被注入了恶意 JavaScript 脚本，也是无法获取到设置了 HttpOnly 的数据。因此一些比较重要的数据我们建议设置 HttpOnly 标志。

```
### 总结
* XSS 攻击就是黑客往页面中注入恶意脚本，然后将页面的一些重要数据上传到恶意服务器。常见的三种 XSS 攻击模式是存储型 XSS 攻击、反射型 XSS 攻击和基于 DOM 的 XSS 攻击。
* 针对这些 XSS 攻击，主要有三种防范策略，第一种是通过服务器对输入的内容进行过滤或者转码，第二种是充分利用好 CSP，第三种是使用 HttpOnly 来保护重要的 Cookie 信息。
* 当然除了以上策略之外，我们还可以通过添加验证码防止脚本冒充用户提交危险操作。而对于一些不受信任的输入，还可以限制其输入长度，这样可以增大 XSS 攻击的难度。

## CSRF攻击：陌生链接不要随便点
* 结合一个真实的关于 CSRF 攻击的典型案例来分析下，在 2007 年的某一天，David 无意间打开了 Gmail 邮箱中的一份邮件，并点击了该邮件中的一个链接。过了几天，David 就发现他的域名被盗了。不过几经周折，David 还是要回了他的域名，也弄清楚了他的域名之所以被盗，就是因为无意间点击的那个链接。
* 那 David 的域名是怎么被盗的呢？
1. 首先 David 发起登录 Gmail 邮箱请求，然后 Gmail 服务器返回一些登录状态给 David 的浏览器，这些信息包括了 Cookie、Session 等，这样在 David 的浏览器中，Gmail 邮箱就处于登录状态了。
2. 接着黑客通过各种手段引诱 David 去打开他的链接，比如 hacker.com，然后在 hacker.com 页面中，黑客编写好了一个邮件过滤器，并通过 Gmail 提供的 HTTP 设置接口设置好了新的邮件过滤功能，该过滤器会将 David 所有的邮件都转发到黑客的邮箱中。
3. 最后的事情就很简单了，因为有了 David 的邮件内容，所以黑客就可以去域名服务商那边重置 David 域名账户的密码，重置好密码之后，就可以将其转出到黑客的账户了。
### 什么是 CSRF 攻击
* CSRF 英文全称是 Cross-site request forgery，所以又称为“跨站请求伪造”
* 指黑客引诱用户打开黑客的网站，在黑客的网站中，利用用户的登录状态发起的跨站请求。
* 简单来讲，CSRF 攻击就是黑客利用了用户的登录状态，并通过第三方的站点来做一些坏事。
* 通常当用户打开了黑客的页面后，黑客有三种方式去实施 CSRF 攻击。
1. 自动发起 Get 请求
黑客最容易实施的攻击方式是自动发起 Get 请求，具体攻击方式你可以参考下面这段代码：
```

<!DOCTYPE html>
<html>
  <body>
    <h1>黑客的站点：CSRF攻击演示</h1>
    <img src="https://diamonds.org/sendcoin?user=hacker&number=100">
  </body>
</html>


这是黑客页面的 HTML 代码，在这段代码中，黑客将转账的请求接口隐藏在 img 标签内，欺骗浏览器这是一张图片资源。
当该页面被加载时，浏览器会自动发起 img 的资源请求，如果服务器没有对该请求做判断的话，那么服务器就会认为该请求是一个转账请求，于是用户账户上的钱就被转移到黑客的账户上去了。



```
2. 自动发起 POST 请求

```
除了自动发送 Get 请求之外，有些服务器的接口是使用 POST 方法的，所以黑客还需要在他的站点上伪造 POST 请求，
当用户打开黑客的站点时，是自动提交 POST 请求，具体的方式你可以参考下面示例代码：

<!DOCTYPE html>
<html>
<body>
  <h1>黑客的站点：CSRF攻击演示</h1>
  <form id='hacker-form' action="https://diamonds.org/sendcoin" method=POST>
    <input type="hidden" name="user" value="hacker" />
    <input type="hidden" name="number" value="100" />
  </form>
  <script> document.getElementById('hacker-form').submit(); </script>
</body>
</html>




在这段代码中，我们可以看到黑客在他的页面中构建了一个隐藏的表单，该表单的内容就是网站的转账接口。
当用户打开该站点之后，这个表单会被自动执行提交；
当表单被提交之后，服务器就会执行转账操作。
因此使用构建自动提交表单这种方式，就可以自动实现跨站点 POST 数据提交。



```
3. 引诱用户点击链接
```
除了自动发起 Get 和 Post 请求之外，还有一种方式是诱惑用户点击黑客站点上的链接，这种方式通常出现在论坛或者恶意邮件上。
黑客会采用很多方式去诱惑用户点击链接，示例代码如下所示：

<div>
  <img width=150 src=http://images.xuejuzi.cn/1612/1_161230185104_1.jpg> </img> </div> <div>
  <a href="https://diamonds.org/sendcoin?user=hacker&number=100" taget="_blank">
    点击下载美女照片
  </a>
</div>

这段黑客站点代码，页面上放了一张美女图片，下面放了图片下载地址，而这个下载地址实际上是黑客用来转账的接口，一旦用户点击了这个链接，那么他的钱就被转到黑客账户上了。
```
* 和 XSS 不同的是，CSRF 攻击不需要将恶意代码注入用户的页面，仅仅是利用服务器的漏洞和用户的登录状态来实施攻击。
### 如何防止 CSRF 攻击
* CSRF 攻击的三个必要条件：
1. 第一个，目标站点一定要有 CSRF 漏洞；
2. 第二个，用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态；
3. 第三个，需要用户打开一个第三方站点，可以是黑客的站点，也可以是一些论坛。
* 满足以上三个条件之后，黑客就可以对用户进行 CSRF 攻击了。这里还需要额外注意一点，与 XSS 攻击不同，CSRF 攻击不会往页面注入恶意脚本，因此黑客是无法通过 CSRF 攻击来获取用户页面数据的；
* 其最关键的一点是要能找到服务器的漏洞，所以说对于 CSRF 攻击我们主要的防护手段是提升服务器的安全性。
* 要让服务器避免遭受到 CSRF 攻击，通常有以下几种途径。
1. 充分利用好 Cookie 的 SameSite 属性
①黑客会利用用户的登录状态来发起 CSRF 攻击，而 Cookie 正是浏览器和服务器之间维护登录状态的一个关键数据，因此要阻止 CSRF 攻击，我们首先就要考虑在 Cookie 上来做文章。
②通常 CSRF 攻击都是从第三方站点发起的，要防止 CSRF 攻击，我们最好能实现从第三方站点发送请求时禁止 Cookie 的发送，因此在浏览器通过不同来源发送 HTTP 请求时，有如下区别：
如果是从第三方站点发起的请求，那么需要浏览器禁止发送某些关键 Cookie 数据到服务器；
如果是同一个站点发起的请求，那么就需要保证 Cookie 数据正常发送。
③而我们要聊的 Cookie 中的 SameSite 属性正是为了解决这个问题的，通过使用 SameSite 可以有效地降低 CSRF 攻击的风险。
```

在 HTTP 响应头中，通过 set-cookie 字段设置 Cookie 时，可以带上 SameSite 选项，如下：
set-cookie: 1P_JAR=2019-10-20-06; expires=Tue, 19-Nov-2019 06:36:21 GMT; path=/; domain=.google.com; SameSite=none


SameSite 选项通常有 Strict、Lax 和 None 三个值。
1. Strict 最为严格。如果 SameSite 的值是 Strict，那么浏览器会完全禁止第三方 Cookie。
简言之，如果你从a页面中访问 b的资源，而 b 的某些 Cookie 设置了 SameSite = Strict 的话，
那么这些 Cookie 是不会被发送到 b 的服务器上的。
只有你从 b的站点去请求 b的资源时，才会带上这些 Cookie。
2.Lax 相对宽松一点。在跨站点的情况下，从第三方站点的链接打开和从第三方站点提交 Get 方式的表单这两种方式都会携带 Cookie。
但如果在第三方站点中使用 Post 方法，或者通过 img、iframe 等标签加载的 URL，这些场景都不会携带 Cookie。
3.而如果使用 None 的话，在任何情况下都会发送 Cookie 数据。



```
④对于防范 CSRF 攻击，我们可以针对实际情况将一些关键的 Cookie 设置为 Strict 或者 Lax 模式，这样在跨站点请求时，这些关键的 Cookie 就不会被发送到服务器，从而使得黑客的 CSRF 攻击失效。
2. 验证请求的来源站点
①在服务器端验证请求来源的站点。
②Referer 是 HTTP 请求头中的一个字段，记录了该 HTTP 请求的来源地址。
③虽然可以通过 Referer 告诉服务器 HTTP 请求的来源，但是有一些场景是不适合将来源 URL 暴露给服务器的，因此浏览器提供给开发者一个选项，可以不用上传 Referer 值，具体可参考 Referrer Policy。
④但在服务器端验证请求头中的 Referer 并不是太可靠，因此标准委员会又制定了 Origin 属性，在一些重要的场合，比如通过 XMLHttpRequest、Fecth 发起跨站请求或者通过 Post 方法发送请求时，都会带上 Origin 属性
Origin 属性只包含了域名信息，并没有包含具体的 URL 路径，这是 Origin 和 Referer 的一个主要区别。
Origin 的值之所以不包含详细路径信息，是有些站点因为安全考虑，不想把源站点的详细路径暴露给服务器。
⑤因此，服务器的策略是优先判断 Origin，如果请求头中没有包含 Origin 属性，再根据实际情况判断是否使用 Referer 值。
3. CSRF Token
```
大致分为两步：
第一步，在浏览器向服务器发起请求时，服务器生成一个 CSRF Token。
CSRF Token 其实就是服务器生成的字符串，然后将该字符串植入到返回的页面中。你可以参考下面示例代码：

<!DOCTYPE html>
<html>
<body>
    <form action="https://diamonds.org/sendcoin" method="POST">
      <input type="hidden" name="csrf-token" value="nc98P987bcpncYhoadjoiydc9ajDlcn">
      <input type="text" name="user">
      <input type="text" name="number">
      <input type="submit">
    </form>
</body>
</html>


第二步，在浏览器端如果要发起转账的请求，那么需要带上页面中的 CSRF Token，然后服务器会验证该 Token 是否合法。
如果是从第三方站点发出的请求，那么将无法获取到 CSRF Token 的值，所以即使发出了请求，服务器也会因为 CSRF Token 不正确而拒绝请求。


```

## 安全沙箱：页面和系统之间的隔离墙
* 在最开始的阶段，浏览器是单进程的，这意味着渲染过程、JavaScript 执行过程、网络加载过程、UI 绘制过程和页面显示过程等都是在同一个进程中执行的，这种结构虽然简单，但是也带来了很多问题。
* 从稳定性视角来看，单进程架构的浏览器是不稳定的，因为只要浏览器进程中的任意一个功能出现异常都有可能影响到整个浏览器，如页面卡死、浏览器崩溃等。
* 浏览器本身的漏洞是单进程浏览器的一个主要问题，如果浏览器被曝出存在漏洞，那么在这些漏洞没有被及时修复的情况下，黑客就有可能通过恶意的页面向浏览器中注入恶意程序，其中最常见的攻击方式是利用缓冲区溢出，不过需要注意这种类型的攻击和 XSS 注入的脚本是不一样的。
1. XSS 攻击只是将恶意的 JavaScript 脚本注入到页面中，虽然能窃取一些 Cookie 相关的数据，但是 XSS 无法对操作系统进行攻击。
2. 而通过浏览器漏洞进行的攻击是可以入侵到浏览器进程内部的，可以读取和修改浏览器进程内部的任意内容，还可以穿透浏览器，在用户的操作系统上悄悄地安装恶意软件、监听用户键盘输入信息以及读取用户硬盘上的文件内容。
3. 和 XSS 攻击页面相比，这类攻击无疑是枚“核弹”，它会将整个操作系统的内容都暴露给黑客，这样我们操作系统上所有的资料都是不安全的了。
* 现代浏览器采用了多进程架构，将渲染进程和浏览器主进程做了分离，浏览器被划分为浏览器内核和渲染内核两个核心模块，其中浏览器内核是由网络进程、浏览器主进程和 GPU 进程组成的，渲染内核就是渲染进程。
1. 所有的网络资源都是通过浏览器内核来下载的，下载后的资源会通过 IPC 将其提交给渲染进程（浏览器内核和渲染进程之间都是通过 IPC 来通信的）。
2. 然后渲染进程会对这些资源进行解析、绘制等操作，最终生成一幅图片。
3. 但是渲染进程并不负责将图片显示到界面上，而是将最终生成的图片提交给浏览器内核模块，由浏览器内核模块负责显示这张图片。
* 虽然设计成了多进程架构，不过这些模块之间的沟通方式却有些复杂，也许你还有以下问题：
1. 为什么一定要通过浏览器内核去请求资源，再将数据转发给渲染进程，而不直接从进程内部去请求网络资源？
2. 为什么渲染进程只负责生成页面图片，生成图片还要经过 IPC 通知浏览器内核模块，然后让浏览器内核去负责展示图片？
### 安全沙箱
* 由于渲染进程需要执行 DOM 解析、CSS 解析、网络图片解码等操作，如果渲染进程中存在系统级别的漏洞，那么以上操作就有可能让恶意的站点获取到渲染进程的控制权限，进而又获取操作系统的控制权限，这对于用户来说是非常危险的。
* 如果你下载了一个恶意程序，但是没有执行它，那么恶意程序是不会生效的。同理，浏览器之于网络内容也是如此，浏览器可以安全地下载各种网络资源，但是如果要执行这些网络资源，比如解析 HTML、解析 CSS、执行 JavaScript、图片编解码等操作，就需要非常谨慎了，因为一不小心，黑客就会利用这些操作对含有漏洞的浏览器发起攻击。
* 基于以上原因，我们需要在渲染进程和操作系统之间建一道墙，即便渲染进程由于存在漏洞被黑客攻击，但由于这道墙，黑客就获取不到渲染进程之外的任何操作权限。将渲染进程和操作系统隔离的这道墙就是我们要聊的安全沙箱。
* 浏览器中的安全沙箱是利用操作系统提供的安全技术，让渲染进程在执行过程中无法访问或者修改操作系统中的数据，在渲染进程需要访问系统资源的时候，需要通过浏览器内核来实现，然后将访问的结果通过 IPC 转发给渲染进程。
* 安全沙箱最小的保护单位是进程。因为单进程浏览器需要频繁访问或者修改操作系统的数据，所以单进程浏览器是无法被安全沙箱保护的，而现代浏览器采用的多进程架构使得安全沙箱可以发挥作用。
#### 安全沙箱如何影响各个模块功能
* 如果要让安全沙箱应用在某个进程上，那么这个进程必须没有读写操作系统的功能，比如读写本地文件、发起网络请求、调用 GPU 接口等。
* 那安全沙箱是如何影响到各个模块功能的呢？
1. 持久存储
①由于安全沙箱需要负责确保渲染进程无法直接访问用户的文件系统，
但是在渲染进程内部有访问 Cookie 的需求、有上传文件的需求，为了解决这些文件的访问需求，
所以现代浏览器将读写文件的操作全部放在了浏览器内核中实现，然后通过 IPC 将操作结果转发给渲染进程。
②存储 Cookie 数据的读写。通常浏览器内核会维护一个存放所有 Cookie 的 Cookie 数据库，
然后当渲染进程通过 JavaScript 来读取 Cookie 时，渲染进程会通过 IPC 将读取 Cookie 的信息发送给浏览器内核，
浏览器内核读取 Cookie 之后再将内容返回给渲染进程。
③一些缓存文件的读写也是由浏览器内核实现的，比如网络文件缓存的读取。
2. 网络访问
① 在渲染进程内部也是不能直接访问网络的，如果要访问网络，则需要通过浏览器内核。
② 不过浏览器内核在处理 URL 请求之前，会检查渲染进程是否有权限请求该 URL，比如检查 XMLHttpRequest 或者 Fetch 是否是跨站点请求，或者检测 HTTPS 的站点中是否包含了 HTTP 的请求。
3. 用户交互
①通常情况下，如果你要实现一个 UI 程序，操作系统会提供一个界面给你，该界面允许应用程序与用户交互，允许应用程序在该界面上进行绘制，比如 Windows 提供的是 HWND，Linux 提供的 X Window，我们就把 HWND 和 X Window 统称为窗口句柄。应用程序可以在窗口句柄上进行绘制和接收键盘鼠标消息。
②在现代浏览器中，由于每个渲染进程都有安全沙箱的保护，所以在渲染进程内部是无法直接操作窗口句柄的，这也是为了限制渲染进程监控到用户的输入事件。
③由于渲染进程不能直接访问窗口句柄，所以渲染进程需要完成以下两点大的改变。
第一点，渲染进程需要渲染出位图。为了向用户显示渲染进程渲染出来的位图，渲染进程需要将生成好的位图发送到浏览器内核，然后浏览器内核将位图复制到屏幕上。
第二点，操作系统没有将用户输入事件直接传递给渲染进程，而是将这些事件传递给浏览器内核。然后浏览器内核再根据当前浏览器界面的状态来判断如何调度这些事件，如果当前焦点位于浏览器地址栏中，则输入事件会在浏览器内核内部处理；如果当前焦点在页面的区域内，则浏览器内核会将输入事件转发给渲染进程。
④之所以这样设计，就是为了限制渲染进程有监控到用户输入事件的能力，所以所有的键盘鼠标事件都是由浏览器内核来接收的，然后浏览器内核再通过 IPC 将这些事件发送给渲染进程。
### 站点隔离（Site Isolation）
* 所谓站点隔离是指 Chrome 将同一站点（包含了相同根域名和相同协议的地址）中相互关联的页面放到同一个渲染进程中执行。
* 最开始 Chrome 划分渲染进程是以标签页为单位，也就是说整个标签页会被划分给某个渲染进程。但是，按照标签页划分渲染进程存在一些问题，原因就是一个标签页中可能包含了多个 iframe，而这些 iframe 又有可能来自于不同的站点，这就导致了多个不同站点中的内容通过 iframe 同时运行在同一个渲染进程中。
* 目前所有操作系统都面临着两个 A 级漏洞——幽灵（Spectre）和熔毁（Meltdown），这两个漏洞是由处理器架构导致的，很难修补，黑客通过这两个漏洞可以直接入侵到进程的内部，如果入侵的进程没有安全沙箱的保护，那么黑客还可以发起对操作系统的攻击。
* 所以如果一个银行站点包含了一个恶意 iframe，然后这个恶意的 iframe 利用这两个 A 级漏洞去入侵渲染进程，那么恶意程序就能读取银行站点渲染进程内的所有内容了，这对于用户来说就存在很大的风险了。
* 因此 Chrome 几年前就开始重构代码，将标签级的渲染进程重构为 iframe 级的渲染进程，然后严格按照同一站点的策略来分配渲染进程，这就是 Chrome 中的站点隔离。
* 实现了站点隔离，就可以将恶意的 iframe 隔离在恶意进程内部，使得它无法继续访问其他 iframe 进程的内容，因此也就无法攻击其他站点了。
* 值得注意是，2019 年 10 月 20 日 Chrome 团队宣布安卓版的 Chrome 已经全面支持站点隔离。





##  HTTPS：让数据传输更安全
* 使用 HTTP 传输的内容很容易被中间人窃取、伪造和篡改，通常我们把这种攻击方式称为中间人攻击。
* 在将 HTTP 数据提交给 TCP 层之后，数据会经过用户电脑、WiFi 路由器、运营商和目标服务器，在这中间的每个环节中，数据都有可能被窃取或篡改。
* 比如用户电脑被黑客安装了恶意软件，那么恶意软件就能抓取和篡改所发出的 HTTP 请求的内容。或者用户一不小心连接上了 WiFi 钓鱼路由器，那么数据也都能被黑客抓取或篡改。
### 在 HTTP 协议栈中引入安全层
* HTTPS 并非是一个新的协议，通常 HTTP 直接和 TCP 通信，HTTPS 则先和安全层通信，然后安全层再和 TCP 层通信。
* HTTPS 所有的安全核心都在安全层，它不会影响到上面的 HTTP 协议，也不会影响到下面的 TCP/IP
* 安全层有两个主要的职责：对发起 HTTP 请求的数据进行加密操作和对接收到 HTTP 的内容进行解密操作。
### 第一版：使用对称加密
* 所谓对称加密是指加密和解密都使用的是相同的密钥。
* HTTPS 首先要协商加解密方式，这个过程就是 HTTPS 建立安全连接的过程。为了让加密的密钥更加难以破解，我们让服务器和客户端同时决定密钥，具体过程如下：
1. 浏览器发送它所支持的加密套件列表和一个随机数 client-random，这里的加密套件是指加密的方法，加密套件列表就是指浏览器能支持多少种加密方法列表。
2. 服务器会从加密套件列表中选取一个加密套件，然后还会生成一个随机数 service-random，并将 service-random 和加密套件列表返回给浏览器。
3. 最后浏览器和服务器分别返回确认消息。
4. 这样浏览器端和服务器端都有相同的 client-random 和 service-random 了，然后它们再使用相同的方法将 client-random 和 service-random 混合起来生成一个密钥 master secret，有了密钥 master secret 和加密套件之后，双方就可以进行数据的加密传输了。
* 虽然这个版本能够很好地工作，但是其中传输 client-random 和 service-random 的过程却是明文的，这意味着黑客也可以拿到协商的加密套件和双方的随机数，由于利用随机数合成密钥的算法是公开的，所以黑客拿到随机数之后，也可以合成密钥，这样数据依然可以被破解，那么黑客也就可以使用密钥来伪造或篡改数据了。
### 第二版：使用非对称加密
* 非对称加密算法有 A、B 两把密钥，如果你用 A 密钥来加密，那么只能使用 B 密钥来解密；反过来，如果你要 B 密钥来加密，那么只能用 A 密钥来解密。
* 在 HTTPS 中，服务器会将其中的一个密钥通过明文的形式发送给浏览器，我们把这个密钥称为公钥，服务器自己留下的那个密钥称为私钥。顾名思义，公钥是每个人都能获取到的，而私钥只有服务器才能知道，不对任何人公开。
* 我们来分析下使用非对称加密的请求流程。
1. 首先浏览器还是发送加密套件列表给服务器。
2. 然后服务器会选择一个加密套件，不过和对称加密不同的是，使用非对称加密时服务器上需要有用于浏览器加密的公钥和服务器解密 HTTP 数据的私钥，由于公钥是给浏览器加密使用的，因此服务器会将加密套件和公钥一道发送给浏览器。
3. 最后就是浏览器和服务器返回确认消息。
4. 这样浏览器端就有了服务器的公钥，在浏览器端向服务器端发送数据时，就可以使用该公钥来加密数据。由于公钥加密的数据只有私钥才能解密，所以即便黑客截获了数据和公钥，他也是无法使用公钥来解密数据的。
* 因此采用非对称加密，就能保证浏览器发送给服务器的数据是安全的了，这看上去似乎很完美，不过这种方式依然存在两个严重的问题。
1. 第一个是非对称加密的效率太低。这会严重影响到加解密数据的速度，进而影响到用户打开页面的速度。
2. 第二个是无法保证服务器发送给浏览器的数据安全。虽然浏览器端可以使用公钥来加密，但是服务器端只能采用私钥来加密，私钥加密只有公钥能解密，但黑客也是可以获取得到公钥的，这样就不能保证服务器端数据的安全了。
### 第三版：对称加密和非对称加密搭配使用
* 在传输数据阶段依然使用对称加密，但是对称加密的密钥我们采用非对称加密来传输。
* 改造后的流程是这样的：
1. 首先浏览器向服务器发送对称加密套件列表、非对称加密套件列表和随机数 client-random；
2. 服务器保存随机数 client-random，选择对称加密和非对称加密的套件，然后生成随机数 service-random，向浏览器发送选择的加密套件、service-random 和公钥；
3. 浏览器保存公钥，并生成随机数 pre-master，然后利用公钥对 pre-master 加密，并向服务器发送加密后的数据；
4. 最后服务器拿出自己的私钥，解密出 pre-master 数据，并返回确认消息。
5. 到此为止，服务器和浏览器就有了共同的 client-random、service-random 和 pre-master，然后服务器和浏览器会使用这三组随机数生成对称密钥，因为服务器和浏览器使用同一套方法来生成密钥，所以最终生成的密钥也是相同的。
6. 需要特别注意的一点，pre-master 是经过公钥加密之后传输的，所以黑客无法获取到 pre-master，这样黑客就无法生成密钥，也就保证了黑客无法破解传输过程中的数据了
### 第四版：添加数字证书
* 通过对称和非对称混合方式，我们完美地实现了数据的加密传输。不过这种方式依然存在着问题，比如我要打开a的官网，但是黑客通过 DNS 劫持将a的官网的 IP 地址替换成了黑客的 IP 地址，这样我访问的其实是黑客的服务器了，黑客就可以在自己的服务器上实现公钥和私钥，而对浏览器来说，它完全不知道现在访问的是个黑客的站点。
* 结合实际生活中的一个例子，比如你要买房子，首先你需要给房管局提交你买房的材料，包括银行流水、银行证明、身份证等，然后房管局工作人员在验证无误后，会发给你一本盖了章的房产证，房产证上包含了你的名字、身份证号、房产地址、实际面积、公摊面积等信息。在这个例子中，你之所以能证明房子是你自己的，是因为引进了房管局这个权威机构，并通过这个权威机构给你颁发一个证书：房产证。
* 对于浏览器来说，数字证书有两个作用：一个是通过数字证书向浏览器证明服务器的身份，另一个是数字证书里面包含了服务器公钥。
* 相较于第三版的 HTTPS 协议，这里主要有两点改变：
1. 服务器没有直接返回公钥给浏览器，而是返回了数字证书，而公钥正是包含在数字证书中的；
2. 在浏览器端多了一个证书验证的操作，验证了证书之后，才继续后续流程。
* 通过引入数字证书，我们就实现了服务器的身份认证功能，这样即便黑客伪造了服务器，但是由于证书是没有办法伪造的，所以依然无法欺骗用户。


























##  如何计算Chrome中渲染进程的个数？
* 同一站点，从 A 标签页中打开 B 标签页，就会使用同一个渲染进程，而分别打开这两个标签页，会分别使用不同的渲染进程
### 标签页之间的连接
* 第一种是通过<a>标签来和新标签建立连接
* 还可以通过 JavaScript 中的 window.open 方法来和新标签页建立连接
* 通过上述两种方式打开的新标签页，不论这两个标签页是否属于同一站点，他们之间都能通过 opener 来建立连接，所以他们之间是有联系的。在 WhatWG 规范中，把这一类具有相互连接关系的标签页称为浏览上下文组 ( browsing context group)。
* 既然提到浏览上下文组，就有必要提下浏览上下文，通常情况下，我们把一个标签页所包含的内容，诸如 window 对象，历史记录，滚动条位置等信息称为浏览上下文。这些通过脚本相互连接起来的浏览上下文就是浏览上下文组。
* Chrome 浏览器会将浏览上下文组中属于同一站点的标签分配到同一个渲染进程中，这是因为如果一组标签页，既在同一个浏览上下文组中，又属于同一站点，那么它们可能需要在对方的标签页中执行脚本。因此，它们必须运行在同一渲染进程中。
### 一个“例外”
* 通常，将 noopener 的值引入 rel 属性中，就是告诉浏览器通过这个链接打开的标签页中的 opener 值设置为 null，引入 noreferrer 是告诉浏览器，新打开的标签页不要有引用关系。
### 站点隔离
* 目前 Chrome 浏览器已经默认实现了站点隔离的功能，这意味着标签页中的 iframe 也会遵守同一站点的分配原则，如果标签页中的 iframe 和标签页是同一站点，并且有连接关系，那么标签页依然会和当前标签页运行在同一个渲染进程中，如果 iframe 和标签页不属于同一站点，那么 iframe 会运行在单独的渲染进程中。



## 任务调度：有了setTimeOut，为什么还要使用rAF？
* 用 JavaScript 实现高性能的动画，那就得使用 requestAnimationFrame 这个 API，我们简称 rAF，那么为什么都推荐使用 rAF 而不是 setTimeOut 呢？
1. 要解释清楚这个问题，就要从渲染进程的任务调度系统讲起，理解了渲染进程任务调度系统，你自然就明白了 rAF 和 setTimeOut 的区别。
2. 渲染进程内部的大多数任务都是在主线程上执行的，诸如 JavaScript 执行、DOM、CSS、计算布局、V8 的垃圾回收等任务。要让这些任务能够在主线程上有条不紊地运行，就需要引入消息队列。
3. 主线程维护了一个普通的消息队列和一个延迟消息队列，调度模块会按照规则依次取出这两个消息队列中的任务，并在主线程上执行。

* CSS 动画是由渲染进程自动处理的，所以渲染进程会让 CSS 渲染每帧动画的过程与 VSync 的时钟保持一致, 这样就能保证 CSS 动画的高效率执行。
* 但是 JavaScript 是由用户控制的，如果采用 setTimeout 来触发动画每帧的绘制，那么其绘制时机是很难和 VSync 时钟保持一致的，所以 JavaScript 中又引入了 window.requestAnimationFrame，用来和 VSync 的时钟周期同步

### 单消息队列的队头阻塞问题
* 渲染主线程会按照先进先出的顺序执行消息队列中的任务，具体地讲，当产生了新的任务，渲染进程会将其添加到消息队列尾部，在执行任务过程中，渲染进程会顺序地从消息队列头部取出任务并依次执行。在最初，采用这种方式没有太大的问题，因为页面中的任务还不算太多，渲染主线程也不是太繁忙。
* 不过浏览器是向前不停进化的，其进化路线体现在架构的调整、功能的增加以及更加精细的优化策略等方面，这些变化让渲染进程所需要处理的任务变多了，对应的渲染进程的主线程也变得越拥挤。
* 在基于这种单消息队列的架构下，如果用户发出一个点击事件或者缩放页面的事件，而在此时，该任务前面可能还有很多不太重要的任务在排队等待着被执行，诸如 V8 的垃圾回收、DOM 定时器等任务，如果执行这些任务需要花费的时间过久的话，那么就会让用户产生卡顿的感觉。
* 因此，在单消息队列架构下，存在着低优先级任务会阻塞高优先级任务的情况，比如在一些性能不高的手机上，有时候滚动页面需要等待一秒以上。这像极了我们在介绍 HTTP 协议时所谈论的队头阻塞问题
### Chromium 是如何解决队头阻塞问题的？

### 第一次迭代：引入一个高优先级队列
* 在交互阶段，下面几种任务都应该视为高优先级的任务：
1. 通过鼠标触发的点击任务、滚动页面任务；
2. 通过手势触发的页面缩放任务；
3. 通过 CSS、JavaScript 等操作触发的动画特效等任务
* 这些任务被触发后，用户想立即得到页面的反馈，所以我们需要让这些任务能够优先与其他的任务执行。
* 要实现这种效果，我们可以增加一个高优级的消息队列，将高优先级的任务都添加到这个队列里面，然后优先执行该消息队列中的任务。
* 我们使用了一个优先级高的消息队列和一个优先级低消息队列，渲染进程会将它认为是紧急的任务添加到高优先级队列中，不紧急的任务就添加到低优先级的队列中。
* 然后我们再在渲染进程中引入一个任务调度器，负责从多个消息队列中选出合适的任务，通常实现的逻辑，先按照顺序从高优先级队列中取出任务，如果高优先级的队列为空，那么再按照顺序从低优级队列中取出任务。
* 还可以更进一步，将任务划分为多个不同的优先级，来实现更加细粒度的任务调度，比如可以划分为高优先级，普通优先级和低优先级
* 不过大多数任务需要保持其相对执行顺序，如果将用户输入的消息或者合成消息添加进多个不同优先级的队列中，那么这种任务的相对执行顺序就会被打乱，甚至有可能出现还未处理输入事件，就合成了该事件要显示的图片。因此我们需要让一些相同类型的任务保持其相对执行顺序。
### 第二次迭代：根据消息类型来实现消息队列
* 我们可以为不同类型的任务创建不同优先级的消息队列，比如：
1. 可以创建输入事件的消息队列，用来存放输入事件。
2. 可以创建合成任务的消息队列，用来存放合成事件。
3. 可以创建默认消息队列，用来保存如资源加载的事件和定时器回调等事件。
4. 还可以创建一个空闲消息队列，用来存放 V8 的垃圾自动垃圾回收这一类实时性不高的事件。
* 但是它依然存在着问题，那就是这几种消息队列的优先级都是固定的，任务调度器会按照这种固定好的静态的优先级来分别调度任务。
* 页面大致的生存周期大体分为两个阶段，加载阶段和交互阶段。
* 虽然在交互阶段，采用上述这种静态优先级的策略没有什么太大问题的，但是在页面加载阶段，如果依然要优先执行用户输入事件和合成事件，那么页面的解析速度将会被拖慢。Chromium 团队曾测试过这种情况，使用静态优先级策略，网页的加载速度会被拖慢 14%。
### 第三次迭代：动态调度策略
* 页面加载阶段的场景，在这个阶段，用户的最高诉求是在尽可能短的时间内看到页面，至于交互和合成并不是这个阶段的核心诉求，因此我们需要调整策略，在加载阶段将页面解析，JavaScript 脚本执行等任务调整为优先级最高的队列，降低交互合成这些队列的优先级。
* 页面加载完成之后就进入了交互阶段
1. 在显卡中有一块叫着前缓冲区的地方，这里存放着显示器要显示的图像，显示器会按照一定的频率来读取这块前缓冲区，并将前缓冲区中的图像显示在显示器上，不同的显示器读取的频率是不同的，通常情况下是 60HZ，也就是说显示器会每间隔 1/60 秒就读取一次前缓冲区。
2. 如果浏览器要更新显示的图片，那么浏览器会将新生成的图片提交到显卡的后缓冲区中，提交完成之后，GPU 会将后缓冲区和前缓冲区互换位置，也就是前缓冲区变成了后缓冲区，后缓冲区变成了前缓冲区，这就保证了显示器下次能读取到 GPU 中最新的图片。
3. 显示器从前缓冲区读取图片，和浏览器生成新的图像到后缓冲区的过程是不同步的，这种显示器读取图片和浏览器生成图片不同步，容易造成众多问题。
如果渲染进程生成的帧速比屏幕的刷新率慢，那么屏幕会在两帧中显示同一个画面，当这种断断续续的情况持续发生时，用户将会很明显地察觉到动画卡住了。
如果渲染进程生成的帧速率实际上比屏幕刷新率快，那么也会出现一些视觉上的问题，比如当帧速率在 100fps 而刷新率只有 60Hz 的时候，GPU 所渲染的图像并非全都被显示出来，这就会造成丢帧现象。
就算屏幕的刷新频率和 GPU 更新图片的频率一样，由于它们是两个不同的系统，所以屏幕生成帧的周期和 VSync 的周期也是很难同步起来的。
4. 所以 VSync 和系统的时钟不同步就会造成掉帧、卡顿、不连贯等问题。为了解决这些问题，就需要将显示器的时钟同步周期和浏览器生成页面的周期绑定起来。
5. 当显示器将一帧画面绘制完成后，并在准备读取下一帧之前，显示器会发出一个垂直同步信号（vertical synchronization）给 GPU，简称 VSync。这时候浏览器就会充分利用好 VSync 信号。
6. 具体地讲，当 GPU 接收到 VSync 信号后，会将 VSync 信号同步给浏览器进程，浏览器进程再将其同步到对应的渲染进程，渲染进程接收到 VSync 信号之后，就可以准备绘制新的一帧了
7. 当渲染进程接收到用户交互的任务后，接下来大概率是要进行绘制合成操作，因此我们可以设置，当在执行用户交互的任务时，将合成任务的优先级调整到最高。
8. 处理完成 DOM，计算好布局和绘制，就需要将信息提交给合成线程来合成最终图片了，然后合成线程进入工作状态。
* 现在的场景是合成线程在工作了，那么我们就可以把下个合成任务的优先级调整为最低，并将页面解析、定时器等任务优先级提升。
* 在合成完成之后，合成线程会提交给渲染主线程提交完成合成的消息，如果当前合成操作执行的非常快，比如从用户发出消息到完成合成操作只花了 8 毫秒，因为 VSync 同步周期是 16.66（1/60）毫秒，那么这个 VSync 时钟周期内就不需要再次生成新的页面了。那么从合成结束到下个 VSync 周期内，就进入了一个空闲时间阶段，那么就可以在这段空闲时间内执行一些不那么紧急的任务，比如 V8 的垃圾回收，或者通过 window.requestIdleCallback() 设置的回调任务等，都会在这段空闲时间内执行。4. 第四次迭代：任务饿死
### 第四次迭代：任务饿死
* 以上方案看上去似乎非常完美了，不过依然存在一个问题，那就是在某个状态下，一直有新的高优先级的任务加入到队列中，这样就会导致其他低优先级的任务得不到执行，这称为任务饿死。
* Chromium 为了解决任务饿死的问题，给每个队列设置了执行权重，也就是如果连续执行了一定个数的高优先级的任务，那么中间会执行一次低优先级的任务，这样就缓解了任务饿死的情况。




## 加载阶段性能：使用Audits来优化Web性能

### 到底什么是 Web 性能?
* Web 性能描述了 Web 应用在浏览器上的加载和显示的速度。
* 关于 Web 应用的速度，我们需要从两个阶段来考虑：页面加载阶段；页面交互阶段。
### 性能检测工具：Performance vs Audits
* Chrome 为我们提供了非常完善的性能检测工具：Performance 和 Audits，它们能够准确统计页面在加载阶段和运行阶段的一些核心数据，诸如任务执行记录、首屏展示花费的时长等，有了这些数据我们就能很容易定位到 Web 应用的性能瓶颈 。
* 首先 Performance 非常强大，因为它为我们提供了非常多的运行时数据，利用这些数据我们就可以分析出来 Web 应用的瓶颈。但是要完全学会其使用方式却是非常有难度的，其难点在于这些数据涉及到了特别多的概念，而这些概念又和浏览器的系统架构、消息循环机制、渲染流水线等知识紧密联系在了一起。
* 相反，Audtis 就简单了许多，它将检测到的细节数据隐藏在背后，只提供给我们一些直观的性能数据，同时，还会给我们提供一些优化建议。
### 利用 Audits 生成 Web 性能报告
* 这里我们可以拿B 站作为分析的列子。
* 首先我们打开浏览器的隐身窗口，Windows 系统下面的快捷键是 Control+Shift+N，Mac 系统下面的快捷键是 Command+Shift+N。我们需要在 Chrome 的隐身模式下工作，这样可以确保我们安装的扩展、浏览器缓存、Cookie 等数据不会影响到检测结果。
* 然后在隐身窗口中输入 B 站的网站。
* 打开 Chrome 的开发者工具，选择 Audits 标签。
* 在生成报告之前，我们需要先配置 Audits，配置模块主要有两部分组成，一个是监测类型 (Categories)，另外一个是设备类型 (Device)。
* 监控类型 (Categories) 是指需要监控哪些内容，这里有五个对应的选项，它们的功能分别是：
1. 监测并分析 Web 性能 (Performance)
2. 监测并分析 PWA(Progressive Web App) 程序的性能；
3. 监测并分析 Web 应用是否采用了最佳实践策略 (Best practices)；
4. 监测并分析是否实施了无障碍功能 (Accessibility)，无障碍功能让一些身体有障碍的人可以方便地浏览你的 Web 应用。
5. 监测并分析 Web 应用是否采实施了 SEO 搜素引擎优化 (SEO)。
* 设备 (Device) 部分，它给了我们两个选项，Moblie 选项是用来模拟移动设备环境的，另外一个 Desktop 选项是用来模拟桌面环境的。这里我们选择移动设备选项，因为目前大多数流量都是由移动设备产生的，所以移动设备上的 Web 性能显得更加重要。
* 配置好选项之后，我们就可以点击最上面的生成报告 (Generate report) 按钮来生成报告了。
### 解读性能报告
* 中间圆圈中的数字表示该站点在加载过程中的总体 Web 性能得分，总分是 100 分。
* Audits 除了生成性能指标以外，还会分析该站点并提供了很多优化建议，我们可以根据这些建议来改进 Web 应用以获得更高的得分，进而获得更好的用户体验效果。
* 报告的第一个部分是性能指标 (Metrics)，性能指标下面一共有六项内容，这六项内容分别对应了从 Web 应用的加载到页面展示完成的这段时间中，各个阶段所消耗的时长。在中间还有一个 View Trace 按钮，点击该按钮可以跳转到 Performance 标签，并且查看这些阶段在 Performance 中所对应的位置。
* 报告的第二个部分是可优化项 (Opportunities)，这些可优化项是 Audits 发现页面中的一些可以直接优化的部分，你可以对照 Audits 给的这些提示来优化你的 Web 应用。
* 报告的第三部分是手动诊断 (Diagnostics)，在手动诊断部分，采集了一些可能存在性能问题的指标，这些指标可能会影响到页面的加载性能，Audits 把详情列出来，并让你依据实际情况，来手动排查每一项。
* 报告的最后一部分是运行时设置 (Runtime Settings)，这是运行时的一些基本数据，如果选择移动设备模式，你可以看到发送网络请求时的 User Agent 会变成设备相关信息，还有会模拟设备的网速，这个体现在网络限速上。
### 根据性能报告优化 Web 性能
* 最直接的方式是想办法提高性能指标的分数，而性能指标的分数是由六项指标决定的，它们分别是
1. 首次绘制 (First Paint)；
2. 首次有效绘制 (First Meaningfull Paint)；
3. 首屏时间 (Speed Index)；
4. 首次 CPU 空闲时间 (First CPU Idle)；
5. 完全可交互时间 (Time to Interactive)；
6. 最大估计输入延时 (Max Potential First Input Delay)。
* 在渲染进程确认要渲染当前的请求后，渲染进程会创建一个空白页面，我们把创建空白页面的这个时间点称为 First Paint，简称 FP。
1. 关键资源包括了 JavaScript 文件和 CSS 文件，因为关键资源会阻塞页面的渲染，所以我们需要等待关键资源加载完成后，才能执行进一步的页面绘制。
* 当页面中绘制了第一个像素时，我们把这个时间点称为 First Content Paint，简称 FCP。
* 接下来继续执行 JavaScript 脚本，当首屏内容完全绘制完成时，我们把这个时间点称为 Largest Content Paint，简称 LCP。
* 在 FCP 和 LCP 中间，还有一个 FMP，这个是首次有效绘制，由于 FMP 计算复杂，而且容易出错，现在不推荐使用该指标
* 接下来 JavaScript 脚本执行结束，渲染进程判断该页面的 DOM 生成完毕，于是触发 DOMContentLoad 事件。等所有资源都加载结束之后，再触发 onload 事件。
```
第一项指标 FP，如果 FP 时间过久，那么直接说明了一个问题，那就是页面的 HTML 文件可能由于网络原因导致加载时间过久
第二项是 FMP，,如果 FMP 和 LCP 消耗时间过久，那么有可能是加载关键资源花的时间过久，也有可能是 JavaScript 执行过程中所花的时间过久，所以我们可以针对具体的情况来具体分析。
第三项是首屏时间 (Speed Index)，这就是我们上面提到的 LCP，它表示填满首屏页面所消耗的时间，首屏时间的值越大，那么加载速度越慢，具体的优化方式同优化第二项 FMP 是一样。
第四项是首次 CPU 空闲时间 (First CPU Idle)，也称为 First Interactive，它表示页面达到最小化可交互的时间，也就是说并不需要等到页面上的所有元素都可交互，只要可以对大部分用户输入做出响应即可。要缩短首次 CPU 空闲时长，我们就需要尽可能快地加载完关键资源，尽可能快地渲染出来首屏内容，因此优化方式和第二项 FMP 和第三项 LCP 是一样的。
第五项是完全可交互时间 (Time to Interactive)，简称 TTI，它表示页面中所有元素都达到了可交互的时长。简单理解就这时候页面的内容已经完全显示出来了，所有的 JavaScript 事件已经注册完成，页面能够对用户的交互做出快速响应，通常满足响应速度在 50 毫秒以内。如果要解决 TTI 时间过久的问题，我们可以推迟执行一些和生成页面无关的 JavaScript 工作。
第六项是最大估计输入延时 (Max Potential First Input Delay），这个指标是估计你的 Web 页面在加载最繁忙的阶段， 窗口中响应用户输入所需的时间，为了改善该指标，我们可以使用 WebWorker 来执行一些计算，从而释放主线程。另一个有用的措施是重构 CSS 选择器，以确保它们执行较少的计算。

```



## 页面性能工具：如何使用Performance？
* 通常，使用 Performance 需要分三步走：
1. 第一步是配置 Performance；
2. 第二步是生成报告页；
3. 第三步就是人工分析报告页，并找出页面的性能瓶颈。
### 配置 Performance
* 我们可以设置该区域中的“Network”来限制网络加载速度，设置“CPU”来限制 CPU 的运算速度。通过设置，我们就可以在 Chrome 浏览器上来模拟手机等性能不高的设备了。
* 不同于 Audits 只能监控加载阶段的性能数据，Performance 还可以监控交互阶段的性能数据，不过 Performance 是分别录制这两个阶段的，黑色按钮是用来记录交互阶段性能数据的，下面那个带箭头的圆圈形按钮用来记录加载阶段的性能数据。
* 当你录制加载阶段的性能数据时，Performance 会重新刷新页面，并等到页面完全渲染出来后，Performance 就会自动停止录制。
* 如果你是录制交互阶段的性能时，那么需要手动停止录制过程。
### 认识报告页
* 分为三个主要的部分，分别为概览面板、性能指标面板和详情面板。
* 概览面板
1. 引入了时间线，Performance 就会将几个关键指标，诸如页面帧速 (FPS)、CPU 资源消耗、网络请求流量、V8 内存使用量 (堆内存) 等，按照时间顺序做成图表的形式展现出来，这就是概览面板
2. 如果 FPS 图表上出现了红色块，那么就表示红色块附近渲染出一帧所需时间过久，帧的渲染时间过久，就有可能导致页面卡顿。
3. 如果 CPU 图形占用面积太大，表示 CPU 使用率就越高，那么就有可能因为某个 JavaScript 占用太多的主线程时间，从而影响其他任务的执行。
4. 如果 V8 的内存使用量一直在增加，就有可能是某种原因导致了内存泄漏。
* 性能面板
1. 在性能面板中，记录了非常多的性能指标项，比如 Main 指标记录渲染主线程的任务执行过程，Compositor 指标记录了合成线程的任务执行过程，GPU 指标记录了 GPU 进程主线程的任务执行过程。
2. 简而言之，我们通过概览面板来定位问题的时间节点，然后再使用性能面板分析该时间节点内的性能数据。
*  解读性能面板的各项指标
1. 一条完整的渲染流水线包括了解析 HTML 文件生成 DOM、解析 CSS 生成 CSSOM、执行 JavaScript、样式计算、构造布局树、准备绘制列表、光栅化、合成、显示等一系列操作。
2. 渲染流水线主要是在渲染进程中执行的，在执行渲染流水线的过程中，渲染进程又需要网络进程、浏览器进程、GPU 等进程配合，才能完成如此复杂的任务。另外在渲染进程内部，又有很多线程来相互配合。
3. 主线程上跑了特别多的任务，诸如渲染流水线的大部分流程，JavaScript 执行、V8 的垃圾回收、定时器设置的回调任务等等，因此 Main 指标的内容非常多，而且非常重要，所以我们在使用 Perofrmance 的时候，大部分时间都是在分析 Main 指标。
4. 通过渲染流水线，我们知道了渲染主线程在生成层树 (LayerTree) 之后，然后根据层树生成每一层的绘制列表，我们把这个过程称为绘制 (Paint)。
5. 在绘制阶段结束之后，渲染主线程会将这些绘列表制提交 (commit)给合成线程，并由合成线程合成出来漂亮的页面。因此，监控合成线程的任务执行记录也相对比较重要，所以 Chrome 又在性能面板中引入了Compositor 指标，也就是合成线程的任务执行记录。
6. 在合成线程执行任务的过程中，还需要 GPU 进程的配合来生成位图，我们把这个 GPU 生成位图的过程称为光栅化。
7. 如果合成线程直接和 GPU 进程进行通信，那么势必会阻塞后面的合成任务，因此合成线程又维护了一个光栅化线程池 (Raster)，用来让 GPU 执行光栅化的任务。
8. 因为光栅化线程池和 GPU 进程中的任务执行也会影响到页面的性能，所以性能面板也添加了这两个指标，分别是 Raster 指标和 GPU 指标。因为 Raster 是线程池，所以如果你点开 Raster 项，可以看到它维护了多个线程。
9. 渲染进程中除了有主线程、合成线程、光栅化线程池之外，还维护了一个 IO 线程，IO 线程主要用来接收用户输入事件、网络事件、设备相关等事件，如果事件需要渲染主线程来处理，那么 IO 线程还会将这些事件转发给渲染主线程。在性能面板上，Chrome_ChildIOThread 指标对应的就是 IO 线程的任务记录。
10. Network 指标，网络记录展示了页面中的每个网络请求所消耗的时长，并以瀑布流的形式展现。这块内容和网络面板的瀑布流类似，之所以放在性能面板中是为了方便我们和其他指标对照着分析。
11. 第二个是 Timings 指标，用来记录一些关键的时间节点在何时产生的数据信息，诸如 FP、FCP、LCP 等。
12. 第三个是 Frames 指标，也就是浏览器生成每帧的记录，我们知道页面所展现出来的画面都是由渲染进程一帧一帧渲染出来的，帧记录就是用来记录渲染进程生成所有帧信息，包括了渲染出每帧的时长、每帧的图层构造等信息，你可以点击对应的帧，然后在详细信息面板里面查看具体信息。
13. 第四个是 Interactions 指标，用来记录用户交互操作，比如点击鼠标、输入文字等交互信息。
* 详情面板
1.你可以通过在性能面板中选中性能指标中的任何历史数据，然后选中记录的细节信息就会展现在详情面板中了。


## 性能分析工具：如何分析Performance中的Main指标？

### 任务 vs 过程
* 渲染进程中维护了消息队列，如果通过 SetTimeout 设置的回调函数，通过鼠标点击的消息事件，都会以任务的形式添加消息队列中，然后任务调度器会按照一定规则从消息队列中取出合适的任务，并让其在渲染主线程上执行。
* Main 指标就记录渲染主线上所执行的全部任务，以及每个任务的详细执行过程。
* 每个灰色横条就对应了一个任务，灰色长条的长度对应了任务的执行时长。通常，渲染主线程上的任务都是比较复杂的，如果只单纯记录任务执行的时长，那么依然很难定位问题，因此，还需要将任务执行过程中的一些关键的细节记录下来，这些细节就是任务的过程，灰线下面的横条就是一个个过程，同样这些横条的长度就代表这些过程执行的时长。
### 分析页面加载过程

```

<html>
<head>
    <title>Main</title>
    <style>
        area {
            border: 2px ridge;
        }


        box {
            background-color: rgba(106, 24, 238, 0.26);
            height: 5em;
            margin: 1em;
            width: 5em;
        }
    </style>
</head>


<body>
    <div class="area">
        <div class="box rAF"></div>
    </div>
    <br>
    <script>
        function setNewArea() {
            let el = document.createElement('div')
            el.setAttribute('class', 'area')
            el.innerHTML = '<div class="box rAF"></div>'
            document.body.append(el)
        }
        setNewArea()   
    </script>
</body>
</html>

加载过程主要分为三个阶段，它们分别是：

1. 导航阶段，该阶段主要是从网络进程接收 HTML 响应头和 HTML 响应体。
2. 解析 HTML 数据阶段，该阶段主要是将接收到的 HTML 数据转换为 DOM 和 CSSOM。
3. 生成可显示的位图阶段，该阶段主要是利用 DOM 和 CSSOM，经过计算布局、生成层树 (LayerTree)、生成绘制列表 (Paint)、完成合成等操作，生成最终的图片。



```
* 导航阶段
1. 当你点击了 Performance 上的重新录制按钮之后，浏览器进程会通知网络进程去请求对应的 URL 资源；一旦网络进程从服务器接收到 URL 的响应头，便立即判断该响应头中的 content-type 字段是否属于 text/html 类型；如果是，那么浏览器进程会让当前的页面执行退出前的清理操作，比如执行 JavaScript 中的 beforeunload 事件，清理操作执行结束之后就准备显示新页面了，这包括了解析、布局、合成、显示等一系列操作。
2. 因此，在导航阶段，这些任务实际上是在老页面的渲染主线程上执行的。
3. 当你点击重新加载按钮后:
第一个子过程就是 Send request，该过程表示网络请求已被发送。然后该任务进入了等待状态。
接着由网络进程负责下载资源，当接收到响应头的时候，该任务便执行 Receive Respone 过程，该过程表示接收到 HTTP 的响应头了。
接着执行 DOM 事件：pagehide、visibilitychange 和 unload 等事件，如果你注册了这些事件的回调函数，那么这些回调函数会依次在该任务中被调用。
这些事件被处理完成之后，那么接下来就接收 HTML 数据了，这体现在了 Recive Data 过程，Recive Data 过程表示请求的数据已被接收，如果 HTML 数据过多，会存在多个 Receive Data 过程。
等到所有的数据都接收完成之后，渲染进程会触发另外一个任务，该任务主要执行 Finish load 过程，该过程表示网络请求已经完成。
* 解析 HTML 数据阶段
1. 这个阶段的主要任务就是通过解析 HTML 数据、解析 CSS 数据、执行 JavaScript 来生成 DOM 和 CSSOM。
2. 其中一个主要的过程是 HTMLParser，顾名思义，这个过程是用来解析 HTML 文件，解析的就是上个阶段接收到的 HTML 数据。
在 ParserHTML 的过程中，如果解析到了 script 标签，那么便进入了脚本执行过程
我们知道，要执行一段脚本我们需要首先编译该脚本，于是在 Evalute Script 过程中，先进入了脚本编译过程，脚本编译好之后，就进入程序执行过程，执行全局代码时，V8 会先构造一个 anonymous 过程，在执行 anonymous 过程中，会调用 setNewArea 过程，setNewArea 过程中又调用了 createElement，由于之后调用了 document.append 方法，该方法会触发 DOM 内容的修改，所以又强制执行了 ParserHTML 过程生成的新的 DOM。
DOM 生成完成之后，会触发相关的 DOM 事件，比如典型的 DOMContentLoaded，还有 readyStateChanged。
DOM 生成之后，ParserHTML 过程继续计算样式表，也就是 Reculate Style，这就是生成 CSSOM 的过程
* 生成可显示位图阶段
1. 生成页面上的位图。通常这需要经历布局 (Layout)、分层、绘制、合成等一系列操作
2. 在生成完了 DOM 和 CSSOM 之后，渲染主线程首先执行了一些 DOM 事件，诸如 readyStateChange、load、pageshow。具体地讲，如果你使用 JavaScript 监听了这些事件，那么这些监听的函数会被渲染主线程依次调用。
3. 接下来就正式进入显示流程了，大致过程如下所示。
首先执行布局，这个过程对应 Layout。
然后更新层树 (LayerTree)，这个过程对应Update LayerTree。
有了层树之后，就需要为层树中的每一层准备绘制列表了，这个过程就称为 Paint。
准备每层的绘制列表之后，就需要利用绘制列表来生成相应图层的位图了，这个过程对应 Composite Layers。
走到了 Composite Layers 这步，主线程的任务就完成了，接下来主线程会将合成的任务完全教给合成线程来执行
4. 我们再来梳理下最终图像是怎么显示出来的。
首先主线程执行到 Composite Layers 过程之后，便会将绘制列表等信息提交给合成线程，合成线程的执行记录你可以通过 Compositor 指标来查看。
合成线程维护了一个 Raster 线程池，线程池中的每个线程称为 Rasterize，用来执行光栅化操作，对应的任务就是 Rasterize Paint。
当然光栅化操作并不是在 Rasterize 线程中直接执行的，而是在 GPU 进程中执行的，因此 Rasterize 线程需要和 GPU 线程保持通信。
然后 GPU 生成图像，最终这些图层会被提交给浏览器进程，浏览器进程将其合成并最终显示在页面上。


## HTTPS：浏览器如何验证数字证书？
* HTTPS 使用了对称和非对称的混合加密方式，这解决了数据传输安全的问题；
* HTTPS 引入了中间机构 CA，CA 通过给服务器颁发数字证书，解决了浏览器对服务器的信任问题；
### 浏览器验证证书的流程
* 在浏览器和服务器建立 HTTPS 链接的过程中，浏览器首先会向服务器请求数字证书，之后浏览器要做的第一件事就是验证数字证书。
* 具体地讲，浏览器需要验证证书的有效期、证书是否被 CA 吊销、证书是否是合法的 CA 机构颁发的。
* 数字证书和身份证一样也是有时间期限的，所以第一部分就是验证证书的有效期，这部分比较简单，因为证书里面就含有证书的有效期，所以浏览器只需要判断当前时间是否在证书的有效期范围内即可。
* 有时候有些数字证书被 CA 吊销了，吊销之后的证书是无法使用的，所以第二部分就是验证数字证书是否被吊销了。通常有两种方式，一种是下载吊销证书列表 -CRL (Certificate Revocation Lists)，第二种是在线验证方式 -OCSP (Online Certificate Status Protocol) 
* 验证数字证书是否是 CA 机构颁发的，验证的流程非常简单：
1. 首先，浏览器利用证书的原始信息计算出信息摘要；
2. 然后，利用 CA 的公钥来解密数字证书中的数字签名，解密出来的数据也是信息摘要；
3. 最后，判断这两个信息摘要是否相等就可以了。

### 浏览器是怎么获取到 CA 公钥的？
* 通常，当你部署 HTTP 服务器的时候，除了部署当前的数字证书之外，还需要部署 CA 机构的数字证书，CA 机构的数字证书包括了 CA 的公钥，以及 CA 机构的一些基础信息。
* 服务器就有了两个数字证书:域名的数字证书；签名的 CA 机构的数字证书。
* 然后在建立 HTTPS 链接时，服务器会将这两个证书一同发送给浏览器，于是浏览器就可以获取到 CA 的公钥了。
* 如果有些服务器没有部署 CA 的数字证书，那么浏览器还可以通过网络去下载 CA 证书，不过这种方式多了一次证书下载操作，会拖慢首次打开页面的请求速度，一般不推荐使用。
### 证明 CA 机构的合法性
* 这里并没有一个非常好的方法来证明 CA 的合法性，妥协的方案是，直接在操作系统中内置这些 CA 机构的数字证书
* 我们将所有 CA 机构的数字证书都内置在操作系统中，这样当需要使用某 CA 机构的公钥时，我们只需要依据 CA 机构名称，就能查询到对应的数字证书了，然后再从数字证书中取出公钥。
* 不过这种方式依然存在问题，因为在实际情况下，CA 机构众多，因此操作系统不可能将每家 CA 的数字证书都内置进操作系统。

### 数字证书链
* 将颁发证书的机构划分为两种类型，根 CA(Root CAs)和中间 CA(Intermediates CAs)，通常申请者都是向中间 CA 去申请证书的，而根 CA 作用就是给中间 CA 做认证，一个根 CA 会认证很多中间的 CA，而这些中间 CA 又可以去认证其他的中间 CA。
### 如何验证根证书的合法性
* 其实浏览器的判断策略很简单，它只是简单地判断这个根证书在不在操作系统里面，如果在，那么浏览器就认为这个根证书是合法的，如果不在，那么就是非法的。





## 时势与英雄：HTTP的前世今生
### 创世纪
* URI：即统一资源标识符，作为互联网上资源的唯一身份；
* HTML：即超文本标记语言，描述超文本文档；
* HTTP：即超文本传输协议，用来传输超文本。
* 这三项技术在如今的我们看来已经是稀松平常，但在当时却是了不得的大发明。基于它们，就可以把超文本系统完美地运行在互联网上，让各地的人们能够自由地共享信息，蒂姆把这个系统称为“万维网”（World Wide Web），也就是我们现在所熟知的 Web。所以在这一年，我们的英雄“HTTP”诞生了，从此开始了它伟大的征途。
### HTTP/0.9
* 20 世纪 90 年代初期的互联网世界非常简陋，计算机处理能力低，存储容量小，网速很慢，还是一片“信息荒漠”。网络上绝大多数的资源都是纯文本，很多通信协议也都使用纯文本，所以 HTTP 的设计也不可避免地受到了时代的限制。
* 最初设想的系统里的文档都是只读的，所以只允许用“GET”动作从服务器上获取 HTML 文档，并且在响应请求之后立即关闭连接，功能非常有限。
### HTTP/1.0
* HTTP/1.0 版本在 1996 年正式发布。它在多方面增强了 0.9 版，形式上已经和我们现在的 HTTP 差别不大了，例如：
1. 增加了 HEAD、POST 等新方法；
2. 增加了响应状态码，标记可能的错误原因；
3. 引入了协议版本号概念；
4. 引入了 HTTP Header（头部）的概念，让 HTTP 处理请求和响应更加灵活；
5. 传输的数据不再仅限于文本。
* TTP/1.0 的发布对于当时正在蓬勃发展的互联网来说并没有太大的实际意义，各方势力仍然按照自己的意图继续在市场上奋力拼杀。
### HTTP/1.1
* 1995 年，网景的 Netscape Navigator 和微软的 Internet Explorer 开始了著名的“浏览器大战”，都希望在互联网上占据主导地位。这场战争的结果你一定早就知道了，最终微软的 IE 取得了决定性的胜利，而网景则“败走麦城”（但后来却凭借 Mozilla Firefox 又扳回一局）。
* 1999 年，HTTP/1.1 发布了 RFC 文档，编号为 2616，正式确立了延续十余年的传奇。从版本号我们就可以看到，HTTP/1.1 是对 HTTP/1.0 的小幅度修正。但一个重要的区别是：它是一个“正式的标准”，而不是一份可有可无的“参考文档”。这意味着今后互联网上所有的浏览器、服务器、网关、代理等等，只要用到 HTTP 协议，就必须严格遵守这个标准，相当于是互联网世界的一个“立法”。
* HTTP/1.1 主要的变更点有：
1. 增加了 PUT、DELETE 等新的方法；
2. 增加了缓存管理和控制；
3. 明确了连接管理，允许持久连接；
3. 允许响应数据分块（chunked），利于传输大文件；
4. 强制要求 Host 头，让互联网主机托管成为可能。
### HTTP/2
* 互联网标准化组织以 SPDY 为基础开始制定新版本的 HTTP 协议，最终在 2015 年发布了 HTTP/2，RFC 编号 7540。
* HTTP/2 的制定充分考虑了现今互联网的现状：宽带、移动、不安全，在高度兼容 HTTP/1.1 的同时在性能改善方面做了很大努力，主要的特点有：
1. 二进制协议，不再是纯文本；
2. 可发起多个请求，废弃了 1.1 里的管道；
3. 使用专用算法压缩头部，减少数据传输量；
4. 允许服务器主动向客户端推送数据；
5. 增强了安全性，“事实上”要求加密通信。
### HTTP/3
* 2018 年，互联网标准化组织 IETF 提议将“HTTP over QUIC”更名为“HTTP/3”并获得批准，HTTP/3 正式进入了标准化制订阶段，也许两三年后就会正式发布，到时候我们很可能会跳过 HTTP/2 直接进入 HTTP/3。




















































