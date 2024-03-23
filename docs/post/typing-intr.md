---
date: 2024-03-23
tag:
  - typing
  - change-theme
  - custom-theme
sticky: true
excerpt: <p>打字网站 <a href="https://typing.yasinchan.com" target="_blank">Typing</a> 介绍</p>
---

# Typing 项目技术总结 - 通用模块（主题切换系列）

地址：[https://typing.yasinchan.com](https://typing.yasinchan.com)

> 这是一个简约风格的可自定义主题的打字记录和键盘测试网站，可以用来测试打字速度，统计打字错误率，支持回放打字过程，支持排行榜，支持联机比一比功能。同时也支持自定义主题，切换字体，以及登录记录数据等等功能。网站也包含一套用户反馈系统记录反馈信息。

以下是不同模块的技术总结

# 通用模块

## 切换主题

切换主题模块涉及了**预设主题**和**自定义主题**两种，对于预设主题，我使用了目前通用的主题切换逻辑。

### 预设主题

![预设主题](https://file.yasinchan.com/JLM2zxbFSe5j7JwItquftrRoe7nExToc/1745432064.png)

我们知道 `:root`  伪类选择器在 CSS 中用于选择样式表作用域内的最顶层元素，也就是全局范围。同时，我利用 CSS 自定义属性，定义全局通用主题变量，这样在整个文档中都可以引用和使用这些变量。

```css
/* 颜色变量 dark 模式 */
:root {
  /*灰阶颜色 */
  --gray-08: #ffffff;
  --gray-06: #999999;
  --gray-04: #666666;
  --gray-02: #404040;

  --background-gray: #252733;
  --layout-background-gray: #30323d;

  --key-box-shadow: 2px 2px 4px rgba(255, 255, 255, 0.2);
  --box-shadow-color: rgba(255, 255, 255, 0.2);

  /* 基础色 */
  --label-white: #fff;
  --main-red: #f64c4c;
  --main-color: #15c5ce;
  --main-orange: #ff8156;
}

/* 颜色变量 light 模式 */
:root {
  /*灰阶颜色 */
  --gray-08: #1d2127;
  --gray-06: #52575d;
  --gray-04: #a0a5aa;
  --gray-02: #d2d7d9;

  --background-gray: #f5f7f8;
  --layout-background-gray: #ffffff;

  --key-box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  --box-shadow-color: rgba(0, 0, 0, 0.4);

  /* 基础色 */
  --label-white: #fff;
  --main-red: #f64c4c;
  --main-color: #15c5ce;
  --main-orange: #ff8156;
}
```

这段 css 即是我所定义的用于主题色的自定义属性，我这里定义了两套分别为 `dark` 和 `light` 的主题色，将其分别定义到[两个文件](https://github.com/YasinChan/typing/tree/main/src/assets/theme)中，然后通过 `import()` 动态加载文件的方式，结合 `link.remove` 和 `document.head.appendChild` Dom 操作的方式将主题文件移除、插入到 head 中，达到预设主题切换的功能，具体逻辑查看[文件](https://github.com/YasinChan/typing/blob/main/src/common/theme.ts)。

### 自定义主题

![自定义主题](https://file.yasinchan.com/iY9lqu2UeDjKEHg7MoRthRitWQHm5N99/4096162448.png)

除了预设主题，我这里还开发了一套自定义主题逻辑，可以由用户自定义主题色，然后配合反馈模块，进行展示和评分。我这里也可以根据评分情况将好看的主题也放入预设主题中。

自定义主题的设置是将上述自定义属性重新赋值到 body 标签上，从而依赖 [css 优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)关系，达到覆盖预设样式的目的，具体逻辑可以查看[文件](https://github.com/YasinChan/typing/blob/main/src/common/color.ts)。

我将主题色分为图中的几种类别，其中**字体颜色**这里，由于涉及到不同区域字体颜色的明暗区别，我将其分为了五种类别。图中可以看到有一个**自动生成**的按钮，这里我是考虑到色彩过多，会过于繁琐，同时可能用户刚开始设置的时候可能会不明白这里明暗的意图，所以我加入了这个自动生成的逻辑。这里我分别从设计和技术两个角度来说明这点：

1. 设计角度

   当我们想突出页面元素的重要性等级时，我们会通过颜色的深浅来体现。对于我这里打字网站的场景而言，文字是网站主体，所以我这里是通过对文字颜色的深浅设置，来达到重要性的表达的。

   一般来说，主题主要分为两类：亮色主题和暗色主题。而在这两种情况下，在对上述所谓重要性的表达上是相反的，实际体验下来会发现，深色主题选择变暗，浅色主题选择变亮，来达到这个效果。可以在[这里](https://typing.yasinchan.com/)体验一下。

2. 技术角度

   我们知道了变暗和变亮的目的，那么现在来实现一下。这里是利用 RGB 来实现这一目标，再说明一下 RGB 的含义：

   RGB 代表红（Red）、绿（Green）、蓝（Blue）三种基色。在 RGB 颜色模型中，每种颜色都有一个介于 0 至 255 之间的整数值来表示其亮度或强度，0 表示该颜色通道完全没有贡献（最暗或关闭状态），255 表示该颜色通道的亮度最高（最亮状态）。

   基于此，我们可以通过对 RGB 中每个颜色都按照同一个比值进行缩放，从而达到变亮或者变暗的目的。同样可以查看方法 [lightenHexColor 和 darkenHexColor](https://github.com/YasinChan/typing/blob/7fdaa2ebc07c4c3606519d20e9cc684befacb696/src/common/color.ts#L72)。
