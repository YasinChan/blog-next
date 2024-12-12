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

# DNSPod 配置 acme.sh 步骤

## DNSPod 和 acme.sh

[acme.sh](acme.sh) 是一个轻量级的 ACME 协议客户端，用于通过自动化方式申请和管理 SSL/TLS 证书，比如来自 Let’s Encrypt 的免费证书。它支持各种环境，适合自动化申请和续期证书。

[DNSPod](https://www.dnspod.cn/) 是一家提供 DNS 解析服务的公司，提供一系列域名解析解决方案，以确保域名解析的可靠性和快速性，目前已是腾讯云的一部分。我目前的域名解析使用的是这个，所以下面介绍一下使用 acme.sh 与 DNSPod 配置自动化的 SSL/TLS 证书颁发的步骤。

## 步骤

> 参考官方文档 https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E
