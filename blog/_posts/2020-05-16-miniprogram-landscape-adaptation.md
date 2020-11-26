---
title: 微信小程序横屏适配问题
date: 2020-05-16
tags:
  - 小程序
  - 踩坑
summary: 使用 vmin 可以将屏幕宽度固定为竖屏时的宽度（锁定屏幕的短边），这样无论横屏竖屏，屏幕宽度总是等于 100vmin ，代入 rpx 的计算规则，将 rpx 换算成 vmin 即可完美适配。
---

## 开启横屏

> 在 `app.json` 的 `window` 段中设置 `"pageOrientation": "auto"` ，或在页面 json 文件中配置 `"pageOrientation": "auto"` 。

`pageOrientation` 配置项

- `auto` ：自动
- `portrait` ：竖屏（默认）
- `landscape` ：横屏

## 适配问题

微信小程序设置横屏之后原本的 `rpx` 单位就不再适用。

> rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。

如果在开发横屏页面时直接使用 `rpx` 作为单位，元素会被拉伸放大，因为竖屏切换为横屏后，`rpx` 的计算会以竖屏时的高度（也就是手机屏幕的高）作为屏幕宽度，**1rpx = 1 / 750 * 屏幕宽度**，屏幕宽度变大，1rpx 也会随之变大。

使用 `px` 作为单位可以解决元素放大的问题，但失去了自适应效果。

## 使用 `vmin` 进行布局

> vw : 1vw 等于视口宽度的 1%
>
> vh : 1vh 等于视口高度的 1%
>
> vmin : 当前 vw 和 vh 中较小的值
>
> vmax : 当前 vw 和 vh 中较大的值

使用 `vmin` 可以将屏幕宽度固定为竖屏时的宽度（锁定屏幕的短边），这样无论横屏竖屏，屏幕宽度总是等于 `100vmin` ，代入 `rpx` 的计算规则，将 `rpx` 换算成 `vmin` 即可完美适配。

1rpx =  1 / 750 * 100vmin  ⇔  1rpx = 1vmin / 7.5

```css
/* 设置宽度为 5rpx */
.box {
  width: calc(5vmin / 7.5);
}
```

## 使用 CSS 预处理器

这里以 `scss` 为例，有函数和混合两种方式：

```scss
// function
@function rpx2vmin($rpx) {
  @return #{$rpx / 7.5}vmin;
}

.box {
  width: rpx2vmin(5);
}
```

```scss
// mixin
@mixin rpx2vmin($property, $rpxValues...) {

  $max: length($rpxValues);  // 返回 $rpxValues 列表的长度值
  $rpxValue: '';
  $vminValues: '';

  @for $i from 1 through $max {
    $rpxValue: nth($rpxValues, $i);
    $vminValues: #{$vminValues + ($value / 7.5)}vmin;

    @if $i < $max {
      $vminValues: #{$vminValues + ' '};
    }
  }

  #{$property}: $vminValues;
}

.box {
  @include rpx2vmin(width, 45);
  @include rpx2vmin(margin, 1, 2, 1, .5);
}
```

## 使用 VSCode 代码片段

如果项目没有使用预处理器，可以在 VSCode 中创建代码片段，通过代码片段快速开发。

```json
{
  "rpx to vmin": {
    "prefix": "vm",
    "body": ["calc($0vmin / 7.5)"],
    "description": "Convert rpx to vmin"
  }
}
```
