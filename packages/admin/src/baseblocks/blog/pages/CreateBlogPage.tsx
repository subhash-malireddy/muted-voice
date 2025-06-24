import React, { useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { createBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import { toast } from 'react-toastify';
import PageContent from '../../../components/page-content/PageContent';
import BlogEditor from '../components/blog-editor/BlogEditor';

const CreateBlogPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (blogData: Partial<Blog>): void => {
    if (isPending) {
      toast.error('Please wait, creation in progress...');
      return;
    }

    startTransition(() => {
      createBlog(getRequestHandler(), blogData)
        .then(() => {
          toast.success('Blog created successfully');
          navigate('/blogs');
        })
        .catch((error) => {
          console.error('Failed to create blog:', error);
          toast.error('Failed to create blog. Please try again.');
        });
    });
  };

  const handleCancel = (): void => {
    navigate(-1);
  };

  const getSubmitButtonText = () => {
    return isPending ? 'Creating...' : 'Create Blog';
  };

  return (
    <PageContent>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        {/* Header */}
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
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: 0,
            }}
          >
            Create New Blog Post
          </h1>

          <button
            onClick={() => navigate('/blogs')}
            disabled={isPending}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 0,
              borderRadius: '4px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              opacity: isPending ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            ← Back to List
          </button>
        </div>

        {/* Blog Editor */}
        <BlogEditor
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText={getSubmitButtonText()}
          isLoading={isPending}
        />
      </div>
    </PageContent>
  );
};

export default CreateBlogPage;
