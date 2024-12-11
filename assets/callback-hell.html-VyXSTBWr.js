import{_ as t,r as c,o,c as l,a,b as n,d as e,e as p}from"./app-DrpWXkc-.js";const r={},i=p(`<h1 id="callback-hell" tabindex="-1"><a class="header-anchor" href="#callback-hell"><span>callback hell</span></a></h1><blockquote><p>JavaScript 是单线程的语言，处理异步的事件比如 ajax 请求，我们会使用 callback 的方式来处理。可是当我们需要处理复杂的异步过程时，最常见的方式就是在回调事件中层层嵌套，可是这样做的弊端也很明显，就是代码不直观，冗余，当我们在后期维护的时候，工程量也会很大。</p></blockquote><blockquote><p>于是，在 ES6 中，增加了几种新的方法，来使我们能更加优雅的处理复杂异步事件。</p></blockquote><ol><li><p>Promise<br> 这也是我们在解决这类问题中用的最多的方式了，不做赘述，详情参考 http://es6.ruanyifeng.com/#docs/promise 。</p></li><li><p>Generator 函数<br> 这个可能使用率比较小，但是个人认为是个更加直观的解决方式。生成器函数一般而言可以配合 yield 来用，使用方法：</p></li></ol><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">function</span><span class="token operator">*</span> <span class="token function">countAppleSales</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> result1 <span class="token operator">=</span> <span class="token keyword">yield</span> $<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;data1.json&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> result2 <span class="token operator">=</span> <span class="token keyword">yield</span> $<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;data2.json&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 * 来区分他跟一般的函数的区别，yield 是一个用来暂停生成器函数的关键字，使用 .next() 来继续函数详情可参见 https://www.w3ctech.com/topic/1917</p>`,6),u={start:"3"},d=a("br",null,null,-1),k={href:"http://es6.ruanyifeng.com/#docs/async",target:"_blank",rel:"noopener noreferrer"},h={href:"https://www.w3ctech.com/topic/1917",target:"_blank",rel:"noopener noreferrer"};function m(b,_){const s=c("ExternalLinkIcon");return o(),l("div",null,[i,a("ol",u,[a("li",null,[n("acync 函数"),d,a("a",k,[n("http://es6.ruanyifeng.com/#docs/async"),e(s)])])]),a("p",null,[a("a",h,[n("https://www.w3ctech.com/topic/1917"),e(s)])])])}const v=t(r,[["render",m],["__file","callback-hell.html.vue"]]),g=JSON.parse('{"path":"/post/callback-hell.html","title":"callback hell","lang":"zh-CN","frontmatter":{"date":"2018-03-01T00:00:00.000Z","tag":["front-end","tech"],"excerpt":""},"headers":[],"git":{"updatedTime":1711200423000,"contributors":[{"name":"YasinChan","email":"yasinchan2016@gmail.com","commits":1}]},"filePathRelative":"post/callback-hell.md"}');export{v as comp,g as data};