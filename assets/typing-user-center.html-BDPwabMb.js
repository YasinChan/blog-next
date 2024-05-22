import{_ as p,r as o,o as l,c,a as n,b as a,d as t,e}from"./app-B5fP3dJT.js";const i={},r=n("h1",{id:"typing-项目技术总结-用户中心逻辑",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#typing-项目技术总结-用户中心逻辑"},[n("span",null,"Typing 项目技术总结 - 用户中心逻辑")])],-1),u={href:"https://typing.yasinchan.com",target:"_blank",rel:"noopener noreferrer"},d={href:"https://github.com/YasinChan/typing",target:"_blank",rel:"noopener noreferrer"},k=n("p",null,"本项目有一个完整的用户中心模块，包含了用户注册、登录、找回密码、修改密码、绑定邮箱、退登的完整链路。除此之外，用户中心中还包含了自动生成的用户头像，用户历史打字记录列表等功能。下面，我将分享一下这里面的技术。",-1),h=n("h2",{id:"为什么要个人中心",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#为什么要个人中心"},[n("span",null,"为什么要个人中心")])],-1),v={href:"https://typing.yasinchan.com/game",target:"_blank",rel:"noopener noreferrer"},m=n("h2",{id:"注册与登录",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#注册与登录"},[n("span",null,"注册与登录")])],-1),g=n("p",null,"这点老生常谈，没啥特别的，就是在实现的时候需要注意几点：",-1),b=n("ol",null,[n("li",null,"用户名、密码的前端与后端校验，与此对应的就是前端校验错误的提醒与后端校验错误的接口返回；"),n("li",null,"注册时用户名是否重复，在服务端需要在对应中间件中做校验；"),n("li",null,"密码加密，这点可以细说一下")],-1),_=n("h3",{id:"密码加密",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#密码加密"},[n("span",null,"密码加密")])],-1),f=n("p",null,"密码加密一般来说就是为了保护用户信息安全，增加系统安全性。很多人在注册账户的时候，都会习惯于用自己常用的密码，一旦被不怀好意的人发现，结合账户拥有者的信息，就能破解其他账户。同时，对于我这个小网站而言，这种行为更多的也是培养我们开发者自身的开发习惯与思维，在开发过程中也能获得一些其他的技术的提高。",-1),y={href:"https://github.com/dcodeIO/bcrypt.js",target:"_blank",rel:"noopener noreferrer"},j=e(`<h2 id="重置密码机制" tabindex="-1"><a class="header-anchor" href="#重置密码机制"><span>重置密码机制</span></a></h2><p>常见的重新创建密码，可以通过向邮件或者手机发送验证码的方式来实现。不过这种方式必然需要用户将其邮箱或者手机号记录到页面中，这种本身就是一个个人信息的暴露，另外也会增加很多额外的成本，尤其是对于我这样的小网站而言，用户肯定不愿意花很多时间在设置这些弯弯绕绕的东西上面。另外，发送验证码的机制也是一个成本。</p><p>为此，我这里使用了一套<strong>密保问题</strong>的机制。在登录之后，在个人中心可以设置密保问题与答案，在下次登录时忘记密码时可以通过回答问题的方式重新设置密码。</p><h2 id="登录持久化与-jwt" tabindex="-1"><a class="header-anchor" href="#登录持久化与-jwt"><span>登录持久化与 jwt</span></a></h2><p>用户在登录之后会记住登录状态，下次打开时就可以不用再次登录了。这里的实现方式是服务端</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 服务端在登录接口调用成功时</span>
<span class="token comment">// koa2</span>
<span class="token keyword">const</span> token <span class="token operator">=</span> jwt<span class="token punctuation">.</span><span class="token function">sign</span><span class="token punctuation">(</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">id</span><span class="token operator">:</span> userInfo<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>id<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token constant">JWT_SECRET</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token comment">// expiresIn: &#39;1d&#39; // 这里是设置过期时间，不设置就是永久有效。</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

ctx<span class="token punctuation">.</span>cookies<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">&#39;token&#39;</span><span class="token punctuation">,</span> token<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token comment">// maxAge: 10 * 60 * 1000, // cookie有效时长</span>
  <span class="token comment">// expires: new Date(&#39;2017-02-15&#39;),  // cookie失效时间</span>
  <span class="token literal-property property">httpOnly</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 是否只用于http请求中获取</span>
  <span class="token literal-property property">overwrite</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 是否允许重写</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在登录成功时，会将 jwt 记录到 token 中。</p><p>前端在每次进入页面时都会请求一个 <code>/api/users/me</code> 接口，用来获取个人信息，这是通过 token 中记录的 jwt 来做的校验。</p><h3 id="jwt" tabindex="-1"><a class="header-anchor" href="#jwt"><span>jwt</span></a></h3><p>JWT 由三部分组成，通过.分隔：</p><ol><li>Header（头部）：描述 JWT 的元数据，通常包含两部分：类型（typ，默认为 JWT）和签名所用的算法（如 HS256, RS256 等）。</li><li>Payload（载荷）：包含声明（claims），即传输的数据。这部分可以包含用户的身份信息、过期时间、发行者等。JWT 的这一部分是可被解码查看的，但不应包含敏感信息。</li><li>Signature（签名）：用于验证 JWT 的完整性和来源。签名是通过将 Header、Payload 以及一个秘钥（使用 Header 中指定的算法）进行加密计算得出的。</li></ol><p>上面的代码中可以看到 <code>JWT_SECRET</code> 就是我们自己约定好的密钥，是不可以暴露出去的。</p><h2 id="头像生成" tabindex="-1"><a class="header-anchor" href="#头像生成"><span>头像生成</span></a></h2><p>其实在开发个人中心之前我就意识到传统头像会是一个比较大的成本，如果用户可以自己上传头像，无论是图床、cdn、存储都会有一定的压力。因此，我这里放弃了上传图片的形式，而是看看能不能根据一个唯一标识生成一个 svg 或者 canvas 或者 base64 图片的头像。</p><h3 id="gravatar" tabindex="-1"><a class="header-anchor" href="#gravatar"><span>Gravatar</span></a></h3><blockquote><p>Gravatar 是 &quot;Globally Recognized Avatar&quot; 的缩写，是一项全球通用的头像服务。这项服务由 Automattic 公司运营，主要目的是为用户提供一个统一的在线身份标识。用户可以在 Gravatar 的网站上注册一个账号，并将自己选择的头像与个人电子邮件地址关联起来。一旦设置了 Gravatar 头像，当用户在支持 Gravatar 的网站或平台上留言、发表文章或参与讨论时，只要提供了关联了该头像的电子邮件地址，该头像就会自动显示在用户的个人资料或评论旁。</p></blockquote><blockquote><p>Gravatar 的好处在于它提供了一种便捷的方式，让用户能够跨多个平台维持一致的视觉身份，无需在每个网站或服务上分别上传和管理头像。此外，Gravatar 还允许用户为自己的头像分配不同的年龄评级，以便于网站根据内容政策展示合适的头像。许多博客平台、论坛软件和内容管理系统（如 WordPress）都默认集成了 Gravatar 支持。</p></blockquote>`,17),w={href:"https://www.gravatar.com/avatar/",target:"_blank",rel:"noopener noreferrer"},x=n("h3",{id:"jdenticon",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#jdenticon"},[n("span",null,"jdenticon")])],-1),q={href:"https://github.com/dmester/jdenticon",target:"_blank",rel:"noopener noreferrer"},T=e(`<div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> toSvg <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;jdenticon&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">generateAvatar</span><span class="token punctuation">(</span>name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> size<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">40</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">data:image/svg+xml;utf8,</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token function">encodeURIComponent</span><span class="token punctuation">(</span><span class="token function">toSvg</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本站的用户名本身就是唯一的，所以我这里配合用户名，在运行时生成了头像图片，达到了我的目的。</p><h2 id="用户名密码自动填充" tabindex="-1"><a class="header-anchor" href="#用户名密码自动填充"><span>用户名密码自动填充</span></a></h2><p>在浏览器中（如 Chrome），在我们登录时，浏览器会提示是否记住账户密码，方便下次登录之前可以自动填入。这里可以配合 <code>form</code> 表单提交实现：</p><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>form</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>login-form<span class="token punctuation">&quot;</span></span> <span class="token attr-name">action</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>POST<span class="token punctuation">&quot;</span></span> <span class="token attr-name">@submit.prevent</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>login<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span>
    <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>text<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>用户名<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>input</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span>
    <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>password<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>密码<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>input</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>form</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),S={href:"https://github.com/YasinChan/typing/blob/2e429a9ff1f0b08a40ca28d663a0e194411a3937/src/components/Auth.vue#L389",target:"_blank",rel:"noopener noreferrer"},C=n("h2",{id:"ip2region",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#ip2region"},[n("span",null,"ip2region")])],-1),G={href:"https://typing.yasinchan.com/leaderboard",target:"_blank",rel:"noopener noreferrer"},I={href:"https://github.com/lionsoul2014/ip2region",target:"_blank",rel:"noopener noreferrer"},P=n("code",null,"request header",-1),J=n("code",null,"来自上海的网友 - b122",-1),W=e(`<div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 根据 ip 生成长度为 4 的字符串的方法</span>
<span class="token keyword">function</span> <span class="token function">generateShortenedId</span><span class="token punctuation">(</span><span class="token parameter">inputStr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hash <span class="token operator">=</span> <span class="token function">createHash</span><span class="token punctuation">(</span><span class="token string">&#39;md5&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>inputStr<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">digest</span><span class="token punctuation">(</span><span class="token string">&#39;hex&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 截取前4个字符作为唯一标识（注意：这不保证绝对唯一）</span>
  <span class="token keyword">return</span> hash<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>个人中心是个复杂工程，除了以上这些以外，还有与其他信息相绑定和其他各种边界情况需要处理。在自己上手之后，可以更加深入的了解和理解这里面的机制，对技术和产品系统思维的成长大有裨益。</p>`,3);function E(N,R){const s=o("ExternalLinkIcon");return l(),c("div",null,[r,n("p",null,[a("地址："),n("a",u,[a("https://typing.yasinchan.com"),t(s)])]),n("p",null,[a("源码："),n("a",d,[a("https://github.com/YasinChan/typing"),t(s)])]),k,h,n("p",null,[a("我这个网站的开发初衷就是网站浏览者都可以使用所有功能（"),n("a",v,[a("玩一玩"),t(s)]),a("功能由于目前服务器资源有限，为限制人数，暂时需要登录才可以用），不过由于本站具有排行榜等需要记录的场景，所以设计了这套个人中心。不过在设计时，是完全注重到了个人隐私的隔离措施，这也是开发的一个宗旨，下文也会结合隐私逻辑进一步展开说说可以做哪些措施。")]),m,g,b,_,f,n("p",null,[a("我这里使用的是"),n("a",y,[a("bcryptjs"),t(s)]),a("，这是一种单向 hash 加密的工具，不可反向破解生成密码明文。所以对于本站而言，数据库中储存的加密字符串是无法反向得到密码明文的。因此，本站是无法「找回密码」的。那么，对于用户忘记密码的情况，该如何处理呢？")]),j,n("p",null,[a("这本可以实现我的需求，不过由于是海外站点，生成的图片地址国内访问受限。我也尝试找过国内的几家镜像源，不过都是多年以前的，现在也都挂掉了，因此我放弃了这个好东西。当然，各位也可以自己尝试："),n("a",w,[a("https://www.gravatar.com/avatar/"),t(s)]),a("。")]),x,n("p",null,[a("后来经过多方尝试，我选用了"),n("a",q,[a("jdenticon"),t(s)]),a("来实现我的需求。")]),T,n("p",null,[a("这样，我们便能利用到浏览器的账户密码记录与自动填充功能了，我的具体实现可以参考"),n("a",S,[a("代码"),t(s)]),a("。")]),C,n("p",null,[a("这里说个题外话，各位会发现"),n("a",G,[a("排行榜页面"),t(s)]),a("，或者未登录时建议与反馈会显示对应的 IP 地址，这个又是如何实现的呢。")]),n("p",null,[a("其实最初想要实现这个，也是为了不做登录功能，直接就可以根据 IP 地址对应的省份来做用户区分。当时是调研到了"),n("a",I,[a("ip2region"),t(s)]),a("框架，在 node 端配合 "),P,a(" 中的 IP 地址，即可获得对应的省份，配合根据 IP 地址生成的一个长度为 4 的字符串，从而获得一个“唯一”名称（这里“唯一”加上双引号原因如下代码注释），如 "),J,a("。")]),W])}const H=p(i,[["render",E],["__file","typing-user-center.html.vue"]]),z=JSON.parse('{"path":"/post/typing-user-center.html","title":"Typing 项目技术总结 - 用户中心逻辑","lang":"zh-CN","frontmatter":{"date":"2024-05-22T00:00:00.000Z","head":[["meta",{"name":"keywords","content":"typing, user center, login, register, jwt, Gravatar, jdenticon, ip2region"}],["meta",{"name":"description","content":"https://typing.yasinchan.com/ 用户中心介绍"}]],"tag":["typing","login","register","user center","jwt","产品"],"sticky":true,"excerpt":"<p>打字网站 <a href=\\"https://typing.yasinchan.com\\" target=\\"_blank\\">Typing</a> 用户中心逻辑</p>"},"headers":[{"level":2,"title":"为什么要个人中心","slug":"为什么要个人中心","link":"#为什么要个人中心","children":[]},{"level":2,"title":"注册与登录","slug":"注册与登录","link":"#注册与登录","children":[{"level":3,"title":"密码加密","slug":"密码加密","link":"#密码加密","children":[]}]},{"level":2,"title":"重置密码机制","slug":"重置密码机制","link":"#重置密码机制","children":[]},{"level":2,"title":"登录持久化与 jwt","slug":"登录持久化与-jwt","link":"#登录持久化与-jwt","children":[{"level":3,"title":"jwt","slug":"jwt","link":"#jwt","children":[]}]},{"level":2,"title":"头像生成","slug":"头像生成","link":"#头像生成","children":[{"level":3,"title":"Gravatar","slug":"gravatar","link":"#gravatar","children":[]},{"level":3,"title":"jdenticon","slug":"jdenticon","link":"#jdenticon","children":[]}]},{"level":2,"title":"用户名密码自动填充","slug":"用户名密码自动填充","link":"#用户名密码自动填充","children":[]},{"level":2,"title":"ip2region","slug":"ip2region","link":"#ip2region","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"updatedTime":1716392466000,"contributors":[{"name":"YasinChan","email":"yasinchan2016@gmail.com","commits":1}]},"filePathRelative":"post/typing-user-center.md"}');export{H as comp,z as data};
