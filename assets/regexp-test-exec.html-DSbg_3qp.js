import{_ as s,o as n,c as a,e as t}from"./app-B61g1JEs.js";const p={},e=t(`<h1 id="正则-test-和-exec-在-global-模式下的工作机制" tabindex="-1"><a class="header-anchor" href="#正则-test-和-exec-在-global-模式下的工作机制"><span>正则 test 和 exec 在 global 模式下的工作机制</span></a></h1><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>正则的 <code>test</code> 方法是和 <code>exec</code> 类似的机制 会在当正则设置了 global 标志位的情况下每次执行 <code>test</code> 方法的时候都会记录匹配之后的位置 在下一次执行的时候从新的位置开始匹配</p></div><p>有一个字符串 <code>axbaybazbaaa</code></p><p>当需要匹配出所有满足 a.b 的字符时，可以定义一个如下的正则表达式</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">var</span> reg <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RegExp</span><span class="token punctuation">(</span><span class="token string">&#39;a.b&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;g&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">var</span> str <span class="token operator">=</span> <span class="token string">&#39;axbaybazbaaa&#39;</span>
<span class="token keyword">var</span> arr
<span class="token keyword">while</span><span class="token punctuation">(</span><span class="token punctuation">(</span>arr <span class="token operator">=</span> reg<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span> <span class="token punctuation">}</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token punctuation">[</span><span class="token string">&quot;axb&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">index</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">input</span><span class="token operator">:</span> <span class="token string">&quot;axbaybazbaaa&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">groups</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">]</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token punctuation">[</span><span class="token string">&quot;ayb&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">index</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token literal-property property">input</span><span class="token operator">:</span> <span class="token string">&quot;axbaybazbaaa&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">groups</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">]</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token punctuation">[</span><span class="token string">&quot;azb&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">index</span><span class="token operator">:</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token literal-property property">input</span><span class="token operator">:</span> <span class="token string">&quot;axbaybazbaaa&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">groups</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一个正则对象包括多个属性，此时我们需要观察的是其中的 <code>lastIndex</code> 属性，此属性的作用是记录下一次匹配开始的位置，所以我们可以将上述的 <code>while</code> 方法拆分开了查看每步执行了什么</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code>reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token comment">// 最初 lastIndex 属性必然是指向 0 的</span>
reg<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token punctuation">[</span><span class="token string">&quot;axb&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">index</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">input</span><span class="token operator">:</span> <span class="token string">&quot;axbaybazbaaa&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">groups</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">]</span>
reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">3</span> <span class="token comment">// 在执行一次之后，匹配了字符串前三个字符，所以下一次匹配开始的位置为 3</span>
reg<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token punctuation">[</span><span class="token string">&quot;ayb&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">index</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token literal-property property">input</span><span class="token operator">:</span> <span class="token string">&quot;axbaybazbaaa&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">groups</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">]</span>
reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">6</span> <span class="token comment">// 同上</span>
reg<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token punctuation">[</span><span class="token string">&quot;azb&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">index</span><span class="token operator">:</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token literal-property property">input</span><span class="token operator">:</span> <span class="token string">&quot;axbaybazbaaa&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">groups</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">]</span>
reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">9</span>
reg<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token keyword">null</span> <span class="token comment">// 此时 从第 9 个值开始执行，会发现匹配不到值，所以是 null</span>
reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token comment">// 以上执行到 null 时，表示一个循环结束了</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上便是我们常用的 <code>exec</code> 的方法详解，<code>test</code> 方法本质也和 exec 相似，所以当我们在重复执行 <code>reg.test(str)</code> 时，也会和上述相同的遍历过程，之所以我们平时不会注意到 <code>test</code> 的这个机制，是因为 我们在使用 <code>test</code> 的时候，目的就是检测字符串中是否有满足我们正则表达式的字符，只要有一个满足，就不需要继续检测了。</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code>reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">0</span>
reg<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token boolean">true</span>
reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">3</span>
reg<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token boolean">true</span>
reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">6</span>
reg<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token boolean">true</span>
reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">9</span>
reg<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token boolean">false</span>
reg<span class="token punctuation">.</span>lastIndex
<span class="token operator">-</span><span class="token operator">&gt;</span> <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),o=[e];function c(l,r){return n(),a("div",null,o)}const u=s(p,[["render",c],["__file","regexp-test-exec.html.vue"]]),k=JSON.parse('{"path":"/post/regexp-test-exec.html","title":"正则 test 和 exec 在 global 模式下的工作机制","lang":"zh-CN","frontmatter":{"date":"2020-05-21T00:00:00.000Z","tag":["tech","front-end","reg"],"excerpt":"正则的 test 方法是和 exec 类似的机制 会在当正则设置了 global 标志位的情况下每次执行 test 方法的时候都会记录匹配之后的位置 在下一次执行的时候从新的位置开始匹配"},"headers":[],"git":{"updatedTime":1711200423000,"contributors":[{"name":"YasinChan","email":"yasinchan2016@gmail.com","commits":1}]},"filePathRelative":"post/regexp-test-exec.md"}');export{u as comp,k as data};
