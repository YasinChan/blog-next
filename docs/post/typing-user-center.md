---
date: 2024-05-22
head:
  - - meta
    - name: keywords
      content: typing, user center, login, register, jwt, Gravatar, jdenticon, ip2region
  - - meta
    - name: description
      content: https://typing.yasinchan.com/ 用户中心介绍
tag:
  - typing
  - login
  - register
  - user center
  - jwt
  - 产品
sticky: true
excerpt: <p>打字网站 <a href="https://typing.yasinchan.com" target="_blank">Typing</a> 用户中心逻辑</p>
---

# Typing 项目技术总结 - 用户中心逻辑

地址：[https://typing.yasinchan.com](https://typing.yasinchan.com)

源码：[https://github.com/YasinChan/typing](https://github.com/YasinChan/typing)

本项目实现了一套完整的用户中心模块，覆盖注册、登录、找回密码、修改密码、绑定邮箱、退登的全链路，此外还包含自动生成头像、历史打字记录列表等功能。下面分享其中的几处技术细节。

## 为什么要做个人中心

网站的初衷是让所有访客都能使用全部功能（[玩一玩](https://typing.yasinchan.com/game) 因服务器资源有限，暂时需要登录才能使用）。但站内有排行榜等需要持久化记录的场景，所以才设计了这套个人中心。

设计过程中，**用户隐私的隔离**是一个核心宗旨。下文也会结合隐私逻辑展开说说具体做了哪些措施。

## 注册与登录

注册与登录是老生常谈，实现时主要注意几点：

1. 用户名、密码的前后端校验，以及与之对应的前端错误提示与后端接口返回；
2. 注册时用户名的重复校验需要在服务端中间件中完成；
3. 密码加密，这点值得展开说一下。

### 密码加密

密码加密的目的是保护用户信息、提升系统安全性。很多人注册账户时习惯使用自己常用的密码，一旦泄露，结合账户拥有者的其他信息，就可能被用来破解其他平台的账户。即便是这样的小网站，做好加密也是培养良好开发习惯、积累技术经验的过程。

我这里使用的是 [bcryptjs](https://github.com/dcodeIO/bcrypt.js)，这是一种单向 hash 加密工具，无法反向还原出密码明文。也就是说，数据库里存储的加密字符串无法被反推回原始密码，本站也因此**无法实现传统意义上的「找回密码」**。那么，用户忘记密码时该怎么办呢？

## 重置密码机制

常见的做法是通过邮箱或短信发送验证码来重置密码。但这条路径要求用户先把邮箱或手机号填进系统，本身就是一次个人信息的暴露；同时验证码下发也是一笔不小的成本。对于这样一个小网站而言，让用户花时间走完这套流程也并不友好。

为此，我采用了一套**密保问题**机制：用户登录后可以在个人中心设置密保问题与答案，下次忘记密码时通过回答问题就能重新设置密码。

## 登录持久化与 JWT

用户登录后会记住登录状态，下次打开无需再次登录。具体实现是在服务端：

```js
// 服务端在登录接口调用成功时
// koa2
const token = jwt.sign(
  {
    id: userInfo[0].id,
  },
  JWT_SECRET,
  {
    // expiresIn: '1d' // 这里是设置过期时间，不设置就是永久有效。
  }
);

ctx.cookies.set('token', token, {
  // maxAge: 10 * 60 * 1000, // cookie有效时长
  // expires: new Date('2017-02-15'),  // cookie失效时间
  httpOnly: true, // 是否只用于http请求中获取
  overwrite: true, // 是否允许重写
});
```

登录成功时，将 JWT 写入 token Cookie。

前端每次进入页面都会请求一次 `/api/users/me` 接口来获取个人信息，校验依据正是 Cookie 中携带的这个 JWT。

### JWT 结构

JWT 由三部分组成，使用 `.` 分隔：

1. **Header（头部）**：描述 JWT 的元数据，通常包含两部分——类型（`typ`，默认为 JWT）和签名所用的算法（如 HS256、RS256 等）。
2. **Payload（载荷）**：包含声明（claims），即传输的数据，可以放用户身份信息、过期时间、发行者等。这部分是可被解码查看的，因此**不应包含敏感信息**。
3. **Signature（签名）**：用于验证 JWT 的完整性与来源，由 Header、Payload 以及一个密钥按 Header 指定的算法计算得出。

上面代码里的 `JWT_SECRET` 就是我们约定好的密钥，绝不能暴露。

## 头像生成

开发个人中心之前我就意识到，传统头像方案的成本不低：一旦允许用户上传，图床、CDN、存储都会有压力。因此我放弃了上传图片的方案，转而思考能否用一个唯一标识来生成一张 SVG、canvas 或 base64 头像。

### Gravatar

> Gravatar 是 "Globally Recognized Avatar" 的缩写，是一项全球通用的头像服务。这项服务由 Automattic 公司运营，主要目的是为用户提供一个统一的在线身份标识。用户可以在 Gravatar 的网站上注册一个账号，并将自己选择的头像与个人电子邮件地址关联起来。一旦设置了 Gravatar 头像，当用户在支持 Gravatar 的网站或平台上留言、发表文章或参与讨论时，只要提供了关联了该头像的电子邮件地址，该头像就会自动显示在用户的个人资料或评论旁。

> Gravatar 的好处在于它提供了一种便捷的方式，让用户能够跨多个平台维持一致的视觉身份，无需在每个网站或服务上分别上传和管理头像。此外，Gravatar 还允许用户为自己的头像分配不同的年龄评级，以便于网站根据内容政策展示合适的头像。许多博客平台、论坛软件和内容管理系统（如 WordPress）都默认集成了 Gravatar 支持。

Gravatar 本来是个不错的选择，但它是海外站点，生成的图片地址在国内访问受限。我也找过几家国内镜像源，但都是多年前的项目，现在基本都挂了，所以只好放弃。感兴趣的可以自己试试：[https://www.gravatar.com/avatar/](https://www.gravatar.com/avatar/)。

### jdenticon

经过多方尝试，我最终选用了 [jdenticon](https://github.com/dmester/jdenticon)。

```ts
import { toSvg } from 'jdenticon';

export function generateAvatar(name: string, size: number = 40) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(toSvg(name, size))}`;
}
```

本站的用户名本身就是唯一的，所以以用户名为种子，在运行时即可生成专属头像，刚好满足需求。

## 用户名密码自动填充

在 Chrome 等浏览器中登录时，浏览器会提示是否记住账户密码，方便下次自动填入。要触发这一行为，需要配合标准的 `form` 表单提交：

```html
<form id="login-form" action="POST" @submit.prevent="login">
  <input
    type="text"
    placeholder="用户名"
  ></input>
  <input
    type="password"
    placeholder="密码"
  ></input>
</form>
```

这样就能复用浏览器自带的账户密码记录与自动填充能力。具体实现可以参考[这段代码](https://github.com/YasinChan/typing/blob/2e429a9ff1f0b08a40ca28d663a0e194411a3937/src/components/Auth.vue#L389)。

## ip2region：根据 IP 推断归属地

说个题外话。访问 [排行榜页面](https://typing.yasinchan.com/leaderboard)，或者未登录时提交建议与反馈，会看到一个带 IP 归属地的标识，这是怎么做的？

最初做这件事是想绕开登录、直接通过 IP 所属省份来区分用户。当时调研到了 [ip2region](https://github.com/lionsoul2014/ip2region)：在 Node 端拿到 `request header` 中的 IP，就能查到对应的省份；再用 IP 生成一个 4 位长度的字符串，就能拼出一个“唯一”的访客名称——比如 `来自上海的网友 - b122`（这里“唯一”加引号的原因见下方代码注释）。

```js
// 根据 ip 生成长度为 4 的字符串的方法
function generateShortenedId(inputStr) {
  const hash = createHash('md5').update(inputStr).digest('hex');
  // 截取前4个字符作为唯一标识（注意：这不保证绝对唯一）
  return hash.substring(0, 4);
}
```

## 总结

个人中心其实是一个相当复杂的工程，除了上面这些点，还会涉及大量信息绑定与边界情况的处理。亲自动手实现一遍，能对其中的机制理解得更深，对技术能力与产品系统思维的成长都大有裨益。
