/**
 *1.假设有任意多张面额为 2 元、3 元、7 元的货币，现要用它们凑出 100 元，求总共有多少种可能性。
 */
function test1() {
  let count = 0;
  for (let i = 0; i <= 100 / 7; i++) {
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
  let res = new Map();
  let max = -1;
  for (let i = 0; i < arr.length; i++) {
    if (res.has(arr[i])) {
      res.set(arr[i], res.get(arr[i]) + 1);
    } else {
      res.set(arr[i], 1);
    }
  }
  max = Math.max.apply(null, [...res.values()]);
  for (let [key, value] of res) {
    if (value === max) console.log(`${key}出现的次数最多，出现了${value}次`);
  }
}
//test2([1, 2, 3, 4, 5, 5, 6]);
