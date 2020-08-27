---
title: sentry使用及原理
date: 2020-08-27 17:10:10
tags:
  - web 安全
---

## 搭建 sentry

如何搭建 sentry 大家可以阅读该篇文章（[Sentry 入门实战](http://sinhub.cn/2019/07/getting-started-guide-of-sentry/)），在此就不做过多介绍。

本文直接使用官方sentry账号进行前端的错误监控。https://sentry.io/

## 使用sentry

### 注册sentry账号

![image-20200827175753635](sentry使用及原理.assets/image-20200827175753635.png)

### 创建一个项目

大家可以根据自己项目的技术栈创建对应的sentry项目，由于项目我的项目技术栈为Vue，所以我创建Vue的项目。

![image-20200827180126891](sentry使用及原理.assets/image-20200827180126891.png)

### 查看对应配置

![image-20200827180649660](sentry使用及原理.assets/image-20200827180649660.png)

### 查看配置文档

根据对应的配置文档进行引入配置即可，文档已经将该项目的dsn已经初始化好了直接copy。![image-20200827181117982](sentry使用及原理.assets/image-20200827181117982.png)

`详细配置`：https://docs.sentry.io/product/performance/getting-started/

### 查看警告

你可以在开发环境，故意写错一个在运行时会发生的bug测试一下，当看到自己收到警告通知时便是引入成功了。

![image-20200827181716092](sentry使用及原理.assets/image-20200827181716092.png)

### 使用注意

#### 生产环境引入

当然平时我们并不需监控开发环境，所以我们通过环境变量进行判断引入，在生产打包时引入。

```typescript
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
    'https://3014f57eb2dc490ba8c6ffe191690781@o434427.ingest.sentry.io/5391506',
    integrations: [new VueIntegration({ Vue, attachProps: true })],
  })
}
```

#### 指定分支

我们可以指定上线分支配置，详细分支配置：https://docs.sentry.io/product/releases/

```
 Sentry.init({
		...
		release: "my-project-name@2.3.12",
		...
  })
```

#### 上传Source Map 

https://docs.sentry.io/platforms/javascript/guides/vue/config/sourcemaps/

webpack引入插件

```bash
 npm install --save-dev @sentry/webpack-plugin
```

```js
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  // other configuration
  plugins: [
    new SentryWebpackPlugin({
      include: ".",
      ignoreFile: ".sentrycliignore",
      ignore: ["node_modules", "webpack.config.js"],
      configFile: "sentry.properties",
    }),
  ],
};
```

当然我们还需要配置一下`~/.sentryclirc`

```ini
[auth]
token=your-auth-token

# 可以指定到自己的服务器，默认情况下sentry-cli将连接到sentry.io
[defaults]
url = https://mysentry.invalid/
```

环境变量设置`.env`

```bash
SENTRY_AUTH_TOKEN=your-auth-token

# 可以指定到自己的服务器，默认情况下sentry-cli将连接到sentry.io
SENTRY_URL=https://mysentry.invalid/
```

## 监控原理

### window.onerror劫持

每当代码在runtime时发生错误时，JavaScript引擎就会抛出一个Error对象，并且触发window.onerror函数。

Sentry对window.onerror函数进行了改写，在这里实现了错误监控的逻辑，添加了很多运行时信息帮助进行错误定位，对错误处理进行跨浏览器的兼容等等。

在这里Sentry使用了TraceKit来帮助它劫持window.onerror函数。TraceKit主要是用来进行抹平各浏览器之间的差异，使得错误处理的逻辑统一。

### 监听unhandledrejection事件

在我们使用Promise的时候，如果发生错误而我们没有去catch的话，window.onerror是不能监控到这个错误的。但是这个时候，JavaScript引擎会触发unhandledrejection事件，只要我们监听这个事件，那么就能够监控到Promise产生的错误。

_attachPromiseRejectionHandler的实现很简单，就是为unhandledrejection事件挂载一个事件处理函数。这里最核心的逻辑其实是captureException函数。

1. 如果接收到的是一个ErrorEvent对象，那么直接取出它的error属性即可，这就是对应的error对象。
2. 如果接收到的是一个DOMError或者DOMException，那么直接解析出name和message即可，因为这类错误通常是使用了已经废弃的DOMAPI导致的，并不会附带上错误堆栈信息。
3. 如果接收到的是一个标准的错误对象，不做处理
4. 如果接收到的是一个普通的JavaScript对象

Sentry会将这个对象的Key序列化为字符串，然后会触发报错

```js
'Non-Error exception captured with keys: ' + serializeKeysForMessage(exKeys)
```

所以触发报错，是因为在代码当中，Promise进行reject时并没有传入一个错误对象，而是传入了一个普通对象。

错误代码大致上是这样

```xml
javascript reject(json)// json => {data:{},result:{}}
```

以上都不是，那么证明这就是一个普通的字符串，直接作为message即可。