---
date: 2024-03-23
head:
  - - meta
    - name: keywords
      content: typing, 主题, theme
  - - meta
    - name: description
      content: https://typing.yasinchan.com/ 主题切换介绍
tag:
  - typing
  - change-theme
  - custom-theme
sticky: true
excerpt: <p>打字网站 <a href="https://typing.yasinchan.com" target="_blank">Typing</a> 介绍</p>
---

# Typing 项目技术总结 - 通用模块（主题切换系列）

地址：[https://typing.yasinchan.com](https://typing.yasinchan.com)

源码：[https://github.com/YasinChan/typing](https://github.com/YasinChan/typing)

> 这是一个简约风格、可自定义主题的打字记录与键盘测试网站，可以测试打字速度、统计错误率，支持回放打字过程、排行榜以及联机比一比功能。同时还支持自定义主题、切换字体、登录后记录数据等。网站还内置了一套用户反馈系统，用于收集反馈信息。

以下是各模块的技术总结。

# 通用模块

## 切换主题

切换主题模块包含**预设主题**和**自定义主题**两种。对于预设主题，我采用了目前通用的主题切换思路。

### 预设主题

![预设主题](https://file.yasinchan.com/JLM2zxbFSe5j7JwItquftrRoe7nExToc/1745432064.png)

我们知道 `:root`  伪类选择器在 CSS 中用于选中样式表作用域内的最顶层元素，也就是全局范围。结合 CSS 自定义属性，就可以定义出全局通用的主题变量，整份文档都能引用：

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

这段 CSS 就是我为主题色定义的自定义属性。我这里准备了 `dark` 和 `light` 两套主题色，分别放在[两个文件](https://github.com/YasinChan/typing/tree/main/src/assets/theme)中，再通过 `import()` 动态加载，并配合 `link.remove` 和 `document.head.appendChild` 这样的 DOM 操作把主题样式从 `<head>` 中移除或插入，从而实现预设主题的切换。具体逻辑可以查看[源文件](https://github.com/YasinChan/typing/blob/main/src/common/theme.ts)。

### 自定义主题

![自定义主题](https://file.yasinchan.com/iY9lqu2UeDjKEHg7MoRthRitWQHm5N99/4096162448.png)

除了预设主题，我还开发了一套自定义主题逻辑：用户可以自行定义主题色，再配合反馈模块进行展示和评分。我也会根据评分情况，把好看的主题收录进预设主题。

自定义主题的实现方式是把上述自定义属性重新赋值到 `body` 标签上，借助 [CSS 优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)覆盖预设样式，具体逻辑可以查看[源文件](https://github.com/YasinChan/typing/blob/main/src/common/color.ts)。

我把主题色分成了图中的几个类别。其中**字体颜色**因为涉及不同区域文字明暗层次的区分，又细分为五个类别。图中还可以看到一个**自动生成**按钮——之所以加这个，是考虑到色彩选项太多会显得繁琐，而且用户刚开始可能也不明白这里明暗划分的意图。下面分别从设计和技术两个角度来说明：

1. 设计角度

   想要突出页面元素的重要性等级时，通常会借助颜色的深浅。在这个打字网站的场景下，文字是页面主体，所以重要性的层次表达就落在了文字颜色的深浅上。

   主题大致可以分为两类：亮色主题和暗色主题。在这两种主题下，对所谓"重要性"的表达方向恰好是相反的——实际体验下来你会发现，深色主题靠"变暗"来弱化、浅色主题靠"变亮"来弱化，效果才自然。可以在[这里](https://typing.yasinchan.com/)体验一下。

2. 技术角度

   明确了变暗和变亮的目标，下面来实现它。这里我用 RGB 来完成。先简单解释一下 RGB：

   RGB 代表红（Red）、绿（Green）、蓝（Blue）三种基色。在 RGB 颜色模型中，每种颜色用 0 至 255 的整数来表示亮度或强度：0 表示该颜色通道完全没有贡献（最暗或关闭状态），255 表示该通道亮度最高（最亮状态）。

   基于此，对 RGB 三个通道按相同的比值进行缩放，就能实现整体变亮或变暗的效果。具体可参考 [lightenHexColor 和 darkenHexColor](https://github.com/YasinChan/typing/blob/7fdaa2ebc07c4c3606519d20e9cc684befacb696/src/common/color.ts#L72) 这两个方法。
