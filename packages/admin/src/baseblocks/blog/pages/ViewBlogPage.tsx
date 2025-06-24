import React from 'react';
import { useLoaderData, LoaderFunctionArgs } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { getBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import PageContent from '../../../components/page-content/PageContent';

export async function viewBlogLoader({ params }: LoaderFunctionArgs) {
  const blog = await getBlog(getRequestHandler(), params.id!);
  return { blog };
}

const ViewBlogPage = (): JSX.Element => {
  const { blog } = useLoaderData() as { blog: Blog };

  return (
    <PageContent>
      <div>
        <h1>View Blog Post</h1>
        <h2>{blog.title}</h2>
        <p>By: {blog.author}</p>
        <p>Status: {blog.isPublished ? 'Published' : 'Draft'}</p>
        <div>
          <h3>Content:</h3>
          <p>{blog.content}</p>
        </div>

        {/* TODO: Add Edit button and Back to list button */}
      </div>
    </PageContent>
  );
};

export default ViewBlogPage;
