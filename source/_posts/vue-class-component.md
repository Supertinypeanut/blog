---
title: 了解vue-class-component
date: 2020-02-12 10:10:10
tags: Vue
---

# vue-class-component

本文翻译自 [vue-class-component](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-class-component)

> 给 class 类型的 Vue 组件的 ECMAScript / TypeScript 修饰器

### 用法：

要求：[ECMAScript 一阶段的修饰器](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fwycats%2Fjavascript-decorators%2Fblob%2Fmaster%2FREADME.md)。
 如果你使用 Babel，需要使用 [babel-plugin-transform-decorators-legacy](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Floganfsmyth%2Fbabel-plugin-transform-decorators-legacy)
 如果你使用 TypeScript，请启用 --experimentalDecorators 标识

> 目前不支持二阶段修饰器，因为主流的编译器仍然编译旧版本的修饰器

##### 注意

1.`methods` 可以直接声明作为 class 的方法

2.`computed` 可以直接声明作为 class 上属性的访问器

3.初始化的 `data` 可以声明作为 class 上的属性（如果你使用 Babel，你得使用[babel-plugin-transform-class-properties](https://links.jianshu.com/go?to=https%3A%2F%2Fbabeljs.io%2Fdocs%2Fplugins%2Ftransform-class-properties%2F)）

4.`data`、`render` 以及 Vue 生命周期钩子也可以直接声明作为 class 上的方法，但是你不能够不能通过当前实例引用它们（？？？这句不懂），当你声明一个普通的方法，你也要避免使用这些保留字。

5.对于其它的选项（options），将它们传递给修饰器函数

以下是一个 Babel 下的例子，如果你需要 TypeScript 版本，请看[这里](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-class-component%2Fblob%2Fmaster%2Fexample%2Fsrc%2FApp.vue)



```js
<template>
  <div>
    <input v-model="msg">
    <p>prop: {{propMessage}}</p>
    <p>msg: {{msg}}</p>
    <p>helloMsg: {{helloMsg}}</p>
    <p>computed msg: {{computedMsg}}</p>
    <button @click="greet">Greet</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    propMessage: String
  }
})
export default class App extends Vue {
  // 初始化 data
  msg = 123

  // 使用 prop 数据初始化 data
  helloMsg = 'Hello, ' + this.propMessage

  // 生命周期
  mounted () {
    this.greet()
  }

  // 计算属性 computed
  get computedMsg () {
    return 'computed ' + this.msg
  }

  // method
  greet () {
    alert('greeting: ' + this.msg)
  }
}
</script>
```

你可以在 [vue-property-decorator](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fkaorun343%2Fvue-property-decorator) 查看 `@prop`、`@watch` 修饰器

### 使用 Mixins

vue-class-component 提供 mixins 帮助函数，可以用来在 class 类型风格中使用 [mixins](https://links.jianshu.com/go?to=https%3A%2F%2Fvuejs.org%2Fv2%2Fguide%2Fmixins.html)
 通过 mixins 帮助函数，Typescript 可以推断出 mixin 类型并且在组件类型中继承它们。

声明 mixin 的例子：



```js
// mixin.js
import Vue from 'vue'
import Component from 'vue-class-component'

// 你可以想声明一个组件一样声明一个 mixin
@Component
export default class MyMixin extends Vue {
  mixinValue = 'Hello'
}
```

然后使用它：



```js
import Component, { mixins } from 'vue-class-component'
import MyMixin from './mixin.js'

// 使用 `mixins` 帮助函数，而不是 `Vue`.
// `mixins` 可以获取任何数量的参数

@Component
export class MyComp extends mixins(MyMixin) {
  created () {
    console.log(this.mixinValue) // -> Hello
  }
}
```

### 自定义修饰器

你还可以创建你自己的修饰器并且继承这个库的功能，vue-class-component 提供 createDecorator 帮助函数用来创建自定义修饰器。

createDecorator 的第一个参数是一个回调函数，并且这个函数可以获取一下参数：

`options`: vue 组件选项组成的对象，改变这些选项会影响所提供的组件
 `key`: 修饰器所作为的属性或方法的 key
 `parameterIndex`: 修饰器作用于参数时，这个参数的索引

例子：创建一个 NoCache 修饰器



```js
// decorators.js
import { createDecorator } from 'vue-class-component'

export const NoCache = createDecorator((options, key) => {
  // 组件的选项应该传给回调函数，同时会更新选项对象（options object）
  // 进而作用于组件
  options.computed[key].cache = false
})
import { NoCache } from './decorators'
```



```js
@Component
class MyComp extends Vue {
  // 这个计算属性不会被缓存
  @NoCache
  get random () {
    return Math.random()
  }
}
```

### 添加自定义钩子

如果你使用了一些Vue 插件比如 Vue Router，你可能会希望 class 组件解析它们所提供的钩子，比如，下面的例子中 `Component.registerHooks` 就允许你注册这些钩子



```js
// class-component-hooks.js
import Component from 'vue-class-component'

// 通过这些钩子的名称来注册它们
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
])
```



```js
// MyComp.js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class MyComp extends Vue {
  // class 组件现在可以处理 beforeRouteEnter 钩子和 
  // beforeRouteLeave 钩子作为 Vue Router 钩子
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter')
    next() // 需要调用这个来确认导航
  }

  beforeRouteLeave (to, from, next) {
    console.log('beforeRouteLeave')
    next() // 需要调用这个来确认导航
  }
}
```

值得注意的是，你必须在组件定义之前注册钩子



```js
// main.js

// 确保在引入任何组件之前注册
import './class-component-hooks'

import Vue from 'vue'
import MyComp from './MyComp'

new Vue({
  el: '#app',
  components: {
    MyComp
  }
})
```

### 注意事项

vue-class-component 通过实例化 钩子下的初始构造函数来收集 class 属性作为 Vue 实例的 data（？？？这句不太懂）。然而我们也可以像本地 class 的方式定义实例 data，有时候我们需要知道它是如何工作的。

##### this

如果你定义一个 class 属性并且在里面访问 this，它不会起作用，因为 this 只是当我们实例化 class 属性时候 Vue 实例的一个拦截对象。



```js
@Component
class MyComp extends Vue {
  foo = 123

  bar = () => {
    // 不会如预期中的更新
    // `this` 的值实际上不是 Vue 实例
    this.foo = 456
  }
}
```

你可以简单地定义一个方法而不是一个 class 属性因为 Vue 会自动绑定实例



```js
@Component
class MyComp extends Vue {
  foo = 123

  bar () {
    // 如预期地更新数据
    this.foo = 456
  }
}
```

##### undefined 不会响应式

为了在 Babel 和 TypeScript 上表现稳定，如果一个属性的初始化值是 undefined，vue-class-components 不会对它触发响应式，你应该使用 null 作为 初始值货值使用 data 钩子来初始化值为 undefined 的属性



```js
@Component
class MyComp extends Vue {
  // 没有响应式
  foo = undefined

  // 响应式
  bar = null

  data () {
    return {
      // 响应式
      baz: undefined
    }
  }
}
```

##### 创建例子



```ruby
$ npm install && npm run example
```

