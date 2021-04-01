/**
 *假设有任意多张面额为 2 元、3 元、7 元的货币，现要用它们凑出 100 元，求总共有多少种可能性。
 */
function test1() {
  let count = 0;
  for (let i = 0; i <= 100 / 7; i++) {
    //这里针对j可以优化一波
    for (let j = 0; j <= 100 / 3; j++) {
      if (100 - i * 7 - j * 3 >= 0 && (100 - i * 7 - j * 3) % 2 == 0) {
        count += 1;
        console.log(
          `${count}:7元:${i}张,3元:${j}张,2元:${(100 - i * 7 - j * 3) / 2}张`
        );
      }
    }
  }
  console.log(`一共有${count}种可能性`);
}
//test1();
/**
 *
 * 查找出一个数组中，出现次数最多的那个元素的数值。
 * 例如，输入数组 a = [1,2,3,4,5,5,6 ] 中，查找出现次数最多的数值。
 * 从数组中可以看出，只有 5 出现了 2 次，其余都是 1 次。显然 5 出现的次数最多，则输出 5。
 */
function test2(arr) {
  //记录数组元素出现次数  采用map数据结构，查找的时间复杂度是o(1)
  let res = new Map();
  //出现最多次数
  let max = -1;
  for (let i = 0; i < arr.length; i++) {
    if (res.has(arr[i])) {
      res.set(arr[i], res.get(arr[i]) + 1);
    } else {
      res.set(arr[i], 1);
    }
  }
  //获取出现次数的最大值
  max = Math.max.apply(null, [...res.values()]);
  for (let [key, value] of res) {
    if (value === max) console.log(`${key}出现的次数最多，出现了${value}次`);
  }
}
//test2([1, 2, 3, 4, 5, 5, 6]);

/**
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
 * 有效字符串需满足：左括号必须与相同类型的右括号匹配，左括号必须以正确的顺序匹配。
 * 例如，{ [ ( ) ( ) ] } 是合法的，而 { ( [ ) ] } 是非法的。
 *
 *
 *
 * 思路：
 * 从左到右顺序遍历字符串。
 * 当出现左括号时，压栈。
 * 当出现右括号时，出栈。
 * 并且判断当前右括号，和被出栈的左括号是否是互相匹配的一对。
 * 如果不是，则字符串非法。当遍历完成之后，如果栈为空。则合法。
 */

function test3(data) {
  //左括号
  const typesLeft = ["(", "[", "{"];
  //右括号
  const typesRight = [")", "]", "}"];
  //括号
  const types = ["()", "[]", "{}"];

  //存储 模拟栈
  const store = [];

  for (let type of data) {
    //匹配到左括号时，进行入栈操作
    if (typesLeft.includes(type)) {
      store.push(type);
    } else {
      //匹配到右括号时，进行出栈操作，检验当前括号是否合法
      const left = store.pop();
      if (!types.includes(`${left}${type}`)) {
        console.log("非法字符串");
        break;
      }
    }
  }
}
//test3(['(','{','}','}',')'])

/**
 * 约瑟夫环是一个数学的应用问题，具体为，已知 n 个人（以编号 1，2，3...n 分别表示）围坐在一张圆桌周围。
 * 从编号为 k 的人开始报数，数到 m 的那个人出列；
 * 他的下一个人又从 1 开始报数，数到 m 的那个人又出列；
 * 依此规律重复下去，直到圆桌周围的人全部出列。
 * 这个问题的输入变量就是 n 和 m，即 n 个人和数到 m 的出列的人。输出的结果，就是 n 个人出列的顺序。
 * 这个问题，用队列的方法实现是个不错的选择。它的结果就是出列的顺序，恰好满足队列对处理顺序敏感的前提。因此，求解方式也是基于队列的先进先出原则。
 * 解法如下：
 * 先把所有人都放入循环队列中。注意这个循环队列的长度要大于或者等于 n。
 * 从第一个人开始依次出队列，出队列一次则计数变量 i 自增。如果 i 比 m 小，则还需要再入队列。
 * 直到i等于 m 的人出队列时，就不用再让这个人进队列了。而是放入一个用来记录出队列顺序的数组中。
 * 直到数完 n 个人为止。当队列为空时，则表示队列中的 n 个人都出队列了，这时结束队列循环，输出数组内记录的元素。
 */

//n个人，从编号为k的人开始报数，
function test4(persons, k, m) {
  //退出的人
  const exitPersons = [];
  //计数器
  let count = 1;

  //第一次
  for (let { name, num } of persons) {
    if (num < k) {
      persons.shift();
      persons.push({
        name,
        num,
      });
      continue;
    }
    break;
  }

  //还有人时
  while (persons.length) {
    const person = persons.shift();
    if (count < m) {
      persons.push(person);
      count++;
    } else {
      //找到目标后，重置计数器
      count = 1;
      exitPersons.push(person);
    }
  }
  //console.log(exitPersons);
}
// test4(
//   [
//     { name: "赵一", num: 1 },
//     { name: "钱二", num: 2 },
//     { name: "孙三", num: 3 },
//     { name: "李四", num: 4 },
//     { name: "周五", num: 5 },
//     { name: "吴六", num: 6 },
//     { name: "郑七", num: 7 },
//     { name: "王八", num: 8 },
//   ],
//   2,
//   4
// );

/**
 *          10
 *         /  \
 *        8   12
 *       / \  / \
 *      6   9 11 13
 * 给定一棵树，按照层次顺序遍历并打印这棵树。
 */
const root = {
  value: 10,
  left: { value: 8, left: { value: 6 }, right: { value: 9 } },
  right: { value: 12, left: { value: 11 }, right: { value: 13 } },
};
function test5(root) {
  //模拟队列
  const queue = [];
  //根节点入队列
  queue.push(root);
  while (queue.length) {
    //当前节点
    const current = queue.shift();
    console.log(current.value);
    //左节点
    if (current.left) {
      queue.push(current.left);
    }
    //右节点
    if (current.right) {
      queue.push(current.right);
    }
  }
}
//test5(root);

/**
 *          10
 *         /  \
 *        8   12
 *       / \  / \
 *      6   9 11 13
 * 二叉树的三种遍历方式
 */
//前序
function test6(node) {
  if (!node) return;
  console.log(node.value);
  test6(node.left);
  test6(node.right);
}
//test6(root)
//中序
function test7(node) {
  if (!node) return;
  test7(node.left);
  console.log(node.value);
  test7(node.right);
}
//test7(root)
//后序
function test8(node) {
  if (!node) return;
  test8(node.left);
  test8(node.right);
  console.log(node.value);
}
//test8(root)
/**
 * 给定一个整数数组 arr 和一个目标值 target，请你在该数组中找出加和等于目标值的那两个整数，并返回它们的在数组中下标。
 * 你可以假设，原数组中没有重复元素，而且有且只有一组答案。但是，数组中的元素只能使用一次。例如，arr = [1, 2, 3, 4, 5, 6]，target = 4。因为，arr[0] + arr[2] = 1 + 3 = 4 = target，则输出 0，2。
 */
function test9(data, target) {
  for (const item of data) {
    if (data.includes(target - item) && target - item !== item)
      console.log(`${target}=${item}+${target - item}`);
  }
}
//test9([1,2,3,4,5,6],4)

/**
 * 汉诺塔问题(递归)
 * 从左到右有 x、y、z 三根柱子，其中 x 柱子上面有从小叠到大的 n 个圆盘。现要求将 x 柱子上的圆盘移到 z 柱子上去。要求是，每次只能移动一个盘子，且大盘子不能被放在小盘子上面。求移动的步骤。
 * ---------------------------------------------
 * 我们的原问题是，把从小到大的 n 个盘子，从 x 移动到 z。
 * 我们可以将这个大问题拆解为以下 3 个小问题：
 * 把从小到大的 n-1 个盘子，从 x 移动到 y；
 * 接着把最大的一个盘子，从 x 移动到 z；
 * 再把从小到大的 n-1 个盘子，从 y 移动到 z。
 * --------------------------------------
 * 经过仔细分析可见，汉诺塔问题是完全可以用递归实现的。我们定义汉诺塔的递归函数为 hanio()。这个函数的输入参数包括了：
 * 3 根柱子的标记 x、y、z；
 * 待移动的盘子数量 n。
 * -----------------------------------
 * 具体代码如下所示，在代码中，hanio(n, x, y, z)，代表了把 n 个盘子由 x 移动到 z。根据分析，我们知道递归体包含 3 个步骤：
 * 把从小到大的 n-1 个盘子从 x 移动到 y，那么代码就是 hanio(n-1, x, z, y)；
 * 再把最大的一个盘子从 x 移动到 z，那么直接完成一次移动的动作就可以了；
 * 再把从小到大的 n-1 个盘子从 y 移动到 z，那么代码就是 hanio(n-1, y, x, z)。对于终止条件则需要判断 n 的大小。如果 n 等于 1，那么同样直接移动就可以了。
 */
function test10(n, x, y, z) {
  if (n < 1) return console.log("汉诺塔层数不能小于1");
  if (n === 1) return console.log(`移动${x}到${z}`);
  test10(n - 1, x, z, y);
  console.log(`移动${x}到${z}`);
  test10(n - 1, y, x, z);
}
//test10(3, "x", "y", "z");

/**
 * 斐波那契数列。(递归)
 * 斐波那契数列是：0，1，1，2，3，5，8，13，21，34，55，89，144……。
 * 你会发现，这个数列中元素的性质是，某个数等于它前面两个数的和；
 * 也就是 a[n+2] = a[n+1] + a[n]。至于起始两个元素，则分别为 0 和 1。
 * 在这个数列中的数字，就被称为斐波那契数。
 * ---------------------------------
 * 写一个函数，输入 x，输出斐波那契数列中第 x 位的元素。
 * 例如，输入 4，输出 2；输入 9，输出 21。
 * 要求：需要用递归的方式来实现。
 */
const target = 9;
const data = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
function test11(data, x) {
  if (x === 1) return 0;
  if (x === 2) return 1;
  if (x > 2) data[x] = test11(data, x - 1) + test11(data, x - 2);
  //输出结果
  if (x === target) console.log(data[x]);
  return data[x];
}
//test11(data, target);

/**
 *二分 (基于有序)
 */
function test12(data, target) {
  //低
  let low = 0;
  //高
  let high = data.length - 1;
  //中
  let middle = 0;
  //计数器
  let count = 1;
  while (low <= high) {
    middle = Math.floor((low + high) / 2);
    if (target === data[middle]) {
      console.log(`找了${count}次`);
      return;
    }
    if (target > data[middle]) {
      low = middle + 1;
    }
    if (target < data[middle]) {
      high = middle - 1;
    }
    count++;
  }
  console.log("没有找到");
}
//test12([2, 4, 6, 7], 4);
/**
 *在一个有序数组中，查找出第一个大于 9 的数字，假设一定存在。
 *例如，arr = { -1, 3, 3, 7, 10, 14, 14 }; 则返回 10。
 *查找的目标数字具备这样的性质：
 *第一，它比 9 大；
 *第二，它前面的数字（除非它是第一个数字），比 9 小。
 *因此，当我们作出向左走或向右走的决策时，必须满足这两个条件。
 */
function test13(data, target) {
  let low = 0;
  let high = data.length - 1;
  let middle = 0;
  while (low <= high) {
    middle = Math.floor((low + high) / 2);
    if (target >= data[middle]) {
      if (target < data[middle + 1]) return data[middle + 1];
      low = middle + 1;
    }
    if (target < data[middle]) {
      if (target > data[middle - 1]) return data[middle];
      high = middle - 1;
    }
  }
}
//console.log(test13([-1, 3, 3, 7, 10, 14, 14], 9));
/**
 * 冒泡排序
 */

function test14(data) {
  for (let i = 0; i < data.length; i++) {
    //j < data.length - i 每一轮都会筛选出一个最值，减少没有必要的比较次数
    for (let j = 0; j < data.length - i; j++) {
      //交换位置
      if (data[j] > data[j + 1]) {
        data[j + 1] = data[j] + data[j + 1];
        data[j] = data[j + 1] - data[j];
        data[j + 1] = data[j + 1] - data[j];
      }
    }
  }
  console.log(data);
}
//test14([-1, 3, -3, 7, 10, 14, 14]);
/**
 * 插入排序
 * 选取未排序的元素，插入到已排序区间的合适位置，直到未排序区间为空。
 * 插入排序顾名思义，就是从左到右维护一个已经排好序的序列。直到所有的待排数据全都完成插入的动作。
 */
function test15(data) {
  for (let i = 1; i < data.length; i++) {
    //记录当前遍历的元素
    let current = data[i];
    //冒泡
    for (let j = i - 1; j >= 0; j--) {
      if (data[j] > current) {
        data[j + 1] = data[j] + data[j + 1];
        data[j] = data[j + 1] - data[j];
        data[j + 1] = data[j + 1] - data[j];
      } else {
        break;
      }
    }
  }
  console.log(data);
}
test15([-1, 3, -3, 7, 10, 14, 14]);
/**
 * 归并排序
 */
/**
 * 快速排序
 */
