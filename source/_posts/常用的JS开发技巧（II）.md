---
title: 常用的JS开发技巧(II)
date: 2020-03-06 10:10:10
tags: JavaScript
---

## 目录

- 判断当前环境是否是手机端
- 断当前环境是否是微信环境
- 检测浏览器是否放大
- 获取普通地址url参数
- 获取hash模式地址url参数
- 时间戳转换为目标格式
- 时间戳距离现在多久以前
- 生成任意位数随机数(数字)
- 随机生成一个自定义长度，不重复的字母加数字组合，可用来做id标识
- js数组去重(复杂数据有ID的情况下)
- 浅拷贝
- 深拷贝
- Promise方式封装的Ajax函数
- js浮点数计算加减乘除精度损失解决方法
- 防抖 (debounce)
- 节流(throttle)
- 文件大小换算成单位
- 将一个字符串复制到剪贴板
- 平滑滚动到页面顶部

> 如果以上工具函数还未能解你的需求，可以移步查阅[JavaScript工具函数大全](https://segmentfault.com/a/1190000021937948)、[JavaScript 工具函数大全（新）](https://mp.weixin.qq.com/s/YmMq1THEObpYU38JlWZGdw)

## 函数实现

### 1.判断当前环境是否是手机端

```js
/**
 * 判断当前环境是否是手机端
 * @return {Boolean}  返回结果
 */
 export const isMobile=() =>{
     if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true
        } else {
            return false
      }
   }
```

### 2.断当前环境是否是微信环境

```js
/**
 * 断当前环境是否是微信环境
 * @return {Boolean}  返回结果
 */
export const isWeixin =() =>{      
      const ua = navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i)==="micromessenger") {
           return true;
     } else {
            return false;
      }
  }
```

### 3.检测浏览器是否放大

```js
/**
 * 检测浏览器是否放大
 * @param {Boolean } rsize  是否返回具体放大数值,默认否
 * @return {Boolean | Number}  返回结果
 */
export const detectZoom=rsize =>{
  let ratio = 0
  const screen = window.screen
  const ua = navigator.userAgent.toLowerCase()

  if (window.devicePixelRatio) {
    ratio = window.devicePixelRatio
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) ratio = screen.deviceXDPI / screen.logicalXDPI
  } else if (window.outerWidth&& window.innerWidth) {
    ratio = window.outerWidth / window.innerWidth
  }

  if (ratio) ratio = Math.round(ratio * 100)

  return rsize ? ratio : ratio === 100
}
```

### 4.获取普通地址url参数

```js
/**
 * 获取普通地址url参数
 * 例如：http://localhost:8080/?token=rTyJ7bcRb7KU4DMcWo4216&roleId=512213631174180864
 * @param {String} name 
 * @return {Boolean | String} 返回获取值 
 */
export const getUrlParam = name =>{
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
  const r = window.location.search.substr(1).match(reg);  
  if (r != null) return decodeURI(r[2]); return false; 
}
```

### 5.获取hash模式地址url参数

```js
/**
 * 获取hash模式地址url参数
 * 例如：http://localhost:8080/#/?token=rTyJ7bcRb7KU4DMcWo4216&roleId=512213631174180864
 * @param {String} name 
 * @return {Boolean | String} 返回获取值 
 */
export const getUrlHashParam =name =>{
  const w = window.location.hash.indexOf("?");
  const query = window.location.hash.substring(w + 1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == name) {
      return pair[1];
    }
  }

  return false;
}
```

### 6.时间戳转换为目标格式

```js
/**
 * 时间戳转换
 * @param {Number} date 时间戳
 * @param {String} fmt  时间显示格式，例如 yyyy-MM-dd HH:mm:ss
 * @return {String} fmt 返回转换后的时间 ，formatDate(value, "yyyy-MM-dd  hh: mm : ss")
 */
export const formatDate = (date, fmt) => {
  date = new Date(date);
  if (isNaN(date.getDate())) return date;
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
      );
    }
  }
  return fmt;
};
```

### 7.时间戳距离现在多久以前

```js
/**
 * 时间戳转换成什么之前
 * @param {Number} times 时间戳
 * @return {String} 返回结果，timeAgoLabel(1606273724459) 输出：刚刚
 */
export const timeAgoLabel = times => {
  let nowTimes = new Date().getTime()
  let diffSecond = (nowTimes - times) / 1000
  let agoLabel = ''
  if (diffSecond < 60) {
    agoLabel = '刚刚'
  } else if (diffSecond < 60 * 60) {
    agoLabel = Math.floor(diffSecond / 60) + '分钟前'
  } else if (diffSecond < 60 * 60 * 24) {
    agoLabel = Math.floor(diffSecond / 3600) + '小时前'
  } else if (diffSecond < 60 * 60 * 24 * 30) {
    agoLabel = Math.floor(diffSecond / (3600 * 24)) + '天前'
  } else if (diffSecond < 3600 * 24 * 30 * 12) {
    agoLabel = Math.floor(diffSecond / (3600 * 24 * 30)) + '月前'
  } else {
    agoLabel = Math.floor(diffSecond / (3600 * 24 * 30 * 12)) + '年前'
  }
  return agoLabel
}
```

### 8.生成任意位数随机数(数字)

```js
/**
 * 生成任意位数随机数(数字)
 * @param {Number} n 可选长度位数
 * @return {Number} 返回随机值
 */
export const randomNumber =n =>{
      let rnd = '';
      for (let i = 0; i < n; i++) {
        rnd += Math.floor(Math.random() * 10);
      }
      return rnd;
}
```

### 9.随机生成一个自定义长度，不重复的字母加数字组合，可用来做id标识

```js
/**
 * 随机生成一个自定义长度，不重复的字母加数字组合，可用来做id标识
 * @param {Number} randomLength 可选长度位数，默认10
 * @return {String} 返回随机值
 */
export const randomId =(randomLength = 10) =>{
    return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
},
复制代码
```

### 10.js数组去重(复杂数据有ID的情况下)

```js
 /**
  * js数组去重(复杂数据有ID的情况下)
  * 方式一(hash)
  * @param {Array} repeatArray 含重复数据的数组
  * @return {Array} 返回去重后的数据
  */
 export const noRepeatArrayHash= repeatArray =>{
      const hash = {};
      const temp = [];
      for (let i = 0; i < repeatArray.length; i++) {
          if (!hash[repeatArray[i].id]) {
              hash[repeatArray[i].id] = true;
              temp.push(repeatArray[i]);
          }
      }
  
      return temp;
}

 /**
  * js数组去重(复杂数据有ID的情况下)
  * 方式二(hash + reduce)
  * @param {Array} repeatArray 含重复数据的数组
  * @return {Array} 返回去重后的数据
  */
export const noRepeatArrayReduce= repeatArray =>{
    const hash = {};
	return repeatArray.reduce(function(accumulator, currentValue){
	       if(!hash[currentValue.id]){
		       hash[currentValue.id]=true;
			   accumulator.push(currentValue)
           }  
           
        return accumulator		   
	
	}, []);
}
```

### 11.浅拷贝

```js
/**
 * 浅拷贝
 * @param {Array | Object} objOrArr 要拷贝的对象或数组
 * @return {Array | Object} 返回拷贝结果
 */
export const shallowCopy = objOrArr =>{
    const type = objOrArr instanceof Array ? 'array' : 'object'
    let newObjOrArr = objOrArr instanceof Array ? [] : {}
    if(type === 'array'){
        newObjOrArr=[].concat(objOrArr)
    }else{
        for(let key in objOrArr){
            if(objOrArr.hasOwnProperty(key)){
                newObjOrArr[key]= objOrArr[key]
            }
        }
    }

    return newObjOrArr
}
```

### 12.深拷贝

```js
/**
 * 深拷贝
 * @param {Array | Object} objOrArr 要拷贝的对象或数组
 * @return {Array | Object} 返回拷贝结果
 */
export const deepCopy= objOrArr => {
    const type = objOrArr instanceof Array ? 'array' : 'object'
    let newObjOrArr = objOrArr instanceof Array ? [] : {}
    if (type === 'array') {
        newObjOrArr = JSON.parse(JSON.stringify(objOrArr))
    } else {
        for (let key in objOrArr) {
            if (objOrArr.hasOwnProperty(key)) {
                newObjOrArr[key] = typeof objOrArr[key] === 'object' ? deepCopy(objOrArr[key]) : objOrArr[key]
            }
        }
    }

    return newObjOrArr
}
```

### 13.Promise方式封装的Ajax函数

```js
/**
 * promise方式封装的ajax函数
 * @param {String} method 请求方式
 * @param {String} url 请求地址
 * @param {Object} params 请求参数
 */
export const ajax=(method,url, params) =>{		
    //兼容IE		 	
    const request= window.XMLHttpRequest ? 	new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")	
    return new Promise(function(resolve,reject){
            request.onreadystatechange=function(){
                    if(request.readyState===4){
                            if(request.status===200){
                                resolve(JSON.parse(request.response));
                            }else{
                                reject(request.status);
                            }
                    }
            };
            if(method.toUpperCase() === "GET"){
                const arr = [];
                for(let key in params){
                    arr.push(key + '=' + params[key]);
                }
                const getData=arr.join("&");					
                request.open("GET",url +"?"+getData,true);
                request.send(null);
            }else if(method.toUpperCase() === "POST"){
                request.open("POST",url,true);
                request.responseType="json";
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                request.send(params);

            }			

    })

}
```

### 14.js浮点数计算加减乘除精度损失解决方法

```js
/**
 * js浮点数计算加减乘除精度损失解决方法
 * @param {Number} a 数值a
 * @param {Number} b 数值b
 * @param {String} computeType 加减乘除类型 add加  subtract减  multiply乘  divide除
 * @return {Number} 返回计算结果，floatNumber(0.11, 0.03, 'add')
 */
export const floatNumber = (a, b, computeType) =>{
    const isInteger= obj =>{
        return Math.floor(obj) === obj
    }
    const toInteger= floatNum =>{
        const ret = {times: 1, num: 0}
        if (isInteger(floatNum)) {
            ret.num = floatNum
            return ret
        }
        const strfi  = floatNum + ''
        const dotPos = strfi.indexOf('.')
        const len    = strfi.substr(dotPos+1).length
        const times  = Math.pow(10, len)
        const intNum = parseInt(floatNum * times + 0.5, 10)
        ret.times  = times
        ret.num    = intNum
        return ret
    }
    const operation=(a, b, computeType) =>{
        const o1 = toInteger(a)
        const o2 = toInteger(b)
        const n1 = o1.num
        const n2 = o2.num
        const t1 = o1.times
        const t2 = o2.times
        const max = t1 > t2 ? t1 : t2
        let result = null
        switch (computeType) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max
            case 'multiply':
                result = (n1 * n2) / (t1 * t2)
                return result
            case 'divide':
                result = (n1 / n2) * (t2 / t1)
                return result
        }

    }

    return operation(a, b, computeType)
}
```

### 15.防抖 (debounce)

```js
/**
 * 防抖 (debounce)将多次高频操作优化为只在最后一次执行
 * @param {Function} fn 需要防抖函数
 * @param {Number} wait  需要延迟的毫秒数
 * @param {Boolean} immediate 可选参，设为true，debounce会在wait时间间隔的开始时立即调用这个函数
 * @return {Function}
 */
export const debounce= (fn, wait, immediate) =>{
    let timer = null

    return function() {
        let args = arguments
        let context = this

        if (immediate && !timer) {
            fn.apply(context, args)
        }

        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, wait)
    }
}
```

### 16.节流(throttle)

```js
/**
 * 节流(throttle)将高频操作优化成低频操作，每隔 100~500 ms执行一次即可
 * @param {Function} fn 需要防抖函数
 * @param {Number} wait  需要延迟的毫秒数
 * @param {Boolean} immediate 可选参立即执行，设为true，debounce会在wait时间间隔的开始时立即调用这个函数
 * @return {Function}
 */
export const throttle =(fn, wait, immediate) =>{
    let timer = null
    let callNow = immediate
    
    return function() {
        let context = this,
            args = arguments

        if (callNow) {
            fn.apply(context, args)
            callNow = false
        }

        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(context, args)
                timer = null
            }, wait)
        }
    }
}
```

### 17.文件大小换算成单位

```js
/** 
 * 文件大小换算成单位
 * @param {Number} bytes 大小
 * @param {String} units 可选单位，默认metric
 * @param {Number} precision 可选位数，数值精度保留几位小数点，默认1
 * @return {String} 返回带单位值，byteSize(1580)，输出1.6 kB
*/
export const byteSize = (bytes, units='metric', precision=1) => {
    let value='',
        unit=''
    const base = units === 'metric' || units === 'metric_octet' ? 1000 : 1024
    const table = [
        { expFrom: 0, expTo: 1, metric: 'B', iec: 'B', metric_octet: 'o', iec_octet: 'o' },
        { expFrom: 1, expTo: 2, metric: 'kB', iec: 'KiB', metric_octet: 'ko', iec_octet: 'Kio' },
        { expFrom: 2, expTo: 3, metric: 'MB', iec: 'MiB', metric_octet: 'Mo', iec_octet: 'Mio' },
        { expFrom: 3, expTo: 4, metric: 'GB', iec: 'GiB', metric_octet: 'Go', iec_octet: 'Gio' },
        { expFrom: 4, expTo: 5, metric: 'TB', iec: 'TiB', metric_octet: 'To', iec_octet: 'Tio' },
        { expFrom: 5, expTo: 6, metric: 'PB', iec: 'PiB', metric_octet: 'Po', iec_octet: 'Pio' },
        { expFrom: 6, expTo: 7, metric: 'EB', iec: 'EiB', metric_octet: 'Eo', iec_octet: 'Eio' },
        { expFrom: 7, expTo: 8, metric: 'ZB', iec: 'ZiB', metric_octet: 'Zo', iec_octet: 'Zio' },
        { expFrom: 8, expTo: 9, metric: 'YB', iec: 'YiB', metric_octet: 'Yo', iec_octet: 'Yio' }
    ]

    for (let i = 0; i < table.length; i++) {
        const lower = Math.pow(base, table[i].expFrom)
        const upper = Math.pow(base, table[i].expTo)
        if (bytes >= lower && bytes < upper) {
            const retUnit = table[i][units]
            if (i === 0) {
                value = String(bytes)
                unit = retUnit
                break;
            } else {
                value = (bytes / lower).toFixed(precision)
                unit = retUnit
                break;
            }
        }
    }
    return `${value} ${unit}`.trim()  
}
```

### 18.将一个字符串复制到剪贴板

```js
/**
 * 将一个字符串复制到剪贴板
 * @param {String} str 复制的内容
 * @return {String} 直接粘贴， copyToClipboard('将一个字符串复制到剪贴板')
 */
 export const copyToClipboard = str => {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected =document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
          document.getSelection().removeAllRanges();
          document.getSelection().addRange(selected);
      }
}
```

### 19.平滑滚动到页面顶部

```js
/**
 * 平滑滚动到页面顶部
 */
export const scrollToTop = () => {  
    const c = document.documentElement.scrollTop || document.body.scrollTop;  
    if (c > 0) {  
    window.requestAnimationFrame(scrollToTop);  
    window.scrollTo(0, c - c / 8);  
    }  
}
```