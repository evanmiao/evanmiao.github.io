---
title: 跨域问题及解决方案
date: 2019-07-16
tags:
  - HTTP
  - JavaScript
  - 学习笔记
summary: JSONP、CORS 及 postMessage 实现原理
---

## 同源策略

> 同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。

简单地说，同源策略（Same-origin policy）就是浏览器的一个安全机制，它阻止了脚本与不同源（即跨域）资源的交互。所谓同源，指的是三个相同：
- 协议相同
- 域名相同（包括子域名）
- 端口相同（默认 80 ）

### 非同源的限制

1. 无法读取非同源网页的 Cookie、LocalStorage 和 IndexDB
2. 无法获取非同源网页的 DOM 元素
3. 无法向非同源地址发送 AJAX 请求

## 常见跨域场景

举例来说：

| 当前页面url                | 被请求页面url                        | 是否跨域 | 原因       |
| -------------------------- | ------------------------------------ | -------- | ---------- |
| www\.exmple.com/index.html | www\.exmple.com/service.php          | 非跨域   | 同源       |
| www\.exmple.com/index.html | www\.google.com/service.php          | 跨域     | 主域名不同 |
| www\.exmple.com/index.html | bbs\.exmple.com/service/php          | 跨域     | 子域名不同 |
| www\.exmple.com/index.html | www\.exmple.com:81/service.php       | 跨域     | 端口不同   |
| www\.exmple.com/index.html | https\://www\.exmple.com/service.php | 跨域     | 协议不同   |

## 解决方案

### JSONP

JSONP (JSON with Padding) 利用 HTML 标签的 src 属性引用资源不受同源策略的影响（支持跨域）的特性达到跨域获取数据的目的。

声明一个回调函数，函数形参为期望获取的服务端返回数据，函数内容为对返回数据的处理。

```js
var callbackHandler = function (data) {
  alert(data.name);
}
```

动态生成一个 `<script>` 标签，`src` 为：请求资源的地址 + 获取函数的字段名 + 回调函数名称，这里的获取函数的字段名是要和服务端约定好的，是为了让服务端拿到回调函数名称。

```js
// 提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
var url = "https://api.exmple.com/service.php?callback=callbackHandler";
// 创建script标签，设置其属性
var jsonpScript = document.createElement('script');
jsonpScript.setAttribute('src', url);
// 把script标签加入head，此时调用开始
document.getElementsByTagName('head')[0].appendChild(jsonpScript);
```

服务端接收到请求后，通过参数获得回调函数名，并将数据放在回调函数的参数中将其返回。

```js
callbackHandler({'name':'xxx','age':24});
```

浏览器解析 `<script>` 标签时，会自动下载 `src` 属性值 (url) 指向的资源，其中的内容会被立即执行。所以浏览器会认为你在调用一个函数，并且传递了一个对象给函数。作为参数的 JSON 数据被视为 JavaScript 对象，而不是字符串，因此避免了使用 `JSON.parse` 的步骤。

JSONP 和 AJAX 本质上是不同的东西，**AJAX 的核心是通过 `XmlHttpRequest` 获取非本页内容，而 JSONP 的核心则是动态添加 `<script>` 标签来调用服务端提供的 js 脚本。**

#### 在jQuery中的用法

```js
$.ajax({
  type: "get",
  async: false,
  url: "http://api.exmple.com/service.php",
  dataType: "jsonp",
  jsonp: "callback",// 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
  jsonpCallback: "callbackHandler",// 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
  success: function(data) {
    alert(data.name);
  },
  error: function() {
    alert('fail');
  }
});
```

### CORS

> CORS 是一个 W3C 标准，全称是"跨域资源共享"（Cross-origin resource sharing）它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制。

**CORS 需要浏览器和服务器同时支持。IE 8 和 9 需要通过 `XDomainRequest` 来实现。**

CORS 通信与同源的 AJAX 通信没有差别，代码完全一样。浏览器发现 AJAX 请求跨域时会自动帮我们做一些处理。只要服务端提供支持，前端不需要做额外的事情。

所以说实现 CORS 通信的关键是服务端。只要服务端实现了 CORS 接口，就实现了跨域。

#### 简单请求

浏览器将 CORS 请求分成两类：简单请求 (simple request) 和非简单请求 (not-so-simple request) 。

只要同时满足以下两大条件，就属于简单请求。否则，就属于非简单请求。浏览器对这两种请求的处理不一样。

1. 请求方法是以下三种方法之一：
  - HEAD
  - GET
  - POST
2. HTTP 的头信息不超出以下几种字段：
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type：只限于三个值 `application/x-www-form-urlencoded` 、 `multipart/form-data` 、 `text/plain`

对于简单的跨域请求，浏览器会自动在请求的头信息增加一个 `Origin` 字段，表示本次请求来自哪个源（协议 + 域名 + 端口），服务端会获取到这个值，然后判断是否同意这次请求并返回。

```
GET /cors HTTP/1.1
Origin: https://api.origin.com
Host: api.exmple.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

如果 `Origin` 指定的源不在许可范围内，服务端会返回一个正常的 HTTP 回应，但是不会带上 `Access-Control-Allow-Origin` 字段，浏览器发现这个跨域请求的返回头信息没有该字段，就会抛出一个错误，会被 `XMLHttpRequest` 的 `onerror` 回调捕获到。**这种错误无法通过 HTTP 状态码判断，因为回应的状态码有可能是200。**

如果 `Origin` 指定的源在许可范围内，服务端就会在返回的头信息多出几个字段：

```
Access-Control-Allow-Origin: http://api.origin.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Info
Content-Type: text/html; charset=utf-8
```

- **Access-Control-Allow-Origin**

必须。它的值是请求时 `Origin` 字段的值，或者是一个 `*` ，表示接受任意域名的请求。

- **Access-Control-Allow-Credentials**

可选。它的值是一个布尔值，表示是否允许发送 Cookie 。默认为 true ，也只能设为 true ，如果服务器不要浏览器发送 Cookie ，删除该字段。

- **Access-Control-Expose-Headers**

可选。使 `XMLHttpRequest` 对象的 `getResponseHeader()` 方法拿到除6个基本字段之外的其他字段，上面的例子指定， `getResponseHeader('Info')` 可以返回 `Info` 字段的值。

---
另外，CORS 请求默认不发送 Cookie 和 HTTP 认证信息。如果需要发送 Cookie ，除了服务器指定 `Access-Control-Allow-Credentials` 字段之外，还必须在 AJAX 请求中打开 `withCredentials` 属性。

```js
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

需要注意的是，如果要发送 Cookie ， `Access-Control-Allow-Origin` 就不能设为星号，必须指定明确的、与请求网页一致的域名。同时， Cookie 依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的 `document.cookie` 也无法读取服务器域名下的 Cookie 。

#### 非简单请求

非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为「预检」 (preflight) 请求。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XMLHttpRequest` 请求，否则就报错。

浏览器的正常请求和回应一旦服务器通过了"预检"请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 `Origin` 头信息字段。服务器的回应，也都会有一个 `Access-Control-Allow-Origin` 头信息字段。

预检请求的发送请求：

```
OPTIONS /cors HTTP/1.1
Origin: https://api.origin.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.example.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

"预检"请求用的请求方法是 `OPTIONS` ，表示这个请求是用来询问的。头信息里面，关键字段是 `Origin` ，表示请求来自哪个源。除了 `Origin` 字段，"预检"请求的头信息包括两个特殊字段。

1. **Access-Control-Request-Method**

必须。用来列出浏览器的 CORS 请求会用到哪些 HTTP 方法，上例是 `PUT`

2. **Access-Control-Request-Headers**

该字段是一个逗号分隔的字符串，指定浏览器 CORS 请求会额外发送的头信息字段，上例是 `X-Custom-Header` 。

预检请求的返回：

```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: https://api.origin.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

- **Access-Control-Allow-Methods**

必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

- **Access-Control-Allow-Headers**

如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

- **Access-Control-Max-Age**

可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。

### postMessage
> postMessage 方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。
>
> postMessage 是 HTML5 XMLHttpRequest Level 2 中的 API ，用于实现不同窗口不同页面的跨域通信。

#### 发送数据

语法：

```js
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

- **otherWindow**

其他窗口的一个引用，比如 `iframe` 的 `contentWindow` 属性、执行 `window.open` 返回的窗口对象、或者是命名过或数值索引的 `window.frames` 。

- **message**

将要发送到其他窗口的数据。

- **targetOrigin**

目标窗口的源（协议 + 域名 + 端口）。也可以设为 `*` ，表示不限制域名，向所有窗口发送。如果要指定和当前窗口同源的话设置为 `/` 。

如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 `targetOrigin` ，而不是 `*` 。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。

- **transfer**

可选。是一串和 `message` 同时传递的 `Transferable` 对象。这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

#### 接收数据

父窗口和子窗口都可以通过 `message` 事件，监听对方的消息。

```js
window.addEventListener('message', function(event) {
  console.log(event.data);
}, false);
```

`message` 事件监听函数接收一个参数，`event` 对象实例，该对象有三个属性：

- **event.data** ：消息内容

- **event.origin** ：消息发向的网址

`event.origin` 属性可以过滤不是发给本窗口的消息。

```js
window.addEventListener('message', receiveMessage);
function receiveMessage(event) {
  if (event.origin !== 'http://api.origin.com') return;
  if (event.data === 'Hello World') {
    event.source.postMessage('Hello', event.origin);
  } else {
    console.log(event.data);
  }
}
```

- **event.source** ：发送消息的窗口

下面的例子是，子窗口通过 `event.source` 属性引用父窗口，然后发送消息。

```js
window.addEventListener('message', receiveMessage);
function receiveMessage(event) {
  event.source.postMessage('Nice to see you!', '*');
}
```

### 其他方案

- 代理服务器

- nginx 反向代理

- document.domain

- window.name

- window.location.hash

- websocket

- CSST (CSS Text Transformation)

- flash