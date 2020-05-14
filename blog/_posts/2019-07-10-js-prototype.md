---
title: JavaScript 原型与原型链
date: 2019-07-10
tags:
  - JavaScript
  - 学习笔记
summary: 每个实例对象 (object) 都有一个私有属性 (__proto__) 指向它的构造函数的原型对象 (prototype) 。该原型对象也有一个自己的原型对象 (__proto__) ，层层向上直到一个对象的原型对象为 null 。根据定义， null 没有原型，并作为这个原型链中的最后一个环节。
---

## prototype

`prototype` 属性是函数所独有的，指向函数的原型对象。当使用这个构造函数创建实例的时候，`prototype` 属性指向的原型对象就成为实例的原型对象。`prototype` 属性定义了构造函数构造出来的共有祖先，构造函数产生的实例对象可以继承该属性的方法和属性。

```js
function Test() {}
Test.prototype.a = 0;

var t1 = new Test();
var t2 = new Test();

console.log(t1.a);  // 0
console.log(t2.a);  // 0
```

## \_\_proto__

所有对象都拥有一个内部属性 `[[prototype]]` ，指向它的原型对象，这个属性可以通过 `Object.getPrototypeOf(obj)` 或 `obj.__proto__` 来访问。

`__prototype__` 属性指向的对象与创建它的构造函数的 `prototype` 属性所指向的对象是同一个，即实例对象的 `__proto__` 指向其构造函数的 `prototype` 。

```js
function Test() {}
var t = new Test();
console.log(t.__proto__ === Test.prototype);  // true
```

凡是通过 `new Function()` 创建的对象都是函数对象（包含 Function 自身），所有函数对象的 `__proto__` 属性都指向 `Function.prototype` ，它是一个空函数（Empty function）。

```js
function Test() {}
console.log(Test.__proto__ === Function.prototype);  // true
```

`Function.__proto__` 和 `Function.prototype` 为同一对象。

`Object` `Array` `String` 等构造函数本质上和 `Function` 一样，均继承于 `Function.prototype` 。因此也就指向 `Function.prototype` 。

```js
console.log(Function.__proto__ === Function.prototype);   // true

console.log(Object.__proto__ === Function.prototype);  // true

console.log(Array.__proto__ === Function.prototype);  // true

console.log(String.__proto__ === Function.prototype);  // true

console.log(Boolean.__proto__ === Function.prototype);  // true

console.log(RegExp.__proto__ === Function.prototype);  // true

console.log(Error.__proto__ === Function.prototype);  // true

console.log(Date.__proto__ === Function.prototype);  // true
```

`Math` ， `JSON` 是以对象形式存在的，无需 `new` 。它们的 `__proto__` 属性指向 `Object.prototype` 。

```js
console.log(Math.__proto__ === Object.prototype);  // true

console.log(JSON.__proto__ === Object.prototype);  // true
```

原型对象也是对象，是通过 `Object` 构造函数生成的，它的 `__proto__` 属性指向 `Object.prototype` 。

`Object.prototype` 是原型链的尽头（ `root` ）。所有对象均从 `Object.prototype` 继承属性。

```js
function Test() {}
console.log(Test.prototype.__proto__ === Object.prototype);  // true
```

同理， `Function.prototype` 直接继承 `root` （ `Object.prototype` ）

```js
console.log(Function.prototype.__proto__ === Object.prototype);  // true
```

`Object.prototype` 的 `__proto__` 属性指向 `null` 。

```js
console.log(Object.prototype.__proto__ === null);  // true
```

## constructor

原型对象默认拥有一个 `constructor` 属性，指向指向它的那个构造函数（也就是说构造函数和原型对象是互相指向的关系）。

```js
function Test() {}
console.log(Test === Test.prototype.constructor);  // true

var t = new Test();
console.log(t.constructor === Test); // true
```

注意， `t` 对象本身不具有 `constructor` 属性，所以会通过 `__proto__` 属性到原型链中找，而 `t.__proto__ === Test.prototype` ， `Test.prototype` 具有 `constructor` 属性并指向 `Test` 函数，故 `t.constructor` 指向了 `Test` ，它不是 `t` 自己本身拥有的，是继承而来的。

## 原型链

在 JavaScript 中，所有的对象都是由它的原型对象继承而来，反之，所有的对象都可以作为原型对象存在。

有了原型，原型还是一个对象，那么这个名为原型的对象自然还有自己的原型，这样的原型上还有原型的结构就构成了原型链。

![prototype.png](https://i.loli.net/2020/03/25/EoZXw9x5cyld8YF.png)

当访问一个对象的属性时，如果该对象内部找不到，就会去它的 `__proto__` 属性所指向的那个对象（原型对象）里找，如果还是找不到就会访问原型对象的 `__proto__` 属性（原型的原型），依次层层向上搜索，直到 `null` 。此时若还没找到，浏览器断言该属性不存在，并给出属性值为 `undefined` 的结论。