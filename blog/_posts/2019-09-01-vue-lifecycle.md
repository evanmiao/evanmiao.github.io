---
title: Vue 生命周期
date: 2019-09-01
tags:
  - Vue
  - 学习笔记
summary: Vue 的生命周期的思想贯穿在组件开发的始终，通过熟悉其生命周期调用不同的钩子函数，我们可以准确地控制数据流和其对 DOM 的影响； Vue 生命周期的思想是 Vnode 和 MVVM 的生动体现和继承。
---

## 概念解释

> 每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做**生命周期钩子**的函数，这给了用户在不同阶段添加自己的代码的机会。

官方的图解：

![lifecycle.png](https://i.loli.net/2020/05/13/9WEgmzXZQIKljq7.png)

简单地说， Vue 实例从创建到销毁的过程，就是生命周期。而这个过程中各种各样的事件，就是生命周期钩子函数。这些函数会在实例生命周期的不同阶段被调用，从而让开发人员的代码控制实例的行为。

Vue 的生命周期的思想贯穿在组件开发的始终，通过熟悉其生命周期调用不同的钩子函数，我们可以准确地控制数据流和其对 DOM 的影响； Vue 生命周期的思想是 Vnode 和 MVVM 的生动体现和继承。

## 生命周期与钩子函数

| 生命周期钩子  | 详细                                                         |
| ------------- | ------------------------------------------------------------ |
| beforeCreate  | 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。 |
| created       | 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，`$el` property 目前尚不可用。 |
| beforeMount   | 在挂载开始之前被调用：相关的 `render` 函数首次被调用。       |
| mounted       | 实例被挂载后调用，这时 `el` 被新创建的 `vm.$el` 替换了。如果根实例挂载到了一个文档内的元素上，当 `mounted` 被调用时 `vm.$el` 也在文档内。 |
| beforeUpdate  | 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。 |
| updated       | 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。 |
| activated     | 被 keep-alive 缓存的组件激活时调用。                         |
| deactivated   | 被 keep-alive 缓存的组件停用时调用。                         |
| beforeDestroy | 实例销毁之前调用。在这一步，实例仍然完全可用。               |
| destroyed     | 实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。 |
| errorCaptured | 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 `false` 以阻止该错误继续向上传播。 |

注：除了 beforeCreate 和 created 钩子之外，其他钩子函数均在服务器端渲染期间不被调用。

### 新建 Vue 实例

`new Vue()`

### 初始化事件和生命周期

现在这个实例对象上只有默认的一些生命周期函数和默认的事件。

### beforeCreate 钩子

在实例初始化之后，数据观测和事件配置之前调用。

- 不能访问 `data` `computed` `watch` `methods` 上的方法和数据。
- `$route` 存在，因此此阶段就可以根据路由信息进行重定向等操作。

应用场景：

- 可以在这加个 loading 事件。
- 用于初始化非响应式变量。

### 初始化数据

通过依赖注入导入依赖项，完成数据（ `data` `props` 等）的初始化。

### created 钩子

实例已经创建完成之后调用。

- 可访问 `data` `computed` `watch` `methods` 上的方法和数据。
- `DOM` 未生成， `$el` 属性不可访问， `$ref` 属性内容为空数组。
- 注意 `mounted` **不会**保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 `mounted` 内部使用 `this.$nextTick` 回调函数。

应用场景：

- 可以在这结束 loading 。
- 对实例进行预处理，操作 `data` 数据或操作方法。
- 推荐这个时候发送请求数据，尤其是返回的数据与绑定事件有关时。
- 这个周期中是没有什么方法来对实例化过程进行拦截的。因此假如有某些数据必须获取才允许进入页面的话，并不适合在这个页面发请求。建议在组件导航守卫 `beforeRouteEnter` 中来完成。

### 模版编译

- 检查是否有 `el` 属性
  - 检查 `vue` 配置，即新建实例 `new Vue({})` 时传入的参数对象是否存在 `el` 属性，如果有的话就继续向下编译，如果没有则停止编译，直到在该 `vue` 实例上调用 `vm.$mount(el)` ，代码才会继续执行。

- 检查是否有 `template` 属性
  - 检查配置中的 `template` 属性，如果有则将其作为模板编译成 `render` 函数，如果没有则将 `el` 的 `outerHTML` 作为模板编译。
  - 如果有配置中有 `render` 函数，那么 `render` 就会替换 `template` 。
  - 优先级： render  >  template > el

渲染函数 render

> 因为 vue 是虚拟 DOM ，所以在拿到 template 模板时也要转译成 VNode （虚拟节点）的函数，而用 render 函数构建 DOM ， vue 就免去了转译的过程。
>
> 当使用 render 函数描述虚拟 DOM 时， vue 提供一个函数，这个函数是就构建虚拟 DOM 所需要的工具。官网上给他起了个名字叫 createElement 。还有约定它的简写叫 h 。

```html
<div id="app">
  <h1>this is outerHTML</h1>
</div>
<script>
  let vm = new Vue({
    template: '<h1>this is template</h1>',
    render: h => h('h1', 'this is createElement')
  }).$mount('#app')
</script>
```

### beforeMount 钩子

在挂载开始之前调用。

- 此时 `$el` 属性不可访问。
- 将 `HTML` 解析生成 `AST` 节点，再根据 `AST` 节点动态生成渲染函数，相关的 `render` 函数首次被调用。

### 挂载

实例创建 `$el` 属性并替换所挂载的 DOM 元素( `el` )。

### mounted 钩子

实例挂载到页面之后调用。

- 如果 `root` 实例挂载了一个文档内元素，当 `mounted` 被调用时 `vm.$el` 也在文档内。

应用场景：

- 此时可以获取 `el` 中 `DOM` 节点，进行 `DOM` 操作，`$ref` 属性可以访问。
- 如果返回的数据操作依赖 `DOM` 完成，推荐这个时候发送数据请求。

### beforeUpdate 钩子

数据更新时调用，发生在虚拟 `DOM` 重新渲染和打补丁之前。

- 在这个钩子中进一步地更改状态，不会触发附加的重渲染过程。

应用场景：

- 这里适合在更新之前访问现有的 `DOM`，比如手动移除已添加的事件监听器。

### 更新

先根据 `data` 中的最新数据，在内存中，重新渲染出一份最新的虚拟 `DOM` 树，当最新的虚拟 `DOM` 树被更新之后，会把最新的内存 `DOM` 树重新渲染到真实的页面中去，这个时候就完成数据从 `data` （模型层）到页面（视图层）的更新。

### updated 钩子

数据更新导致的虚拟 `DOM` 重新渲染和打补丁之后调用。

- 此时组件 `DOM` 已经更新，可以执行依赖于 `DOM` 的操作。
- 并不建议在这进行对异步数据得到的 `DOM` 进行操作，因为有可能你当前的数据不止更改一次，而 `updated` 只要相关的数据更改一次就会执行一次。
- 大多数情况下，应该避免在此期间更改状态，可能会陷入死循环。如果要相应状态改变，最好使用计算属性或 `watcher` 取代。
- 注意 `updated` **不会**保证所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以在 `updated` 里使用 `vm.$nextTick` 回调函数。

应用场景：

- 如果 `DOM` 操作依赖的数据是在异步操作中获取，并且只有一次数据的更改 （数据更新完毕）时可以对数据更新做一些统一处理。

updated 、 watch 和 nextTick 区别

1. `updated` 对所有数据的变化进行统一处理

2. `watch` 对具体某个数据变化做统一处理

3. `nextTick` 是对某个数据的某一次变化进行处理

### activated 钩子

被 keep-alive 缓存的组件激活时调用。

- 在使用 `vue-router` 时有时需要使用 `<keep-alive></keep-alive>` 来缓存组件状态，这个时候 `created` 钩子就不会被重复调用了。如果我们的子组件需要在每次加载的时候进行某些操作，可以使用 `activated` 钩子触发。

### deactivated 钩子

被 keep-alive 缓存的组件停用时调用。

### beforeDestroy 钩子

实例销毁之前调用。

- 在这一步，实例仍然完全可用（`this` 仍能获取到）。

注： `beforeDestroy` 和 `destroyed` 只能通过手动触发 `$destroy` 来调用。

应用场景：

- 一般在这做一些重置的操作，比如清除掉组件中的 定时器 和 监听的 `DOM` 事件。
- 提示：你确认删除 XX 吗？

### 销毁

对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。

### destroyed 钩子

实例销毁后调用。

- vue2.0 之后主动调用 `$destroy` 不会移除 `DOM` 节点，作者不推荐直接 `destroy` 这种做法，如果实在需要这样用可以在这个生命周期钩子中手动移除 `DOM` 节点。

应用场景：

- 提示：已删除 XX

## 组件生命周期

### 单个组件

1. 初始化组件时，仅执行了 beforeCreate/Created/beforeMount/mounted 四个钩子函数。
2. 当改变 data 中定义的变量（响应式变量）时，会执行 beforeUpdate/updated 钩子函数。
3. 当切换组件（当前组件未缓存）时，会执行 beforeDestory/destroyed 钩子函数。
4. 初始化和销毁时的生命钩子函数均只会执行一次， beforeUpdate/updated 可多次执行。

### 父子组件

1. 仅当子组件完成挂载后，父组件才会挂载。
2. 当子组件完成挂载后，父组件会主动执行一次 beforeUpdate/updated 钩子函数（仅首次）。
3. 父子组件在 data 变化中是分别监控的，但是在更新 props 中的数据是关联的（可实践）。
4. 销毁父组件时，先将子组件销毁后才会销毁父组件。

### 兄弟组件

1. 兄弟组件的初始化（ mounted 之前）分开进行，挂载是从上到下依次进行。
2. 当没有数据关联时，兄弟组件之间的更新和销毁是互不关联的。

## Vue 3

### 替换

- beforeCreate -> setup()
- created -> setup()

### 重命名

- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeDestroy -> onBeforeUnmount
- destroyed -> onUnmounted
- errorCaptured -> onErrorCaptured

### 新增

- onRenderTracked
- onRenderTriggered

Vue 3 中建议使用 `setup()` 代替 `beforeCreate` 、 `created` 钩子函数, 虽然 Vue3 兼容 Vue2 的大部分语法, 但是在 Vue3 中慎用以下钩子函数, 以下的生命周期钩子函数被改名后, 在 Vue3 中将不会再有 `beforeDestroy` 和 `destroyed`

- beforeDestroy -> onBeforeUnmount
- destroyed -> onUnmounted

### 生命周期函数执行顺序

`setup` => `onBeforeMount` => `onRenderTracked` => `onMounted` => `onRenderTriggered` => `onBeforeUpdate` => `onRenderTracked` => `OnUpdated` => `onBeforeUnmount` => `onUnmounted`
