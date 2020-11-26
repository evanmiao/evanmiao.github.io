---
title: Vue 导航守卫
date: 2019-10-14
tags:
  - Vue
  - 学习笔记
summary: 导航守卫（Navigation Guards）就是路由跳转过程中的一些钩子函数，类似生命周期函数。“导航”表示路由正在发生改变。
---

导航守卫（Navigation Guards）就是路由跳转过程中的一些钩子函数，类似生命周期函数。“导航”表示路由正在发生改变。

## 导航守卫回调参数

`to` 是即将要进入的目标路由对象（this.$route）， `from` 是当前导航正要离开的路由， `next` 是一个函数，且**必须调用**，否则不能成功跳转。`next` 调用参数不同执行效果不同：

- `next()` ：进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
- `next(false)` ：中断当前的导航，URL 地址重置为 `from` 路由地址。
- `next('/')` 或者 `next({ path: '/' })` ：中断当前的导航，然后进行一个新的导航。可传递的参数与 `router.push` 中选项一致。
- `next(error)` ：(2.4.0+) 如果传入一个 `Error` 实例，则导航会被终止且该错误会被传递给 `router.onError()` 注册过的回调。
- `next(vm => {})` ：在 `beforeRouteEnter` 可接收一个回调函数，参数为当前组件的实例 `vm` ，这个回调函数在生命周期 `mounted` 之后调用，是所有导航守卫和生命周期函数最后执行的那个钩子。

确保 `next` 函数在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。这里有一个在用户未能验证身份时重定向到 `/login` 的示例：

```js
// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next()
})
```

```js
// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## 全局守卫

指路由实例上直接操作的钩子函数，特点是所有路由配置的组件都会触发。

### beforeEach

全局前置守卫，在路由跳转前触发，主要是用于登录验证。参数包括 `to` , `from` , `next` 。

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

### beforeResolve

> 2.5.0 新增

全局解析守卫，与 `router.beforeEach` 类似，也是路由跳转前触发，参数包括 `to` , `from` , `next` 。

区别是在导航被确认之前，**同时在所有组件内守卫和异步路由组件被解析之后**，解析守卫就被调用。

即在 `beforeEach` 和 组件内 `beforeRouteEnter` 之后， `afterEach` 之前调用。

### afterEach

全局后置钩子，在路由跳转完成后触发。和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```js
router.afterEach((to, from) => {
  // ...
})
```

## 路由独享的守卫（beforeEnter）

你可以在路由配置上直接定义 `beforeEnter` 守卫：

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

这些守卫与全局前置守卫 `beforeEach` 的方法参数是一样的，如果都注册了则紧跟在 `beforeEach` 之后执行。

## 组件内的守卫

在组件内执行的钩子函数，类似于组件内的生命周期，相当于为配置路由的组件添加的生命周期钩子函数。

### beforeRouteEnter

在渲染该组件的对应路由被 confirm 前调用。

**不能**访问 `this` ，在导航确认前被调用，组件实例还没被创建。

可以通过传一个回调给 `next` 来访问组件实例：

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```

### beforeRouteUpdate

在当前路由改变，但是该组件被复用时调用，比如一个带有动态参数的路径 `/foo/:id` ，在 `/foo/1` 和 `/foo/2` 之间跳转的时候，由于会渲染同样的 `Foo` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。

### beforeRouteLeave

导航离开该组件的对应路由时调用，通常用来禁止用户在还未保存修改前突然离开。

可以通过 `next(false)` 来取消：

```js
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

## 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。
