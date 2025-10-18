import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { getPublishedBlogs } from '@baseline/client-api/blog';
import { createRequestHandler } from '@baseline/client-api/request-handler';
import PageWrapper from '../components/page-wrapper/PageWrapper';
import BlogsList from '../components/blogs-list/BlogsList';

export async function blogsLoader() {
  // Create request handler for public API calls (no authentication)
  const requestHandler = createRequestHandler();
  const blogs = await getPublishedBlogs(requestHandler);
  return { blogs };
}

const Blogs = (): JSX.Element => {
  const { blogs } = useLoaderData() as { blogs: Blog[] };

  return (
    <PageWrapper title="Blog">
      <BlogsList blogs={blogs} />
    </PageWrapper>
  );
};

export default Blogs;
