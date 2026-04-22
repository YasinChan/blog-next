---
date: 2022-01-15
tag:
  - slate
  - rich-editor
  - space
sticky: true
excerpt: ''
---

# slate 系列 - 不同空格的处理

::: tip
slate 的数据渲染到页面后会出现一个问题：行首空格消失，文字之间的多个空格也会被合并成一个。而一般的 `div[contenteditable]` 里的连续空格却可以正常显示。
:::

## 几个前置概念

1. 前端开发中常见的空格主要有两种：`&nbsp;` 和键盘 space 键打出的普通空格，对应 unicode 分别是 `\u00a0` 和 `\u0020`。两者的区别如下图红框：前者被称为[不可换行空格](https://zh.wikipedia.org/wiki/%E4%B8%8D%E6%8D%A2%E8%A1%8C%E7%A9%BA%E6%A0%BC)，因此在折行时，`10 km` 会作为整体一起换行；而蓝框中的普通空格则会在 `10` 和 `km` 之间被拆开。
   ![图一](https://qiniu.yasinchan.com/image/image.png)
2. 浏览器对键盘 space 键打出的普通空格有合并规则：连续的空白字符会被合并，行首的空白字符则直接不渲染。`innerText` 和 `innerHTML` 的差异如下图。
   ![图二](https://qiniu.yasinchan.com/image/image%20%281%29.png)
3. `div` 的 `contenteditable` 属性在输入空格时会做特殊处理（Chrome 下的效果见此[视频](https://qiniu.yasinchan.com/image/QQ20220117-150233-HD.mp4)）：依次插入 `\u0020` 和 `\u00a0`，从而保证浏览器能正确渲染出所有空格。

> 以上例子中的代码[参考](https://jsbin.com/qiqezahodu/edit?html,output)

## 回到问题

`div[contenteditable]` 中连续空格的处理在上面第 3 点已经说明。而 slate 是由数据驱动渲染的，存储的数据中连续空格不做任何特殊处理，就是单纯一连串 `\u0020`。最终渲染到页面时，就会落入上面第 2 种情况——空格被合并、行首空格消失。

为了避免这个问题，我们可以在 slate 保存数据之前做一次二次处理，比如：

```js
text = text.replace(/\u0020{2,}/g, (str) => {
  const len = str.length;
  let space = '';
  for (let i = 0; i < len; i++) {
    space += i % 2 === 0 ? '\u00a0' : '\u0020';
  }
  return space;
});
```

也就是在保存前把 slate json 数据中的 `text` 字段处理一遍，转成上面视频里浏览器自身的那种交替形式。

上一篇 [slate 系列 - 零宽空格在 slate 中的运用](/post/zero-width-space.html)
