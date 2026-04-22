---
date: 2018-03-01
tag:
  - front-end
  - tech
excerpt: ''
---

# 几种摆脱 callback hell 的方式

JavaScript 是单线程语言，处理异步事件（比如 ajax 请求）时，我们通常会用 callback 的方式。但当异步流程变复杂之后，最常见的写法就是在回调里层层嵌套——代码不直观、冗余度高，后期维护成本也很大。这就是常说的 callback hell。

ES6 引入了几种新的写法，让我们可以更优雅地处理复杂异步事件。

1. Promise

   这是目前解决这类问题中用得最多的方式，不再赘述，详情参考 http://es6.ruanyifeng.com/#docs/promise 。

2. Generator 函数

   这个使用率相对小一些，但个人认为是种更直观的解决方式。生成器函数一般会配合 yield 来用：

   ```javascript
   function* countAppleSales() {
     var result1 = yield $.get('data1.json');
     var result2 = yield $.get('data2.json');
   }
   ```

   用 `*` 来与普通函数区分，`yield` 是用来暂停生成器函数的关键字，再通过 `.next()` 继续执行。详情可参见 https://www.w3ctech.com/topic/1917 。

3. async 函数

   <http://es6.ruanyifeng.com/#docs/async>

<https://www.w3ctech.com/topic/1917>
