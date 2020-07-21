---
title: JavaScript 数组去重
date: 2019-08-12
tags:
  - JavaScript
  - 学习笔记
summary: 记录几种数组去重的方法，一般都是在面试的时候才会遇到。
---

## 循环嵌套

外层循环遍历原始数组，内层循环遍历新数组，将原始数组中的每个元素与新数组中的每个元素进行比对，如果不重复则添加到新数组中。

```js
function unique(arr) {
  var res = [];
  for (i = 0; i < arr.length; i++) {
    for (j = 0; j < res.length; j++) {
      if (arr[i] === res[j]) {
        break;
      }
    }
    // 如果元素唯一，循环完成后 j 等于 res.length
    if (j === res.length) {
      res.push(arr[i]);
    }
  }
  return res;
}
```

## indexOf

遍历原始数组的每一个元素，调用 `indexOf` 方法检测新数组中是否有该元素，如果元素不在新数组中，则将其添加。

```js
function unique(arr) {
  var res = [];
  for (i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) === -1) {
      res.push(arr[i]);
    }
  }
  return res;
}
```

## includes

与上一个思路相同，使用 `includes` 方法取代 `indexOf` 方法。

```js
function unique(arr) {
  var res = [];
  for (i = 0; i < arr.length; i++) {
    if (!res.includes(arr[i])) {
      res.push(arr[i]);
    }
  }
  return res;
}
```

## indexOf 索引判断

调用 `indexOf` 方法检测元素在数组中第一次出现的位置是否和元素现在的位置相等，如果不等则说明该元素是重复元素。

```js
function unique(arr) {
  var res = [];
  for (i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i]) === i) {
      res.push(arr[i]);
    }
  }
  return res;
}
```

## filter

与上一个思路相同，调用 `filter` 方法过滤原数组。

```js
function unique(arr) {
  return arr.filter(function (item, index, arr) {
    return arr.indexOf(item) === index;
  });
}
```

## splice

内层循环从外层循环当前元素的下一个元素开始，值相同时调用 `splice` 方法删去第二个（直接操作原始数组）。

```js
function unique(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
}
```

## sort 排序去邻

调用 `sort` 方法对原始数组进行排序，然后根据排序后的结果进行遍历及相邻元素比对，如果相等则跳过该元素，直到遍历结束。

```js
function unique(arr) {
  arr = arr.sort();
  var res = [],
    temp;
  for (i = 0; i < arr.length; i++) {
    // 第一个元素 || 与上一个相邻元素不相等
    if (!i || arr[i] !== temp) {
      res.push(arr[i]);
    }
    temp = arr[i];
  }
  return res;
}
```

## 递归

数组排序后递归调用处理函数比较相邻的两个值，相同时删掉。

```js
function unique(arr) {
  arr = arr.sort();

  function loop(i) {
    if (i > 0) {
      if (arr[i] === arr[i - 1]) {
        arr.splice(i, 1);
      }
      loop(i - 1);
    }
  }
  loop(arr.length - 1);
  return arr;
}
```

## Object 键值对

创建一个空的 `Object` 对象，遍历原始数组，把数组的元素存成 `Object` 的 `key` ，并给对应的 `value` 赋值，在判断另一个元素时，如果对应的 `value` 有值，则该元素重复。

```js
function unique(arr) {
  var res = [],
    obj = {};
  for (i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      res.push(arr[i]);
      obj[arr[i]] = true;
    }
  }
  return res;
}
```

## Map

与上一个思路相同， `Map` 数据结构也不会出现相同的 `key` 。

```js
function unique(arr) {
  var res = [],
    map = new Map();
  for (i = 0; i < arr.length; i++) {
    if (!map.has(arr[i])) {
      res.push(arr[i]);
      map.set(arr[i], true);
    }
  }
  return res;
}
```

## Set

最常用，最简洁。

```js
function unique(arr) {
  return Array.from(new Set(arr));
}
```

使用扩展运算符（spread）进一步简化：

```js
function unique(arr) {
  return [...new Set(arr)];
}
```
