module.exports = {
  title: 'Evan Miao',
  description: '博客',
  head: [
    ['link', {
      rel: 'icon',
      href: '/favicon.ico'
    }],
    ['meta', {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,user-scalable=no'
    }]
  ],
  markdown: {
    lineNumbers: true
  },
  plugins: [
    ['@vuepress/back-to-top'],
    ['@vuepress/medium-zoom', {
      selector: '.content__default :not(a) > img'
    }],
    ['@vuepress/google-analytics', {
      'ga': 'UA-166044073-1'
    }]
  ],
  theme: '@vuepress/theme-blog',
  themeConfig: {
    nav: [{
        text: 'Home',
        link: '/'
      },
      {
        text: 'Tag',
        link: '/tag/'
      },
      {
        text: 'About',
        link: '/about/'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/evanmiao'
      }
    ],
    footer: {
      contact: [{
          type: 'github',
          link: 'https://github.com/evanmiao',
        },
        {
          type: 'mail',
          link: 'mailto:evan.c.miao@gmail.com',
        },
      ],
      copyright: [{
        text: 'Powered by VuePress',
        link: 'https://vuepress.vuejs.org/',
      }, {
        text: 'Copyright © 2019 Evan Miao',
        link: '/',
      }],
    },
    sitemap: {
      hostname: 'https://evanmiao.github.io'
    },
    comment: {
      service: 'vssue',
      owner: 'evanmiao',
      repo: 'evanmiao.github.io',
      clientId: '65268a9657ddba9a8023',
      clientSecret: '3bbfb64f22c61420c584203a63b22d9b861a8639'
    },
    globalPagination: {
      prevText: '上一页',
      nextText: '下一页',
      lengthPerPage: '10'
    },
    smoothScroll: true
  }
};