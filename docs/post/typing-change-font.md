---
date: 2024-03-24
head:
  - - meta
    - name: keywords
      content: typing, 主题, theme
  - - meta
    - name: description
      content: https://typing.yasinchan.com/ 主题切换介绍
tag:
  - typing
  - link preload
  - FontFaceObserver
  - font-family
  - fontmin
sticky: true
excerpt: <p>打字网站 <a href="https://typing.yasinchan.com" target="_blank">Typing</a> 字体切换逻辑介绍</p>
---

# Typing 项目技术总结 - 通用模块（字体切换系列）

地址：[https://typing.yasinchan.com](https://typing.yasinchan.com)

源码：[https://github.com/YasinChan/typing](https://github.com/YasinChan/typing)

![](https://file.yasinchan.com/Ah4n6YhrHtTazLbAGidp2oNzwttOiUFb/766579006.png)

## 切换字体

正如[前文](/post/typing-intr.html)所言，本站是一个以文字为主的站点，所以对文字本身可以做更多的定制，字体就是其中一个可以改变的点。

我在网上找了一些免费或开源的字体站点，从中挑选了几款个人认为比较合适的字体。这里用到的有以下四个：

- [free-font](https://wordshub.github.io/free-font/)
- [Google Fonts](https://fonts.google.com/)
- [得意黑](https://github.com/atelier-anchor/smiley-sans)
- [阿里巴巴普惠体](https://fonts.alibabagroup.com/#/home)

一个完整的字体 `ttf` 文件通常在几 M 到几十 M 不等，因此我把这些字体文件放在了 CDN 上，再通过 CSS 的 `@font-face` 进行定义：

```css
@font-face {
  font-family: 'zpix';
  src: url('https://file.yasinchan.com/JudectfYr6GWqWPMRw79gEhCdUhozc36/zpix.ttf');
}
```

根据 W3C 的 [Font loading guidelines](https://www.w3.org/TR/css-fonts-3/?spm=5176.28103460.0.0.297c3f99aJeEs1#font-face-loading)，字体只有在对应的 `font-family` 被使用时才会真正被加载。

在上图中点击选择某个字体后，会把包含对应 `font-family` 样式的 `class` 设置到目标标签上，此时字体文件就会被加载，从而实现字体文件的动态加载与切换。

不过字体文件通常较大，第一次加载耗时较长，甚至需要数秒。在这段时间里，用户从观感上会觉得字体没加载出来。为此，我引入了一个用于监听字体加载状态的库 [FontFaceObserver](https://github.com/bramstein/fontfaceobserver)，用来在动态加载字体时监听加载结果：

```tsx
function listenFont(name: string) {
  if (name === 'default') {
    showMessage({ message: '默认字体加载成功！' });
    return;
  }
  showMessage({ message: '"' + name + '"' + ' 字体加载中...', timeout: 8000 });
  const myFont = new FontFaceObserver(name, {});
  myFont.load(null, 8000).then(
    function () {
      showMessage({ message: '"' + name + '"' + ' 字体加载成功！' });
    },
    function () {
      showMessage({ message: '"' + name + '"' + ' 字体加载失败！', type: 'error' });
    }
  );
}
```

这里可以看到我给 `load` 方法传入了第二个参数 `8000`，原因来自该库的说明：

> The default timeout for giving up on font loading is 3 seconds. You can increase or decrease this by passing a number of milliseconds as the second parameter to the load method.

默认超时是 3 秒，但字体文件较大或 CDN 不稳定时，加载时间可能超过 3 秒，所以我暂时把它设置为 8 秒。具体可以查看[我的源码](https://github.com/YasinChan/typing/blob/877a7a77a399bf492c31af0fb7cf9c8280ac20ad/src/App.vue#L169C1-L184C2)。

### 用 fontmin 做字体预览的按需加载

如上图所示，在选择字体的弹框里，每种字体都带有一段预览样式。如果只是为了预览就加载完整的字体文件，未免太浪费。所以我使用了 [fontmin](https://github.com/ecomfe/fontmin) 工具来做按需加载——它可以从字体文件中只抽取所需的字符，单独打包成一个很小的文件。在预览这个场景下，只需要弹框里展示的几个字符就够了。举个例子，使用 fontmin 之后，原本 7.2M 的字体文件可以缩减到 6.4k，极大地节约了加载资源。

### 关于字体资源预加载的取舍

开发时我也考虑过字体资源预加载的方案。这里先引入一个概念：`link preload`。

### [link preload](https://html.spec.whatwg.org/multipage/links.html#link-type-preload)

我们知道 `<link>` 通常用来加载样式资源，不过 `<link>`  也加入了一些有意思的性能与安全特性，**preload** 就是其中之一。

浏览器渲染时，遇到 `<img>` 标签才会加载其中的图片资源；同样地，前面提到的 `@font-face`，也只有在定义的 `font-family` 被使用时才会加载对应的字体资源。基于[浏览器的工作原理](https://web.dev/articles/critical-rendering-path?spm=5176.28103460.0.0.74fb3f99KEeKuS&hl=zh-cn)，这意味着资源要等到执行到对应位置时才会被加载——从用户视角看，就是图片滞后加载、字体出现"跳一下"的现象。

如果能尽早把这些资源加载下来，再配合 loading 状态等手段，就能给用户更好的体验。

[link preload](https://html.spec.whatwg.org/multipage/links.html#link-type-preload) 正是用来实现这种"尽早加载"的：把需要提前加载的资源放到 `<head>` 中靠前的位置，就可以起到预加载的作用。再结合浏览器缓存，DOM 中真正用到这些资源时就可以直接从缓存里取。顺便一提，单从字体文件来说，即使不是我这里这种按需加载的特殊场景，而是常规的全局加载字体，也同样需要尽早加载——[web.dev](https://web.dev/articles/codelab-preload-web-fonts?hl=zh-cn) 中也提到了这一点。

那为什么我会在切换字体这里提到预加载呢？因为我一开始遇到字体按需加载等待好几秒的问题，想做优化时就看到了 preload 方案。当时考虑过直接在 `<head>` 里用 `link preload` 把字体写进去，但担心将来字体越加越多，会让初始加载的资源量过大。后来又想过在打开字体选择框时动态插入 `<link>` 来预加载字体，大致写法如下：

```tsx
function preloadFont(url: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.href = url;
  link.crossOrigin = '';
  document.head.appendChild(link);
}
```

不过实际发现，用户从打开字体选择框到点击设置之间可能只有几秒钟，根本不足以加载几十 M 的资源，依然会出现选定字体后等待多秒才显示出来的情况。所以最终我还是选择了上面提到的 [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) 方案。
