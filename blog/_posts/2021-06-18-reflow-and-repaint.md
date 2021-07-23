---
title: 重排与重绘
date: 2021-06-18
tags:
  - 学习笔记
summary: 「重绘」不一定需要「重排」，「重排」必然导致「重绘」。
---

## 网页的生成过程

1. 构建 DOM 树。
2. 构建 CSSOM 树。
3. 将 DOM 树和 CSSOM 树融合成渲染树。
4. 根据渲染树生成布局（layout），计算每个节点的几何信息。
5. 将布局绘制（paint）在屏幕上。

其中一到三都很快，耗时的是四五两步。

「生成布局」（flow）和「绘制」（paint）合称为「渲染」（render）。网页生成的时候，至少会渲染一次。用户访问的过程中，还会不断重新渲染。

## 重排与重绘

重新渲染，就需要重新生成布局和重新绘制。前者叫做「重排」（reflow），后者叫做「重绘」（repaint）。

重排也叫回流，指的是渲染树中的节点几何信息发生变化，需要重新计算各节点信息并生成布局。例如，如下行为会触发重排：

- 浏览器窗口尺寸改变；
- 新增或删除可见元素；
- 元素位置或尺寸改变；
- 元素内容改变（文字数量、图片大小等）；
- 元素字体改变；
- 激活 CSS 伪类；
- 设置 style 属性；

重绘指的是渲染树中的节点部分属性发生变化，而这些属性不会影响布局，比如：改变元素的背景颜色、字体颜色等操作会导致重绘。

「重绘」不一定需要「重排」，「重排」必然导致「重绘」。

现代浏览器对于重排和重绘有一些优化机制。通常浏览器会尽量把所有会引起重排、重绘的操作排成一个队列，等队列中的操作到了一定的数量或者到了一定的时间间隔后一次性执行，尽量避免多次重新渲染。

但是在获取布局或样式信息时，浏览器为了给你最精确的值，会强制将队列清空并重新渲染，因为队列中可能会有影响到这些值的操作。

- offsetTop/offsetLeft/offsetWidth/offsetHeight
- scrollTop/scrollLeft/scrollWidth/scrollHeight
- clientTop/clientLeft/clientWidth/clientHeight
- getComputedStyle()/getBoundingClientRect()

## 优化技巧

### 分离读写操作

如刚才提到的，DOM 的多个读操作（或多个写操作），应该放在一起。

```js
// bad
div.style.top = div.offsetTop + 10 + 'px' // 触发重排重绘
div.style.left = div.offsetLeft + 10 + 'px'

// good
const top = div.offsetTop // 缓存布局信息
const left = div.offsetLeft
div.style.top = top + 10 + 'px'
div.style.left = left + 10 + 'px'
```

### 合并样式修改

不要一条条地改变样式，而要通过添加类名或 cssText 属性，一次性地改变样式。

```js
// bad
div.style.top = '10px'
div.style.left = '10px'

// good
div.classList.add('class-name')

// good
div.style.cssText += '; top: 10px; left: 10px;'
```

### 离线 DOM

1. 将元素设为 `display: none` 时，元素节点不会存在于渲染树中，之后的操作将不会触发重排和重绘，操作完成后再恢复显示，这样就只需要 1 次重排和重绘。

   ```js
   div.style.display = 'none'
   // do something...
   div..style.display = 'block'
   ```

2. 创建一个 `DocumentFragment`，在它上面批量操作 DOM，操作完成之后，再添加到文档中，这样只会触发一次重排。

   ```js
   const fragment = document.createDocumentFragment()
   // do something...
   div.appendChild(fragment)
   ```

3. 使用 `cloneNode` 和 `replaceChild`。

   ```js
   const clone = div.cloneNode(true)
   // do something...
   div.parentNode.replaceChild(clone, div)
   ```

### 脱离文档流

将需要多次重排的元素（例如动画），`position` 属性设为 `absolute` 或 `fixed`，这样此元素就脱离了文档流，对其它节点造成的影响较小。

### 避免使用 table 布局

HTML 采用基于流的布局模型，从根渲染对象（即`<html>`）开始，递归遍历部分或所有的框架层次结构，为每一个需要计算的渲染对象计算几何信息，大多数情况下只要一次遍历就能计算出几何信息。但是也有例外，比如 `<table>` 的计算就需要不止一次的遍历。
