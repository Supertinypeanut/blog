---
title: 模仿jQuery分装Ajax方法
date: 2019-11-20 10:10:10
tags: JavaScript

---

###原生封装

```js
function ajax(obj) {
  defaults = {
      type: 'get',
      url: void (0),
      async: true,
      dataType: 'json',
      data: {},
      jsonp: 'callback',
      jsonpCallBack: 'jQuery' + ('1.12.2' + Math.random()).replace(/\D/g, '') + Date.now(), //随机生成回调函数名，避免get请求的缓存问题
      success(data) {
        console.log(data)
      }
    }
    // 处理传过来的参数对象，更新默认值
  for (const key in obj) {
    defaults[key] = obj[key]
  }

  // 由于发送给后台数据，是有 键=值&....,所以遍历数据对象defaults.data
  var str = '';
  if (defaults.data) {
    for (const key in defaults.data) {
      str += key + '=' + defaults.data[key] + '&';
    }
  }

  // 剔出最后一个&
  str = str.substring(0, str.length - 1);

  //--------------------------------判断是否是jsonp数据类型，因为jsonp请求方式和普通的请求处理逻辑不同
  if (!defaults.dataType == 'jsonp') {
    ajaxFa();
  } else { //--------------------------jsonp请求主要是通过script的src属性·

    ajaxJsonp(str);
  }
}
//**********************普通同源请求****************
function ajaxFa() {
  //创建XMLHttpRequest
  const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
    // 创建成功 xhr.readyState == 0    数据初始化成功

  // 为了以防背后xhr.send（）请求过快而为监听到事件，所以先注册  可以监听xhr.readyState状态变化 与当响应数据xhr.response（xhr.readyState==3）过大会分段传回，也会不断触发该函数，该阶段触发的情况 与单独的onpregress（）事件等价，  
  xhr.onreadystatechange = () => {
    // 等于4时，响应数据接收解析完毕   --》可以等同与onload（）事件
    if (xhr.readyState == 4) {
      // 等于200数据请求成功
      if (xhr.status == 200) {
        let data = xhr.responseText;
        // 判断是否是json数据类型
        if (defaults.dataType == 'json') {
          data = JSON.parse(data);
        }
        // 执行回调函数
        defaults.success(data);
      }
    }
  }

  if (defaults.type == 'get') {
    // 获取可能请求参数有中文，所以需要进行转码  
    defaults.url += encodeURI('?' + str);
  }
  // 与服务器建立链接
  xhr.open(defaults.type, defaults.url, defaults.async);
  // 此时 xhr.readtSate == 1


  // 判断请求类型是否为post
  let parme = null;
  if (defaults.type == 'post') {
    // 由于post请求，将参数是放到请求体中所以，转码方式与get有所不同，是设置请求头
    xhr.setRequestHeader('Content-Type', 'applocation/x-www-form-urlencoded');
    parme = str;
  }
  //   发送请求
  xhr.send(parme);
  //   当转变为2时直接触发onreadystatechange
}
//**********************跨域请求jsonp****************
function ajaxJsonp(str) {
  // 将回调函数挂载到window上
  window[defaults.jsonCallBack] = data => {
      defaults.success(data);
    }
    // console.log(defaults.jsonCallBack);
  if (str) {
    str = '&' + str;
  }
  // 将回调函数与请求参数添加到请求路径背后
  defaults.url += '?' + defaults.jsonp + '=' + defaults.jsonCallBack + str;
  // 应为服务器传回的数据是文本格式，但只要传回的文本格式是js解析的文本便会执行
  // 创建script标签
  const script = document.createElement('script');
  //  为script标签添加src属性
  script['src'] = defaults.url;
  // 获取hend标签
  const head = document.querySelector('head')[0];
  // 将script标签添加到head中
  head.appendChild(script);
}
```

###优化代码结构

```js
function ajax({
    type = 'get',
    url = void 0,
    data = {},
    async = true,
    dataType = 'json',
    jsonp = 'callback',
    jsonpCallBack =  `JQuery_111_${Date.now()}${Math.random().toString().replace('.','')}`,
    success = data=>{ console.log(data)}
}){
    // 处理请求参数对象
    let requestParams = ''
    for (const key in data) {
        if (Object.hasOwnProperty.call(data,key)) {
            requestParams += `${key}=${data[key]}&`
        }
    }
    requestParams = requestParams.slice(0,-1)

    // 判断是否是jsonp跨域
    if(type === 'jsonp'){
        // 挂载调用函数
        window[jsonpCallBack] = function (data){
            success(data)
        }
        const headNode = document.querySelector('head')[0]
        const scriptNode = document.createElement('script')
        scriptNode.src = `${url}?${jsonp}=${jsonpCallBack}&${requestParams}`
        headNode.appendChild(scriptNode)
    }
    // 使用XMLHttpRequest对象
    else{
        // 创建
        const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
        //  xhr.readyState ===0

        xhr.onreadystatechange = ()=>{
            if (xhr.readyState === 4 && xhr.status === 200) {
                let res =  xhr.responseText
                dataType === 'json' ? success(JSON.parse(res)) : success(res)
            }
        }

        if (type === 'get') {
            url += '?' + requestParams 
        }
        xhr.open(type, encodeURI(url), async)

        let temp = null
        if (type === 'post') {
            temp = requestParams
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencode')
        }
        xhr.send(temp)
    }
}
```

###TypeScript编写

```typescript
interface AjaxConfig{
    url: string,  // 请求地址
    type?: 'get' | 'head' | 'delete' | 'option' | 'post' | 'patch' | 'put' , // 请求方式
    dataType?: 'json' | 'jsonp' | 'text' | 'xml', // 返回数据格式
    data?: object, // 请求参数
    jsonp?: string, // 后端获取回调函数名的键
    jsonpCallBack?: string, // 回调函数名
    async?: boolean, // 是否异步请求
    success?: Function, // 请求成功回调
}

class Ajax {
    private requestParams: string = ''
    private requestSetting: AjaxConfig = {
        url: '',
        type: 'get',
        data: {},
        dataType: 'json',
        jsonp: 'callBack',
        jsonpCallBack: `Peanut_Ajax_${Date.now()}_${Math.random().toString().replace('.','')}`,
        async: true,
        success(data: any){console.log('请求成功:',data)}
    }
    // 初始化数据
    constructor(agrObj?: AjaxConfig) {
        for (const key in agrObj) {
            if (Object.prototype.hasOwnProperty.call(agrObj, key)) {
                this.requestSetting[key] = agrObj[key];
            }
        }
    }
    // 请求方法
    private request(agrObj?: AjaxConfig) {
        for (const key in agrObj) {
            if (Object.prototype.hasOwnProperty.call(agrObj, key)) {
                this.requestSetting[key] = agrObj[key];
            }
        }

        if (!this.requestSetting.url) {
            throw new Error("没有URL")
            return
        }

        // 是否是jsonp请求
        this.requestSetting.dataType === 'jsonp' 
            ? this.jsonpRequest()
            : this.defaultRequest() 
    }

    // 请求参数处理
    private requestParamsTransform(obj: object): string  {
        let result: string = ''
        for (const key in obj) {
            result += `${key}=${obj[key]}&`
        }
        return result.slice(0, -1)
    }

    // 普通请求
    private defaultRequest() {
        let { url, type, dataType, success, data, async } = this.requestSetting
        let sendParams = null

        const xhr: XMLHttpRequest = XMLHttpRequest 
            ? new XMLHttpRequest() 
            : new ActiveXObject('Microsoft.XMLHTTP')
        
        xhr.onreadystatechange = () => {
            console.log(xhr.readyState, 'onreadystatechange')
            if(xhr.readyState === 4 && xhr.status === 200) {
                const res = dataType === 'json' 
                    ? JSON.parse(xhr.responseText) 
                    : xhr.responseText
                
                success(res)
            }
        }

        if(type === 'get') {
            const urlParams = encodeURI(this.requestParamsTransform(data))
            url += '?' + urlParams
        }
        xhr.open(type, url, async)

        if(type === 'post') {
            sendParams = this.requestParamsTransform(data)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencode')
        }
        xhr.send(sendParams)
    }

    // jsonp请求
    private jsonpRequest() {
        const { jsonp, jsonpCallBack, url, success, data } = this.requestSetting
        // 挂载成功回调
        window[jsonpCallBack] = success
        const request: string = this.requestParamsTransform(data)

        const scriptNode: HTMLScriptElement = document.createElement('script')
        scriptNode.src = `${url}?${jsonp}=${jsonpCallBack}&${request}`

        // 将script标签添加到头部
        const head: HTMLHeadElement = document.getElementsByTagName('head')[0]
        head.appendChild(scriptNode)
    }
}
```

