---
title: JavaScript 正则表达式
date: 2019-08-22
tags:
  - JavaScript
  - 学习笔记
summary: 正则表达式（regular expression）是用于匹配字符串中字符组合的模式。在 JavaScript 中，正则表达式也是对象，其体系参照 Perl 5 建立。
---

## 创建正则表达式

- 使用一个正则表达式字面量

```js
var reg = /xxx/;
```

- 调用 `RegExp` 对象的构造函数

```js
var reg = new RegExp('xxx');
```

两种方法主要区别是：第一种方法在引擎编译代码时，就会新建正则表达式，第二种方法在运行时新建正则表达式，所以前者的效率较高。而且，前者比较便利和直观，所以实际应用中，基本上都采用字面量定义正则表达式。

### 实例属性

分为两类

- 修饰符（只读）

`RegExp.prototype.ignoreCase`：返回一个布尔值，表示是否设置了 `i` 修饰符。用于忽略字符串大小写。

`RegExp.prototype.global`：返回一个布尔值，表示是否设置了 `g` 修饰符。用于全局匹配。

`RegExp.prototype.multiline`：返回一个布尔值，表示是否设置了 `m` 修饰符。用于设置匹配为多行模式。

- 其他属性

`RegExp.prototype.lastIndex`：返回一个数值，表示下一次开始搜索的位置。该属性可读写，但是只在进行连续搜索时有意义，详细介绍请看后文。

`RegExp.prototype.source`：返回正则表达式的字符串形式（不包括反斜杠），该属性只读。

### 实例方法

- **RegExp.prototype.test()**

`test` 方法返回布尔值，表示当前模式是否能匹配参数字符串

```js
/a/.test('and');  // true
```

- **RegExp.prototype.exec()**

`exec` 方法，用来返回匹配结果

如果发现匹配，就返回一个数组，成员是匹配成功的子字符串，否则返回 `null`

```js
/a/.exec('adbca');
```

如果正则表示式包含圆括号（即含有“组匹配”），则返回的数组会包括多个成员。第一个成员是整个匹配成功的结果，后面的成员就是圆括号对应的匹配成功的组。也就是说，第二个成员对应第一个括号，第三个成员对应第二个括号，以此类推。整个数组的 `length` 属性等于组匹配的数量再加 1 。

`String.prototype.match()`：返回一个数组，成员是所有匹配的子字符串。

`String.prototype.search()`：按照给定的正则表达式进行搜索，返回一个整数，表示匹配开始的位置。

`String.prototype.replace()`：按照给定的正则表达式进行替换，返回替换后的字符串。

`String.prototype.split()`：按照给定规则进行字符串分割，返回一个数组，包含分割后的各个成员。

---

## 元字符

### 点字符

点字符 `.` 匹配除回车（`\r`）、换行（`\n`） 、行分隔符（`\u2028`）和段分隔符（`\u2029`）以外的所有字符。

### 位置字符

`^` 表示字符串的开始位置

`$` 表示字符串的结束位置

### 选择符

`|` 表示“或关系”

### 转义符

匹配元字符本身可以在它们前面加反斜杠 `\`

构造函数需要两次转义

### 特殊字符

`\cX` 表示 Ctrl-[X]，其中的 X 是 A-Z 之中任一个英文字母，用来匹配控制字符。

`[\b]` 匹配退格键(U+0008)，不要与 `\b` 混淆。

`\n` 匹配换行键。

`\r` 匹配回车键。

`\t` 匹配制表符 tab（U+0009）。

`\v` 匹配垂直制表符（U+000B）。

`\f` 匹配换页符（U+000C）。

`\0` 匹配 `null` 字符（U+0000）。

`\xhh` 匹配一个以两位十六进制数（\x00-\xFF）表示的字符。

`\uhhhh` 匹配一个以四位十六进制数（\u0000-\uFFFF）表示的 Unicode 字符。

## 字符类

字符类（class）表示有一系列字符可供选择，只要匹配其中一个就可以了。所有可供选择的字符都放在方括号内，比如 `[^xyz]` 表示 x、y、z 之中任选一个匹配。

### 脱字符

（`^`）：需在字符类第一位

表示除了字符类之中的字符，其他字符都可以匹配。只有 `[^]` ，就表示匹配一切字符，包括换行符。相比之下，点号 `.` 作为元字符是不包括换行符的。

### 连字符

（`-`）

```js
/[0-9.,]/;
/[0-9a-fA-F]/;
/[a-zA-Z0-9-]/;
/[1-31]/;  // 不代表1到31，只代表1到3
```

## 预定义模式：某些常见模式的简写方式

`\d` 匹配0-9之间的任一数字，相当于 `[0-9]` 。

`\D` 匹配所有0-9以外的字符，相当于 `[^0-9]` 。

`\w` 匹配任意的字母、数字和下划线，相当于 `[A-Za-z0-9_]` 。

`\W` 除所有字母、数字和下划线以外的字符，相当于 `[^A-Za-z0-9_]` 。

`\s` 匹配空格（包括换行符、制表符、空格符等），相等于 `[ \t\r\n\v\f]` 。

`\S` 匹配非空格的字符，相当于 `[^ \t\r\n\v\f]` 。

`\b` 匹配词的边界。

`\B` 匹配非词边界，即在词的内部。

## 重复类

模式的精确匹配次数，使用大括号 `{}` 表示。

`{n}` 表示恰好重复 n 次；

`{n,}` 表示至少重复 n 次；

`{n,m}` 表示重复不少于 n 次，不多于 m 次。

## 量词符：设定某个模式出现的次数

`?` 问号表示某个模式出现0次或1次，等同于 `{0, 1}` 。

`*` 星号表示某个模式出现0次或多次，等同于 `{0,}` 。

`+` 加号表示某个模式出现1次或多次，等同于 `{1,}` 。

## 贪婪模式

```js
var s = 'aaa';
s.match(/a+/);  // ["aaa"]
```

贪婪模式改为非贪婪模式
`*?`：表示某个模式出现 0 次或多次，匹配时采用非贪婪模式。

`+?`：表示某个模式出现 1 次或多次，匹配时采用非贪婪模式。

## 字符串去空格(replace)

```js
var str = '  #id div.class  ';
str.trim();  // "#id div.class"
str.replace(/^\s+|\s+$/g, '');  // "#id div.class"
```

`$&`：匹配的子字符串。

$`：匹配结果前面的文本。

`$’`：匹配结果后面的文本。

`$n`：匹配成功的第 n 组内容， n 是从 1 开始的自然数。

`$$`：指代美元符号 $ 。
