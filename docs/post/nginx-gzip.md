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

# nginx 关于 gzip 压缩的相关配置

## 问题

最近 [typing](https://typing.yasinchan.com) 项目中发现页面加载很慢，调试发现 js 文件有 1.4M。，相关的 js css 文件没有被开启 gzip 压缩，不过项目是使用 vite 开发的，默认是会开启 gzip 压缩，本地页面调试发现是开启了 gzip 的，但是上线之后却没有生效。

## 原因

在调试之后发现，由于线上是使用 nginx 做的代理，因此是 nginx 中的相关配置问题导致 gzip 没有生效。

一般在我们安装 nginx 后，默认 `nginx.conf` 文件中关于 gzip 相关的配置如下

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

发现这里默认只会开启 `gzip on;`。不过 `Nginx` 默认只对部分 MIME 类型进行压缩，所以这里的 js 和 css 文件没有被压缩到。

因此，我们需要将默认配置中的 `gzip_types` 放开。当然，其他配置也可以选择性的放开。
