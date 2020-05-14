---
title: JavaScript 数组去重
date: 2019-08-12
tags:
  - JavaScript
  - 学习笔记
summary: 记录几种数组去重的方法：循环嵌套、indexOf、indexOf 索引判断、sort 排序去邻、Object 键值对、ES6 Set
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

## sort 排序去邻

调用 `sort` 方法对原始数组进行排序，然后根据排序后的结果进行遍历及相邻元素比对，如果相等则跳过改元素，直到遍历结束。

```js
function unique(arr) {
  arr = arr.sort();
  var res = [],
    temp;
  for (i = 0; i < arr.length; i++) {
    // 第一个元素或与上一个相邻元素不相等
    if (!i || arr[i] !== temp) {
      res.push(arr[i]);
    }
    temp = arr[i];
  }
  return res;
}
```

## Object 键值对

创建一个空的 `Object` 对象，遍历原始数组，把数组的元素存成 `Object` 的 `key` ，并给对应的 `value` 赋值 `true` ，在判断另一个元素时，如果对应的 `value` 值为 `true`，则该元素重复。

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

## ES6 Set

```js
function unique (arr) {
  return Array.from(new Set(arr));
}
```