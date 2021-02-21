---
title: 前端安全问题
date: 2021-02-20
tags:
  - 学习笔记
summary: 常见前端安全问题及解决方案。
---

## XSS

Cross Site Scripting（跨站脚本攻击）简称 XSS，是一种代码注入攻击。攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行。利用这些恶意脚本，攻击者可获取用户的敏感信息如 Cookie、SessionID 等，进而危害数据安全。

### XSS 类型

| 类型   | 存储区                  | 插入点          |
| ------ | ----------------------- | --------------- |
| 存储型 | 后端数据库              | HTML            |
| 反射型 | URL                     | HTML            |
| DOM 型 | 后端数据库/前端存储/URL | 前端 JavaScript |

#### 反射型

攻击流程：

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
2. 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

反射型 XSS 常见于通过 URL 传递参数的功能，如网站搜索、跳转等。

由于需要用户主动打开恶意的 URL 才能生效，攻击者往往会结合多种手段诱导用户点击。

#### 存储型

攻击流程：

1. 攻击者将恶意代码提交到目标网站的数据库中。
2. 用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器。
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等。

一般而言只要用户访问这个界面就行了，不像反射型 XSS，需要访问特定的 URL。

#### DOM 型

攻击流程：

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
2. 用户打开带有恶意代码的 URL。
3. 用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

DOM 型 XSS 跟前两种 XSS 的区别：DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

### XSS 防范

- HttpOnly: 禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie。
- 验证码防止脚本冒充用户，对用户输入内容进行长度控制并过滤。
- 在变量输出到 HTML 页面时，使用编码或转义。
- 尽量使用 Vue / React 等成熟框架。

## CSRF

CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

攻击流程：

1. 受害者登录 `a.com`，并保留了登录凭证（Cookie）。
2. 攻击者引诱受害者访问了 `b.com`。
3. `b.com` 向 `a.com` 发送了一个请求：`a.com/act=xx`。浏览器会默认携带 `a.com` 的 Cookie。
4. `a.com` 接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。
5. `a.com` 以受害者的名义执行了 `act=xx`。
6. 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让 `a.com` 执行了自己定义的操作。

### CSRF 类型

#### GET

GET 类型的 CSRF 利用非常简单，只需要一个 HTTP 请求，一般会这样利用：

```html
<img src="http://bank.example/withdraw?amount=10000&for=hacker" />
```

在受害者访问含有这个 `img` 的页面后，浏览器会自动向 `http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker` 发出一次 HTTP 请求。`bank.example` 就会收到包含受害者登录信息的一次跨域请求。

#### POST

这种类型的 CSRF 利用起来通常使用的是一个自动提交的表单，如：

```html
<form action="http://bank.example/withdraw" method="POST">
  <input type="hidden" name="account" value="xiaoming" />
  <input type="hidden" name="amount" value="10000" />
  <input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script> 
```

复制代码访问该页面后，表单会自动提交，相当于模拟用户完成了一次 POST 操作。

POST 类型的攻击通常比 GET 要求更加严格一点，但仍并不复杂。任何个人网站、博客，被黑客上传页面的网站都有可能是发起攻击的来源，后端接口不能将安全寄托在仅允许 POST 上面。

#### 链接

链接类型的 CSRF 并不常见，比起其他两种用户打开页面就中招的情况，这种需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击，例如：

```html
<a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
  重磅消息！！
</a>
```

由于之前用户登录了信任的网站 A，并且保存登录状态，只要用户主动访问上面的这个 PHP 页面，则表示攻击成功。

### CSRF 特点

- 攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。
- 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据。
- 整个过程攻击者并不能获取到受害者的登录凭证，仅仅是「冒用」。
- 跨站请求可以用各种方式：图片 URL、超链接、CORS、Form 提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。

CSRF 通常是跨域的，因为外域通常更容易被攻击者掌控。但是如果本域下有容易被利用的功能，比如可以发图和链接的论坛和评论区，攻击可以直接在本域下进行，而且这种攻击更加危险。

### CSRF 防范

- 根据 Origin Header 和 Referer Header 确定请求的来源域，直接禁止外域（或者不受信任的域名）对我们发起请求。
- DOM 中所有的 a 和 form 标签后加入 Token， 页面提交的请求携带 Token，后端对接口进行校验，保证页面 Token 及请求 Token 一致。

  ```html
  <a href="http://url?csrftoken=tokenvalue"></a>
  
  <!-- 对于 POST 请求来说，要在 form 的最后加上 -->
  <input type="hidden" name="csrftoken" value="tokenvalue" />
  ```

- 双重 Cookie 验证，利用 CSRF 攻击不能获取到用户 Cookie 的特点，要求 Ajax 和表单请求携带一个 Cookie 中的值，后端接口验证 Cookie 中的字段与 URL 参数中的字段是否一致。
- 关键操作要求再次输入验证码和密码，打断 CSRF 的进程。

## iframe

### 点击劫持

点击劫持（ClickJacking）是一种视觉上的欺骗手段。攻击者使用一个透明的、不可见的 iframe，覆盖在一个网页上，然后诱使用户在网页上进行操作，此时用户将在不知情的情况下点击透明的 iframe 页面。通过调整 iframe 页面的位置，可以诱使用户恰好点击在 iframe 页面的一些功能性按钮上。

防止其他页面通过 iframe 引用：

```js
if (top.location != self.location) {
  top.location.href = 'https://www.example.com'  // 若被其他网站引用则强制跳转
}
```

或者设置 HTTP 响应头 X-Frame-Options

X-Frame-Options HTTP 响应头是用来给浏览器指示允许一个页面可否在 `<frame>`、`<iframe>`、`<object>` 中展现的标记。

有三个可选的值：

- DENY：浏览器会拒绝当前页面加载任何 frame 页面（即使是相同域名的页面也不允许）
- SAMEORIGIN：允许加载 frame 页面，但是 frame 页面的地址只能为同源域名下的页面
- ALLOW-FROM：可以加载指定来源的 frame 页面（可以定义 frame 页面的地址）

### 防止引用的 iframe 篡改自己的页面

sandbox 是 HTML5 的新属性，通过它可以对 iframe 的行为进行各种限制。

- allow-forms：允许 iframe 中提交 form 表单
- allow-popups：允许 iframe 中弹出新的窗口或者标签页（例如，`window.open()`，`showModalDialog()`，`target="_blank"` 等等）
- allow-scripts：允许 iframe 中执行 JavaScript
- allow-same-origin：允许 iframe 中的网页开启同源策略

## target="_blank"

带有 `target="_blank"` 跳转的网页拥有了浏览器 `window.opener` 对象赋予的对原网页的跳转权限，这可能会被恶意网站利用：

```js
window.opener.location.replace('https://a.fake.site')
```

**修复方法：** 为 `target="_blank"` 加上 `rel="noopener noreferrer"` 属性。

## CDN 劫持

如果攻击者劫持了 CDN， 或者对存放在 CDN 上的静态资源进行了污染，就可以肆意篡改我们的前端页面，对用户实施攻击。

应对方法：

Subresource Integrity（子资源完整性）简称 SRI，是允许浏览器检查其获得的资源（例如从 CDN 获得的）是否被篡改的一项安全特性。它通过验证获取文件的哈希值是否和你提供的哈希值一样来判断资源是否被篡改。

```html
<script type="text/javascript" src="example.js" integrity="sha256-xxx sha384-yyy" crossorigin="anonymous"></script>
```

`integrity` 属性分成两个部分，第一部分指定哈希值的生成算法（sha256、sha384、sha512），第二部分是经过 base64 编码的实际哈希值，两者之间通过一个短横（-）分割。

`integrity` 属性可以包含多个由空格分隔的哈希值，只要文件匹配其中任意一个哈希值，就可以通过校验并加载该资源。

`crossorigin="anonymous"` 的作用是引入跨域脚本，使用 SRI 要保证资源同域或开启跨域。如果不加此属性则表示不开启 CORS 策略。
