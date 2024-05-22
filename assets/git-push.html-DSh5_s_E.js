import{_ as n,o as s,c as a,e}from"./app-B5fP3dJT.js";const i={},t=e(`<h1 id="git-本地仓库提交到远程操作" tabindex="-1"><a class="header-anchor" href="#git-本地仓库提交到远程操作"><span>git 本地仓库提交到远程操作</span></a></h1><ol><li><p>新建远程空仓库</p></li><li><p>本地仓库执行</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> init

<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>

<span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&#39;提交说明&#39;</span>

<span class="token function">git</span> remote <span class="token function">add</span> origin 远程仓库地址

<span class="token function">git</span> push <span class="token parameter variable">-u</span> origin master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol>`,2),l=[t];function c(o,d){return s(),a("div",null,l)}const p=n(i,[["render",c],["__file","git-push.html.vue"]]),m=JSON.parse('{"path":"/post/git-push.html","title":"git 本地仓库提交到远程操作","lang":"zh-CN","frontmatter":{"date":"2019-02-01T00:00:00.000Z","tag":["git"],"excerpt":""},"headers":[],"git":{"updatedTime":1711200423000,"contributors":[{"name":"YasinChan","email":"yasinchan2016@gmail.com","commits":1}]},"filePathRelative":"post/git-push.md"}');export{p as comp,m as data};
