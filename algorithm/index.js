/**
 *1.假设有任意多张面额为 2 元、3 元、7 元的货币，现要用它们凑出 100 元，求总共有多少种可能性。
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
