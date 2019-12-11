---
title: 函数防抖与函数节流
date: 2019-12-11 15:53:00
---

#### 函数实现防抖

```js
function debounceCallbake() {
  console.log('防抖回调')
}

// 将函数进行防抖处理
function getdebounce(debounceCallbake, delay) {

  // 用来保存定时器序号
  let params = undefined
  return function() {

    //  清除上一次定时器
    clearTimeout(params)

    // 时间未到便会清除上次定时器，重新获取新定时器序号
    params = setTimeout(() => {
      debounceCallbake()
    }, delay)
  }
}

let debounce = getdebounce(debounceCallbake, 2000)

window.onresize = function() {
  debounce()
}

```



#### 函数实现节流

```js
function throttleCallbake() {
  console.log('节流回调')
}

// 将函数进行节流处理
function getThrottle(throttleCallbake, delay) {
  // 声明先前时间
  let previousTiem = Date.now()

  // 返回处理函数，闭包扩展了previons作用域范围
  return function() {

    // 获取当前时间
    const currentTiem = Date.now()

    // 判断是否超过延时时常
    if (currentTiem - previousTiem >= delay) {

      // 回调执行函数
      throttleCallbake()

      // 更新当前时间
      previousTiem = Date.now()
    }
  }
}
const handle = getThrottle(throttleCallbake, 3000)
  /**
   * 封装防抖函数
   */

function debounceCallbake() {
  window.onresize = function() {
    console.log(888);
    handle()
 }
```

