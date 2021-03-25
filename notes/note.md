
## 数据类型
1. 基础类型存储在栈内存，被引用或拷贝时，会创建一个完全相等的变量；
   > `Undefined` `Null` `String` `Number` `Boolean` `Symbol` `BigInt`
2. 引用类型存储在堆内存，存储的是地址，多个引用指向同一个地址，这里会涉及一个“共享”的概念。
   > `Object`
     > `Array` `Date` `RegExp` `Function` `Math`