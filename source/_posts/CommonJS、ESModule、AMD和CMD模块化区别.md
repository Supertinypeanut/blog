---
title: CommonJS、ESModule、AMD和CMD模块化区别
date: 2020-09-01 10:10:10
tags: JavaScript
---

## CommonJS

- 对于基本数据类型，属于复制。即会被模块缓存。同时，在另一个模块可以对该模块输出的变量重新赋值。
- 对于复杂数据类型，属于浅拷贝。由于两个模块引用的对象指向同一个内存空间，因此对该模块的值做修改时会影响另一个模块。
- 当使用 require 命令加载某个模块时，就会运行整个模块的代码。
- 当使用 require 命令加载同一个模块时，不会再执行该模块，而是取到缓存之中的值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
- 循环加载时，属于加载时执行。即脚本代码在 require 的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

```js
// b.js
exports.done = false
let a = require('./a.js')
console.log('b.js-1', a.done)
exports.done = true
console.log('b.js-2', '执行完毕')

// a.js
exports.done = false
let b = require('./b.js')
console.log('a.js-1', b.done)
exports.done = true
console.log('a.js-2', '执行完毕')

// c.js
let a = require('./a.js')
let b = require('./b.js')

console.log('c.js-1', '执行完毕', a.done, b.done)

node c.js
b.js-1 false
b.js-2 执行完毕
a.js-1 true
a.js-2 执行完毕
c.js-1 执行完毕 true true

```

## ES Module

- ES Module 中的值属于动态只读引用， 不可修改（修改即报错）。复杂数据类型可修改其属性
- 循环加载时，ES6 模块是动态引用。只要两个模块之间存在某个引用，代码就能够执行。
- ES6 模块化采用静态编译，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。

```js
// b.js
import {foo} from './a.js';
export function bar() {
  console.log('bar');
  if (Math.random() > 0.5) {
    foo();
  }
}

// a.js
import {bar} from './b.js';
export function foo() {
  console.log('foo');
  bar();
  console.log('执行完毕');
}
foo();

babel-node a.js
foo
bar
执行完毕

// 执行结果也有可能是
foo
bar
foo
bar
执行完毕
执行完毕
```

## AMD

基于 commonJS 规范的 nodeJS 出来以后，服务端的模块概念已经形成，很自然地，大家就想要客户端模块。而且最好两者能够兼容，一个模块不用修改，在服务器和浏览器都可以运行。但是，由于一个重大的局限，**使得 CommonJS 规范不适用于浏览器环境**。

**浏览器端的模块，不能采用"同步加载"（synchronous），只能采用"异步加载"（asynchronous）。这就是 AMD 规范诞生的背景。**

**它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。**

- 异步加载模块
- 依赖前置

```js
define([依赖...],function(变量...){})
```

## CMD

- 没有依赖前置，即用即返

```js
defind(function (require, exports, module) {
  var a = require("./a");
});
```

## 总结

- CommonJS 为服务端规范，ESModule、AMD(requireJS)和 CMD(seaJS)均为浏览器端规范
- CommonJS 同一模块只会被加载一次，第二次便只会取首次的缓存结果；ESModule 只要引入就会执行导入模块
- CommonJS、CMD 为同步导入，ESModule、AMD 为异步导入
- CommonJS 导入支持动态导入 require(`${path}/xx.js`)，ES6 模块化导入不支持
