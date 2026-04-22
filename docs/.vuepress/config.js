import { blogPlugin } from '@vuepress/plugin-blog';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { viteBundler } from '@vuepress/bundler-vite';
import { searchProPlugin } from 'vuepress-plugin-search-pro';

const LOGO_URL =
  'https://file.yasinchan.com/rPAaaJxvP0KoTDILIYwSfGxWjUT51d8X/D018B6FFE06A79F3EE14730D88214BEE.png';
const BAIDU_ANALYTICS_ID = '7a4553a66f119e8706760cec79cafbbf';
const GA_MEASUREMENT_ID = 'G-8C7G0NW5CR';

export default defineUserConfig({
  lang: 'zh-CN',

  title: 'Yasinchan的自留地',
  description: 'Yasinchan 记录前端生活',
  head: [
    ['link', { rel: 'icon', href: LOGO_URL }],
    ['link', { rel: 'preconnect', href: 'https://file.yasinchan.com' }],
    ['script', { src: '/iconfont.js' }],
    [
      'script',
      {},
      `var _hmt = _hmt || [];\n(function() {\n  var hm = document.createElement("script");\n  hm.src = "https://hm.baidu.com/hm.js?${BAIDU_ANALYTICS_ID}";\n  var s = document.getElementsByTagName("script")[0]; \n  s.parentNode.insertBefore(hm, s);\n})();`,
    ],
    [
      'script',
      {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${GA_MEASUREMENT_ID}');`,
    ],
  ],

  theme: defaultTheme({
    logo: LOGO_URL,

    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '博客',
        link: '/post/',
      },
      {
        text: '标签',
        link: '/tags/',
      },
      {
        text: '归档',
        link: '/archives/',
      },
      {
        text: '关于',
        children: [
          {
            text: '此博客',
            link: '/about/blog.md',
          },
          {
            text: '我',
            link: '/about/me.md',
          },
        ],
      },
      {
        text: '好玩',
        children: [
          {
            text: 'Quick Meet',
            link: 'https://qm.yasinchan.com',
          },
          {
            text: 'Typing',
            link: 'https://typing.yasinchan.com',
          },
        ],
      },
      { text: 'Github', link: 'https://github.com/yasinchan' },
    ],
  }),

  plugins: [
    searchProPlugin({
      // your options
    }),
    blogPlugin({
      // Only files under posts are articles
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('post/') : false,

      // Getting article info
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || '',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt:
          // Support manually set excerpt through frontmatter
          typeof frontmatter.excerpt === 'string'
            ? frontmatter.excerpt
            : data?.excerpt || '',
      }),

      // Generate excerpt for all pages excerpt those users choose to disable
      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home &&
        frontmatter.excerpt !== false &&
        typeof frontmatter.excerpt !== 'string',

      category: [
        {
          key: 'tags',
          getter: (page) => page.frontmatter.tag || [],
          layout: 'Tags',
          itemLayout: 'Tags',
          frontmatter: () => ({
            title: 'Tags',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Tags ${name}`,
            sidebar: false,
          }),
        },
      ],

      type: [
        {
          key: 'post',
          // Remove archive articles
          filter: (page) => !page.frontmatter.archive,
          layout: 'Post',
          frontmatter: () => ({
            title: 'Posts',
            sidebar: false,
          }),
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
        },
        {
          key: 'archives',
          // Only article with date should be added to timeline
          filter: (page) => page.frontmatter.date instanceof Date,
          // Sort pages with time
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          layout: 'Archives',
          frontmatter: () => ({
            title: 'Archives',
            sidebar: false,
          }),
        },
      ],
      hotReload: true,
    }),
  ],

  bundler: viteBundler(),
});
