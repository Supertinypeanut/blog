/**
 * 写出代码对下列数组去重并从大到小排列
 */

function ribArr(arr) {
  const set = new Set()
    //   使用集合特性去重
  arr.forEach(item => set.add(item))
    //   获得集合迭代对象
  const setInterator = set.values()
  let item = setInterator.next()
    //   清空形参
  arr = []
    //   进行迭代对象
  while (!item.done) {
    arr.push(item.value)
    item = setInterator.next()
  }
  //   排序
  return arr.sort((a, b) => b - a)
}

/**
 * 用 js 实现随机选取 10–100 之间的 10 个数字，存入一个数组，并排序。
 * @param { number } num 
 * @param { number } max 
 * @param { number } min 
 */
function getRandomArr(num, max, min) {
  const arr = [];
  while (num--) {
    arr.push(Math.round(Math.random() * (max - min)) + min)
  }
  return arr.sort((a, b) => a - b)
}