---
date: 2024-03-24
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

# 通用模块

## 切换字体

![](https://file.yasinchan.com/Ah4n6YhrHtTazLbAGidp2oNzwttOiUFb/766579006.png)

正如[前文](/post/typing-intr.html)所言，本站是个文字为主的站点，所以对于文字本身可以做更多的定制，字体则是其中一个可以改变的点。

我在互联网上找到了一些免费或者开源的字体网站，从中找到一些个人认为比较适合的字体。比如我这里使用到是如下四个：

- [free-font](https://wordshub.github.io/free-font/)
- [Google Fonts](https://fonts.google.com/)
- [得意黑](https://github.com/atelier-anchor/smiley-sans)
- [阿里巴巴普惠体](https://fonts.alibabagroup.com/#/home)

一般一个完整的字体 `ttf 文件` 大小在 几 M 到 几十 M 不等，因此这种字体文件我将其放在 CDN 上了。然后通过 css `@font-face` 进行定义。

```css
@font-face {
  font-family: 'zpix';
  src: url('https://file.yasinchan.com/JudectfYr6GWqWPMRw79gEhCdUhozc36/zpix.ttf');
}
```

参考 w3c 文档对 [Font loading guidelines](https://www.w3.org/TR/css-fonts-3/?spm=5176.28103460.0.0.297c3f99aJeEs1#font-face-loading) 的定义，只有在 `font-family` 被使用时才会被加载

然后在上图中点击选择对应字体后，将包含对应 `font-family` 字体样式的 `class` 设置到对应标签上，此时字体文件会被加载，从而达到动态加载字体文件和切换字体的目的。

不过由于字体文件一般都比较大，在第一次加载时都会比较久，甚至会有数秒的加载时长，对于用户而言，在这数秒内观感上会觉得没有加载出来。为此，我这里引入了一个用于监听字体文件加载完成的组件库 [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) ，用于在点击设置字体后动态加载字体文件时，起到监听文件是否加载成功的作用

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

这里可以看到我为 load 方法加了第二个 8000 的参数，原因是该组件库的描述

> The default timeout for giving up on font loading is 3 seconds. You can increase or decrease this by passing a number of milliseconds as the second parameter to the load method.

默认是 3 秒超时，而由于字体文件过大或者 CDN 供应商不给力的原因可能导致加载时间会更长超过 3 秒，所以我这里暂时设置为 8 秒，具体可以查看[我的源码](https://github.com/YasinChan/typing/blob/877a7a77a399bf492c31af0fb7cf9c8280ac20ad/src/App.vue#L169C1-L184C2)。

另外如上图，在选择字体弹框里是有个预览字体样式的，如果说当需要预览的时候加载所有完整的字体文件也会有所浪费，所以我这里使用了 [fontmin](https://github.com/ecomfe/fontmin) 工具，用于按需加载字体文件。使用该工具可以将所需要的字符从字体文件中单独打包出来形成一个很小的文件。放到我这里预览的场景，只需要入土中的几个单独的字符。举例来讲，在使用 fontmin 工具之后，可以将 7.2M 的文件减少到只有 6.4k，极大的节约了资源加载。

另外再说一点，在开发时也考虑过字体资源预加载的方案。这里先引入一个新的概念 `link preload`。

### [link preload](https://html.spec.whatwg.org/multipage/links.html#link-type-preload)

我们知道 `<link>` 通常是用来加载样式资源的，不过 `<link>`  也加入了一些新的有意思的性能和安全特性，这里的 **preload** 就是其一。

我们知道浏览器在渲染时，当加载到 `<img>` 标签时才会加载其中的图片资源，就像上面提到的 `@font-face` ，只有当定义的 `font-family` 被使用时才会加载其对应的字体资源。基于[浏览器的工作原理](https://web.dev/articles/critical-rendering-path?spm=5176.28103460.0.0.74fb3f99KEeKuS&hl=zh-cn)，这意味着这些资源只有当执行到对应位置才会加载所需资源，从用户层面讲，视觉上就是图片资源滞后加载或者字体会跳一下加载。

对此我们可以考虑到，如果能尽快的加载这部分资源，再依赖其他比如加 loading 状态等手段，就可以给到用户更好的体验。

[link preload](https://html.spec.whatwg.org/multipage/links.html#link-type-preload) 就是做这个“尽快”加载的作用的。利用 link preload 可以将需要提前加载的资源放到 head 里面靠上的位置，即可以起到预加载的作用。再结合浏览器缓存，当 Dom 中使用到这些预加载的资源时，就可以从缓存中拿到。顺便提一下单从字体文件角度而言，如果不是我这里特殊的按需加载的需求，而是全局的正常加载字体文件的需求时，也是需要尽快加载到字体文件的，包括在 [web.dev](https://web.dev/articles/codelab-preload-web-fonts?hl=zh-cn) 也是提到这一点。

为什么切换字体这里我会提到预加载呢。因为我在一开始遇到需要按需加载字体，但是由于字体文件过大等待好几秒的问题而想优化时，看到了预加载的方案。当时是有考虑直接在 `<head>` 中将对应字体资源直接通过 `link preload` 写进去的，但是考虑到将来可能会增加更多的字体资源，可能会导致一开始加载的资源过多了。后来也有想法是在打开字体选择框的时候动态插入 `<link>` 预加载字体文件，类似这种：

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

不过发现用户在打开字体选择框到点击字体设置的时间可能只有几秒，是无法将几十 M 的资源都加载出来的，还是会出现选择了一个字体资源后等待多秒才加载出来的情况，最终选择了上面 [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) 的方案。
