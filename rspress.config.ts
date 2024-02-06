import * as path from 'path';
import { defineConfig } from 'rspress/config';
import { pluginBlog } from './plugins/pluginBlog';

export default defineConfig({
  root: path.join(__dirname, 'blog'),
  title: 'Evan’s Blog',
  description: 'Evan’s Blog',
  icon: '/favicon.ico',
  builderConfig: {
    source: {
      alias: {
        '@components': path.join(__dirname, 'components'),
        '@layouts': path.join(__dirname, 'layouts'),
        '@models': path.join(__dirname, 'models'),
      },
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'twitter', mode: 'link', content: 'https://twitter.com/evan_miao' },
      { icon: 'github', mode: 'link', content: 'https://github.com/evanmiao' },
    ],
    nav: [
      {
        text: '标签',
        link: '/tags/',
      },
      {
        text: '归档',
        link: '/archives/',
      },
      {
        text: '关于我',
        link: '/about/',
      },
    ],
    sidebar: {},
    // hideNavbar: 'auto',
    searchPlaceholderText: '搜索',
    outlineTitle: '目录',
    prevPageText: '上一篇',
    nextPageText: '下一篇',
    lastUpdated: true,
    lastUpdatedText: '最后编辑时间',
    editLink: {
      text: '📝 在 GitHub 上编辑此页',
      docRepoBaseUrl: 'https://github.com/evanmiao/evanmiao.github.io/blob/main/blog/',
    },
    // enableContentAnimation: true,
  },
  route: {
    exclude: ['_posts/**/*'],
  },
  plugins: [pluginBlog()],
});
