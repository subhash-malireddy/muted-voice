import { Blog } from '@baseline/types/blog';

export const blogMapper = (data: Blog): Blog => {
  const blog: Blog = {
    blogId: data?.blogId,
    title: data?.title,
    content: data?.content,
    author: data?.author,
    isPublished: data?.isPublished,
  };
  return blog;
};
