---
title: 微信小程序日期格式 iOS 兼容性问题
date: 2021-07-24
tags:
  - 小程序
  - 踩坑
summary: iOS 只支持 2021/07/24 这种日期格式，不支持 2021-07-24 这样的格式。
---

## 问题描述

服务端接口返回时间字符串，需要前端转换成时间戳：

```js
new Date('2021-07-24 00:00:00')
```

在 Android 和开发者工具（windows/mac）以及开发者工具的真机调试模式（iOS/Android）都不会有问题，但在 iOS 真机打印出来是 `<Date: null>`

## 原因

因为 iOS 只支持 `2021/07/24` 这种日期格式，不支持 `2021-07-24` 这样的格式。

## 解决方法

```js
new Date('2021-07-24 00:00:00').replace(/-/g, '/')
```

参考：[javascript - Invalid date in safari - Stack Overflow](https://stackoverflow.com/questions/4310953/invalid-date-in-safari)
