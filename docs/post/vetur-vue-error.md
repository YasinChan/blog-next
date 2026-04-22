---
date: 2023-07-11
tag:
  - vue3
  - vscode
excerpt: ''
---

# Vue 3 在 VSCode 中引用组件报错

::: tip
Cannot find module '@/components/ui/Button.vue' or its corresponding type declarations. Vetur(2307)
:::

## 现象

在 Vite 启动的 Vue 3 项目中，引用组件时 VSCode 可能会抛出如下错误：

![](https://tf.yasinchan.com/JIg54yX6OTUzHPIWxW64m8OUo6llWDWF/55D44D1F-95CA-4483-A575-AC74368D2ED1.png)

## 解决

报错来自 Vetur 这个 Vue 2 时代的扩展，对 Vue 3 + TypeScript 的类型解析已不再适用。[Vue 官方文档](https://cn.vuejs.org/guide/typescript/overview.html#ide-support) 推荐的方案很直接：**卸载 Vetur**，改用官方的 Volar（现已升级为 Vue - Official）。
