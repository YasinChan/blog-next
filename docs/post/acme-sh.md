---
date: 2024-08-18
head:
  - - meta
    - name: keywords
      content: acme
  - - meta
    - name: description
      content: DNSPod 配置 acme.sh 步骤
tag:
  - acme
  - DNSPod
  - 腾讯云
sticky: true
excerpt: ''
---

# 用 acme.sh 在 DNSPod 上自动签发 SSL/TLS 证书

## DNSPod 和 acme.sh

[acme.sh](acme.sh) 是一个轻量级的 ACME 协议客户端，用于自动化申请和管理 SSL/TLS 证书，例如来自 Let's Encrypt 的免费证书。它兼容多种运行环境，很适合用来自动化签发与续期。

[DNSPod](https://www.dnspod.cn/) 是一家提供 DNS 解析服务的公司，目前已是腾讯云的一部分。它提供一系列域名解析方案，以保证解析的稳定与速度。

我目前的域名解析就在 DNSPod 上，下面记录一下用 acme.sh 配合 DNSPod 自动签发 SSL/TLS 证书的步骤。

## 步骤

> 参考官方文档 https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E
