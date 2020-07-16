---
title: 常见javascript设计模式
date: 2020-02-08 15:53:00
tags: 
    - JavaScript
---

##### 模块设计模式

JS模块化是使用最普遍的设计模式，用于保持特殊的代码块与其它组件之间互相独立。为支持结构良好的代码提供了松耦合。

对于熟悉面向对象的开发者来说，模块就是JS的 “类”。封装是“类”的众多优点之一，可以确保它本身的状态和行为不被其它的类访问到。模块设计模式有公有和私有两种访问级别（除此之外，还有比较少为人知的保护级别、特权级别）。

考虑到私有的作用域，模块应该是一个立即调用函数（IIFE) ，也就是说，它是一个保护其私有变量和方法的闭包。（然而，它返回的却不是一个函数，而是一个对象）。

这种模式我们可以通过即行函数 IIFE（immediately-invoked function expression)、闭包和函数作用域来模拟，例如：

```js
const myModule = (function() {

const privateVariable = 'Hello World';

  function privateMethod() {
    console.log(privateVariable);
  }
  return {
    publicMethod: function() {
      privateMethod();
    }
  }
})();

myModule.publicMethod();
```

代码是即行函数的方法，通过立即执行函数，并把返回结果指向了 myModule 变量。由于闭包、返回的对象仍然可以访问定义在即行函数内的函数和变量，当然这些操作是在执行完即行函数产生实例之后了。我们可以看到，变量和方法被定义在即行函数内部，对于模块外部的作用域来说即达到了 private 的效果。



##### 工厂模式

工厂模式是一种使用工厂函数来创建对象的设计模式，该模式不用指定被创建对象准确的类或者构造函数。这种模式通常用来去创建一些不用暴露实例化逻辑的对象。例如我们可以根据依赖对象中传递的不同实例化条件来动态生成所需要的对象：

```js
class Car{
  constructor(options) {
    this.doors = options.doors || 4;
    this.state = options.state || 'brand new';
    this.color = options.color || 'white';
  }
}
class Truck {
  constructor(options) {
    this.doors = options.doors || 4;
    this.state = options.state || 'used';
    this.color = options.color || 'black';
  }
}
class VehicleFactory {
  createVehicle(options) {
    if(options.vehicleType === 'car') {
      return new Car(options);
    } else if(options.vehicleType === 'truck') {
      return new Truck(options);
    }
  }
}

```

这里我分别定义了一个Car 和一个Truck类，并给对象添加了默认值，这2个类分别用来创建各自的 car 和 truck 对象。然后我定义了一个VehicleFactory类，根据options对象中vehicleType属性来创建和返回新的对象。

```js
const factory = new VehicleFactory();
const car = factory.createVehicle({
  vehicleType: 'car',
  doors: 4,
  color: 'silver',
  state: 'Brand New'
});
const truck= factory.createVehicle({
  vehicleType: 'truck',
  doors: 2,
  color: 'white',
  state: 'used'
});
// Prints Car {doors: 4, state: "Brand New", color: "silver"}
console.log(car);
// Prints Truck {doors: 2, state: "used", color: "white"}
console.log(truck);
```

这里我用 VehicleFactory 类创建了一个工厂对象，然后分别指定两个options对象 vehicleType属性的值为car 和 truck，通过 factory.createVehicle 方法分别创建了 Car 和 Truck 对象。



#####观察者模式

很多时候，当应用的一部分改变了，另一部分也需要相应更新。在 AngularJs 里面，如果 $scope 被更新，就会触发一个事件去通知其他组件。结合观察这模式就是：如果一个对象改变了，它只要派发 broadcasts 事件通知依赖的对象它已经改变了则可。

观察者模式主要应用于对象之间一对多的依赖关系，当一个对象发生改变时，多个对该对象有依赖的其他对象也会跟着做出相应改变，这就非常适合用观察者模式来实现。使用观察者模式可以根据需要增加或删除对象，解决一对多对象间的耦合关系，使程序更易于扩展和维护。

又一个典型的例子就是 model-view-controller (MVC) 架构了；当 model 改变时， 更新相应的 view。这样做有一个好处，就是从 model 上解耦出 view 来减少依赖。

实现一个观察者模式至少要包含2个角色如下图UML图中所示：Subject和Observer对象 。

![img](640.jpeg)

下面我们使用JavaScript来实现上图的观察者模式。

```js
var Subject = function() {
  var observers = [];

  return {
    subscribeObserver: function(observer) {
      observers.push(observer);
    },
    unsubscribeObserver: function(observer) {
      var index = observers.indexOf(observer);
      if(index > -1) {
        observers.splice(index, 1);
      }
    },
    notifyObserver: function(observer) {
      var index = observers.indexOf(observer);
      if(index > -1) {
        observers[index].notify(index);
      }
    },
    notifyAllObservers: function() {
      for(var i = 0; i < observers.length; i++){
        observers[i].notify(i);
      };
    }
  };
};

var Observer = function() {
  return {
    notify: function(index) {
      console.log("Observer " + index + " is notified!");
    }
  }
}
```

上面的代码我们实现了Subject对象，在其内部声明了一个observers 数组用来存储注册的observer对象。下面让我们来使用这两个对象

```js
var subject = new Subject();

var observer1 = new Observer();
var observer2 = new Observer();
var observer3 = new Observer();
var observer4 = new Observer();

subject.subscribeObserver(observer1);
subject.subscribeObserver(observer2);
subject.subscribeObserver(observer3);
subject.subscribeObserver(observer4);

subject.notifyObserver(observer2); // Observer 2 is notified!

subject.notifyAllObservers();
// Observer 1 is notified!
// Observer 2 is notified!
// Observer 3 is notified!
// Observer 4 is notified!
```

以上实现了一个简单的设计者模式，先使用subjectsubscribeObserver(observer)注册以后要通知的观察者对象，当我们想通知注册好的观察者对象时，只需要使用subject.notifyObserver(observer)即可



##### 单例模式

单例模式只允许实例化一个对象，但是相同的对象，会用很多个实例。单例模式制约着客户端创建多个对象。第一个对象创建后，就返回实例本身。

JavaScript 语言本身就是支持单例模式的，不过我们一般并不称它为单例模式，我们通常叫它字面量对象，例如：

```js
const user = {
  name: 'Peter',
  age: 25,
  job: 'Teacher',
  greet: function() {
    console.log('Hello!');
  }
};

```

JavaScript 中的每个对象在内存中都是唯一的，当我们调用 User对象时，实质上也是返回的对象引用地址。

假如我们想要拷贝某个对象到另外一个变量，并且修改变量，该如何办呢？如下：

```js
const user1 = user;
user1.name = 'Mark';
```

我们会得到结果是两个对象的name都被修改了, 因为赋值的时候是引用赋值，而不是值赋值。所以内存中只有一份对象。请看：

```js
// prints 'Mark'
console.log(user.name);
// prints 'Mark'
console.log(user1.name);
// prints true
console.log(user === user1);
```

单例模式可以通过构造函数来实现，看代码：

```js
var printer = (function () {

    var printerInstance;

    function create() {
        return {
            turnOn: function turnOn() {
            console.log('working')
        }
      }
    }

    return {
        getInstance: function () {
            if (!printerInstance) {
                printerInstance = create();
            }
            return printerInstance;
        }
    }
})()

printer.getInstance().turnOn()     // output: working
```

从上面代码我们可以看到printer模块提供了一个唯一外部可以访问的接口getInstance，当第一次访问该接口时，我们先判断实例是否被创建，如果没有创建则使用create()创建，如果已经创建则返回唯一的实例printerInstance。