---
title: bind、call和apply原理
date: 2020-04-04 10:10:10
tags: 
    - JavaScript
---

## bind、call和apply原理

### 基本使用

#### bind

```js
func.bind(thisArg[, arg1[, arg2[, ...]]])
thisArg 当绑定函数被调用时，该参数会作为原函数运行时的this指向。当使用new 操作符调用绑定函数时，该参数无效。
arg1, arg2, ... 当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。
```

#### call

```js
func.call(thisArg, arg1, arg2, ...)
thisArg:：在fun函数运行时指定的this值。需要注意的是，指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于非严格模式下，则指定为null和undefined的this值会自动指向全局对象(浏览器中就是window对象)，同时值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象。
arg1, arg2, ... 指定的参数列表。
```

#### apply

```js
func.apply(thisArg, [argsArray])
thisArg： 在 fun 函数运行时指定的 this 值。需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。
argsArray: 一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 fun 函数。如果该参数的值为null 或 undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。
```

### 原理实现

#### bind

```js
Function.prototype.myBind = function() {
    var _this = this;
    var context = [].shift.call(arguments);// 保存需要绑定的this上下文
    var args = [].slice.call(arguments); //剩下参数转为数组
    console.log(_this, context, args);
    return function() {
        return _this.apply(context, [].concat.call(args, [].slice.call(arguments)));
    }
};
```

#### call

```js
Function.prototype.myCall = function(context = window) {
    context.fn = this  // 保存外部的函数fn
    context.fn()  // 隐式绑定 调用的外部的fn
    delete context.fn // 删除新增属性fn
}

var a = 1

function fn() {
    console.log(this.a); // 2
}
var obj = {
    a: 2
}
// 调用自己的call2方法
fn.myCall(obj)
```

#### apply

```js
/**
 * apply函数传入的是this指向和参数数组
 */
Function.prototype.myApply = function(context = window, arr) {
    var context = context ;
    context.fn = this;
    var result;
    if (!arr) {
        result = context.fn(); //直接执行
    } else {
        var args = [];
        for (var i=0,len=arr.length;i<len;i++) {
            args.push("arr[" + i + "]");
        }
        result = eval("context.fn([" + args.toString() + "])");
    }
    //将this指向销毁
    delete context.fn;
    return result;
}
```

