---
title: Vue 组件通信
date: 2019-09-18
tags:
  - Vue
  - 学习笔记
summary: 组件化是 Vue 主要思想之一，而组件实例的作用域是相互独立的，而 Vue 又是以数据驱动视图的 MVVM 框架，所以各个组件间的通信传递数据非常重要。
---

## 组件关系

![component-relationship.png](https://i.loli.net/2020/05/21/DsmRHrbg1B78A5I.png)

如上图所示：

- A 组件和 B 组件、B 组件和 C 组件、B 组件和 D 组件形成了父子关系
- C 组件和 D 组件形成了兄弟关系
- A 组件和 C 组件、A 组件和 D 组件形成了隔代关系（其中的层级可能是多级，即隔多代）

不同的使用场景适合的通信方式：

- 父子组件通信：`prop` / `$emit` 、 `$attrs` / `$listeners` 、 `$parent` / `$children` 、 `$refs` 、 `provide` / `inject`
- 兄弟组件通信：`eventBus` 、 `Vuex`
- 跨级通信：`$attrs` / `$listeners` 、 `$root` 、 `provide` / `inject` 、 `eventBus` 、 `Vuex`

## `prop` / `$emit`

父组件通过 `prop` 向子组件传值，子组件通过 `$emit` 定义自定义事件，父组件通过 `v-on` 监听子组件触发的自定义事件从而接受子组件传递的值：

```vue
// 父组件
<template>
  <div>
    <Child v-bind:parentData="data" v-on:update:parentData="data=$event"></Child>
    <!-- 上面的语句可以用 .sync 修饰符缩写 -->
    <child v-bind:parentData.sync="data"></child>
  </div>
</template>

<script>
import Child from './child.vue'
export default {
  components: {
    Child
  },
  data() {
    return {
      data: '父组件的数据'
    }
  }
}
</script>
```

```vue
// 子组件
<template>
  <div>
    <p>接收到的数据：{{ receivedData }}</p>
    <button v-on:click="update(childData)">更新</button>
  </div>
</template>

<script>
export default {
  props: ['parentData'],  // 字符串数组是最简单的写法，对象形式可以增加类型检查和其它 prop 验证
  data() {
    return {
      childData: '子组件的数据'
    }
  },
  computed: {
    receivedData() {
      return this.parentData
    }
  },
  methods: {
    update(data) {
      this.$emit('update:parentData', data)
    }
  }
}
</script>
```

- 字符串是静态的可直接传入无需在属性前加 `v-bind` ，数字、布尔值、数组、对象这些是 js 表达式而不是字符串，所以即使这些传递的是静态的也需要加 `v-bind` 。
- 如果 `prop` 传递的值只是作为初始值使用，且在父组件中不会变化，赋值到 `data` 中使用；如果数据在父组件会被改变，放到计算属性中监听变化使用。
- 如果传递的数据是个对象，在子组件中改变这个对象会影响到父组件的状态，因为传递的只是个引用，即使把 `prop` 的数据赋值到 `data` 中也是一样的，无论如何赋值都是引用的赋值。
- 如果要将一个对象的所有属性都作为 `prop` 传入，可以使用不带参数的 `v-bind` (取代 `v-bind:prop-name`)。

  - ```html
    <Child v-bind="person"></Child>
    <!-- 等价于 -->
    <Child v-bind:name="person.name" v-bind:age="person.age"></Child>

    <!-- 也可以配合 .sync 修饰符使用 -->
    <Child v-bind.sync="person"></Child>
    ```

注意：Vue 3 中 `v-bind` 的 `.sync` 修饰符和组件的 `model` 选项已移除，可用 `v-model` 作为代替。

## `$attrs` / `$listeners`

`prop` / `$emit` 只适合直接的父子组件通信，多级嵌套的父子组件如果使用这种方式，需要在每一级都做一遍相关操作，过于麻烦。Vue 2.4 开始提供了 `$attrs` 和 `$listeners` 来解决这个问题。

> `$attrs` 包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 (`class` 和 `style` 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (`class` 和 `style` 除外)，并且可以通过 `v-bind="$attrs"` 传入内部组件——在创建高级别的组件时非常有用。
>
> `$listeners` 包含了父作用域中的 (不含 `.native` 修饰器的) `v-on` 事件监听器。它可以通过 `v-on="$listeners"` 传入内部组件——在创建更高层次的组件时非常有用。

注意：vue 3 移除了 `$listeners` ，现在 `$attrs` 同时包含所有的属性绑定（包括 `style` 和 `class`）和事件监听器。需要将 `$listeners` 改成 `$attrs` 。

```vue
// 父组件
<template>
  <div>
    <ChildA :data="data" :dataToA="dataToA" :dataToB="dataToB" @update="update"></ChildA>
  </div>
</template>

<script>
import ChildA from './ChildA.vue'
export default {
  components: {
    ChildA
  },
  data() {
    return {
      data: '父组件的数据',
      dataToA: '父组件传给A组件的数据',
      dataToB: '父组件传给B组件的数据'
    }
  },
  methods: {
    update(data) {
      this.dataToB = data
    }
  }
}
</script>
```

```vue
// 子组件 A
<template>
  <div>
    <p>A组件props: {{ dataToA }}</p>
    <p>A组件$attrs: {{ $attrs }}</p>
    <!-- A组件调用B组件时，使用 v-on 绑定了 $listeners 属性，所以B组件能直接触发父组件中监听的自定义事件 -->
    <!-- 通过 v-bind 绑定 $attrs 属性，B组件可以直接获取到父组件中传递下来的 props（除了A组件中 prop 声明的） -->
    <ChildB v-bind="$attrs" v-on="$listeners"></ChildB>
  </div>
</template>

<script>
import ChildB from './ChildB.vue'
export default {
  components: {
    ChildB
  },
  inheritAttrs: false,  // 关闭自动挂载到组件根元素上的没有在 prop 声明的属性
  props: ['dataToA'],
  created() {
    console.log(this.dataToA)  // "父组件传给A组件的数据"
    console.log(this.$attrs)  // { "data": "父组件的数据", "dataToB": "父组件传给B组件的数据" }
  }
}
</script>
```

```vue
// A 组件的子组件 B
<template>
  <div>
    <p>B组件props: {{ dataToB }}</p>
    <p>B组件$attrs: {{ $attrs }}</p>
    <button v-on:click="update(childBData)">获取B组件的数据</button>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['dataToB'],
  data() {
    return {
      childBData: 'B组件的数据'
    }
  },
  methods: {
    update(data) {
      this.$emit('update', data)
    }
  },
  created() {
    console.log(this.dataToB)  // 父组件传给B组件的数据
    console.log(this.$attrs)  // { "data": "父组件的数据" }
  }
}
</script>
```

## `$root` / `$parent` / `$children` / `$refs`

- $root: 当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。
- $parent: 当前实例的父实例，在 `#app` 上拿 `$parent` 得到的是 `new Vue()` 的实例，在这实例上再拿 `$parent` 得到的是 `undefined` 。
- $children: 当前实例的直接子组件。在最底层的子组件拿 `$children` 得到的是个空数组。
  - 注意 `$children` 并不保证顺序，也不是响应式的。如果你发现自己正在尝试使用 `$children` 来进行数据绑定，考虑使用一个数组配合 `v-for` 来生成子组件，并且使用 Array 作为真正的来源。
  - 注意 `$children` 拿到是数组，而 `$parent` 是个对象。
  - Vue 3 移除了 `$children`
- ref: 如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例。
- $refs: 拿到一个对象，包含注册过 `ref` 属性的所有 DOM 元素和组件实例。
  - 注意 `$refs` 也不是响应式的。

```vue
// 父组件
<template>
  <div>
    <p>{{ childData }}</p>
    <Child ref="child"></Child>
  </div>
</template>

<script>
import Child from './Child.vue'
export default {
  components: {
    Child
  },
  data() {
    return {
      childData: ''
    }
  },
  methods: {
    parentMethod() {
      alert('父组件的方法')
    }
  },
  mounted() {
    this.childData = this.$refs.child.data
  }
}
</script>
```

```vue
// 子组件
<template>
  <div>
    <button @click="parentMethod">调用父组件的方法</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: '子组件的数据'
    }
  },
  methods: {
    parentMethod() {
      this.$parent.parentMethod()
    }
  }
}
</script>
```

## `provide` 和 `inject`

> Vue 2.2.0 新增，主要在开发高阶插件/组件库时使用。这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。

在父组件中通过 `provider` 提供变量，然后在子组件中通过 `inject` 注入变量。

```vue
// 父组件
<template>
  <div>
    <Child></Child>
  </div>
</template>

<script>
import Child from './Child.vue'
export default {
  components: {
    Child
  },
  provide: {
    data: '父组件的数据'
  }
}
</script>
```

```vue
// 子组件
<template>
  <div>
    <p>{{ data }}</p>
  </div>
</template>

<script>
export default {
  inject: ['data'],
  created() {
    console.log(this.data)  // 父组件的数据
  }
}
</script>
```

## eventBus

> `eventBus` 又称为事件总线。在 Vue 中可以使用 `eventBus` 来作为沟通桥梁的概念，就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，所以组件都可以上下平行地通知其他组件，但也就是太方便所以若使用不慎，就会造成难以维护的灾难，因此才需要更完善的 Vuex 作为状态管理中心，将通知的概念上升到共享状态层次。

eventBus 的原理是引入一个新的 Vue 实例，通过调用这个实例的事件触发和事件监听来实现组件通信。

### 初始化

创建一个 `.js` 文件，比如 `eventBus.js` ，引入 Vue 并导出他的一个实例：

```js
import Vue from 'vue'
export default new Vue()
```

另外一种方式，可以直接在项目中的 `main.js` 初始化 `eventBus` ：

```js
Vue.prototype.$eventBus = new Vue()
```

### 使用

```vue
// 父组件
<template>
  <div>
    <ChildA></ChildA>
    <ChildB></ChildB>
  </div>
</template>

<script>
import ChildA from './ChildA.vue'
import ChildB from './ChildB.vue'
export default {
  components: {
    ChildA,
    ChildB
  }
}
</script>
```

```vue
// A组件，发送事件
<template>
  <div>
    <button @click="sendData">发送数据</button>
  </div>
</template>

<script>
import eventBus from './eventBus.js'
export default {
  data() {
    return {
      data: 'A组件的数据'
    }
  },
  methods: {
    sendData() {
      eventBus.$emit('getAData', data)
    }
  }
}
</script>
```

```vue
// B组件，接收事件
<template>
  <div>
    <p>{{ data }}</p>
  </div>
</template>

<script>
import eventBus from './eventBus.js'
export default {
  data() {
    return {
      data: ''
    }
  },
  mounted() {
    eventBus.$on('getAData', data => {
      this.data = data  // A组件的数据
    })
  }
}
</script>
```

### 移除事件监听

- `eventBus.$off('event', callback)` ：只移除这个回调的监听器。
- `eventBus.$off('event')` ：移除该事件所有的监听器。
- `eventBus.$off()` ：移除所有的事件监听器。

```js
beforeDestroy() {
  eventBus.$off('getAData')
}
```

### Mitt

vue 3 移除了 `$on` 、 `$off` 和 `$once` 实例方法。在 vue 3 中推荐使用 `$emit` 或 Vuex 。

也可以采用第三方库 [Mitt](https://github.com/developit/mitt) 来实现事件总线。

```js
import mitt from 'mitt'
const emitter = mitt()
// listen to an event
emitter.on('foo', e => console.log('foo', e))
// fire an event
emitter.emit('foo', { a: 'b' })
```

## Vuex

> Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。 Vuex 解决了「多个视图依赖于同一状态」和「来自不同视图的行为需要变更同一状态」的问题，将开发者的精力聚焦于数据的更新而不是数据在组件之间的传递上。

![vuex.png](https://i.loli.net/2020/05/21/84NBjg5bOiawFzf.png)

### 核心概念

`state` ：用于数据的存储，是 store 中的唯一数据源

`getters` ：如 vue 中的计算属性一样，基于 state 数据的二次包装，常用于数据的筛选和多个数据的相关性计算

`mutations` ：类似函数，改变 state 数据的唯一途径，且不能用于处理异步事件

`actions` ：类似于 `mutation` ，用于提交 `mutation` 来改变状态，而不直接变更状态，可以包含任意异步操作

`modules` ：类似于命名空间，用于项目中将各个模块的状态分开定义和操作，便于维护

---

Vuex 实现了一个单向数据流，在全局拥有一个 State 存放数据，当组件要更改 State 中的数据时，必须通过 Mutation 进行， Mutation 同时提供了订阅者模式供外部插件调用获取 State 数据的更新。而当所有异步操作（常见于调用后端接口异步获取更新数据）或批量的同步操作需要走 Action ，但 Action 也是无法直接修改 State 的，还是需要通过 Mutation 来修改 State 的数据。最后，根据 State 的变化，渲染到视图上。

### 示例

```vue
// A组件，发送数据
<template>
  <div>
    <button @click="sendData">发送数据</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: "A组件的数据"
    }
  },
  methods: {
    sendData() {
      // 触发getAData，将A组件的数据存放到store
      this.$store.commit("getAData", {
        AData: this.data
      })
    }
  }
}
</script>
```

```vue
// B组件，接收数据
<template>
  <div>
    <p>B组件接收到的数据：{{ AMessage }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    AMessage() {
      // 从store里获取的A组件的数据
      return this.$store.state.AData
    }
  }
}
</script>
```

```js
// store
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    AData: '',
  },
  mutations: {
    getAData(state, payload) {
      state.AData = payload.AData  // 将A组件的数据存放于state
    }
  },
  actions: {
  },
  modules: {
  }
})
```
