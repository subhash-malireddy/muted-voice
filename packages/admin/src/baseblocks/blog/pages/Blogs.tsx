import React from 'react';
import { Blog } from '@baseline/types/blog';
import { useLoaderData } from 'react-router-dom';
import { getAllBlogs } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import PageContent from '../../../components/page-content/PageContent';
import BlogList from '../components/blog-list/BlogList';

export async function blogListLoader() {
  const blogs = await getAllBlogs(getRequestHandler());
  return {
    blogs: blogs,
  };
}

const Blogs = (): JSX.Element => {
  const { blogs } = useLoaderData() as { blogs: Blog[] };

  return (
    <PageContent>
      <BlogList blogs={blogs} />
    </PageContent>
  );
};

export default Blogs;
