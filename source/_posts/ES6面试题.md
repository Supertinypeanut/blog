---
title: ES6面试题
date: 2021-03-03 22:10:10
tags: 
    - ECMAScript 6
    - 面试
---



### ES6是什么，为什么要学习它，不学习ES6会怎么样?

答：

**ES6**是新一代的JS语言标准，对分JS语言核心内容做了**升级优化**，规范了JS使用标准，**新增了JS原生方法**，使得JS使用更加规范，更加优雅，更适合大型应用的开发。

学习ES6是成为专业前端正规军的必经之路。不学习ES6也可以写代码打鬼子，但是最多只能当个游击队长。

### ES5、ES6、ES2015的区别

答：

ES2015特指在2015年发布的新一代JS语言标准，

ES6泛指下一代JS语言标准，包含ES2015、ES2016、ES2017、ES2018等。现阶段在绝大部分场景下，ES2015默认等同ES6。

ES5泛指上一代语言标准。ES2015可以理解为ES5和ES6的时间分界线。**babel是什么，有什么作用?**

答：

babel是一个 ES6 转码器，可以将 ES6 代码转为 ES5 代码，以便兼容那些还没支持ES6的平台。

### let有什么用，有了var为什么还要用let？

答：

**在ES6之前，声明变量只能用var**，var方式声明变量其实是很不合理的，准确的说，是因为**ES5里面没有块级作用域**是很不合理的，甚至可以说是一个语言层面的bug。

没有块级作用域回来带很多难以理解的问题，比如**for循环var变量泄露，变量覆盖**等问题。

**let** 声明的变量拥有自己的**块级作用域**，且修复了**var**声明变量带来的**变量提升**问题。

### 问：举一些ES6对String字符串类型做的常用升级优化?

答：

**优化部分：**

ES6新增了`字符串模板`，在拼接大段字符串时，用反斜杠(`)取代以往的字符串相加的形式，能保留所有空格和换行，使得字符串拼接看起来更加直观，更加优雅。

**升级部分:**

ES6在`String`原型上新增了`includes()`方法，用于取代传统的只能用`indexOf`查找包含字符的方法(indexOf返回-1表示没查到不如includes方法返回false更明确，语义更清晰)

此外还新增了startsWith(), endsWith(), padStart(),padEnd(),repeat()等方法，可方便的用于查找，补全字符串。

### 举一些ES6对Array数组类型做的常用升级优化?

答：

**优化部分：**

`数组解构赋值`：ES6可以直接以let [a,b,c] = [1,2,3]形式进行变量赋值，在声明较多变量时，不用再写很多let(var),且`映射关系清晰`，且`支持赋默认值`。

`扩展运算符`：ES6新增的扩展运算符(...)(重要),可以轻松的`实现数组和松散序列的相互转化`，可以`取代`arguments对象和`apply方法`，轻松获取未知参数个数情况下的参数集合。

（尤其是在ES5中，arguments并不是一个真正的数组，而是一个类数组的对象，但是扩展运算符的逆运算却可以返回一个真正的数组）。

扩展运算符还可以轻松方便的实现数组的复制和解构赋值（let a = [2,3,4]; let b = [...a]）。

**升级部分:**

ES6在Array原型上新增了`find()`方法，用于取代传统的只能用`indexOf`查找包含数组项目的方法，且修复了`indexOf`查找不到NaN的bug([NaN].indexOf(NaN) === -1)，

此外还新增了copyWithin(), includes(), fill(),flat()等方法，可方便的用于字符串的查找，补全,转换等。

### 举一些ES6对Number数字类型做的常用升级优化?

答：

**优化部分：**

ES6在Number原型上新增了`isFinite()`, `isNaN\()`方法，用来取代传统的全局`isFinite()`, `isNaN()`方法检测数值是否有限、是否是NaN。

ES5的`isFinite()`, `isNaN()`方法都会先将非数值类型的参数转化为`Number`类型再做判断 这其实是不合理的

> 最造成isNaN('NaN') === true的奇怪行为--'NaN'是一个字符串，但是isNaN却说这就是NaN。

而`Number.isFinite()`和`Number.isNaN()`则不会有此类问题(`Number.isNaN('NaN') === false`)。（isFinite()同上）

**升级部分:**

ES6在Math对象上新增了Math.cbrt()，trunc()，hypot()等等较多的科学计数法运算方法，可以更加全面的进行立方根、求和立方根等等科学计算。

### 举一些ES6对Object类型做的常用升级优化?(重要)

答：

**优化部分：**

1.对象属性变量式声明：ES6可以直接以变量形式声明对象属性或者方法，比传统的键值对形式声明更加简洁，更加方便，语义更加清晰。

```
let [apple, orange] = ['red appe', 'yellow orange'];
let myFruits = {apple, orange};    // let myFruits = {apple: 'red appe', orange: 'yellow orange'};
```

尤其在对象解构赋值(见优化部分2.)或者模块输出变量时，这种写法的好处体现的最为明显:

```
let {keys, values, entries} = Object;
let MyOwnMethods = {keys, values, entries}; // let MyOwnMethods = {keys: keys, values: values, entries: entries}
```

可以看到属性变量式声明属性看起来更加简洁明了。方法也可以采用简洁写法：

```
let es5Fun = {
  method: function(){}
}; 
let es6Fun = {
  method(){}
}
```

2.对象的解构赋值：ES6对象也可以像数组解构赋值那样，进行变量的解构赋值：

```
let {apple, orange} = {apple: 'red appe', orange: 'yellow orange'};
```

3.对象的扩展运算符(...)：ES6对象的扩展运算符和数组扩展运算符用法本质上差别不大，毕竟数组也就是特殊的对象。

对象的扩展运算符一个最常用也最好用的用处就在于可以轻松的取出一个目标对象内部全部或者部分的可遍历属性，从而进行对象的合并和分解。

```
let {apple, orange, ...otherFruits} = {apple: 'red apple', orange: 'yellow orange', grape: 'purple grape', peach: 'sweet peach'}; 
// otherFruits  {grape: 'purple grape', peach: 'sweet peach'}
// 注意: 对象的扩展运算符用在解构赋值时，扩展运算符只能用在最有一个参数(otherFruits后面不能再跟其他参数)
let moreFruits = {watermelon: 'nice watermelon'};
let allFruits = {apple, orange, ...otherFruits, ...moreFruits};
```

4.super 关键字：ES6在Class类里新增了类似this的关键字super。同this总是指向当前函数所在的对象不同，super关键字总是指向当前函数所在对象的原型对象。

**升级部分:**

1.ES6在Object原型上新增了`is()`方法，做两个目标对象的相等比较，用来完善'`===`'方法。

> '==='方法中NaN === NaN //false其实是不合理的，Object.is修复了这个小bug。(Object.is(NaN, NaN) // true)

2.ES6在Object原型上新增了assign()方法，用于对象新增属性或者多个对象合并。

```
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

**注意:**

`assign`合并的对象`target`只能合并`source1`、`source2`中的自身属性。

并不会合并`source1、source2`中的继承属性，也不会合并不可枚举的属性，且无法正确复制`get`和`set`属性（会直接执行get/set函数，取return的值）。

3.ES6在Object原型上新增了`getOwnPropertyDescriptors()`方法，此方法增强了ES5中`getOwnPropertyDescriptor()`方法，可以获取指定对象所有自身属性的描述对象。

结合`defineProperties()`方法，可以完美复制对象，包括复制get和set属性。

4.ES6在Object原型上新增了`getPrototypeOf()`和`setPrototypeOf()`方法，用来获取或设置当前对象的`prototype`对象。

这个方法存在的意义在于，ES5中获取设置prototype对像是通过__proto__属性来实现的，

然而__proto__属性并不是ES规范中的明文规定的属性，只是浏览器各大产商“私自”加上去的属性，只不过因为适用范围广而被默认使用了，再非浏览器环境中并不一定就可以使用.

所以为了稳妥起见，获取或设置当前对象的prototype对象时，都应该采用ES6新增的标准用法。

5.ES6在Object原型上还新增了`Object.keys()，Object.values()，Object.entries()`方法，用来获取对象的所有键、所有值和所有键值对数组。

### 举一些ES6对Function函数类型做的常用升级优化?(重要)

答：

1.箭头函数(核心)：箭头函数是ES6核心的升级项之一，箭头函数里没有自己的this,这改变了以往JS函数中最让人难以理解的this运行机制。

**主要优化点:**

**箭头函数内的this指向的是函数定义时所在的对象，而不是函数执行时所在的对象**。

**ES5函数里的this总是指向函数执行时所在的对象**，这使得在很多情况下this的指向变得很难理解，尤其是非严格模式情况下，this有时候会指向全局对象，这甚至也可以归结为语言层面的bug之一。

**ES6的箭头函数优化了这一点，它的内部没有自己的this,这也就导致了this总是指向上一层的this，如果上一层还是箭头函数，则继续向上指，直到指向到有自己this的函数为止，并作为自己的this；**

**箭头函数不能用作构造函数，因为它没有自己的this，无法实例化；**也是**因为箭头函数没有自己的this,所以箭头函数 内也不存在arguments对象**。（可以用扩展运算符代替）

2.**函数默认赋值**：ES6之前，函数的形参是无法给默认值得，只能在函数内部通过变通方法实现。ES6以更简洁更明确的方式进行函数默认赋值。

```
function es6Fuc (x, y = 'default') {
    console.log(x, y);
}
es6Fuc(4) // 4, default
```

**升级部分:**

ES6新增了双冒号运算符，用来取代以往的bind，call,和apply。(浏览器暂不支持，Babel已经支持转码)

```
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);
```

### Symbol是什么，有什么作用？

答：

Symbol是ES6引入的`第七种`原始数据类型（说法不准确，应该是第七种数据类型，Object不是原始数据类型之一，已更正），
所有Symbol()生成的值都是独一无二的，可以从根本上解决对象属性太多导致属性名冲突覆盖的问题。
对象中Symbol()属性不能被for...in遍历，但是也不是私有属性。

### Set是什么，有什么作用？

答：

`Set`是ES6引入的一种类似Array的新的数据结构，Set实例的成员类似于数组item成员

`区别`是Set实例的成员都是唯一，不重复的。这个特性可以轻松地实现数组去重。

### Map是什么，有什么作用？

答：

`Map`是ES6引入的一种类似`Object`的新的数据结构。
`Map`可以理解为是`Object`的超集，**打破了以传统键值对形式定义对象，对象的key不再局限于字符串，也可以是Object**。可以更加全面的描述对象的属性。

### Proxy是什么，有什么作用？

答：

`Proxy`是ES6新增的一个构造函数，可以理解为JS语言的一个代理，**用来改变JS默认的一些语言行为**，包括拦截默认的**get/set**等底层方法，使得JS的使用自由度更高，可以最大限度的满足开发者的需求。

比如通过拦截对象的**get/set**方法，可以轻松地定制自己想要的**key或者value**。
下面的例子可以看到，随便定义一个myOwnObj的key,都可以变成自己想要的函数。

```
function createMyOwnObj() {
  //想把所有的key都变成函数，或者Promise,或者anything
  return new Proxy({}, {
    get(target, propKey, receiver) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let randomBoolean = Math.random() > 0.5;
          let Message;
          if (randomBoolean) {
            Message = `你的${propKey}运气不错，成功了`;
            resolve(Message);
          } else {
            Message = `你的${propKey}运气不行，失败了`;
            reject(Message);
          }
        }, 1000);
      });
    }
  });
}

let myOwnObj = createMyOwnObj();

myOwnObj.hahaha.then(result => {
  console.log(result) //你的hahaha运气不错，成功了
}).catch(error => {
  console.log(error) //你的hahaha运气不行，失败了
})

myOwnObj.wuwuwu.then(result => {
  console.log(result) //你的wuwuwu运气不错，成功了
}).catch(error => {
  console.log(error) //你的wuwuwu运气不行，失败了
})
```

### Reflect是什么，有什么作用？

答：

`Reflect`是ES6引入的一个新的对象，他的主要作用有两点：

- 一是将原生的一些零散分布在Object、Function或者全局函数里的方法(如apply、delete、get、set等等)，统一整合到Reflect上，这样可以更加方便更加统一的管理一些原生API；
- 二就是因为Proxy可以改写默认的原生API，如果一旦原生API别改写可能就找不到了，
  所以Reflect也可以起到备份原生API的作用，使得即使原生API被改写了之后，也可以在被改写之后的API用上默认的API。

### Promise是什么，有什么作用？

答：

Promise是ES6引入的一个新的对象，他的主要作用是用来解决JS异步机制里，回调机制产生的“回调地狱”。

它并不是什么突破性的API，只是封装了异步回调形式，使得异步回调可以写的更加优雅，可读性更高，而且可以链式调用。

### Iterator是什么，有什么作用？(重要)

答：

`Iterator`是ES6中一个很重要概念，它并不是对象，也不是任何一种数据类型。

因为ES6新增了`Set、Map`类型，他们和Array、Object类型很像，Array、Object都是可以遍历的，但是Set、Map都不能用for循环遍历，解决这个问题有两种方案：

一种是为Set、Map单独新增一个用来遍历的API。

另一种是为Set、Map、Array、Object新增一个统一的遍历API。

显然，第二种更好，ES6也就顺其自然的需要一种设计标准，来统一所有可遍历类型的遍历方式。

`Iterator`正是这样一种标准。或者说是一种规范理念。
就好像JavaScript是ECMAScript标准的一种具体实现一样，Iterator标准的具体实现是Iterator遍历器。

`Iterator`标准规定，所有部署了key值为[Symbol.iterator]，且[Symbol.iterator]的value是标准的Iterator接口函数(标准的Iterator接口函数:

该函数必须返回一个对象，且对象中包含next方法，且执行next()能返回包含value/done属性的Iterator对象)的对象，都称之为可遍历对象，next()后返回的Iterator对象也就是Iterator遍历器。

```
// obj就是可遍历的，因为它遵循了Iterator标准，且包含[Symbol.iterator]方法，方法函数也符合标准的Iterator接口规范。
// obj.[Symbol.iterator]() 就是Iterator遍历器
let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};
```

ES6给Set、Map、Array、String都加上了[Symbol.iterator]方法，

且[Symbol.iterator]方法函数也符合标准的Iterator接口规范，
所以Set、Map、Array、String默认都是可以遍历的。

```
// Array
let array = ['red', 'green', 'blue'];
array[Symbol.iterator]() //Iterator遍历器
array[Symbol.iterator]().next() //{value: "red", done: false}

// String
let string = '1122334455';
string[Symbol.iterator]() //Iterator遍历器
string[Symbol.iterator]().next() //{value: "1", done: false}

// set
let set = new Set(['red', 'green', 'blue']);
set[Symbol.iterator]() //Iterator遍历器
set[Symbol.iterator]().next() //{value: "red", done: false}

// Map
let map = new Map();
let obj= {map: 'map'};
map.set(obj, 'mapValue');
map[Symbol.iterator]().next()  {value: Array(2), done: false}
```

### for...in 和for...of有什么区别？

答：

如果看到上个问题，那么就很好回答。
问题十六提到了ES6统一了遍历标准，制定了可遍历对象，那么用什么方法去遍历呢？

答案就是用for...of。ES6规定，有所部署了载了Iterator接口的对象(可遍历对象)都可以通过for...of去遍历，而for..in仅仅可以遍历对象。

这也就意味着，**数组也可以用for...of遍历**，这极大地方便了数组的取值，且避免了很多程序用for..in去遍历数组的恶习。

上面提到的扩展运算符本质上也就是for..of循环的一种实现。

### Generator函数是什么，有什么作用？

答：

如果说JavaScript是ECMAScript标准的一种具体实现、`Iterator`遍历器是`Iterator`的具体实现，那么`Generator`函数可以说是Iterator接口的具体实现方式。

执行Generator函数会返回一个遍历器对象，每一次`Generator`函数里面的yield都相当一次遍历器对象的`next()`方法，并且可以通过`next(value)`方法传入自定义的`value`,来改变`Generator`函数的行为。

Generator函数可以通过配合Thunk 函数更轻松更优雅的实现异步编程和控制流管理。

### async函数是什么，有什么作用？

答：

async函数可以理解为内置自动执行器的Generator函数语法糖，它配合ES6的Promise近乎完美的实现了异步编程解决方案。

### Class、extends是什么，有什么作用？

答：

ES6 的class可以看作只是一个ES5生成实例对象的构造函数的语法糖。

它参考了java语言，定义了一个类的概念，让对象原型写法更加清晰，对象实例化更像是一种面向对象编程。Class类可以通过extends实现继承。

它和ES5构造函数的不同点：
类的内部定义的所有方法，都是不可枚举的；

```
/// ES5
function ES5Fun (x, y) {
  this.x = x;
  this.y = y;
}
ES5Fun.prototype.toString = function () {
   return '(' + this.x + ', ' + this.y + ')';
}
var p = new ES5Fun(1, 3);
p.toString();
Object.keys(ES5Fun.prototype); //['toString']

//ES6
class ES6Fun {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
  toString () {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

Object.keys(ES6Fun.prototype); //[]
```

ES6的class类必须用new命令操作，而ES5的构造函数不用new也可以执行；

ES6的class类不存在变量提升，必须先定义class之后才能实例化，不像ES5中可以将构造函数写在实例化之后；

ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面。

ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。

### module、export、import是什么，有什么作用？

答：

module、export、import是ES6用来统一前端模块化方案的设计思路和实现方案。

export、import的出现统一了前端模块化的实现方案，整合规范了浏览器/服务端的模块化方法，

之后用来取代传统的AMD/CMD、requireJS、seaJS、commondJS等等一系列前端模块不同的实现方案，使前端模块化更加统一规范，JS也能更加能实现大型的应用程序开发。

> import引入的模块是静态加载（编译阶段加载）而不是动态加载（运行时加载）。

> import引入export导出的接口值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

### 日常前端代码开发中，有哪些值得用ES6去改进的编程优化或者规范？

答：

常用箭头函数来取代的做法；

1. 常用let取代var命令；

   常用数组/对象的结构赋值来命名变量，结构更清晰，语义更明确，可读性更好；

   在长字符串多变量组合场合，用模板字符串来取代字符串累加，能取得更好地效果和阅读体验；

   用Class类取代传统的构造函数，来生成实例化对象；

   在大型应用开发中，要保持module模块化开发思维，分清模块之间的关系，常用import、export方法。