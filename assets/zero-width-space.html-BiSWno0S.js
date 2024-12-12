import{_ as r,r as o,o as c,c as l,a as t,b as e,d as a,w as i}from"./app-B9iGP_ub.js";const d={},h=t("h1",{id:"slate-系列-零宽空格在-slate-中的运用",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#slate-系列-零宽空格在-slate-中的运用"},[t("span",null,"slate 系列 - 零宽空格在 slate 中的运用")])],-1),p={class:"custom-container tip"},m=t("p",{class:"custom-container-title"},"TIP",-1),_={href:"https://github.com/ianstormtaylor/slate/blob/main/packages/slate-react/src/components/string.tsx#L107",target:"_blank",rel:"noopener noreferrer"},u={href:"https://github.com/ianstormtaylor/slate/blob/main/packages/slate-react/src/components/editable.tsx#L853",target:"_blank",rel:"noopener noreferrer"},b=t("p",null,"在前端层面来讲，零宽字符本身是不会在 HTML 中渲染出来的，一般情况下我们不会使用到它。不过在编辑器中，对于 slate 而言，其本身是基于监听 div contenteditable 变化事件来做数据渲染的，而 div contenteditable 中，零宽字符会在其中独占一个 range 从而可以让光标在一个空位显示。",-1);function f(g,k){const s=o("ExternalLinkIcon"),n=o("RouteLink");return c(),l("div",null,[h,t("div",p,[m,t("p",null,[e("在 slate 源码中，我们会看到零宽空格的运用，如 "),t("a",_,[e("代码 1"),a(s)]),e(),t("a",u,[e("代码 2"),a(s)]),e(" 。其含义是什么。")])]),b,t("p",null,[e("上一篇 "),a(n,{to:"/post/about-slate.html"},{default:i(()=>[e("slate 系列")]),_:1})])])}const v=r(d,[["render",f],["__file","zero-width-space.html.vue"]]),L=JSON.parse('{"path":"/post/zero-width-space.html","title":"slate 系列 - 零宽空格在 slate 中的运用","lang":"zh-CN","frontmatter":{"date":"2021-12-20T00:00:00.000Z","tag":["slate","rich-editor","zero-width","\\\\uFEFF"],"sticky":true,"excerpt":""},"headers":[],"git":{"updatedTime":1711200423000,"contributors":[{"name":"YasinChan","email":"yasinchan2016@gmail.com","commits":1}]},"filePathRelative":"post/zero-width-space.md"}');export{v as comp,L as data};