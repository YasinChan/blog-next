---
date: 2024-04-11
head:
  - - meta
    - name: keywords
      content: typing, game, pk, WebSocket, Reflect, Proxy
  - - meta
    - name: description
      content: https://typing.yasinchan.com/ 比一比功能之 WebSocket 的使用
tag:
  - typing
  - Reflect
  - Proxy
  - game
  - websocket
sticky: true
excerpt: <p>打字网站 <a href="https://typing.yasinchan.com" target="_blank">Typing</a> 比一比功能介绍之 WebSocket 的使用</p>
---

# Typing 项目技术总结 - 比一比功能之 WebSocket 的使用

地址：[https://typing.yasinchan.com/game](https://typing.yasinchan.com/game)

源码：[https://github.com/YasinChan/typing](https://github.com/YasinChan/typing)

![](https://file.yasinchan.com/GGisDKdUAHVb92hrBoj5hgBwjcDiGoXj/3483647528.png)

::: tip
「比一比」是一个基于 WebSocket 实现的在线多人打字比赛功能。它覆盖了登录与非登录状态下的**创建、分享、进入、实时消息发送、准备、开始、结算**等完整游戏流程。
:::

<!-- ## websocket -->

要在前端实现一个在线实时游戏，可选的技术方案有不少，常见的包括：

1. WebSocket
2. WebRTC（Real-Time Communication）
3. Server-Sent Events（SSE）或 Long Polling
4. Message Queuing（MQ）或 Publish-Subscribe（Pub/Sub）模式
5. 轮询服务器

这里我选用的是 **WebSocket**。它能在浏览器和服务器之间建立一个交互式通信会话，可以主动向服务器发消息，也能接收事件驱动的响应，无需依赖轮询。

本文主要介绍项目中 WebSocket 在服务端与前端的具体开发方式。关于 WebSocket 的 API 细节，可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API)。

## 服务端

项目的服务端使用 Node.js。Node 没有原生的 WebSocket 实现，这里借助了 [ws](https://github.com/websockets/ws) 这个库：

```shell
pnpm i ws
```

### 初始化

Node 这边用的是 koa2，初始化方式如下：

```js
const Koa = require('koa');
const https = require('node:https');
const WebSocket = require('ws');

const app = new Koa();
const server = https.createServer(app.callback());
const wss = new WebSocket.Server({ port: 8989 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
  });

  ws.send('Hello, client!');
});
```

### nginx 配置

Node 启动后，再配合下面的 nginx 配置：

```nginx
server {
    listen       443 ssl http2;
    server_name  example.com;

    ...

    location /ws {
    	proxy_pass http://localhost:8989;
	    proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
    }
}
```

此时前端就可以通过 `wss://example.com/ws` 进行连接了。

### wss 和 ws

通常，WebSocket 的 URL 以 `ws://` 开头，而 `wss://` 是它的安全版本，使用了 TLS/SSL 加密——可以类比 `http://` 与 `https://` 的关系。上面 nginx 配置中的 `server` 监听 443 端口，并启用了 SSL 和 HTTP/2，因此该 `server` 下的所有路径都会走 HTTPS。

还有一点需要注意：和普通 HTTP 请求一样，WebSocket 连接也受同源策略限制。发起连接的页面的域名、协议和端口必须与服务器端 WebSocket 地址完全一致，否则会遇到跨域问题。所以相关接口也需要定义在同一个 `server` 中。

## 前端

按上面方式启动 Node 服务后，我们就拿到了 `wss://example.com/ws` 这个地址，可以用来建立前后端的 WebSocket 连接。

### 初始化

与 Node 不同，浏览器环境本身就提供了全局的 `WebSocket` 构造函数，无需额外引入库。初始化方式如下：

```ts
const wss = new WebSocket(`wss://example.com/ws?${参数}`);
// 连接打开时的事件
wss.onopen = function () {
  console.log('WebSocket 连接已打开！');
};
// 连接关闭时的事件
wss.onclose = function (e: CloseEvent) {
  console.log('WebSocket 连接已关闭！', e.code);
};
// 连接出错时的事件
wss.onerror = function (error: Error) {
  console.log('WebSocket 错误：' + error);
};
```

### 发送消息

```js
// 前端向后端发送消息，后端的 'message' 回调中将会接收到这里的消息
wss.send('xxx');

// 服务端发送消息的 api 也是 send，后文将具体介绍这块
```

### 前端传参与服务端获取

初始化时通常会有传参需求。我们可以在 wss 链接上拼接 query 参数，服务端解析 query 即可拿到对应的值。在 Node 环境下，query 可以从 `connection` 回调的第二个参数中读取到：

```js
// node 端
wss.on('connection', function connection(ws, req) {
  const url = new URL('wss://example.com/ws' + req.url);
  const searchParams = url.searchParams;

  const params = Array.from(searchParams.entries()).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

  const { 参数 } = params;
});
```

至此连接就建立完成了，控制台中可以看到相应日志。

## 场景分析

双端初始化讲完后，接下来结合本项目的实际场景做一些分析。

由于项目已经上线，这里直接根据成品进行逆向梳理。打开 [https://typing.yasinchan.com/game](https://typing.yasinchan.com/game) 可以看到：游戏流程是先设置配置创建房间，创建完成后可以邀请用户，或由其他用户通过房间列表加入。这意味着系统中需要同时存在多个房间。

![图片](https://file.yasinchan.com/DvgcN0BTCgLEXVxFxtAXeIMeh4Ok5UTI/321876292%20%281%29.png)

进入房间后，玩家可以**发送实时消息、查看消息列表、准备**；房主额外拥有**开始游戏、关闭房间、踢人**等权限；其他玩家则可以**退出房间**。

![](https://file.yasinchan.com/GGisDKdUAHVb92hrBoj5hgBwjcDiGoXj/3483647528.png)

输入开始后，玩家的输入进度还会实时同步给房间内的其他玩家。

### 关键点整理

#### 技术要求

技术实现上主要有三点：

1. 多个房间并行 WebSocket 且互相独立的设计与管理；
2. 实时消息传输又可以细分为：
   1. **状态同步**。比如已准备、取消准备、游戏开始/结束、加入/退出房间等，这些状态会同步呈现在消息框里；
   2. **消息同步**。即玩家发送的聊天内容，同样会出现在消息框中；
   3. **输入内容同步**。如前所述，玩家的输入会实时呈现在其他玩家的输入界面上，但不会出现在消息框中。
3. 房主关闭房间和玩家退出房间，对应的是前后端关闭 WebSocket 的处理。

#### 边界情况

此外还需要考虑一系列边界情况：

1. 房主已创建房间的情况下再次创建如何处理；
2. 房主或玩家在房间内刷新页面如何处理；
3. 房间已满时，仍有人通过分享链接进入如何处理；
4. 房间已关闭时，通过分享链接进入如何处理；
5. 房主关闭房间后，房间内其他玩家需要收到关闭通知；同理，玩家退出或被踢也需要通知其他人；
6. 房间超时管理。

下面就分别针对这三类技术问题和相关边界情况展开。

### 多房间场景下 WebSocket 解决方案

从服务端角度看，用户创建一个房间相当于启动一个 WebSocket 服务。直觉上似乎每个房间都应该对应一个独立的 WebSocket 服务——那么是不是每创建一个房间都要 `new` 一次 WebSocket 呢？

```js
// node 端创建 ws 服务
const server = https.createServer(app.callback());
const wss = new WebSocket.Server({ port: 8989 });
```

从这段代码和上面的 nginx 配置可以看出，服务的域名与启动端口、nginx 代理的域名是绑定的。如果每次创建房间都要 `new` 一次，就意味着每次都得从服务端获取一个新的域名或端口——无论是管理成本还是服务器压力都不划算。因此，这里的实现方式是把所有新建房间都统一放在同一个 `wss` 实例下管理。

为此，我在 Node 端定义了一个常量 `clients`，用于统一管理所有房间：

```js
/**
 * clients 的结构
 * {
 *   [id]: {
 *     player: {
 *       [name]: {
 *         ws,
 *         isOwner: boolean,
 *         isReady: boolean,
 *       }
 *     },
 *     index: number | string,
 *     countDown: number ｜ string,
 *     time: 0,
 *     count: 2,
 *   }
 * }
 */
const clients = new Map();
```

每次创建新房间，都会根据创建者的 userName 生成一个唯一 ID，另外还有创建阶段设置的文案 ID、倒计时时长、玩家数量等信息。这些信息会在前端初始化时作为 `query` 参数拼到 `wss://example.com/ws?` 后面。

服务端接着按 [#前端传参与服务端获取](#前端传参与服务端获取) 中所述的方式解析。

解析完成后，把唯一 ID 作为 key、其他信息作为 value，set 到 `clients` 上。房主和后续加入的玩家信息则作为 `player` 属性内容保存。

```js
wss.on('connection', function connection(ws, req) {
  const url = new URL('wss://example.com/ws' + req.url);
  const searchParams = url.searchParams;

  const params = Array.from(searchParams.entries()).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

  const id = params.id;

  ...

  const project = clients.get(id);
  if (!project) {

    // 没有读取到 id 则认为是房主创建的

    ...

    const obj = {
      /**
      * {
      *     player: {
      *       [name]: {
      *         ws,
      *         isOwner: boolean,
      *         isReady: boolean,
      *       }
      *     },
      *     index: number | string,
      *     countDown: number ｜ string,
      *     time: 0,
      *     count: 2,
      *   }
       */
      ...

    };

    clients.set(id, obj);
  } else {

    // 否则就是其他玩家加入房间

    ...
    // project.xxxx = xxx

  }

  ...

});
```

如上面代码所示，期间会区分处理房主和其他玩家的信息，并相应更新 `clients` 的内容。

:::tip
需要特别注意：`connection` 回调的第一个参数 `ws` 也要存进 `clients`。因为后续在收到前端 send 过来的消息并处理完之后，还需要主动向各端推送数据。这里的 `ws` 对应的就是本次连接的用户实例，把它与用户绑定后，后续就可以做细粒度的发送控制。
:::

### 实时消息的传输管理

前端通过 `wss.send(msg)` 发送消息，Node 端在 `message` 回调中接收：

```js
// node 端
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
  });
});
```

由于服务端只启动了一个实例，所有房间、所有用户发送的消息都会汇集到这同一个 `connection` 回调中。问题随之而来：

::: tip
如何区分**哪个房间**的**哪位玩家**发送的**什么类型**消息，又需要通知到**哪些玩家**？
:::

这里涉及四个关键点：**哪个房间**、**哪位玩家**、**什么类型**、**哪些玩家**，下面逐一拆解。

前三点需要前端在 `wss.send()` 时把必要的信息一并传过来：

```ts
// 前端
wss.send(
  JSON.stringify({
    id: id,
    name: name,
    info: info,
  })
);
```

服务端在 `message` 回调中解析这段信息：

```js
ws.on('message', function incoming(message) {
  /**
   *  {
   *    id: string,
   *    name: string,
   *    info: string,
   *    typing: {
   *      len: number,
   *      accuracy: string
   *    },
   *    action: []
   *  }
   */
  const info = JSON.parse(message);
});
```

注意上面这段代码中的注释，对照前面提到的三点来看：

1. **状态同步**

   通过注释里的 `action` 字段传输，比如已准备、取消准备等。

2. **消息同步**

   对应的是 `info` 字段。

3. **输入内容同步**

   玩家的输入会实时呈现在其他玩家的界面上：

   ![alt text](https://file.yasinchan.com/uy54BGpiRkhBCouAUmgtYd2TyplpTGHh/988799945%202.png)

   这里通过 `typing` 字段进行传输和渲染。

服务端接收到信息并做相应处理后，往往还需要把结果推给前端。这时就要用到 `clients` 中存储的各用户 ws 对象，分别向他们发送消息：

```js
ws.on('message', function incoming(message) {
  const info = JSON.parse(message);
  const currentProject = clients.get(info['id']);
  for (let w in currentProject.player) {

    ...

    // node 端通过这样，向各个用户的浏览器发送消息。
    // 当然这里也可以根据各自的情况选择性的发送。
    currentProject['player'][w]['ws'].send(JSON.stringify({

      ...

    }));
  }
});
```

### 房间关闭与玩家退出

这部分涉及 WebSocket 服务前后端的关闭触发与回调。

房主关闭房间时，前端直接调用：

```ts
// 前端
wss.close(3000, id);
```

服务端就会触发 `close` 回调：

```js
// node
ws.on('close', (code, reason) => {

  ...

});
```

在回调中根据两个参数，删除 `clients` 里对应的房间信息。

而其他玩家触发「退出房间」时，则是发送一条带 `action: ['exit']` 的消息：

```ts
// 前端
wss.send(
  JSON.stringify({
    id: id,
    name: name,
    action: ['exit'],
    info: `退出房间`,
  })
);
```

服务端按前面介绍的方式，根据 `action` 中的 `exit` 把 `clients` 里对应玩家的数据删除即可。

### 边界情况

这里主要聊一下超时管理。

服务端的 WebSocket 服务在 Node 启动时就一并启动，后续新增的房间都保存在 `clients` 中。这意味着我们需要手动清理这些数据。由于是浏览器里的游戏，玩家没主动关闭房间时，服务端是无从感知的——比如房主打完直接关掉网页，或者断网等意外情况，服务端都不知道这个房间是否还需要保留。如果不做处理，除非重启 Node，否则房间信息会一直堆在 `clients` 里。

为此需要一个机制：一段时间内无活动则主动关闭房间。我这里设置的是五分钟无操作就关闭。

由于前端的 ws 活动反映到服务端都会改变 `clients` 中对应的数据，所以这里我用 `Proxy` 代理 `clients` 的内容。代理的时机如下：

```js
wss.on('connection', function connection(ws, req) {

  ...

  if (!project) {

    ...

    const obj = watchObjectWithTimeout(
        {
          player: {
            [name]: {
              ws,
              isOwner: true,
              isReady: false,
            },
          },
          index: index,
          countDown: countDown,
          time: Date.now(),
          count: count,
        },
        LEFT_TIME,
        (type) => {
          // 回调

          ...

          clients.delete(id);
        },
      );
      clients.set(id, obj);
  } else {

    ...


  }

  ...

});
```

`watchObjectWithTimeout` 的作用是给对象加一层代理：每当对象发生变化时执行回调。目的是让每个 WebSocket 房间在 5 分钟内没有任何操作时，被自动关闭并清理。

```js
function watchObjectWithTimeout(obj, timeout = 5 * 60 * 1000, callback) {
  let lastChangeTimestamp = Date.now();
  let timeoutIdRemind = null;
  let timeoutId = null;
  const remindTimeout = timeout - 5 * 1000;
  const handler = {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      clearTimeout(timeoutIdRemind); // 清除旧的定时器
      clearTimeout(timeoutId); // 清除旧的定时器
      Reflect.set(target, prop, value, receiver); // 先设置值
      lastChangeTimestamp = Date.now(); // 更新最后更改时间戳

      timeoutIdRemind = setTimeout(() => {
        if (Date.now() - lastChangeTimestamp >= remindTimeout) {
          callback('remind'); // 执行回调，传递发生变化的属性名
        }
      }, remindTimeout);

      // 设置新的定时器，检查是否超时
      timeoutId = setTimeout(() => {
        if (Date.now() - lastChangeTimestamp >= timeout) {
          callback(prop); // 执行回调，传递发生变化的属性名
        }
      }, timeout);

      return true;
    },
  };

  timeoutIdRemind = setTimeout(() => {
    if (Date.now() - lastChangeTimestamp >= remindTimeout) {
      callback('remind'); // 执行回调，传递发生变化的属性名
    }
  }, remindTimeout);

  timeoutId = setTimeout(() => {
    if (Date.now() - lastChangeTimestamp >= timeout) {
      callback(); // 执行回调，传递发生变化的属性名
    }
  }, timeout);

  return new Proxy(obj, handler);
}
```
