---
title: JavaScript 继承
date: 2019-07-12
tags:
  - JavaScript
  - 学习笔记
summary: 继承是类与类之间的关系，其作用是使得子类具有父类的各种属性和方法。 JavaScript 没有「类」的概念（ES6 中的类只是语法糖），它基于原型链实现继承（通常被称为：原型式继承 —— prototypal inheritance）。
---

## 原型链继承

**实现：**

```js
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function () {
  return this.property;
};

function SubType() {
  this.subproperty = false;
}

// 继承了 SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
  return this.subproperty;
};

var instance = new SubType();
console.log(instance.getSuperValue());  // true
```

**缺点：**

- 引用类型值的原型属性会被所有实例共享。

  ```js
  function SuperType() {
    this.colors = ["red", "blue", "green"];
  }

  function SubType() {
  }

  // 继承了 SuperType
  SubType.prototype = new SuperType();

  var instance1 = new SubType();
  instance1.colors.push("black");
  console.log(instance1.colors);  // ["red", "blue", "green", "black"]

  var instance2 = new SubType();
  console.log(instance2.colors);  // ["red", "blue", "green", "black"]
  ```

  *两个实例对象 `instance1` 和 `instance2` 的 `colors` 属性指向相同，改变一个会影响另一个实例的属性。*

- 在创建子类实例时，不能向父类构造函数传参。

## 借用构造函数

借用构造函数（constructor stealing）有时也叫做伪造对象或经典继承，既在子类构造函数的内部调用父类构造函数。

相当于把父类构造函数的内容复制给了子类构造函数。这是所有继承中唯一不涉及到 `prototype` 的继承。

```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}

function SubType() {
  // 继承了 SuperType
  SuperType.call(this);
}

var instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors);  // ["red", "blue", "green", "black"]

var instance2 = new SubType();
console.log(instance2.colors);  // ["red", "blue", "green"]
```

- 优点：
  1. 避免了引用类型的属性被所有实例共享。
  2. 可在子类构造函数中向父类构造函数传参。

  ```js
  function SuperType(name) {
    this.name = name;
  }

  function SubType() {
    // 继承了 SuperType ，同时还传递了参数
    SuperType.call(this, "Nicholas");
    // 实例属性
    this.age = 29;
  }

  var instance = new SubType();
  console.log(instance.name);  // "Nicholas"
  console.log(instance.age);  // 29
  ```

- 缺点：方法都在构造函数中定义，无法复用，子类每次创建实例都会创建一遍方法。

## 组合继承

组合继承（combination inheritence），有时候也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合到一块，从而发回二者之长的一种继承模式。其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，即通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。

```js
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name);

  this.age = age;
};

// 继承方法
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function () {
  console.log(this.age);
};

var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
console.log(instance1.colors);  // ["red", "blue", "green", "black"]
instance1.sayName();  // "Nicholas"
instance1.sayAge();  // 29

var instance2 = new SubType("Greg", 27);
console.log(instance2.colors);  // ["red", "blue", "green"]
instance2.sayName();  // "Greg"
instance2.sayAge();  // 27
```

- 融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。
- 缺点在寄生组合式继承部分详细叙述。

## 原型式继承

原型式继承（prototypal inheritance）没有严格意义上的构造函数。

思路是借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。

```js
function object(o) {
  function F() {};
  F.prototype = o;
  return new F();
}
```

在 `object()` 函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。从本质上讲，`object()` 对传入其中的对象执行了一次浅复制。

```js
var person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
};

var anotherPerson = object(person);
anotherPerson.name = 'Grey';
anotherPerson.friends.push('Rob');

var yetAnotherPerson = object(person);
yetAnotherPerson.name = 'linda';
yetAnotherPerson.friends.push('Barbie')

console.log(person.friends);  // ["Shelly", "Court", "Van", "Rob", "Barbie"]
```

- ECMAScript 5 通过新增 `Object.create()` 方法规范化了原型式继承。
- 缺点同原型链继承。

## 寄生式继承

寄生式（parasitic）继承是与原型式继承紧密相关的一种思路。寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部已某种方式来增强对象，最后再像真的是它做了所有工作一样返回对象。

```js
function createAnother(original) {
  var clone = object(original);     // 通过调用 object() 函数创建一个新对象
  clone.sayHi = function () {       // 以某种方式来增强这个对象
    console.log("hi");
  };
  return clone;                     // 返回这个对象
}

var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = createAnother(person);
anotherPerson.sayHi();              // "hi"
```

在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。前面示范继承模式时使用的 `object()` 函数不是必需的；任何能够返回新对象的函数都使用与此模式。

- 缺点同构造函数模式，无法实现复用。

## 寄生组合式继承

前面说过，组合继承是 JavaScript 最常用的继承模式；不过，它也有自己的不足。组合继承最大的问题就是无论什么情况下，都会调用两次父类的构造函数：一次是在创建子类原型的时候，另一次是在子类构造函数内部。子类最终会包含父类对象的全部实例属性，但我们不得不在调用子类构造函数时重写这些属性。

```js
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
}

function SubType(name, age) {
  SuperType.call(this, name);  // 第二次调用 SuperType()
  this.age = age;
}

SubType.prototype = new SuperType();  // 第一次调用 SuperType()
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
  console.log(this.age);
};
```

第一次调用 `SuperType` 构造函数时， `SubType.prototype` 会得到两个属性：`name` 和 `colors` ，他们都是 `SuperType` 的实例属性，只不过现在位于 `SubType` 的原型中。当调用 `SubType` 构造函数时，又会调用一次 `SuperType` 构造函数，这一次又在新对象上创建了实例属性 `name` 和 `colors` 。 于是，这两个属性就屏蔽了原型中的两个同名属性。

---

所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。其背后的基本思路是：不必为了指定子类的原型而调用父类的构造函数，我们所需要的无非就是父类原型的一个副本而已。本质上，就是使用寄生式继承来继承父类型的原型，然后再将结果指定给子类的原型。寄生组合式继承的基本模式如下所示。

```js
function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype);   // 创建对象
  prototype.constructor = subType;               // 增强对象
  subType.prototype = prototype;                 // 指定对象
}
```

第一步是创建父类原型的一个副本，第二步是为创建的副本添加 `constructor` 属性，从而弥补因重写原型而失去的默认的 `constructor` 属性。第三步是将新创建的对象（即副本）赋值给子类的原型。

```js
// 父类初始化实例属性和原型属性
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

// 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

// 将父类原型指向子类
inheritPrototype(SubType, SuperType);

// 新增子类原型属性
SubType.prototype.sayAge = function () {
  console.log(this.age);
};
```

这个例子的高效率体现在它只调用了一次 `SuperType` 构造函数，并且因此避免了在 `SubType.prototype` 上创建不必要的、多余的属性。于此同时，原型链还能保持不变；因此，还能够正常使用 `instanceof` 和 `isPrototypeOf()` 。开发人员普遍认为寄生组合继承是引用类型最理想的继承范式。
