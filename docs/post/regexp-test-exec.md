---
date: 2020-05-21
tag:
  - tech
  - front-end
  - reg
excerpt: 正则的 test 方法是和 exec 类似的机制 会在当正则设置了 global 标志位的情况下每次执行 test 方法的时候都会记录匹配之后的位置 在下一次执行的时候从新的位置开始匹配
---

# 正则 test 和 exec 在 global 模式下的工作机制

::: tip
当正则设置了 `g`（global）标志位时，`test` 和 `exec` 的工作机制是类似的：每次执行后都会记录匹配结束的位置，下一次执行会从新的位置继续匹配。
:::

## exec 的匹配过程

假设有一个字符串 `axbaybazbaaa`，需要匹配出所有满足 `a.b` 的子串，可以定义如下正则表达式：

```javascript
var reg = new RegExp('a.b', 'g');
```

```javascript
var str = 'axbaybazbaaa'
var arr
while((arr = reg.exec(str)) !== null) { console.log(arr) }
-> ["axb", index: 0, input: "axbaybazbaaa", groups: undefined]
-> ["ayb", index: 3, input: "axbaybazbaaa", groups: undefined]
-> ["azb", index: 6, input: "axbaybazbaaa", groups: undefined]
```

一个正则对象包含多个属性，这里我们需要关注的是 `lastIndex`，它记录了下一次匹配开始的位置。把上面的 `while` 循环拆开来看，可以更清楚每一步发生了什么：

```javascript
reg.lastIndex
-> 0 // 最初 lastIndex 属性必然是指向 0 的
reg.exec(str)
-> ["axb", index: 0, input: "axbaybazbaaa", groups: undefined]
reg.lastIndex
-> 3 // 在执行一次之后，匹配了字符串前三个字符，所以下一次匹配开始的位置为 3
reg.exec(str)
-> ["ayb", index: 3, input: "axbaybazbaaa", groups: undefined]
reg.lastIndex
-> 6 // 同上
reg.exec(str)
-> ["azb", index: 6, input: "axbaybazbaaa", groups: undefined]
reg.lastIndex
-> 9
reg.exec(str)
-> null // 此时 从第 9 个值开始执行，会发现匹配不到值，所以是 null
reg.lastIndex
-> 0 // 执行结果为 null 时，表示一轮遍历结束，lastIndex 被重置为 0
```

## test 方法同样会推进 lastIndex

以上便是 `exec` 方法的工作过程。`test` 本质上和 `exec` 是相似的，所以重复执行 `reg.test(str)` 时，也会经历和上面一样的遍历过程。

我们平时之所以不容易注意到 `test` 的这个机制，是因为使用 `test` 时通常只是想判断字符串是否匹配正则，只要有一个匹配项就够了，不会反复调用。

```javascript
reg.lastIndex
-> 0
reg.test(str)
-> true
reg.lastIndex
-> 3
reg.test(str)
-> true
reg.lastIndex
-> 6
reg.test(str)
-> true
reg.lastIndex
-> 9
reg.test(str)
-> false
reg.lastIndex
-> 0
```
