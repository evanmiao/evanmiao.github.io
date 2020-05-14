---
title: JavaScript 立即执行函数与闭包
date: 2019-07-28
tags:
  - JavaScript
  - 学习笔记
summary: 立即执行函数形成了一个局部作用域，可以封装一些局部变量，避免变量污染。而闭包可以在外部访问一个函数内部的局部变量。实际开发中，这两者经常一起使用，以实现模块化的效果。
---

## 立即执行函数

立即调用的函数表达式 (Immediately-Invoked Function Expression) ，简称 IIFE 。顾名思义，是一个在定义时就会立即执行的函数，并不需要主动去调用。

> 一般情况下我们只对**匿名函数**使用 IIFE ，这么做有两个目的：一是不必为函数命名，避免了污染全局变量；二是 IIFE 内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量。
>

简单地说，就是声明一个匿名函数，然后马上调用这个匿名函数。

很多人刚开始理解立即执行函数的时候，觉得应该是这样的：

```js
function(){alert('我是匿名函数')}()
```

然而这样写浏览器会报错，因为 JS 引擎认为这是一个函数声明，解决方法就是让引擎知道这是个表达式，可以解析。

比如给函数取反：

```js
!function(){alert('我是匿名函数')}()  // 我们不关心这个匿名函数的返回值，只想通过语法检查
```

类似的还有：

```js
+function(){alert('我是匿名函数')}()
-function(){alert('我是匿名函数')}()
~function(){alert('我是匿名函数')}()
void function(){alert('我是匿名函数')}()
new function(){alert('我是匿名函数')}()
```

如果不想改变函数的返回值，可以使用圆括号：

```js
;(function(){alert('我是匿名函数')}())  // 用括号把整个表达式包起来
;(function(){alert('我是匿名函数')})()  //用括号把函数包起来
```

这种用法最好在开头加一个 `;` 以避免括号前面有东西的情况，比如

```js
a
(function(){})()
//等价于
a()()

//同理
a
(function(){}())
//等价于
a()
```

根据 JS 中「链式作用域」的原理（ [JavaScript 作用域与作用域链](https://evanmiao.github.io/2019/07/25/js-scope/) ）， IIFE 达到了局部变量的效果，外面访问不到立即执行函数里面的变量（避免变量污染）。

以一道面试题为例：

```js
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i)  // 5 5 5 5 5
  })
}
```
JavaScript 是一个「异步」的语言，所以当我们执行这段代码时， `for` 循环并不会等待 `setTimeout` 结束后才继续（即使延时为 0），而是在执行阶段就一口气跑完。也就是说，当 `setTimeout` 内的回调函数执行时，拿到的 `i` 已经是跑完整个 `for` 循环的 `5` 。

用立即执行函数给每个 `setTimeout` 创造一个独立作用域即可解决这个问题：

```js
for (var i = 0; i < 5; i++) {
  (function (ii) {
    setTimeout(function () {
      console.log(ii)  // 0 1 2 3 4
    })
  })(i)
}
```

注：ES6 的 `let` 与 `const` 的块级作用域也可以解决，块级作用域的出现，实际上使得获得广泛应用的 IIFE 不再那么必要了。

## 闭包

如果我们想在外部访问一个函数内部的局部变量，可以使用一种称为闭包的程序结构。

> 函数和对其周围状态（**lexical environment，词法环境**）的引用捆绑在一起构成**闭包**（**closure**）。也就是说，闭包可以让你从内部函数访问外部函数作用域。在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。

「函数」和「声明该函数的词法环境」（函数内部能访问到的变量）的组合，就是一个闭包。

```js
function foo() {
  var local = 1
  function bar() {
    console.log(local)
  }
  return bar
}

var func = foo()
func()  // 1
```

这里 `local` 变量和 `bar` 函数就组成了一个闭包。而 `foo` 函数只是为了造出一个局部变量，与闭包无关。如果不把闭包放在一个函数里， `local` 就是一个全局变量了，达不到使用闭包的目的——隐藏变量。

实际开发中，闭包常与 IIFE 一起使用，比如：

```js
;(function () {
  var counter = 0
  window.increase = function () {
    return counter += 1
  }
})()

console.log(increase())  // 1
console.log(increase())  // 2
```

- IIFE 使 `counter` 成为局部变量从而避免变量污染。
- `counter` 变量和匿名函数组成闭包，匿名函数可以操作 `counter` 变量。
- `window.increase` 保存了匿名函数的地址。
- 任何地方都可以使用 `window.increase` 操作 `counter` ，但是不能直接访问 `counter` 。

应用在 jQuery 封装插件：

```js
(function ($) {
  "use strict";
  $.fn.myPlugin = function (options) {
    var defaults = {
      backgroundColor: "#fff"
    };

    // 用 options 拓展默认选项，defaults 中同名对象的值，会被 options 的值覆盖
    var settings = $.extend({}, defaults, options);

    return this.each(function () {
      // Plugin code would go here...
    });
  };
}(jQuery));
```