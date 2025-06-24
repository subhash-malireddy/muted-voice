import React from 'react';
import {
  useLoaderData,
  LoaderFunctionArgs,
  useNavigate,
} from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate('/blogs');
  };

  const handleEdit = () => {
    navigate(`/blogs/${blog.blogId}/edit`);
  };

  return (
    <PageContent>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        {/* Header with navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e1e5e9',
          }}
        >
          <button
            onClick={handleBackToList}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 0,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s',
            }}
          >
            ← Back to List
          </button>

          <button
            onClick={handleEdit}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 0,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s',
            }}
          >
            Edit Post
          </button>
        </div>

        {/* Blog content */}
        <article>
          {/* Title and metadata */}
          <header style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '1rem',
                lineHeight: '1.2',
              }}
            >
              {blog.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.95rem',
                color: '#666',
                marginBottom: '1rem',
              }}
            >
              <span>
                By <strong>{blog.author}</strong>
              </span>
              <span>•</span>
              <div
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  backgroundColor: blog.isPublished ? '#d4edda' : '#fff3cd',
                  color: blog.isPublished ? '#155724' : '#856404',
                }}
              >
                {blog.isPublished ? 'Published' : 'Draft'}
              </div>
            </div>
          </header>

          {/* Content */}
          <div
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: '#333',
              whiteSpace: 'pre-wrap',
              backgroundColor: '#f8f9fa',
              padding: '2rem',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
            }}
          >
            {blog.content}
          </div>
        </article>
      </div>
    </PageContent>
  );
};

export default ViewBlogPage;
