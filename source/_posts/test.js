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