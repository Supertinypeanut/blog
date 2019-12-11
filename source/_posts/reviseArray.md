---
title: 复习数组所有方法
date: 2019-11-28 10:10:10
---

```js
/**
 * 复习Array所有方法
*/

let arr = [1,2,3,4,5,6,7,8,9,0]

// 头部出弹出
const result1 = arr.shift()
console.log('****************shift')
console.log('result：')
console.log(result1)
console.log('arr:')
console.log(arr)
  


// 头部添加
const result2 = arr.unshift(1)
console.log('****************unshift')
console.log('result：')
console.log(result2)
console.log('arr:')
console.log(arr)


// 尾部删除
const result3 = arr.pop()
console.log('****************pop')
console.log('result：')
console.log(result3)
console.log('arr:')
console.log(arr)  

// 尾部添加
const result4 = arr.push(0)
console.log('****************push')
console.log('result：')
console.log(result4)
console.log('arr:')
console.log(arr)  

// 转化为字符串
const result5 = arr.join('-')
console.log('****************join')
console.log('result：')
console.log(result5)
console.log('arr:')
console.log(arr)  

/*
****************join
result：
1-2-3-4-5-6-7-8-9-0
arr:
[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
*/

// 反转
const result6 = arr.reverse()
console.log('****************reverse')
console.log('result：')
console.log(result6)
console.log('arr:')
console.log(arr)  

/*
result：
[ 0, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]
arr:
[ 0, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]
*/


//排序
const result7 = arr.sort((a, b)=> a-b ) //回调函数的返回值为正值则不调换位置，负值则调换
console.log('****************sort')
console.log('result：')
console.log(result7)
console.log('arr:')
console.log(arr)  

/*
result：
[ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ]
arr:
[ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ]
*/

// 合并数组
const paramArr = [11,22,33]
const result8 = arr.concat(paramArr)
console.log('****************concat')
console.log('result：')
console.log(result8)
console.log('arr:')
console.log(arr)  

/*
result：
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33 ]
arr:
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
*/

// 截取数组
const result9 = arr.slice(1,4)
console.log('****************slice')
console.log('result：')
console.log(result9)
console.log('arr:')
console.log(arr)

/*
result：
[ 1, 2, 3 ]
arr:
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
*/
// 注意：slice的截取索引当为负值时，会自动加上数组长度，如果索引还为负值时等于0


// 可指定索引添加、删除、替换
const result10 = arr.splice(3,3,...[44,55,66,77])   // args: 指定位置 删除个数 替换数值...
console.log('****************splice')
console.log('result：')
console.log(result10)
console.log('arr:')
console.log(arr)  

/*
result：
[ 3, 4, 5 ]
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/


// 正序查找
const result11 = arr.indexOf(77,6)   // args: 查找数值 指定开始位置  
console.log('****************indexOf')
console.log('result：')
console.log(result11)
console.log('arr:')
console.log(arr)  
/*
result：
6      //未找到为-1，找返回索引
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/


// 倒叙查找
const result12 = arr.lastIndexOf(77,7)   // args: 查找数值 指定开始位置  
console.log('****************lastIndexOf')
console.log('result：')
console.log(result12)
console.log('arr:')
console.log(arr)  
/*
result：
6
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/


// 判断是否存在
const result13 = arr.includes(77)   // args: 查找数值
console.log('****************includes')
console.log('result：')
console.log(result13)
console.log('arr:')
console.log(arr)  
/*
result：
true
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/


// 遍历forEach
const result14 = arr.forEach((item,index,arr) => console.log(`${item}---${index}`))
console.log('****************forEach')
console.log('result：')
console.log(result14)
console.log('arr:')
console.log(arr)  
/*
0---0
1---1
2---2
44---3
55---4
66---5
77---6
6---7
7---8
8---9
9---10
****************forEach
result：
undefined
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/
// 注意：无返回值

// 过滤数组
const result15 = arr.filter((item,index,arr) => item >10 )
console.log('****************filter')
console.log('result：')
console.log(result15)
console.log('arr:')
console.log(arr)  

/*
result：(回调函数返回值为true，将该元素加入返回数组)
[ 44, 55, 66, 77 ]
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/


// 遍历数组查找数据，查找到便停止,返回该对象
const result16 = arr.find((item,index,arr) => item === 77 )
console.log('****************find')
console.log('result：')
console.log(result16)
console.log('arr:')
console.log(arr)  
/*
result：
77
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/

// 遍历数组查找数据，查找到便停止,返回该对象的索引
const result17 = arr.findIndex((item,index,arr) => item === 77 )
console.log('****************findIndex')
console.log('result：')
console.log(result17)
console.log('arr:')
console.log(arr)  
/*
result：
6
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/


// 遍历数组判断是否符合自定义条件，一个符合便遍历停止,返回为true，否则反之false
const result18 = arr.some((item,index,arr) => item === 77 )
console.log('****************some')
console.log('result：')
console.log(result18)
console.log('arr:')
console.log(arr)  
/*
result：
true
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/

// 遍历数组判断是否符合自定义条件，一个不符合便遍历停止,返回为false，否则反之true
const result19 = arr.every((item,index,arr) => item === 77 )
console.log('***************every')
console.log('result：')
console.log(result19)
console.log('arr:')
console.log(arr)  
/*
result：
false
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/

// 迭代累加
const result20 = arr.reduce((a, b) => a + b )
console.log('***************reduce')
console.log('result：')
console.log(result20)
console.log('arr:')
console.log(arr)  
/*
result：
275
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/

// 倒序迭代累加
const result21 = arr.reduceRight((a, b) => {console.log(`${a}---${b}`);
 return a + b} )
console.log('***************reduceRight')
console.log('result：')
console.log(result21)
console.log('arr:')
console.log(arr)  
/*
9---8
17---7
24---6
30---77
107---66
173---55
228---44
272---2
274---1
275---0
***************reduceRight
result：
275
arr:
[ 0, 1, 2, 44, 55, 66, 77, 6, 7, 8, 9 ]
*/


// 静态值填充
const result22 = arr.fill(999,3,7)   //args:  填充值  填充起始位置 结束位置
console.log('***************fill')
console.log('result：')
console.log(result22)
console.log('arr:')
console.log(arr)  

/*
result：
[ 0, 1, 2, 999, 999, 999, 999, 6, 7, 8, 9 ]
arr:
[ 0, 1, 2, 999, 999, 999, 999, 6, 7, 8, 9 ]
*/

// 数组内取值覆盖
const result26 = arr.copyWithin(3,6,9)   //args: 赋值前一个位置 取值后一个位置 取值前一个结束位置
console.log('***************copyWithin')
console.log('result：')
console.log(result26)
console.log('arr:')
console.log(arr)  
/*
result：
[ 0, 1, 2, 999, 6, 7, 999, 6, 7, 8, 9 ]
arr:
[ 0, 1, 2, 999, 6, 7, 999, 6, 7, 8, 9 ]
*/

/*返回迭代对象,使用next()获取对象*/
// 值和索引
console.dir(arr.entries())
// 索引
console.dir(arr.keys())
// 值
console.dir(arr.values())
// 转化数组
console.dir(arr.toString())


// 扁平化嵌套数组去空项  --》可以使用reduce + concat + 递归实现
const result23 = [12,23,34,545,,[12,13,34,45,56,6,[12,43,4]]].flat(Infinity)   //args:  结构深度
console.log('***************flat')
console.log('result：')
console.log(result23)
console.log('arr:')
console.log(arr)  
/*
[12, 23, 34, 545, 12, 13, 34, 45, 56, 6, 12, 43, 4]
*/


// .map遍历数组，返回值创建一个新数组  
const result24 =[12,23,34,43,45,4].map((item, index, arr) => item*2 )
console.log('***************flat')
console.log('result：')
console.log(result24)
console.log('arr:')
console.log(arr)
/*
[24, 46, 68, 86, 90, 8]
*/

// .flatmap  会将返回数组进行flat(1)操作再返回数组
const result25 =[12,23,34534,2323].flatMap((item, index, arr) => [item*2] )
console.log('***************flat')
console.log('result：')
console.log(result25)
console.log('arr:')
console.log(arr)

/*
[24, 46, 69068, 4646]
*/

```
