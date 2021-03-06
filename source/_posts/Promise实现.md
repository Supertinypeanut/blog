---
title: Promise实现
date: 2021-03-07 00:53:00
tags: 
    - JavaScript
    - 面试
---

#### 简述

Promise是ES6中的新的异步语法，解决了回调嵌套的问题：

```javascript
new Promise((resolve)=>{
  setTimeout(()=>{
    resolve(1)
  },1000)
}).then(val =>{
  console.log(val);
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(2)
    },1000)
  })
}).then(val => {
  console.log(val);
})
```

#### 实现状态切换

- promise实例有三个状态，`pending`,`fulfilled`,`rejected`
- promise实例在构造是可以传入执行函数，执行函数有两个形参`resolve`,`reject`可以改变promise的状态，promise的状态一旦改变后不可再进行改变。
- 执行函数会在创建promise实例时，同步执行

```javascript
const PENDING = 'PENDING'; // 初始状态
const FULFILLED = 'FULFILLED'; // 成功状态
const REJECTED = 'REJECTED'; // 失败状态
class Promise2 {
  constructor(executor){
    this.status = PENDING
    this.value = null
    this.reason = null
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
      }
    }
    try {
      executor(resolve,reject)
    }catch (e) {
      reject(e)
    }

  }
}
let p = new Promise2((resolve,reject)=>{resolve(1)})
```

#### 实现`then`异步执行

promise实例可以调用`then`方法并且传入回调：

如果调用`then`时，Promise实例是`fulfilled`状态，则马上**异步执行**传入的回调。

如果调用`then`时，Promise实例是`pending`状态，传入的回调会等到resolve后再**异步执行**

例子：

```javascript
let p = new Promise((resolve, reject)=>{
  console.log(1);
  resolve(2)
  console.log(3);
})
p.then((val)=>{
  console.log(val);
})
//1
//3
//2
```

```javascript
let p = new Promise((resolve, reject)=>{
  setTimeout(()=>{
    resolve(1)
  },2000)
})
p.then((val)=>{
  console.log(val);
})
```

思路：需要用回调先保存到队列中，在`resolve`后异步执行队列里的回调，在`then`时判断实例的状态再决定是将回调推入队列，还是直接异步执行回调：

```javascript
const PENDING = 'PENDING'; // 初始状态
const FULFILLED = 'FULFILLED'; // 成功状态
const REJECTED = 'REJECTED'; // 失败状态
class Promise2 {
  constructor(executor){
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        setTimeout(()=>{
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        setTimeout(()=>{
          this.onFulfilledCallbacks.forEach(fn => fn(this.reason));
        })
      }
    }
    try {
      executor(resolve,reject)
    }catch (e) {
      reject(e)
    }

  }
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      setTimeout(()=>{
        onFulfilled(this.value);
      })
    }
    if (this.status === REJECTED) {
      setTimeout(()=>{
        onRejected(this.reason);
      })

    }
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled); // 存储回调函数
      this.onRejectedCallbacks.push(onRejected); // 存储回调函数
    }
  }
}
```

#### `resolve` Promise实例的情况

`resolve`的值有可能也是个promise实例，这时候就要用前述实例自己`resolve`的值

```javascript
let p = new Promise((resolve,reject) =>{  //promise1
  resolve(new Promise((resolve2,reject2)=>{  //promise2
    setTimeout(()=>{
      resolve2(1)
    },1000)
  }))
})
p.then((val)=>{
  console.log(val);
})
```

因此需要在promise1的`resolve`函数中进行判断，是promise实例则在这个promise实例（promise2）后接一个`then`，并且将promise1的`resolve`作为回调传入promise2的`then`

```javascript
const PENDING = 'PENDING'; // 初始状态
const FULFILLED = 'FULFILLED'; // 成功状态
const REJECTED = 'REJECTED'; // 失败状态
class Promise2 {
  constructor(executor){
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (value instanceof this.constructor) {
        value.then(resolve, reject); //resolve reject是箭头函数，this已经绑定到外层Promise
        return
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        setTimeout(()=>{
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        setTimeout(()=>{
          this.onFulfilledCallbacks.forEach(fn => fn(this.reason));
        })
      }
    }
    try {
      executor(resolve,reject)
    }catch (e) {
      reject(e)
    }

  }
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      setTimeout(()=>{
        onFulfilled(this.value);
      })
    }
    if (this.status === REJECTED) {
      setTimeout(()=>{
        onRejected(this.reason);
      })

    }
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled); // 存储回调函数
      this.onRejectedCallbacks.push(onRejected); // 存储回调函数
    }
  }
}
let p = new Promise2((resolve,reject) =>{
  resolve(new Promise2((resolve2,reject2)=>{
    setTimeout(()=>{
      resolve2(1)
    },1000)
  }))
})
p.then((val)=>{
  console.log(val);
})
```

#### 实现链式调用

`then`可以链式调用，而且前一个`then`的回调的返回值，如果不是promise实例，则下一个`then`回调的传参值就是上一个`then`回调的返回值，如果是promise实例，则下一个`then`回调的传参值，是上一个`then`回调返回的promise实例的解决值(value)

```javascript
let p = new Promise((resolve,reject) =>{
    setTimeout(()=>{
      resolve(1)
    },1000)
})
p.then(val => {
  console.log(val);
  return new Promise((resolve) => {
    setTimeout(()=>{
      resolve(2)
    },1000)
  })
}).then(val => {
  console.log(val);
  return 3
}).then(val => {
  console.log(val);
})
```

既然能够链式调用，那么`then`方法本身的返回值必定是一个Promise实例。那么返回的promise实例是不是自身呢？答案显而易见：不是。如果一个promise的then方法的返回值是promise自身，在new一个Promise时，调用了resolve方法，因为promise的状态一旦更改便不能再次更改，那么下面的所有then便只能执行成功的回调，无法进行错误处理，这显然并不符合promise的规范和设计promise的初衷。

因此 `then`方法会返回一个新的promise实例

```javascript
const PENDING = 'PENDING'; // 初始状态
const FULFILLED = 'FULFILLED'; // 成功状态
const REJECTED = 'REJECTED'; // 失败状态
class Promise2 {
  constructor(executor){
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (value instanceof this.constructor) {
        value.then(resolve, reject); //resolve reject是箭头函数，this已经绑定到外层Promise

        return
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        setTimeout(()=>{
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        setTimeout(()=>{
          this.onFulfilledCallbacks.forEach(fn => fn(this.reason));
        })
      }
    }
    try {
      executor(resolve,reject)
    }catch (e) {
      reject(e)
    }

  }
  then(onFulfilled, onRejected) {
    const promise2 = new this.constructor((resolve, reject) => { // 待返回的新的promise实例
      if (this.status === FULFILLED) {
          setTimeout(()=>{
            try {
              let callbackValue = onFulfilled(this.value);
              resolve(callbackValue);
            }catch(error) {
              reject(error) // 如果出错此次的then方法的回调函数出错，在将错误传递给promise2
            }
          })
      }
      if (this.status === REJECTED) {
        setTimeout(()=>{
          try {
            let callbackValue= onRejected(this.reason);
            resolve(callbackValue);
          } catch (error) {
            reject(error);
          }
        })

      }
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            let callbackValue = onFulfilled(this.value);
            resolve(callbackValue);
          }catch (error) {
            reject(error)
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            let callbackValue = onRejected(this.reason);
            resolve(callbackValue);
          } catch (error) {
            reject(error);
          }
        });
      }
    })
    return promise2;
  }
}
```

#### 实现其他方法

- catch
- resolve
- reject
- all
- race

方法演示：

```javascript
/*catch方法*/
let p = new Promise((resolve, reject) => {
  reject(1)
})
p.catch(reason => {
  console.log(reason);
})

/*Promise.resolve*/
let p = Promise.resolve(1)

/*Promise.resolve*/
let p = Promise.reject(1)

/*Promise.all*/
let p = Promise.all([
  new Promise(resolve => {
    setTimeout(() => {
      resolve(1)
    }, 1000)
  }),
  new Promise(resolve => {
    setTimeout(() => {
      resolve(2)
    }, 2000)
  }),
  new Promise(resolve => {
    setTimeout(() => {
      resolve(3)
    }, 3000)
  }),
])
p.then(val => {
  console.log(val);
})
/*Promise.race*/
let p = Promise.race([
  new Promise(resolve => {
    setTimeout(() => {
      resolve(1)
    }, 1000)
  }),
  new Promise(resolve => {
    setTimeout(() => {
      resolve(2)
    }, 2000)
  }),
  new Promise(resolve => {
    setTimeout(() => {
      resolve(3)
    }, 3000)
  }),
])
p.then(val => {
  console.log(val);
})
```



```javascript
const PENDING = 'PENDING'; // 初始状态
const FULFILLED = 'FULFILLED'; // 成功状态
const REJECTED = 'REJECTED'; // 失败状态
class Promise2 {

  static resolve(value) {
    if (value instanceof this) {
      return value;
    }
    return new this((resolve, reject) => {
        resolve(value);
    });
  };

  static reject(reason) {
    return new this((resolve, reject) => reject(reason))
  };
  static all(promises){
    return new this((resolve, reject) => {
      let resolvedCounter = 0;
      let promiseNum = promises.length;
      let resolvedValues = new Array(promiseNum);
      for (let i = 0; i < promiseNum; i += 1) {
        Promise2.resolve(promises[i]).then(
          value => {
            resolvedCounter++;
            resolvedValues[i] = value;
            if (resolvedCounter === promiseNum) {
              return resolve(resolvedValues);
            }
          },
          reason => {
            return reject(reason);
          },
        );

      }
    });
  };
  static race(promises){
    return new this((resolve, reject) => {
      if (promises.length === 0) {
        return;
      } else {
        for (let i = 0, l = promises.length; i < l; i += 1) {
          Promise2.resolve(promises[i]).then(
            data => {
              resolve(data);
              return;
            },
            err => {
              reject(err);
              return;
            },
          );
        }
      }
    });
  }
  constructor(executor) {
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (value instanceof this.constructor) {
        value.then(resolve, reject); //resolve reject是箭头函数，this已经绑定到外层Promise

        return
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        setTimeout(() => {
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        setTimeout(() => {
          this.onFulfilledCallbacks.forEach(fn => fn(this.reason));
        })
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }

  }

  then(onFulfilled, onRejected) {
    const promise2 = new this.constructor((resolve, reject) => { // 待返回的新的promise实例
      if (this.status === FULFILLED) {

        setTimeout(() => {
          try {
            let callbackValue = onFulfilled(this.value);
            resolve(callbackValue);
          } catch (error) {
            reject(error) // 如果出错此次的then方法的回调函数出错，在将错误传递给promise2
          }
        })
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        })

      }
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            let callbackValue = onFulfilled(this.value);
            resolve(callbackValue);
          } catch (error) {
            reject(error)
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            let callbackValue = onRejected(this.reason);
            resolve(callbackValue);
          } catch (error) {
            reject(error);
          }
        });
      }
    })
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}
```



#### macrotask和mirotask

所谓`macroTask`（宏任务）是指将任务排到下一个事件循环，`microTask`（微任务）是指将任务排到当前事件循环的队尾，执行时机会被宏任务更早。Promise的标准里没有规定Promise里的异步该使用哪种，但在node和浏览器的实现里都是使用的`miroTask`（微任务）

![](../../../../Downloads/进阶/阶段1：基础进阶/1-7 常规面试题/resource/笔记/.\img\2.png)

```javascript
setTimeout(() => {
  console.log(1);
}, 0)
let p = Promise.resolve(2)
p.then((val) => {
  console.log(val);
})
```

宏任务api包括：`setTimeout`,`setInterval`,`setImmediate(Node)`,`requestAnimationFrame(浏览器)`,`各种IO操作，网络请求`

微任务api包括：`process.nextTick(Node)`,`MutationObserver（浏览器）`

`MutaionObserver`演示：

```javascript
let observer = new MutationObserver(()=>{
  console.log(1);
})
let node = document.createElement('div')
observer.observe(node, { // 监听节点
  childList: true // 一旦改变则触发回调函数 nextTickHandler
})
node.innerHTML = 1
```

利用`MutaionObserver`封装一个微任务执行函数

```javascript
let nextTick = (function () {
  let callbacks = []
  function nextTickHandler() {
    let copies = callbacks.slice(0)
    callbacks = []
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }

  let counter = 1
  let observer = new MutationObserver(nextTickHandler) // 声明 MO 和回调函数
  let node = document.createElement('div')
  observer.observe(node, { // 监听节点
    childList: true // 一旦改变则触发回调函数 nextTickHandler
  })
  return function (cb) {
    callbacks.push(cb)
    counter = (counter + 1) % 2 //让节点内容文本在 1 和 0 间切换
    node.innerHTML = counter
  }
})()
```



