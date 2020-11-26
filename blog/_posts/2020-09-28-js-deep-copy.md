---
title: JavaScript 深拷贝与浅拷贝
date: 2020-09-28
tags:
  - JavaScript
  - 学习笔记
summary: 浅拷贝就是只复制「引用」，没有复制真正的值。而深拷贝是复制原对象的各项属性的「值」，改变任意一个新对象中的属性，都不会影响到原对象。
---

## 数据类型

Boolean Number String Undefined Null Symbol 等基本数据类型保存在栈内存中，因为基本数据类型占用空间小、大小固定，通过按值来访问，属于被频繁使用的数据。

除了这六种基本数据类型，剩下的都是引用数据类型，保存在堆内存中。因为引用类型占据空间大、大小不固定，如果存储在栈内存中，会影响程序的性能。引用类型在栈内存中存储了指针，指向它在堆内存中的地址。当我们要访问一个引用类型的时候，实际上是先从变量中获取该数据的地址指针，然后再从堆内存中拿到数据。

## 浅拷贝

浅拷贝的意思就是只复制引用（地址指针），没有复制真正的值。

```js
let foo = { x: 1, y: 2 };
let bar = foo;
bar.x = 3;
console.log(foo.x);  // 3
```

上例中，`foo` 和 `bar` 实际指向同一个对象或者说堆内存空间，改变 `foo` 的属性会影响 `bar` 。

使用 `for...in` 循环遍历对象属性本质上也是浅拷贝，当对象中只有一级属性时为深拷贝，但对象的属性也是对象的时候，此方法在二级属性以后就是浅拷贝。

```js
function copy(obj) {
  let res = {};
  for (let key in obj) {
    res[key] = obj[key];
  }
  return res;
}

let foo = { a: { b: 1 } };
let bar = copy(foo);

bar.a.b = 2;
console.log(foo.a.b);  // 2
```

同理 `Object.assign()` 、 `{ ...obj }` 、 `[ ...arr ]` 、数组的 `splice()` 、 `concat()` 等都属于浅拷贝。

基本数据类型不涉及深拷贝浅拷贝的概念，或者说基本数据类型都是深拷贝。

```js
let foo = 10;
let bar = foo;
bar = 20;
console.log(foo);  // 10
```

## 深拷贝

创建一个新的对象，将原对象的各项属性的「值」复制过来，而不是只复制引用。改变任意一个新对象中的属性，都不会影响到原对象。

### JSON

JavaScript 实现深拷贝最简单的方法，原理就是先将对象转换为 JSON 字符串，再通过 `JSON.parse()` 重新建立一个对象。

```js
let foo = { a: { b: 1 } };
let bar = JSON.parse(JSON.stringify(foo));

bar.a.b = 2;
console.log(foo.a.b);  // 1
```

但是该方法只能处理对象和数组，不能处理 `Undefined` 、 `Symbol` 和一些复杂对象比如 `Function` 、 `Date` 、 `RegExp` 、 `Set` 、 `Map` 、 `ArrayBuffer` 等。

```js
let obj = {
  func: () => { console.log('function') },
  date: new Date(),
  reg: /RegExp/ig
};

let copied = JSON.parse(JSON.stringify(obj));
console.log(copied);  // date: "2020-09-28T02:18:45.252Z"
                      // reg: {}
```

可以看到，函数直接丢失了， `Date` 对象成了字符串，正则成了一个空对象。

也不能处理循环引用，会直接报错。

```js
let foo = {};
foo.bar = foo;
JSON.parse(JSON.stringify(foo));  // Uncaught TypeError: Converting circular structure to JSON
```

### 递归

设置一个 WeakMap 结构存储已拷贝过的对象可以解决循环引用的问题。

```js
function copy(obj, hash = new WeakMap()) {
  if ((typeof obj !== 'object' || obj === null)) return obj;
  let res;
  switch (obj.constructor) {
    case Date:  // 只处理 Date RegExp 其他的可以自己添加
      res = new obj.constructor(obj.getTime());
      break;
    case RegExp:
      res = new obj.constructor(obj);
      break;
    default:
      // 如果有循环引用对象，就直接返回
      if(hash.has(obj)) return hash.get(obj);
      res = new obj.constructor();
      hash.set(obj, res);
  }
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {  // 不遍历其原型链上的属性
      typeof obj[key] === 'object' ? res[key] = copy(obj[key], hash) : res[key] = obj[key];
    }
  }
  return res;
}
```
