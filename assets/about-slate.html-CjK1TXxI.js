import{_ as e,r as p,o,c as i,a as n,b as s,d as t,e as l}from"./app-DKehuhjc.js";const c={},r=n("h1",{id:"slate-系列",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#slate-系列"},[n("span",null,"slate 系列")])],-1),u={class:"custom-container tip"},d=n("p",{class:"custom-container-title"},"TIP",-1),k={href:"https://docs.slatejs.org/",target:"_blank",rel:"noopener noreferrer"},v={href:"https://github.com/ianstormtaylor/slate",target:"_blank",rel:"noopener noreferrer"},m=l(`<h2 id="简述" tabindex="-1"><a class="header-anchor" href="#简述"><span>简述</span></a></h2><ol><li>slate 是一个完全可定制的构建富文本编辑器的框架，本质是一个构建于 React 之上的 div contenteditable。</li><li>文档中提到其逻辑都是通过各个插件实现的，可以不用受到“核心”不“核心”的影响。</li><li>slate 的主要插件只有三个，分别是 slate-react、slate-history、slate-hyperscript。</li><li>slate 本身提供了逻辑处理；</li><li>slate-react 是做视图层逻辑（官方。slate 的视图层组件还有包括 vue 和 angular 在内的其他衍生品，这里基于 react 的组件是由官方维护）；</li><li>slate-history 记录状态，配合撤销反撤销操作；</li><li>slate-hyperscript 用于提供 jsx，可以在比如粘贴一段 HTML 做转换处理时使用。</li></ol><h2 id="细节" tabindex="-1"><a class="header-anchor" href="#细节"><span>细节</span></a></h2><p>slate 逻辑本质是基于对一段数组对象数据的处理</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;paragraph&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;children&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;text&quot;</span><span class="token operator">:</span> <span class="token string">&quot;测试&quot;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;text&quot;</span><span class="token operator">:</span> <span class="token string">&quot;加粗&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;bold&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;text&quot;</span><span class="token operator">:</span> <span class="token string">&quot;斜体&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;italic&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;text&quot;</span><span class="token operator">:</span> <span class="token string">&quot;下划线&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;underline&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;text&quot;</span><span class="token operator">:</span> <span class="token string">&quot; &quot;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;children&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token property">&quot;text&quot;</span><span class="token operator">:</span> <span class="token string">&quot;链接&quot;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;link&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;info&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">&quot;url&quot;</span><span class="token operator">:</span> <span class="token string">&quot;https://taptap.com&quot;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;sWIx&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;image&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;info&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;url&quot;</span><span class="token operator">:</span> <span class="token string">&quot;https://img2.tapimg.com/moment/etag/FkNk2byCBYVIw0xr2tA43mSpoxDs.png&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;children&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">&quot;text&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如这段数组对应的是下图两行展示 <img src="https://qiniu.yasinchan.com/image/image2021-11-17_13-47-43.png" alt="图一"></p><p>这段数组中的两个对象，对应了视图层的两行。对于 slate 来说，每行既是一个对象，我们的增删改查都是通过对这段数组的操作。</p><p>slate 对于操作（<strong>Operations</strong>），分为了如下 9 种</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">BaseInsertNodeOperation</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  type<span class="token operator">:</span> <span class="token string">&#39;insert_node&#39;</span><span class="token punctuation">;</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  node<span class="token operator">:</span> Node<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">BaseRemoveNodeOperation</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  type<span class="token operator">:</span> <span class="token string">&#39;remove_node&#39;</span><span class="token punctuation">;</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  node<span class="token operator">:</span> Node<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">BaseInsertTextOperation</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  type<span class="token operator">:</span> <span class="token string">&#39;insert_text&#39;</span><span class="token punctuation">;</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  offset<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  text<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">BaseRemoveTextOperation</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  type<span class="token operator">:</span> <span class="token string">&#39;remove_text&#39;</span><span class="token punctuation">;</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  offset<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  text<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">BaseMergeNodeOperation</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  type<span class="token operator">:</span> <span class="token string">&#39;merge_node&#39;</span><span class="token punctuation">;</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  position<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  properties<span class="token operator">:</span> Partial<span class="token operator">&lt;</span>Node<span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">BaseSplitNodeOperation</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  type<span class="token operator">:</span> <span class="token string">&#39;split_node&#39;</span><span class="token punctuation">;</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  position<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  properties<span class="token operator">:</span> Partial<span class="token operator">&lt;</span>Node<span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">BaseMoveNodeOperation</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  type<span class="token operator">:</span> <span class="token string">&#39;move_node&#39;</span><span class="token punctuation">;</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  newPath<span class="token operator">:</span> Path<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">BaseSetNodeOperation</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  type<span class="token operator">:</span> <span class="token string">&#39;set_node&#39;</span><span class="token punctuation">;</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  properties<span class="token operator">:</span> Partial<span class="token operator">&lt;</span>Node<span class="token operator">&gt;</span><span class="token punctuation">;</span>
  newProperties<span class="token operator">:</span> Partial<span class="token operator">&lt;</span>Node<span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">BaseSetSelectionOperation</span> <span class="token operator">=</span>
  <span class="token operator">|</span> <span class="token punctuation">{</span>
      type<span class="token operator">:</span> <span class="token string">&#39;set_selection&#39;</span><span class="token punctuation">;</span>
      properties<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      newProperties<span class="token operator">:</span> Range<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token operator">|</span> <span class="token punctuation">{</span>
      type<span class="token operator">:</span> <span class="token string">&#39;set_selection&#39;</span><span class="token punctuation">;</span>
      properties<span class="token operator">:</span> Partial<span class="token operator">&lt;</span>Range<span class="token operator">&gt;</span><span class="token punctuation">;</span>
      newProperties<span class="token operator">:</span> Partial<span class="token operator">&lt;</span>Range<span class="token operator">&gt;</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token operator">|</span> <span class="token punctuation">{</span>
      type<span class="token operator">:</span> <span class="token string">&#39;set_selection&#39;</span><span class="token punctuation">;</span>
      properties<span class="token operator">:</span> Range<span class="token punctuation">;</span>
      newProperties<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>形成了对于步骤的记录，也就是能够做到 <code>undo</code> <code>redo</code> 的操作，另外在此基础上，为了减轻心智负担，slate 做了进一步封装，也就是 <strong>Transform</strong> 以及 <strong>Editor</strong>。</p><p><strong>Transform</strong> 能够内部消化对于 <code>Range</code> 的处理。</p><p>更高级的，还有 <code>Commands</code>。也就是 <strong>Editor</strong>，上面所谓的“减轻心智负担”，也就是说一般情况下，我们在调用 <strong>Editor</strong> 时是不需要再传递路径等的。也可以理解为是对 Transform 的封装。</p><p>举个例子 <strong>Operations</strong> 中的 <code>insert_text</code> 和 <code>insert_node</code>，<strong>Transform</strong> 会将其封装成 <code>insertText</code> 和 <code>insertNodes</code> 方法，其都接收包括 <code>at</code> 在内的多个 <code>options</code>。</p><p>而 <strong>Editor</strong> 中的 <code>insertText</code> 方法，则包含了 <strong>Transform</strong> 中的这两个方法，我们无需再外部判断当前是否是一个 marks 而决定使用 <code>Transforms.insertText</code> 还是 <code>Transforms.insertNodes</code>，也不用传递 <code>at</code> 等参数。在某些命令式的情况下使用很方便。</p><p>上面提到了 <strong>Range</strong>，所谓 <strong>Range</strong> 是 slate 对路径的管理。</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">Range</span> <span class="token punctuation">{</span>
  anchor<span class="token operator">:</span> Point<span class="token punctuation">;</span>
  focus<span class="token operator">:</span> Point<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上所示，这便是 <strong>Range</strong> 的定义，anchor 是初始点，focus 为结束点。通俗来说就是比如框选了一段文字，mousedown 的位置即为 anchor，mouseout 的位置即为 focus。一般 focus 而没有选中一段文字的状态下 anchor 和 focus 是同一个 <strong>Point</strong>。</p><p>那么这个 <strong>Point</strong> 又是何物呢</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">Point</span> <span class="token punctuation">{</span>
  path<span class="token operator">:</span> Path<span class="token punctuation">;</span>
  offset<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> <span class="token class-name">Path</span> <span class="token operator">=</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是形容光标的具体位置，举个例子，上面图片中若光标在“测”与“试”中间，此时的 <strong>Point</strong> 即为</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token punctuation">{</span>
    <span class="token string-property property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token string-property property">&quot;offset&quot;</span><span class="token operator">:</span> <span class="token number">1</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21);function b(g,h){const a=p("ExternalLinkIcon");return o(),i("div",null,[r,n("div",u,[d,n("p",null,[s("本文将根据 "),n("a",k,[s("slate 文档"),t(a)]),s(" 结合实例整理讲述 "),n("a",v,[s("slate"),t(a)]),s(" 的部分细节。")])]),m])}const q=e(c,[["render",b],["__file","about-slate.html.vue"]]),_=JSON.parse('{"path":"/post/about-slate.html","title":"slate 系列","lang":"zh-CN","frontmatter":{"date":"2021-11-11T00:00:00.000Z","tag":["slate","rich-editor"],"sticky":true,"excerpt":"<p>本文将根据 slate 文档结合实例整理讲述 slate 的部分细节。</p>"},"headers":[{"level":2,"title":"简述","slug":"简述","link":"#简述","children":[]},{"level":2,"title":"细节","slug":"细节","link":"#细节","children":[]}],"git":{"updatedTime":1711200423000,"contributors":[{"name":"YasinChan","email":"yasinchan2016@gmail.com","commits":1}]},"filePathRelative":"post/about-slate.md"}');export{q as comp,_ as data};
