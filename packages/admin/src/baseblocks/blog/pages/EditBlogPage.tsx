import React from 'react';
import { useLoaderData, LoaderFunctionArgs } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { getBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import PageContent from '../../../components/page-content/PageContent';

export async function editBlogLoader({ params }: LoaderFunctionArgs) {
  const blog = await getBlog(getRequestHandler(), params.id!);
  return { blog };
}

const EditBlogPage = (): JSX.Element => {
  const { blog } = useLoaderData() as { blog: Blog };

  return (
    <PageContent>
      <div>
        <h1>Edit Blog Post</h1>

        {/* TODO: Add BlogEditor component here */}
        <div>
          <h3>Current Data:</h3>
          <p>Title: {blog.title}</p>
          <p>Author: {blog.author}</p>
          <p>Status: {blog.isPublished ? 'Published' : 'Draft'}</p>
          <p>Content: {blog.content}</p>
        </div>

        {/* TODO: Add form with Save/Cancel buttons */}
      </div>
    </PageContent>
  );
};

export default EditBlogPage;
