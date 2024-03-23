import { blogPlugin } from '@vuepress/plugin-blog';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { viteBundler } from '@vuepress/bundler-vite';
import { searchProPlugin } from 'vuepress-plugin-search-pro';

export default defineUserConfig({
  lang: 'zh-CN',

  title: 'YasinChan 的博客',
  description: 'Yasinchan 记录前端生活',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://file.yasinchan.com/rPAaaJxvP0KoTDILIYwSfGxWjUT51d8X/D018B6FFE06A79F3EE14730D88214BEE.png',
      },
    ],
    ['script', { src: '/iconfont.js' }],
    [
      'script',
      {},
      'var _hmt = _hmt || [];\n(function() {\n  var hm = document.createElement("script");\n  hm.src = "https://hm.baidu.com/hm.js?7a4553a66f119e8706760cec79cafbbf";\n  var s = document.getElementsByTagName("script")[0]; \n  s.parentNode.insertBefore(hm, s);\n})();',
    ],
    [
      'script',
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-8C7G0NW5CR',
      },
    ],
    [
      'script',
      {},
      " window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-8C7G0NW5CR');",
    ],
  ],

  theme: defaultTheme({
    logo: 'https://file.yasinchan.com/rPAaaJxvP0KoTDILIYwSfGxWjUT51d8X/D018B6FFE06A79F3EE14730D88214BEE.png',

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
          key: 'category',
          getter: (page) => page.frontmatter.category || [],
          layout: 'Category',
          itemLayout: 'Category',
          frontmatter: () => ({
            title: 'Categories',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Category ${name}`,
            sidebar: false,
          }),
        },
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
          // Sort pages with time and sticky
          sorter: (pageA, pageB) => {
            // if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
            //   return pageB.frontmatter.sticky - pageA.frontmatter.sticky;

            // if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky)
            //   return -1;

            // if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1;

            // if (!pageB.frontmatter.date) return 1;
            // if (!pageA.frontmatter.date) return -1;

            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            );
          },
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
