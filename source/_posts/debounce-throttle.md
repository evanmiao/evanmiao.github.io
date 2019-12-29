---
title: JavaScript 函数防抖与函数节流
tags:
- JavaScript
- 学习笔记
toc: ture
---

{% cq %}
函数防抖(debounce)与函数节流(throttle)
两者都是优化高频率执行 JS 代码的一种手段
{% endcq %}

<!-- more -->

## 概念解释

一些短时间内频繁触发的事件，如果在事件触发时执行代码块，会将代码块重复执行很多次。很可能造成浏览器卡顿，甚至崩溃。可通过函数防抖和函数节流来避免这种情况。

## 函数防抖(debounce)

事件被触发指定时间后执行回调函数，如果事件在这指定时间内又被触发，则重新计时。

实现思路：每次触发事件时都取消之前的延时调用方法：

```js
/**
 * @param fn {function} 回调函数（要防抖的函数）
 * @param delay {number} 规定的时间
 */
function debounce(fn, delay) {
    var timer = null;
    return function (args) {
        // 取消之前的延时调用
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(this, args);
        }, delay);
    }
}
```

## 函数节流(throttle)

事件在指定时间内被触发多次只会执行一次回调函数。

### 定时器方案

实现思路：每次触发事件时都判断当前是否有等待执行的延时函数：

```js
function throttle(fn, delay) {
    var flag = false;
    return function (args) {
        // 判断之前的调用是否完成
        if (flag) {
            return false;
        }
        flag = true;
        setTimeout(function () {
            fn.apply(this, args);
            flag = false;
        }, delay)
    }
}
```

### 时间戳方案

实现思路：每次触发事件时都比对当前时间与上一次执行时间的时间差与规定时间的大小关系：

```js
function throttle(fn, delay) {
    // 记录上一次函数触发的时间
    var lastTime = 0;
    return function (args) {
        // 记录当前函数触发的时间
        var nowTime = Date.now();
        if (nowTime - lastTime > delay) {
            fn.apply(this, args);
            // 同步时间
            lastTime = nowTime;
        }
    }
}
```

## 应用场景

- debounce
    - search搜索联想；手机号、邮箱验证输入检测。用户在不断输入值时，用防抖来节约请求资源。
    - window触发resize的时候。只需窗口调整完成后，计算窗口大小。防止重复渲染。


- throttle
    - canvas 模拟画板，mousemove
    - DOM 元素推拽（不使用 H5 Drag&Drop API），mousemove
    - 射击游戏，mousedown / keydown (单位时间内只能发射一颗子弹)
    - 监听滚动事件是否滑到底部自动加载更多