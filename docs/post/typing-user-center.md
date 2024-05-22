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

本项目有一个完整的用户中心模块，包含了用户注册、登录、找回密码、修改密码、绑定邮箱、退登的完整链路。除此之外，用户中心中还包含了自动生成的用户头像，用户历史打字记录列表等功能。下面，我将分享一下这里面的技术。

## 为什么要个人中心

我这个网站的开发初衷就是网站浏览者都可以使用所有功能（[玩一玩](https://typing.yasinchan.com/game)功能由于目前服务器资源有限，为限制人数，暂时需要登录才可以用），不过由于本站具有排行榜等需要记录的场景，所以设计了这套个人中心。不过在设计时，是完全注重到了个人隐私的隔离措施，这也是开发的一个宗旨，下文也会结合隐私逻辑进一步展开说说可以做哪些措施。

## 注册与登录

这点老生常谈，没啥特别的，就是在实现的时候需要注意几点：

1. 用户名、密码的前端与后端校验，与此对应的就是前端校验错误的提醒与后端校验错误的接口返回；
2. 注册时用户名是否重复，在服务端需要在对应中间件中做校验；
3. 密码加密，这点可以细说一下

### 密码加密

密码加密一般来说就是为了保护用户信息安全，增加系统安全性。很多人在注册账户的时候，都会习惯于用自己常用的密码，一旦被不怀好意的人发现，结合账户拥有者的信息，就能破解其他账户。同时，对于我这个小网站而言，这种行为更多的也是培养我们开发者自身的开发习惯与思维，在开发过程中也能获得一些其他的技术的提高。

我这里使用的是[bcryptjs](https://github.com/dcodeIO/bcrypt.js)，这是一种单向 hash 加密的工具，不可反向破解生成密码明文。所以对于本站而言，数据库中储存的加密字符串是无法反向得到密码明文的。因此，本站是无法「找回密码」的。那么，对于用户忘记密码的情况，该如何处理呢？

## 重置密码机制

常见的重新创建密码，可以通过向邮件或者手机发送验证码的方式来实现。不过这种方式必然需要用户将其邮箱或者手机号记录到页面中，这种本身就是一个个人信息的暴露，另外也会增加很多额外的成本，尤其是对于我这样的小网站而言，用户肯定不愿意花很多时间在设置这些弯弯绕绕的东西上面。另外，发送验证码的机制也是一个成本。

为此，我这里使用了一套**密保问题**的机制。在登录之后，在个人中心可以设置密保问题与答案，在下次登录时忘记密码时可以通过回答问题的方式重新设置密码。

## 登录持久化与 jwt

用户在登录之后会记住登录状态，下次打开时就可以不用再次登录了。这里的实现方式是服务端

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

在登录成功时，会将 jwt 记录到 token 中。

前端在每次进入页面时都会请求一个 `/api/users/me` 接口，用来获取个人信息，这是通过 token 中记录的 jwt 来做的校验。

### jwt

JWT 由三部分组成，通过.分隔：

1. Header（头部）：描述 JWT 的元数据，通常包含两部分：类型（typ，默认为 JWT）和签名所用的算法（如 HS256, RS256 等）。
2. Payload（载荷）：包含声明（claims），即传输的数据。这部分可以包含用户的身份信息、过期时间、发行者等。JWT 的这一部分是可被解码查看的，但不应包含敏感信息。
3. Signature（签名）：用于验证 JWT 的完整性和来源。签名是通过将 Header、Payload 以及一个秘钥（使用 Header 中指定的算法）进行加密计算得出的。

上面的代码中可以看到 `JWT_SECRET` 就是我们自己约定好的密钥，是不可以暴露出去的。

## 头像生成

其实在开发个人中心之前我就意识到传统头像会是一个比较大的成本，如果用户可以自己上传头像，无论是图床、cdn、存储都会有一定的压力。因此，我这里放弃了上传图片的形式，而是看看能不能根据一个唯一标识生成一个 svg 或者 canvas 或者 base64 图片的头像。

### Gravatar

> Gravatar 是 "Globally Recognized Avatar" 的缩写，是一项全球通用的头像服务。这项服务由 Automattic 公司运营，主要目的是为用户提供一个统一的在线身份标识。用户可以在 Gravatar 的网站上注册一个账号，并将自己选择的头像与个人电子邮件地址关联起来。一旦设置了 Gravatar 头像，当用户在支持 Gravatar 的网站或平台上留言、发表文章或参与讨论时，只要提供了关联了该头像的电子邮件地址，该头像就会自动显示在用户的个人资料或评论旁。

> Gravatar 的好处在于它提供了一种便捷的方式，让用户能够跨多个平台维持一致的视觉身份，无需在每个网站或服务上分别上传和管理头像。此外，Gravatar 还允许用户为自己的头像分配不同的年龄评级，以便于网站根据内容政策展示合适的头像。许多博客平台、论坛软件和内容管理系统（如 WordPress）都默认集成了 Gravatar 支持。

这本可以实现我的需求，不过由于是海外站点，生成的图片地址国内访问受限。我也尝试找过国内的几家镜像源，不过都是多年以前的，现在也都挂掉了，因此我放弃了这个好东西。当然，各位也可以自己尝试：[https://www.gravatar.com/avatar/](https://www.gravatar.com/avatar/)。

### jdenticon

后来经过多方尝试，我选用了[jdenticon](https://github.com/dmester/jdenticon)来实现我的需求。

```ts
import { toSvg } from 'jdenticon';

export function generateAvatar(name: string, size: number = 40) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(toSvg(name, size))}`;
}
```

本站的用户名本身就是唯一的，所以我这里配合用户名，在运行时生成了头像图片，达到了我的目的。

## 用户名密码自动填充

在浏览器中（如 Chrome），在我们登录时，浏览器会提示是否记住账户密码，方便下次登录之前可以自动填入。这里可以配合 `form` 表单提交实现：

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

这样，我们便能利用到浏览器的账户密码记录与自动填充功能了，我的具体实现可以参考[代码](https://github.com/YasinChan/typing/blob/2e429a9ff1f0b08a40ca28d663a0e194411a3937/src/components/Auth.vue#L389)。

## ip2region

这里说个题外话，各位会发现[排行榜页面](https://typing.yasinchan.com/leaderboard)，或者未登录时建议与反馈会显示对应的 IP 地址，这个又是如何实现的呢。

其实最初想要实现这个，也是为了不做登录功能，直接就可以根据 IP 地址对应的省份来做用户区分。当时是调研到了[ip2region](https://github.com/lionsoul2014/ip2region)框架，在 node 端配合 `request header` 中的 IP 地址，即可获得对应的省份，配合根据 IP 地址生成的一个长度为 4 的字符串，从而获得一个“唯一”名称（这里“唯一”加上双引号原因如下代码注释），如 `来自上海的网友 - b122`。

```js
// 根据 ip 生成长度为 4 的字符串的方法
function generateShortenedId(inputStr) {
  const hash = createHash('md5').update(inputStr).digest('hex');
  // 截取前4个字符作为唯一标识（注意：这不保证绝对唯一）
  return hash.substring(0, 4);
}
```

## 总结

个人中心是个复杂工程，除了以上这些以外，还有与其他信息相绑定和其他各种边界情况需要处理。在自己上手之后，可以更加深入的了解和理解这里面的机制，对技术和产品系统思维的成长大有裨益。
