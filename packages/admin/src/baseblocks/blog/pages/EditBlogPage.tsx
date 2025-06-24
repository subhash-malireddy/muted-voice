import React, { useTransition } from 'react';
import {
  useLoaderData,
  LoaderFunctionArgs,
  useNavigate,
} from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { getBlog, updateBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import { toast } from 'react-toastify';
import PageContent from '../../../components/page-content/PageContent';
import BlogEditor from '../components/blog-editor/BlogEditor';
import styles from './EditBlogPage.module.scss';

export async function editBlogLoader({ params }: LoaderFunctionArgs) {
  const blog = await getBlog(getRequestHandler(), params.id!);
  return { blog };
}

const EditBlogPage = (): JSX.Element => {
  const { blog } = useLoaderData() as { blog: Blog };
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (blogData: Partial<Blog>): void => {
    if (isPending) {
      toast.error('Please wait, update in progress...');
      return;
    }

    startTransition(() => {
      updateBlog(getRequestHandler(), blogData)
        .then(() => {
          toast.success('Blog updated successfully');
          navigate('/blogs');
        })
        .catch((error) => {
          console.error('Failed to update blog:', error);
          toast.error('Failed to update blog. Please try again.');
        });
    });
  };

  const handleCancel = (): void => {
    navigate(-1);
  };

  const handleBackToView = (): void => {
    navigate(`/blogs/${blog.blogId}`);
  };

  const getSubmitButtonText = () => {
    return isPending ? 'Updating...' : 'Update Blog';
  };

  return (
    <PageContent>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Blog Post</h1>

          <button
            onClick={handleBackToView}
            disabled={isPending}
            className={styles.backButton}
          >
            ← Back to View
          </button>
        </div>

        {/* Blog Editor */}
        <BlogEditor
          initialBlog={blog}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText={getSubmitButtonText()}
          isLoading={isPending}
        />
      </div>
    </PageContent>
  );
};

export default EditBlogPage;
