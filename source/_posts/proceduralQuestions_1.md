---
 title: Promise实现两秒打印和函数柯理化
 date: 2020-01-30 10:10:10
 tags: 
    - JavaScript
---

###### promise实现两秒打印一次成功或失败（随机数大于0.5成功，反之失败）

```js
function setThreeSecond() {

setInterval(() => {
  const promiseObj = new Promise((resolve, reject) => {
    const s = Math.random()
    if (s > 0.5) {
      resolve('成功' + s)
    } else {
      reject('失败' + s)
    }
  })

  promiseObj.then(res => {
    console.log(res)
  }, err => {
    console.log(err)
  })
}, 2000)
}

setThreeSecond()
```



###### 实现add(1)(2)(3)(4)...累加器(柯里化)

```js
function add(s){

  function temp(a){
    return add(s + a)
  }

  temp.toString = function(){
    return s
  }

  return temp
}
```



