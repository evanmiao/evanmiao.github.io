import path from 'path';
import fs, { PathLike } from 'fs';
import dayjs from 'dayjs';
import grayMatter from 'gray-matter';
import removeMd from 'remove-markdown';
import Permalink from '../utils/Permalink';

export interface PostInfo {
  // 文章标题
  title: string;
  // 文章路由
  route: string;
  // 文件路径
  path: string;
  // 创建时间
  date: string;
  // 标签
  tags: string[];
  // 摘要
  summary: string;
}

export interface PostTag {
  // 标签名称
  name: string;
  // 标签数量
  count: number;
  // 文章
  posts: PostInfo[];
}

export const postInfoList: PostInfo[] = [];
export const postTagMap = new Map<string, PostTag>();

const fileNamePattern = ':year-:month-:day-:title.md';
const permalinkPattern = ':year/:month/:day/:title/';

const configBlogFileName = fileNamePattern.slice(0, -path.extname(fileNamePattern).length);
const formFileNamePermalink = new Permalink(configBlogFileName, {
  segments: {
    year: /(\d{4})/,
    month: /(\d{2})/,
    day: /(\d{2})/,
    i_month: /(\d{1,2})/,
    i_day: /(\d{1,2})/,
    hash: /([0-9a-f]{12})/,
  },
});
const toRoutePathPermalink = new Permalink(permalinkPattern);

const formatTags = (tags: string | string[]): string[] => {
  if (!tags) {
    return [];
  }
  if (Array.isArray(tags)) {
    return tags;
  }
  return tags.split(',');
};

const formatPostInfo = (filepath: string): PostInfo | null => {
  const { name, ext } = path.parse(filepath);
  if (!['.mdx', '.md', '.html'].includes(ext)) {
    return null;
  }
  let filename = name;
  if (name === 'index') {
    filename = path.basename(path.dirname(filepath));
  }
  const link = formFileNamePermalink.parse(filename);
  const routePath = `/${toRoutePathPermalink.stringify(link)}`;
  const { data: frontmatter, content } = grayMatter.read(filepath);

  return {
    title: frontmatter.title || (link as any).title,
    route: routePath,
    path: filepath,
    date: dayjs(frontmatter.date || filename.slice(0, 10)).format('YYYY-MM-DD'),
    tags: formatTags(frontmatter.tags),
    summary: frontmatter.summary || `${removeMd(content.trim().replace(/^#+\s+(.*)/, '').slice(0, 100))}...`,
  };
};

const forEachDir = (DirectoryPath: PathLike, callback: (path: string) => void) => {
  const itemList = fs.readdirSync(DirectoryPath);
  itemList.forEach((item) => {
    const itemPath = path.join(DirectoryPath.toString(), item);
    const itemStats = fs.statSync(itemPath);
    if (itemStats.isDirectory()) {
      forEachDir(itemPath, callback);
    } else if (itemStats.isFile()) {
      callback(itemPath);
    }
  });
};

export const getPostList = () => {
  const postsDir = path.join(__dirname, '../blog/_posts');
  forEachDir(postsDir, (path) => {
    const postInfo = formatPostInfo(path);
    if (!postInfo) {
      return;
    }
    postInfoList.push(postInfo);
    postInfo.tags.forEach((tag) => {
      const postTag = postTagMap.get(tag);
      if (postTag) {
        postTag.count++;
        postTag.posts.push(postInfo);
      } else {
        postTagMap.set(tag, {
          name: tag,
          count: 1,
          posts: [postInfo],
        });
      }
    });
  });
  postInfoList.sort((a, b) => {
    return dayjs(b.date).unix() - dayjs(a.date).unix();
  });
  postTagMap.forEach((postTag) => {
    postTag.posts.sort((a, b) => {
      return dayjs(b.date).unix() - dayjs(a.date).unix();
    });
  });
};
