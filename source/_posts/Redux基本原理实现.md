---
title: Redux基本原理实现
date: 2020-08-31 10:10:10
tags:
  - JavaScript
  - React
---

## Redux基本组成

Redux是将整个应用状态存储到一个地方上称为**store**,里面保存着一个状态树**store tree**,组件可以派发(dispatch)行为(action)给store,而不是直接通知其他组件，组件内部通过订阅**store**中的状态**state**来刷新自己的视图。

### State（初始化数据）

state就是store里面存储的数据，store里面可以拥有多个state，Redux规定一个state对应一个View,只要state相同，view就是一样的，反过来也是一样的，可以通过**store.getState( )**获取。

### Action（行为）

定制行为，或传递参数给reducer中使用。

```js
// 无需传递参数
const action = {
  type: 'ADD_TODO',
  params: '1'
}

// 需传递参数
const action = (...params) => {
  type: 'ADD_TODO',
  ...params,
}
  
// 异步action (需要引入thunk中间件，createStore(reducer, applyMiddleware(thunk)))
  const sub = (...params)=>{
    type: 'SUB_TODO',
    ...params,
  }
  
  const action = (...params)=>{
    return (dispatch)=>{
      dispatch(sub(...params))
    }
  }
```

### Reducer（执行行为，纯函数）

Store收到Action以后，必须给出一个新的state，这样view才会发生变化。这种**state的计算过程**就叫做Reducer。Reducer是一个纯函数，他接收Action和当前state作为参数，返回一个新的state

```js
import state from '../state'
import actionType from '../action/actionType.js'

const reducer = (oldState = state, action) => {
    switch (action.type) {
        case actionType.ADD_NUM:
            const newState1 = Object.assign({}, oldState)
            newState1[action.params]++
            return newState1
        case actionType.SUB_NUM:
            const newState2 = Object.assign({}, oldState)
            newState2[action.params]--
            return newState2
        default:
            return oldState
    }
}
export default reducer
```

### Store

以上state、action和reducer均为自己实现，只不过是根据Redux风格约定，只要能实现上述功能，名称其实并没有很强约束。Redux只不过是帮我们将action与reducer函数相关联而已，所以redux原理主要实现createStore函数即可。

```js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
export default createStore(reducer, applyMiddleware(thunk))
```

## CreateStore原理实现

```js
let createStore = (reducer) => {
    let state;
    //获取状态对象
    //存放所有的监听函数
    let listeners = [];
    let getState = () => state;
    //提供一个方法供外部调用派发action
    let dispath = (action) => {
        //调用管理员reducer得到新的state
        state = reducer(state, action);
        //执行所有的监听函数
        listeners.forEach((l) => l())
    }
    //订阅状态变化事件，当状态改变发生之后执行监听函数
    let subscribe = (listener) => {
        listeners.push(listener);
    }
    dispath();
    return {
        getState,
        dispath,
        subscribe
    }
}
let combineReducers=(renducers)=>{
    //传入一个renducers管理组，返回的是一个renducer
    return function(state={},action={}){
        let newState={};
        for(var attr in renducers){
            newState[attr]=renducers[attr](state[attr],action)

        }
        return newState;
    }
}
export {createStore,combineReducers};
```

