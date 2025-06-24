import React, { useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { createBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import { toast } from 'react-toastify';
import PageContent from '../../../components/page-content/PageContent';
import BlogEditor from '../components/blog-editor/BlogEditor';
import styles from './CreateBlogPage.module.scss';

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
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Blog Post</h1>

          <button
            onClick={() => navigate('/blogs')}
            disabled={isPending}
            className={styles.backButton}
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
