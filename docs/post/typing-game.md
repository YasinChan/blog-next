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
「比一比」，是一个基于 websocket 实现的在线多人打字比赛的功能。包括登录与非登录状态下的**创建、分享、进入、实时消息发送、准备、开始、结算**等完整的游戏流程。
:::

<!-- ## websocket -->

如果要前端实现一个在线实时的游戏，可以用到包括但是不限于以下的几种技术：

1. WebSocket
2. WebRTC (Real-Time Communication)
3. Server-Sent Events (SSE) 或 Long Polling
4. Message Queuing (MQ) 或 Publish-Subscribe (Pub/Sub) 模式
5. 轮询服务器

这里我主要是用的是**WebSockets**，WebSockets 可以在用户的浏览器和服务器之间打开交互式通信会话。使用此 API，你可以向服务器发送消息并接收事件驱动的响应，而无需通过轮询服务器的方式以获得响应。

本文将主要介绍项目中对于 WebSockets 在服务端与前端的开发方式，关于 WebSockets 的 API，可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API)

## 服务端

项目的服务端是使用的 Node.js，Node 端是没有原生 WebSocket 的，这里我使用了库：[https://github.com/websockets/ws](https://github.com/websockets/ws)来实现 WebSocket 的功能。

```shell
pnpm i ws
```

### 初始化

这里的 node 使用的是 koa2，所以初始化方式如下：

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

启动 node 后，配合 nginx 相关配置：

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

此时前端可以通过 `wss://example.com/ws` 来进行链接

### wss 和 ws

通常，WebSocket 的 URL 使用 ws:// 开头，而 wss:// 则是 ws:// 的安全版本，它使用了 TLS/SSL 加密，以确保通信的安全性。因此，wss:// 的协议地址就类似于 https:// 的安全版本，上面 nginx 中的配置可以看到这个 `server` 是监听端口 443，来启用 SSL 和 HTTP/2 的部分，同理对于该 `server` 下的路径都将会使用 https。

需要注意的一点是与普通的 HTTP 请求一样，WebSocket 连接也受到同源策略的限制。同源策略要求 WebSocket 连接的源（即发起连接的页面的域名、协议和端口）必须与服务器端 WebSocket 的地址完全一致，否则会遇到跨域访问问题，所以相关接口也需要定义在上述的 `server` 中。

## 前端

通过上述定义启动 node 服务后，我们就有了 `wss://example.com/ws` 地址可以用来进行前后端的 WebSocket 连接。

### 初始化

与 node 环境不同的是，浏览器环境本身就有了全局的 WebSocket 构造函数，不需要引入其他的库。由此，我们可以通过如下方式进行初始化

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

在初始化过程中，会有传参需求。我们可以通过在 wss 链接上加上 query 进行参数传递，服务端可以通过解析 query 获取参数值进行相关操作，node 环境下 query 可以在 connection 事件回调中的第二个参数内读取到：

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

通过以上，连接完成，将在控制台看到相关日志。

## 场景分析

说完双端初始化，接下来便是对本项目所使用的场景进行分析开发了。

因为本项目已经完成，我们就直接根据完成好的内容进行逆向分析。正如 [https://typing.yasinchan.com/game](https://typing.yasinchan.com/game) 所见，整个游戏过程包括设置配置进行创建，创建完成后可以邀请用户或者用户通过房间列表加入房间。这意味着需要同时存在很多房间。

![图片](https://file.yasinchan.com/DvgcN0BTCgLEXVxFxtAXeIMeh4Ok5UTI/321876292%20%281%29.png)

在进入房间后，会有**发送实时消息、消息列表、准备**等功能，对于房主有**开始游戏、关闭房间、踢人**等功能，其他玩家也会有**退出房间**等功能。

![](https://file.yasinchan.com/GGisDKdUAHVb92hrBoj5hgBwjcDiGoXj/3483647528.png)

在进行输入操作后，还实时同步输入进度，其他玩家都可以看到进度。

### 关键点整理

#### 技术要求

总结以上内容，技术实现上主要为三点：

1. 多个房间并行 WebSocket 且各自独立如何进行设计管理；
2. 实时消息传输会分为三点：
   1. 状态同步。如已准备、取消准备、游戏开始/结束、加入/退出房间等状态，这些状态也会在实时消息框中呈现；
   2. 消息同步。如发送的实时消息内容，同上这些状态也会在实时消息框中呈现；
   3. 输入内容的同步。正如上面所说，玩家的输入操作都会实时在其他玩家的输入界面呈现，但不会在实时消息框中呈现。
3. 房主关闭房间，和玩家退出房间，对应的是前后端关闭 WebSocket 的情况。

#### 边界情况

另外还需要关注边界情况：

1. 房主已经创建了房间的情况下再次创建如何处理；
2. 房主或者玩家在房间内刷新了页面后如何处理；
3. 房间人满了，还有人根据分享链接进入后如何处理；
4. 房间被关闭了，通过分享链接进入后如何处理；
5. 房主关闭房间后，房间内的玩家也需要接收到相关关闭通知，同理玩家退出房间或者被房主踢出房间也需要通知其他人；
6. 房间超时管理；

我们分别解决下上述三种技术问题和相关边界情况：

### 多房间场景下 WebSocket 解决方案

从服务端角度来看，当用户创建了一个房间，意味着是启动了一个 WebSocket 服务。可能一般我们会认为，每个房间都应该对应一个新的 WebSocket 服务。那么是不是意味着每创建一个房间，都要 new 一次 WebSocket 呢？

```js
// node 端创建 ws 服务
const server = https.createServer(app.callback());
const wss = new WebSocket.Server({ port: 8989 });
```

如这段代码以及上面 nginx 配置可以看出，创建的服务域名是跟所启动的端口以及 nginx 代理的域名相关的，所以如果要每次创建房间都 new 一次的话，意味着创建之前都需要从服务端获取其单独启动的一个新的域名或者端口，这样无论是管理起来还是对服务器的压力都有影响。所以，这里我的实现方式是新创建的房间都统一在这 `wss` 一个实例下进行管理。

为此，我在 node 端定义了一个常量 `clients`，用于房间的管理

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

每创建一个新的房间，都会根据创建者的 userName 生成一个唯一 ID，另外还有创建阶段设置的文案 id，倒计时时长，玩家数量的信息，这些信息就会在上述的前端初始化过程中作为 `query` 参数拼接到 `wss://example.com/ws?` 后面。

接着就是 [#前端传参与服务端获取](#前端传参与服务端获取) 中所述的解析。

当解析到相关数据后，便会将唯一 ID 作为 key ，其他信息作为 value，被 set 到 `clients` 上。而房主和后来加入的玩家信息则作为 `player` 属性的内容被保存。

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

如上述代码，期间会处理相关房主和其他玩家的信息，然后改变 `clients` 的信息。

:::tip
需要注意的是，本次 `connection` 回调的第一个参数 `ws` 也需要保存到 `clients` 中，因为后续接收到前端 send 过来的信息处理后，还是会有发送出去的需求。这里的 `ws` 就是对应创建本次连接的用户 ws 实例，这里与该用户进行绑定后，后面就可以颗粒度控制。
:::

### 实时消息的传输管理

前端通过 `wss.send(msg)` 的方式发送消息，node 端将会在 `message` 的回调中接收消息

```js
// node 端
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
  });
});
```

由于服务端只启动了一个实例，意味着所有房间的所有用户发送的消息，都会在这个唯一的 `connection` 回调中接收到。现在的问题便是：

::: tip
如何区分是**哪个房间**的**哪位玩家**发送的**什么类型**消息，又是需要通知到**哪些玩家**。
:::

这里有四个关键点：**哪个房间**、**哪位玩家**、**什么类型**、**哪些玩家**，我们一一说道。

关于前三点，我们需要在前端 `wss.send()` 时将必要的信息也传输进来，可以通过

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

这样将信息传输到服务端，在服务端 `message` 的回调中解析

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

上面这段代码中的注释注意下，接着我们说上面提到的三点

1. 状态同步

   我是通过这段注释中的 `action` 字段进行传输的，比如已准备、取消准备这些。

2. 消息同步

   这个就是 `info` 字段

3. 输入内容的同步

   玩家的输入操作都会实时在其他玩家的输入界面呈现，
   ![alt text](https://file.yasinchan.com/uy54BGpiRkhBCouAUmgtYd2TyplpTGHh/988799945%202.png)
   我这里是通过 `typing` 字段来进行传输和渲染。

服务端接收到相关信息后，也会有部分处理后需要发送到前端，这里我们就需要用到 clients 中存储的各位用户的 ws 对象来进行各自的控制。

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

### 房间关闭和玩家退出房间

这里就涉及到 ws 服务前后端关闭的触发和回调了。

房主关闭房间，则直接在前端

```ts
// 前端
wss.close(3000, id);
```

即可，服务端将会触发 `close` 回调

```js
// node
ws.on('close', (code, reason) => {

  ...

});
```

在回调中根据两个参数，删掉对应 `client` 中的信息。

而其他玩家触发「退出房间」，则是

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

服务端则会通过上述的方式，根据 `action` 的 `exit` 将 `clients` 中相关玩家数据删除。

### 边界情况

这里我们主要说超时管理。

我们知道，这个服务端的 WebSocket 服务是在 node 服务启动是时候就会启动，后续新增的房间都是保存在 `clients` 中的。这意味着我们需要手动去清理 `clients` 中的数据。由于是浏览器中的游戏，我们没有办法在玩家没有主动触发关闭房间的情况下知道房间是否需要关闭，说人话就是房主很有可能玩结束了直接就关闭网页了，也可能是断网了等其他意外情况，导致服务端也不知道这个这个房间是否需要关闭。如果我们不做处理，除非重启 node 服务，否则该房间信息将会一直保存在 `clients` 中。

为此，需要一个无活动超过一段时间主动关闭房间的机制，我这里定的是五分钟无操作则会关闭。

因为前端的 ws 活动反应到服务端都会改变 clients 中对应的数据，所以我这里是利用的 `proxy` 代理了 `clients` 中的内容，代理的时机就是

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

`watchObjectWithTimeout` 方法，则是将这个对象进行代理，当对象发生变化时，执行回调。目的是每次开的 websocket 房间若在 5 分钟内没有操作，则需要关闭清理。

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
