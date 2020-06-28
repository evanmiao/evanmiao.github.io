---
title: Vue 计算属性和侦听器
date: 2019-08-30
tags:
  - vue
  - 学习笔记
summary: 计算属性和侦听器都是以 Vue 的依赖追踪机制为基础的，它们都试图处理这样一件事情：当某一个数据（称它为依赖数据）发生变化的时候，所有依赖这个数据的相关数据自动发生变化，也就是自动调用相关的函数去实现数据的变动。
---

计算属性和侦听器都是以 Vue 的依赖追踪机制为基础的，它们都试图处理这样一件事情：当某一个数据（称它为依赖数据）发生变化的时候，所有依赖这个数据的相关数据自动发生变化，也就是自动调用相关的函数去实现数据的变动。

## 计算属性

```js
// ...
data() {
  return {
    firstName: 'Evan',
    lastName: 'Miao'
  }
},
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}
// ...
```

- 计算属性无需调用，可直接在 DOM 里使用。
- 计算属性会基于它们的响应式依赖进行缓存，只在相关响应式依赖发生改变时它们才会重新求值。
- 计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。

### 计算属性的 setter

计算属性默认只有 getter，需要时也可以提供一个 setter ，比如：

```js
// ...
computed: {
  fullName: {
    // getter
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set(val) {
      var names = val.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

此时通过改变 `fullName` 的值，也会同时改变它所依赖的 `firstName` 和 `lastName` 的值。但是**不推荐这样做**，一般计算属性数据是根据多个数据组合成的，组合容易，但拆开重新设置并不容易。

## 侦听器

> 一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 `$watch()`，遍历 watch 对象的每一个 property。

```js
// ...
data() {
  return {
   firstName: 'Evan',
   lastName: 'Miao',
   fullName: ''
  }
},
watch: {
  firstName(newVal, oldVal) {
    this.fullName = newVal + ' ' + this.lastName
  },
  lastName(newVal, oldVal) {
    this.fullName = this.firstName + ' ' + newVal
  }
}
// ...
```

上例中，初始 `fullName` 是没有值的。因为 `watch` 的方法**默认不会执行**，只有当侦听的数据改变时才会执行。

### 立即执行

通过声明 `immediate` 选项为 `true` ，可以立即执行一次 `handler` 。

```js
// ...
watch: {
  firstName: {
    handler(newVal, oldVal) {
      this.fullName = newVal + ' ' + this.lastName
    },
    immediate: true  // 该属性设定该回调将会在侦听开始之后被立即调用
  }
}
// ...
```

### 深度侦听

为了发现对象内部值的变化，可以在选项参数中指定 `deep: true`。注意监听数组的变更不需要这么做。

```js
data() {
  return {
    obj: {
      num: 0
    }
  }
},
watch: {
  obj: {
    handler(newVal, oldVal) {
      console.log(newVal)  // { num: 1 }
      console.log(oldVal)  // { num: 1 }
    },
    deep: true  // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
  }
}
```

深度侦听虽然可以侦听到对象属性的变化，但是无法记录修改之前的数据，原因是它们索引同一个对象。而且修改对象任意属性值，都会触发 `handler` ，性能开销也会变大。

### 侦听对象单个属性

两种方法：

#### 字符串形式侦听

可以直接在字符串中写「对象.属性」来拿到对应属性。

```js
// ...
watch: {
  'obj.num'(newVal, oldVal) {
    console.log(newVal)  // 1
    console.log(oldVal)  // 0
  }
}
// ...
```

#### 配合计算属性

用 `computed` 作为中间件转化，因为 `computed` 可以取到对应属性。

```js
// ...
computed: {
  objNum() {
    return this.obj.num
  }
},
watch: {
  objNum(newVal, oldVal) {
    console.log(newVal)  // 1
    console.log(oldVal)  // 0
  }
}
// ...
```

## 区别

1. `computed` 不支持异步，当 `computed` 内有异步操作时无效，无法监听数据的变化。 `watch` 支持异步。
2. 适用场景不同：
   - `computed` ： 一个数据依赖于其他数据。「一对一」或「多对一」
   - `watch` ：一个数据变化后影响多个数据，或者引起一系列操作。「一对多」

## 注意

不要在 `computed` 或 `watch` 中修改所依赖的数据的值，尤其是 `computed` ，可能会陷入死循环。

不要使用箭头函数来定义 watcher 函数。箭头函数绑定了父级作用域的上下文，所以 `this` 将不会按照期望指向 Vue 实例。
