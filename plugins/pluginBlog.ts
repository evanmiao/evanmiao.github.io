import { AdditionalPage, RspressPlugin } from '@rspress/shared';
import { getPostList, postInfoList, postTagMap } from '../models/default';

export function pluginBlog(): RspressPlugin {
  return {
    name: 'plugin-blog',
    beforeBuild() {
      getPostList();
    },
    addPages() {
      const pages: AdditionalPage[] = [];
      // 添加文章路由
      postInfoList.forEach((postInfo) => {
        pages.push({
          routePath: postInfo.route,
          filepath: postInfo.path,
        });
      });
      return pages;
    },
    extendPageData(pageData) {
      if (['home', 'archives'].includes(pageData?.frontmatter.layout as string)) {
        pageData.posts = postInfoList;
      }
      if (pageData?.frontmatter.layout === 'tags') {
        pageData.tags = Array.from(postTagMap.values())
          .sort((a, b) => b.count - a.count)
          .map((item) => ({
            name: item.name,
            count: item.count,
            posts: postTagMap.get(item.name)?.posts || [],
          }));
      }
      if (pageData?._relativePath.includes('_posts')) {
        const index = postInfoList.findIndex((postInfo) => postInfo.route === pageData.routePath);
        // 前一篇、后一篇文章
        if (index > -1) {
          pageData.prevPost = postInfoList[index + 1];
          pageData.nextPost = postInfoList[index - 1];
        }
        // 日期、标签
        const postInfo = postInfoList[index];
        pageData.date = postInfo.date;
        pageData.tags = postInfo.tags;
      }
    },
  };
}
