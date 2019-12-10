---
title: Vue响应式原理
---

### Object.defineproperty实现

```js
const data = {
  // message: 'hello world'
}

// data.a = 1

// data.message = 'hello'

// 如何给一个对象添加数据成员
// 方式一：初始化的时候添加
// 方式二：对象.xxx = xxx
// 方式三：Object.definePrope0k jrty，更高级

// 这是一个普通变量
let abc = 'hello world'

// 数据劫持、数据代理、数据监视、数据拦截器
// 参数1：数据对象
// 参数2：属性名
// 参数3：一个配置对象
Object.defineProperty(data, 'message', {
  // 当属性访问的时候会调用 get 方法访问器
  // get 方法的返回值就是该属性的值
  // 注意：通过这种方式定义的数据成员无法存储数据
  get () {
    console.log('message 被访问了')
    return abc
    // return 'hello world'
  },

  // 当属性被赋值的时候会调用 set 方法
  // 赋的那个值会作为参数传递给 set 方法
  set (value) {
    console.log('message 被赋值了', value)
    document.querySelector('h1').innerHTML = value
    abc = value
  }
})

defineReactive(data, 'foo', 'bar')

defineReactive(data, 'user', {
  name: '张三',
  age: 18
})

function defineReactive (data, key, value) {
  // value 是一个参数，在函数内部能被访问
  Object.defineProperty(data, key, {
    // 当属性访问的时候会调用 get 方法访问器
    // get 方法的返回值就是该属性的值
    // 注意：通过这种方式定义的数据成员无法存储数据
    get () {
      console.log(key, '被访问了')
      return value
      // return 'hello world'
    },

    // 当属性被赋值的时候会调用 set 方法
    // 赋的那个值会作为参数传递给 set 方法
    set (val) {
      console.log(key, '被修改了', value)
      document.querySelector('h1').innerHTML = value
      // abc = value
      value = val
    }
  })
}
```



#### Object.defineproperty实现深度监视

```js
const data = {
  a: 1,
  b: 2,
  user: {
    name: 'Jack',
    age: 18
  }
}

observe(data)

function observe(data) {
  // 如果 data 数据无效或者 data 不是一个对象，就停止处理
  if (!data || typeof data !== 'object') {
    return;
  }

  // 取出所有属性遍历，对属性成员进行代理（拦截、观察）操作
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}

/**
 * data 是数据对象
 * key 是属性名
 * val 当前属性名对应的值
 */
function defineReactive(data, key, val) {
  // observe(1)
  // observe(2)
  // observe({ name: 'Jack', age: 18 })
  observe(val); // 监听子属性

  Object.defineProperty(data, key, {
    // enumerable: true, // 可枚举
    // configurable: false, // 不能再define
    get: function () {
      console.log(key, '被访问了')
      return val;
    },
    set: function (newVal) {
      console.log(key, '被修改了');
      val = newVal;
    }
  });
    }
```



### 使用Proxy实现（Vue中使用，性能更好）

```js
const data = {
  a: 1,
  b: 'hello',
  user: {
    name: 'Jack',
    age: 18
  }
}

// Proxy 是一个构造函数，使用的时候需要 new
// 参数1：要代理的目标对象
// 参数2：一个配置对象
//    get 访问器
//    set 赋值器
//    ....
// 返回值：代理对象
// 注意：被代理的目标数据对象该是什么样还是什么样
// 必须通过代理对象来访问目标对象中的数据成员才会走代理（get、set）
const p = new Proxy(data, {
  // 当数据成员被访问的时候会调用 get 方法
  // 参数1：被代理的目标对象
  // 参数2：访问的属性名
  get (target, property) {
    console.log('get 方法被调用了', target, property)
    return target[property]
  },

  // 当数据成员被修改赋值的时候会调用 set 方法
  // 参数1：被代理的目标对象
  // 参数2：要修改的属性名
  // 参数3：要修改的值
  set (target, property, value) {
    console.log('set 方法被调用了')
    target[property] = value
  }
})
```

