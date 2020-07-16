---
title: React组件封装方法
data: 2019-12-02 10:10:10
tags: 
    - JavaScript
    - React
---

##### 普通类组件实现

```jsx
import React, { Component } from 'react'

class Renderprops extends Component{
    state = {
        x:0,
        y:0
    }

    handlerFn = (e) => {
        this.setState({x:e.x,y:e.y})
    }

    componentDidMount(){
        window.addEventListener('mousemove',this.handlerFn,false)
    }

    componentWillUnmount(){
        window.removeEventListener('mousemove',this.handlerFn)
    }

    render(){
        return (
            <div>
                <h1>X:{this.state.x} Y:{this.state.y}</h1>
            </div>
        )
    }
}

export default Renderprops
```



##### render props模式

###### 复用的是组件的状态和功能，传入的是UI要呈现的效果。

```jsx
import React, { Component } from 'react'


class MouseComponent extends Component{
    state = {
        x:0,
        y:0
    }

    handlerFn = (e) => {
        this.setState({x:e.x,y:e.y})
    }

    componentDidMount(){
        window.addEventListener('mousemove',this.handlerFn,false)
    }

    componentWillUnmount(){
        window.removeEventListener('mousemove',this.handlerFn)
    }

    render(){
        return this.props.render(this.state)
    }
}

class Renderprops extends Component{

    shoewUI = (state)=>{
        const { x, y } = state
        return <h1>X:{x} Y:{y}</h1>
    }

    render(){
        return <MouseComponent render={this.shoewUI} />
    }
}

export default Renderprops
```



##### 高阶组件（HOC)

######高阶函数(形式上):如果一个**函数**的形参或者返回值也是**函数**

```jsx
import React, { Component } from 'react'


// 创建高阶组件
// 1. 创建一个函数，名称约定以 with 开头 
// 2. 指定函数参数，参数应该以大写字母开头（作为要渲染的组件）
// 3. 在函数内部创建一个类组件，提供复用的状态逻辑代码，并返回 
// 4. 在该组件中，渲染参数组件，同时将状态通过prop传递给参数组件
// 5. 调用该高阶组件，传入要增强的组件，通过返回值拿到增强后的组件,并将其渲染到页面中

const withCompile = (Fnc)=>{
    return class MouseComponent extends Component{
        state = {
            x:0,
            y:0
        }
    
        handlerFn = (e) => {
            this.setState({x:e.x,y:e.y})
        }
    
        componentDidMount(){
            window.addEventListener('mousemove',this.handlerFn,false)
        }
    
        componentWillUnmount(){
            window.removeEventListener('mousemove',this.handlerFn)
        }
    
        render(){
            return <Fnc {...this.state} {...this.props}/>
        }
    }
}

function Fnc(props){
    return <div>title:{props.title}<h1>X:{props.x}Y:{props.y}</h1></div>
}

const Result = withCompile(Fnc)

class Renderprops extends Component{
    render(){
        return <Result title="数据"/>
    }
}

export default Renderprops
```



**所以组件封装是为了复用  state  和  操作state的方法 （组件状态逻辑 ）**