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

console.log(ribArr([12, 2, 2, 234, 4, 6, 6, 7, 6])) //[ 234, 12, 7, 6, 4, 2 ]



/**
 * 用 js 实现随机选取 10–100 之间的 10 个数字，存入一个数组，并排序。
 */
function getRandomArr(num, max, min) {
  const arr = [];
  while (num--) {
    arr.push(Math.round(Math.random() * (max - min)) + min)
  }
  return arr.sort((a, b) => a - b)
}

console.log(getRandomArr(10, 100, 10)) //[ 33, 45, 48, 65, 68, 77, 80, 90, 91, 95 ]


/**
 * 已知有字符串 foo=”get-element-by-id”,写一个 function 将其转化成 驼峰表示法”getElementById”。
 */

function transformHump(params) {
  //   切割字符串
  const paramsArr = params.split('-')
    //   存储首个子串
  params = paramsArr[0]
    //   将非子串首字母转化为大写
  for (let index = 1; index < paramsArr.length; index++) {
    const item = paramsArr[index]
    params += item.charAt(0).toUpperCase() + item.slice(1)
  }
  return params
}
console.log(transformHump('get-element-by-id')) //getElementById