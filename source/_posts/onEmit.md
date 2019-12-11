---
title: 理解Vue事件通信原理 
date: 2019-12-2 10:10:10
---

```js
/**
 * Vue事件通信原理
*/

class EventBus{
    constructor(){
        // 订阅事件存储数组
        this.handles = []
    }

    // 订阅方法
    on(eventName,callbake){
        // 当前事件类型
        const triggerEvent = this.handles[eventName]
        if (!triggerEvent) {
            this.handles[eventName] = []                            
        }

        // 给事件类型添加订阅事件
        this.handles[eventName].push(callbake)
    }

    //发布方法
    emit(eventName,...params){
        const triggerEvent = this.handles[eventName]

        // 如果有当前事件类型，则全部触发
        if (triggerEvent) {
            triggerEvent.forEach( callbake => callbake(...params) )
        }
    }
}

// 创建一个eventBus实例
const evnetBus = new EventBus()

// 订阅事件类型
evnetBus.on('eventA',(args)=>console.log(`A--${args}`))
evnetBus.on('eventA',()=>console.log('A'))
evnetBus.on('eventB',()=>console.log('B'))
evnetBus.on('eventB',()=>console.log('BB'))
evnetBus.on('eventC',()=>console.log('C'))

// 发布订阅事件
evnetBus.emit('eventA',996)

/**
 * 执行结果：
 * A--996
 * A
*/
```

