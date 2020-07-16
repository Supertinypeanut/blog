---
title: 程序题
date: 2019-11-30 10:10:10
tags: 
    - JavaScript
---

```js
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



/**
 * 有这样一个 URL: http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e，
 * 请写一 段 JS 程序提取 URL 中的各个 GET 参数(参数名和参数个数不确定)，将其按
 *  key-value 形式返回到一个 json ，如{a:’1′, b:’2′, c:”, d:’xxx’
 * e:undefined}。
 */


function transformQuery(url) {
  // 判断是否有添加请求
  if (/\?.*$/.test(url)) {
    const query = {}
      // 获取请求参数数组
    const queryArr = url.slice(url.indexOf('?') + 1).split('&')
      // 遍历queryArr,并解析
    queryArr.forEach(item => {
      item = item.split('=')
      console.log(item[1])
        //   存入query对象
      query[item[0]] = `${item[1]}`
    })
    return JSON.stringify(query)
  }
  return JSON.stringify(null)
}

console.log(transformQuery('http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e')) //{"a":"1","b":"2","c":"","d":"xxx","e":"undefined"}


/**
 * 判断一个字符串中出现次数最多的字符，统计这个次数
 */

function getAppearMaxChar(str) {
  let appearMaxArr = [];
  for (let index = 0; index < str.length; index++) {
    const params = str.match(new RegExp(str[index], 'g'));
    if (appearMaxArr.length < params.length) appearMaxArr = params
  }
  return { char: appearMaxArr[0], count: appearMaxArr.length }
}

console.log(getAppearMaxChar('hjbjhbio888joi78g8f7f6rdr98hu')) //{ char: '8', count: 6 }


/**
 * 将数字 12345678 转化成 RMB 形式 如: 12,345,678
 */

function transformRMB(num) {
  const str = String(num)
  let transformStr = ''
    //   获取首部字符串，单独处理
  const fristStr = str.substr(0, str.length % 3 || 3)
    //   对非首部字符串进行拼接
  for (let index = str.length - 3; index > 0; index -= 3) {
    transformStr = ',' + str.substr(index, 3) + transformStr
  }
  //   拼接整个字符床
  transformStr = fristStr + transformStr
  return transformStr
}

transformRMB(123456789)  //123,456,789

```
