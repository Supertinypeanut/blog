---
title: 实现跨域存储
date: 2020-02-09 15:30:56
tags: JavaScript
---

##### 本地存储受同源策略限制

客户端（浏览器）出于安全性考虑，无论是 `localStorage` 还是 `sessionStorage` 都会受到同源策略限制。

那么如何实现**跨域存储**呢？

##### window.postMessage()

想要实现**跨域存储**，先找到一种可跨域通信的机制，没错，就是 `postMessage`，它可以安全的实现跨域通信，不受同源策略限制。

语法：

```js
otherWindow.postMessage('message', targetOrigin, [transfer])
```

- `otherWindow` 窗口的一个引用，如：`iframe` 的 `contentWindow` 属性，当前 `window` 对象，`window.open` 返回的窗口对象等
- `message` 将要发送到 `otherWindow` 的数据
- `targetOrigin` 通过窗口的 `targetOrigin` 属性来指定哪些窗口能接收到消息事件，其值可以是字符串 `"*"`（表示无限制）

##### 实现思路

用 `postMessage` 可跨域特性，来实现跨域存储。因为多个不同域下的页面无法共享本地存储数据，我们需要找个“中转页面”来统一处理其它页面的存储数据。为了方便理解，画了张时序图，如下：

![img](cross-storage/640.png)

​                                 								跨域存储时序图

##### 场景模拟

**需求：**

有两个不同的域名（`http://localhost:6001` 和 `http://localhost:6002`）想共用本地存储中的同一个 `token 作为统一登录凭证：`

**假设：**

http://localhost:6001 对应 client1.html 页面

http://localhost:6002 对应 client2.html 页面

http://localhost:6003 对应 hub.html 中转页面

**启动服务：**

使用 `http-server` 启动 3 个本地服务

```
npm -g install http-server

# 启动 3 个不同端口的服务，模拟跨域现象
http-server -p 6001
http-server -p 6002
http-server -p 6003
```

##### 简单实现版本

**client1.html 页面代码**

```js
<body>
  <!-- 开始存储事件 -->
  <button onclick="handleSetItem()">client1-setItem</button>
  <!-- iframe 嵌套“中转页面” hub.html -->
  <iframe src="http://localhost:6003/hub.html" frameborder="0" id="hub"></iframe>

  <script>
    const $ = id => document.querySelector(id)
    // 获取 iframe window 对象
    const ifameWin = $('#hub').contentWindow

    let count = 0
    function handleSetItem () {
      let request = {
        // 存储的方法
        method: 'setItem',
        // 存储的 key
        key: 'someKey',
        // 需要存储的数据值
        value: `来自 client-1 消息：${count++}`,
      }
      // 向 iframe “中转页面”发送消息
      ifameWin.postMessage(request, '*')
    }
  </script>
</body>
```

**hub.html 中转页面代码**

```js
<body>
  <script>
    // 映射关系
    let map = {
      setItem: (key, value) => window.localStorage['setItem'](key, value "'setItem'"),
      getItem: (key) => window.localStorage['getItem'](key "'getItem'"),
    }

    // “中转页面”监听 ifameWin.postMessage() 事件
    window.addEventListener('message', function (e) {
      let { method, key, value } = e.data
      // 处理对应的存储方法
      let result = map[method](key, value "method")
      // 返回给当前 client 的数据
      let response = {
        result,
      }
      // 把获取的数据，传递给 client 窗口
      window.parent.postMessage(response, '*')
    })
  </script>
</body>
```

**client2.html 页面代码**

```js
<body>
  <!-- 获取本地存储数据 -->
  <button onclick="handleGetItem()">client2-getItem</button>
  <!-- iframe 嵌套“中转页面” hub.html -->
  <iframe src="http://localhost:6003/hub.html" frameborder="0" id="hub"></iframe>

  <script>
    const $ = id => document.querySelector(id)
    // 获取 iframe window 对象
    const ifameWin = $('#hub').contentWindow

    function handleGetItem () {
      let request = {
        // 存储的方法（获取）
        method: 'getItem',
        // 获取的 key
        key: 'someKey',
      }
      // 向 iframe “中转页面”发送消息
      ifameWin.postMessage(request, '*')
    }

    // 监听 iframe “中转页面”返回的消息
    window.addEventListener('message', function (e) {
      console.log('client 2 获取到数据啦：', e.data)
    })
  </script>
</body>
```

**浏览器打开如下地址：**

- http://localhost:6001/client1.html
- http://localhost:6002/client2.html

**改进版本**

共拆分成 2 个 js 文件，一个是客户端页面使用 `client.js`，另一个是中转页面使用 `hub.js，具体代码如下：`

```js
// client.js

class Client {
  constructor (hubUrl) {
    this.hubUrl = hubUrl
    // 每个请求的 id 值，作为唯一标识（累加）
    this.id = 0
    // 所有请求消息数据映射（如：getItem、setItem）
    this._requests = {}
    // 获取 iframe window 对象
    this._iframeWin = this._createIframe(this.hubUrl).contentWindow
    this._initListener()
  }
  // 获取存储数据
  getItem (key, callback) {
    this._requestFn('getItem', {
      key,
      callback,
    })
  }
  // 更新存储数据 
  setItem (key, value, callback) {
    this._requestFn('setItem', {
      key,
      value,
      callback,
    })
  }
  _requestFn (method, { key, value, callback }) {
    // 发消息时，请求对象格式
    let req = {
      id: this.id++,
      method,
      key,
      value,
    }
    // 请求唯一标识 id 和回调函数的映射
    this._requests[req.id] = callback
    // 向 iframe “中转页面”发送消息
    this._iframeWin.postMessage(req, '*')
  }
  // 初始化监听函数
  _initListener () {
    // 监听 iframe “中转页面”返回的消息
    window.addEventListener('message', (e) => {
      let { id, result } = e.data
      // 找到“中转页面”的消息对应的回调函数
      let currentCallback = this._requests[id]
      if (!currentCallback) return
      // 调用并返回数据
      currentCallback(result)
    })
  }
  // 创建 iframe 标签
  _createIframe (hubUrl) {
    const iframe = document.createElement('iframe')
    iframe.src = hubUrl
    iframe.style = 'display: none;'
    window.document.body.appendChild(iframe)
    return iframe
  }
}
// hub.js

class Hub {
  constructor () {
    this._initListener()
    this.map = {
      setItem: (key, value) => window.localStorage['setItem'](key, value "'setItem'"),
      getItem: (key) => window.localStorage['getItem'](key "'getItem'"),
    }
  }
  // 监听 client ifameWin.postMessage() 事件
  _initListener () {
    window.addEventListener('message', (e) => {
      let { method, key, value, id } = e.data
      // 处理对应的存储方法
      let result = this.map[method](key, value "method")
      // 返回给当前 client 的数据
      let response = {
        id,
        result,
      }
      // 把获取的数据，发送给 client 窗口
      window.parent.postMessage(response, '*')
    })
  }
}
```

**页面使用：**

```js
<!-- client1 页面代码 -->

<body>
  <button onclick="handleGetItem()">client1-GetItem</button>
  <button onclick="handleSetItem()">client1-SetItem</button>

  <script src="./lib/client.js"></script>
  <script>
    const crossStorage = new Client('http://localhost:6003/hub.html')
    // 在 client1 中，获取 client2 存储的数据
    function handleGetItem () {
      crossStorage.getItem('client2Key', (result) => {
        console.log('client-1 getItem result: ', result)
      })
    }

    // client1 本地存储
    function handleSetItem () {
      crossStorage.setItem('client1Key', 'client-1 value', (result) => {
        console.log('client-1 完成本地存储')
      })
    }
  </script>
</body>
<!-- hub 页面代码 -->

<body>
  <script src="./lib/hub.js"></script>
  <script>
    const hub = new Hub()
  </script>
</body>
<!-- client2 页面代码 -->

<body>
  <button onclick="handleGetItem()">client2-GetItem</button>
  <button onclick="handleSetItem()">client2-SetItem</button>

  <script src="./lib/client.js"></script>
  <script>
    const crossStorage = new Client('http://localhost:6003/hub.html')
    // 在 client2 中，获取 client1 存储的数据
    function handleGetItem () {
      crossStorage.getItem('client1Key', (result) => {
       console.log('client-2 getItem result: ', result)
      })
    }
    // client2 本地存储
    function handleSetItem () {
      crossStorage.setItem('client2Key', 'client-2 value', (result) => {
        console.log('client-2 完成本地存储')
      })
    }
  </script>
</body>
```

##### 总结

以上就实现了跨域存储，也是 **cross-storage** 开源库的核心原理。通过 `window.postMessage()` api 跨域特性，再配合一个 “中转页面”，来完成所谓的“跨域存储”，实际上并没有真正的在浏览器端实现跨域存储，这是浏览器的限制，我们无法打破，只能用“曲线救国”的方式，变向来共享存储数据。