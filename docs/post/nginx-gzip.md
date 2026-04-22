---
date: 2024-05-11
head:
  - - meta
    - name: keywords
      content: gzip, nginx, 压缩
  - - meta
    - name: description
      content: nginx 关于 gzip 相关配置
tag:
  - typing
  - gzip
  - 压缩
  - nginx
sticky: true
excerpt: nginx 关于 gzip 压缩的相关配置
---

# nginx 中 gzip 压缩的相关配置

## 问题

最近 [typing](https://typing.yasinchan.com) 项目页面加载明显变慢，调试发现 JS 文件竟然有 1.4M——并且对应的 JS、CSS 文件都没有开启 gzip 压缩。

奇怪的是，项目本身用 Vite 开发，默认是会开启 gzip 的，本地调试也确实生效了，但部署上线后就失效了。

## 原因

排查后发现：线上是用 nginx 做的代理，问题出在 nginx 自身的配置上。

通常安装好 nginx 后，默认 `nginx.conf` 中关于 gzip 的配置如下：

```nginx
	##
	# Gzip Settings
	##

	gzip on;
	gzip_disable "msie6";

	# gzip_vary on;
	# gzip_proxied any;
	# gzip_comp_level 6;
	# gzip_buffers 16 8k;
	# gzip_http_version 1.1;
	# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

可以看到默认只开启了 `gzip on;`。而 nginx 默认只会对部分 MIME 类型进行压缩，所以这里的 JS、CSS 文件就被漏掉了。

## 解决

把默认配置中的 `gzip_types` 那行解开注释即可。其他配置也可以按需开启。
