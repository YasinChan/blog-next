---
date: 2020-07-31
tag:
  - css
excerpt: ''
---

# word-break 和 word-wrap 中 break-word 的用法详解

CSS 里控制换行的 `word-wrap` 和 `word-break` 经常被混用，但它们其实有不少差别。下面分别说说这两个属性中 `break-word` 的情况。

### word-break

MDN 和 W3C 标准中都将 `break-word` 归为已废弃的值，只是为了兼容遗留内容才没有删除（[W3C#word-break](https://www.w3.org/TR/css-text-3/#word-break)）。而且它的兼容性较差，比如较老的 Firefox（< v67，也就是去年之前的版本，参见 [https://hg.mozilla.org/mozilla-central/rev/c1075c1f1605](https://hg.mozilla.org/mozilla-central/rev/c1075c1f1605)）就不支持 `break-word`，IE 也不支持。W3C 的解释为：

::: tip
For compatibility with legacy content, the word-break property also supports a deprecated break-word keyword. When specified, this has the same effect as word-break: normal and overflow-wrap: anywhere, regardless of the actual value of the overflow-wrap property.
:::

也就是说，W3C 将 `word-break: break-word` 解释为 `word-break: normal; overflow-wrap: anywhere;` 的组合。但 `overflow-wrap: anywhere` 的[兼容性](https://caniuse.com/#search=overflow-wrap)又很一般。

### word-wrap

1. Chrome 中使用 `word-wrap: break-word;` 会出现中划线（如下图），但实际上是生效的。MDN 对此的解释是：
   ::: tip
   注：word-wrap 属性原本属于微软的一个私有属性，在 CSS3 现在的文本规范草案中已经被重命名为 overflow-wrap。word-wrap 现在被当作 overflow-wrap 的"别名"。稳定的谷歌 Chrome 和 Opera 浏览器版本支持这种新语法。
   :::
   `overflow-wrap` 相比 `word-wrap` 多了一个 `anywhere` 值，但正如上面所说，它的兼容性较差，暂不建议使用。
   ![图-2.1](https://qiniu.yasinchan.com/image/0acce773267861595f8ffb057ad71d68.png)
2. Chrome 中 `word-wrap: break-word;` 的中划线如何去除：
   ```css
   overflow-wrap: break-word;
   word-wrap: break-word;
   ```
3. 在 `flex` 布局中使用 `word-wrap` 可能会失效。解决方式是给 flex item 添加 `min-width: 0;` 即可。可参考 [stackoverflow 1](https://stackoverflow.com/questions/47820826/word-wrap-in-flexbox-is-not-respecting-100-width-limit)、[stackoverflow 2](https://stackoverflow.com/questions/36150458/flex-item-overflows-container-due-to-long-word-even-after-using-word-wrap)。

### 总结

1. 大多数场景下的留白换行：
   ```css
   word-wrap: break-word;
   word-break: break-word;
   ```
2. 需要强制所有单词折行时：
   ```css
   word-break: break-all;
   ```
