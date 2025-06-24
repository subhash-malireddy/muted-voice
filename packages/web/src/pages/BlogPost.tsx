import React from 'react';
import { useLoaderData, LoaderFunctionArgs } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { getPublishedBlog } from '@baseline/client-api/blog';
import { createRequestHandler } from '@baseline/client-api/request-handler';
import PageWrapper from '../components/page-wrapper/PageWrapper';
import BlogPostContent from '../components/blog-post-content/BlogPostContent';

export async function blogPostLoader({ params }: LoaderFunctionArgs) {
  // Create request handler for public API calls (no authentication)
  const requestHandler = createRequestHandler();
  const blog = await getPublishedBlog(requestHandler, params.id!);
  return { blog };
}

const BlogPost = (): JSX.Element => {
  const { blog } = useLoaderData() as { blog: Blog };

  return (
    <PageWrapper title={blog.title}>
      <BlogPostContent blog={blog} />
    </PageWrapper>
  );
};

export default BlogPost;
