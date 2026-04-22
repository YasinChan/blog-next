---
date: 2021-12-20
tag:
  - slate
  - rich-editor
  - zero-width
  - \uFEFF
sticky: true
excerpt: ''
---

# slate 系列 - 零宽空格在 slate 中的运用

::: tip
翻 slate 源码时会发现零宽空格频繁出现，比如 [代码 1](https://github.com/ianstormtaylor/slate/blob/main/packages/slate-react/src/components/string.tsx#L107) 和 [代码 2](https://github.com/ianstormtaylor/slate/blob/main/packages/slate-react/src/components/editable.tsx#L853)。它们的作用是什么？
:::

零宽字符在 HTML 中不会渲染出任何可见内容，日常开发中几乎用不到。但在富文本编辑器里，它有一个不可替代的作用。

slate 是基于 `div[contenteditable]` 的变更事件来驱动数据渲染的。在 `contenteditable` 元素中，零宽字符虽然"看不见"，却能独占一个 range — 这就让光标可以"停"在一个本来空空如也的位置上，避免了空节点上无法定位光标的问题。

上一篇 [slate 系列](/post/about-slate.html)
