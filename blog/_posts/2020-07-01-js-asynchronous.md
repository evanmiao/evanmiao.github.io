---
title: JavaScript 异步编程
date: 2020-07-01
tags:
  - JavaScript
  - 学习笔记
summary: 所谓「异步」，简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。这种不连续的执行，就叫做异步（Asynchronous）。相应地，连续的执行，就叫做同步（Synchronous）。
---

一般来说，JavaScript 是单线程的（single threaded），一次只能执行一个任务。每个任务顺序执行，只有前面的结束了，后面的才能开始。如果有一个任务耗时很长，就会产生阻塞（blocking）。为了解决这个问题，Javascript 将任务的执行模式分成两种：同步（Synchronous）和异步（Asynchronous）。

所谓「异步」，简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。这种不连续的执行，就叫做异步。相应地，连续的执行，就叫做同步。

## callback

回调函数（callback）是 JavaScript 对异步编程的实现。就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。

```js
function fn(callback) {
  setTimeout(function () {
    var data = 'hello';
    callback(data);
  }, 1000);
}

fn(function (data) {
  console.log(data);
});
```

回调函数简单容易实现，但结构混乱，各个部分耦合度高，难以维护。尤其是当多个回调函数嵌套的时候，比如我要每隔一秒打印一句话：

```js
function delay(callback) {
  setTimeout(callback, 1000);
}

delay(function () {
  console.log('After one second.');
  delay(function () {
    console.log('After two seconds.');
    delay(function () {
      console.log('After three seconds');
      delay(function () {
        console.log('After four seconds');
      });
    });
  });
});
```

想在异步操作完成后再执行后面的任务，只能在它的回调函数中进行，这样就会越套越多，代码越来越来复杂，这种情况就称为「回调地狱」（callback hell）。

## Promise

为了解决回调地狱的问题，ES6 提供了一种更合理、更强大的异步解决方案 Promise 。

```js
var promise = new Promise(function (resolve, reject) {
  // 做一些异步操作
  if (error) reject(error);  // rejected
  resolve(data);  // fulfilled
});
```

`Promise` 构造函数接受一个执行函数（executor）作为参数，该函数的两个参数分别是 `resolve` 和 `reject` 。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。`resolve` 和 `reject` 函数分别在异步操作成功或失败时调用，并将 `promise` 实例对象的状态改为 fulfilled（完成）或 rejected（失败）。

`promise` 实例生成以后，可以用 `then` 方法分别指定成功状态和失败状态（可选）的回调函数。

```js
promise.then(function (data) {
  // success
}, function (error) {
  // failure
});
```

或用 `catch` 方法指定错误捕获回调函数， `.catch()` 其实就是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名。

```js
promise.then(function (data) {
  // success
}).catch(function (error) {
  // failure
});
```

`Promise` 构造函数会在返回所建的 `promise` 实例对象之前调用接受的执行函数（executor）：

```js
var promise = new Promise(function (resolve, reject) {
  console.log('new Promise');
  resolve('resolved');
});

promise.then(function (data) {
  console.log(data);
});

console.log('end');

// new Promise
// end
// resolved
```

所以我们用 Promise 的时候一般是包在一个函数中，在需要的时候去运行这个函数，如：

```js
function fn() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      var data = 'hello';
      resolve(data);
    }, 1000);
  });
}

fn().then(function (data) {
  console.log(data);
});
```

`then` 方法返回一个**新的** Promise 实例（字面量会通过 `Promise.resolve()` 封装）。因此可以采用链式写法，即 `.then()` 后面再调用另一个 `.then()` 。第一个 `.then()` 的回调函数完成以后，会将返回结果作为参数，传入第二个 `.then()` 的回调函数。

```js
function fn() {
  return new Promise(function (resolve, reject) {
    resolve('resolved');
  });
}

fn().then(function (data) {
  return data + ' then';
}).then(function (data) {
  console.log(data);  // resolved then
});
```

用 Promise 改写刚才的需求，可以把回调绑定到返回的 Promise 上，形成一个 Promise 链：

```js
function delay() {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000);
  });
}

delay().then(function () {
  console.log('After one second.');
  return delay();
}).then(function () {
  console.log('After two seconds.');
  return delay();
}).then(function () {
  console.log('After three seconds');
  return delay();
}).then(function () {
  console.log('After four seconds');
});
```

这样就很好地解决了回调地狱的问题，但 Promise 也有一些缺陷，比如无法取消，错误需要通过回调函数捕获等。

## Generator

Generator 函数也是 ES6 提供的一种异步编程解决方案，但不同于普通函数，是可以暂停执行的，所以函数名之前要加星号，以示区别。

```js
function* gen(x) {
  yield x + 1;
  yield x + 2;
  return x + 3;
}
```

Generator 函数最大特点就是可以交出函数的执行权（即暂停执行）。普通函数开始执行直到 `return` 语句（函数末尾如果没有 `return` ，就是隐含的 `return undefined` ）为止，中途不可暂停。但 Generator 可以通过 `yield` 表达式将函数的执行挂起，或者理解成暂停。

调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象（Iterator 对象），再通过调用这个指针对象上的 `next()` 方法，让函数继续执行，直到遇到下一个 `yield` 表达式（或 `return` 语句）。

```js
var g = gen(1);
g.next();  // { value: 2, done: false }
g.next();  // { value: 3, done: false }
g.next();  // { value: 4, done: true }
```

`next` 方法的作用就是分阶段执行 Generator 函数。每次调用 `.next()` 都会返回一个对象，对象的 `value` 属性是 `yield` 语句后面表达式的值，表示当前阶段的值；`done` 属性是一个布尔值，表示 Generator 函数是否执行完毕。

`next` 方法还可以接受参数，该参数会被当作上一个 `yield` 表达式的返回值。

```js
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next();  // { value: 3, done: false }
g.next(2);  // { value: 2, done: true }
```

Generator 函数暂停执行和恢复执行的特性和异步操作的原理非常类似，即把一个任务分为两部分，先执行一部分，然后再执行另外一部分。

用 Generator 函数封装刚才的异步任务：

```js
function delay() {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000);
  });
}

function* asyncPrint() {
  yield delay();
  console.log('After one second.');
  yield delay();
  console.log('After two seconds.');
  yield delay();
  console.log('After three seconds');
  yield delay();
  console.log('After four seconds');
}

var g = asyncPrint();
g.next().value.then(function () {
  g.next().value.then(function () {
    g.next().value.then(function () {
      g.next().value.then(function () {
        g.next();
      });
    });
  });
});
```

可以看到，单看 Generator 函数，可以把异步操作表示得很简洁，但流程管理依然很复杂，需要频繁调用指针对象的 `next` 方法。想实现同步效果还是要嵌套回调函数，很不方便。

## async / await

ES2017 标准引入了 async 函数来处理异步，它实际上就是 Generator 函数的一种语法糖。async 函数自带执行器，同时使用了更好的语义，用 `await` 替代了 `yield` ， `async` 替代了 Generator 函数的星号（ `*` ）。

async 函数的返回值是 Promise 对象，这比 Generator 函数的返回值 Iterator 对象更加方便，可以使用 `.then()` 添加回调函数。async 函数执行时，遇到 `await` 会先阻塞，等到异步操作完成，再接着执行函数体内后面的语句。

还是刚才的异步任务，这次用 async 函数来写：

```js
function delay() {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000);
  });
}

async function asyncPrint() {
  await delay();
  console.log('After one second.');
  await delay();
  console.log('After two seconds.');
  await delay();
  console.log('After three seconds');
  await delay();
  console.log('After four seconds');
}

asyncPrint();
```

很明显，async 函数和 Generator 函数很像，但 async 函数更简单，也更易于理解，`async` 表示该函数内部有异步操作，`await` 表示紧跟在后面的表达式需要等待结果。

如果 `await` 后面的异步操作出错，那么等同于 `async` 函数返回的 Promise 对象变为 `reject` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到。

```js
async function fn() {
  await new Promise(function (resolve, reject) {
    throw new Error('The error.');
  });
}

fn().catch(function (error) {
  console.log(error);
});
```

也可以使用同步的 `try...catch` 结构捕获错误：

```js
async function fn() {
  try {
    await new Promise(function (resolve, reject) {
      throw new Error('The error.');
    });
  } catch (error) {
    console.log(error);
  }
}
```

`await` 关键字会阻塞其后的代码，直到 promise 完成，这可能会导致代码因为大量阻塞相继发生而变慢。有的时候为了提高效率，我们需要让多个异步操作同时开始处理（就像没有使用 async/await 时那样），可以将 Promise 对象存储在变量中来同时开始它们，然后在获取结果时用 `await` 等待它们全部执行完毕。

```js
function delay() {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000);
  });
}

async function fn() {
  var delay1 = delay();
  var delay2 = delay();
  await delay1;
  console.log("delay1 end.");
  await delay2;
  console.log("delay2 end.");
}

fn();
```

上面代码中，调用了两次 `delay()` ，并将它们返回的 Promise 对象存储在变量中，这样可以同时启动它们关联的进程。然后分别用 `await` 等待异步任务执行完成。因为两个延时器延迟时间一样，且基本同时开始处理，所以将同时完成。当一秒过后，先输出 `delay1 end.` 紧接着立即输出 `delay2 end.` 。

async/await 建立在 Promise 之上，因此它与 Promise 提供的所有功能兼容。处理多个并发请求时可以用 Promise 的 `all` 方法，它用于将多个 Promise 实例，包装成一个新的 Promise 实例。 `.all()` 接受一个数组为参数，数组中可包含多个 Promise 实例（如果不是 Promise 实例会调用 `Promise.resolve()` 进行封装）。

```js
var p = Promise.all([p1, p2, p3]);
```

- 只有所有参数状态都变成 fulfilled， `p` 的状态才会变成 fulfilled，此时所有参数返回值组成一个数组，传给 `p` 的回调函数。
- 只要参数中有一个被 rejected， `p` 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传给 `p` 的回调函数。

```js
function delay(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('After ' + ms + ' millisecond.');
    }, ms);
  });
}

async function fn() {
  var results = await Promise.all([delay(1000), delay(2000)]);
  console.log(results);
}

fn();
```
