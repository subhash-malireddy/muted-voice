import React, { useState, useTransition } from 'react';
import { Blog } from '@baseline/types/blog';
import { deleteBlog, updateBlog } from '@baseline/client-api/blog';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmDelete from '../../../../components/confirm-delete/ConfirmDelete';
import styles from './BlogPost.module.scss';
import { getRequestHandler } from '@baseline/client-api/request-handler';

interface BlogPostProps {
  blog: Blog;
  onDelete: (blogId: string) => void;
  onUpdate: (updatedBlog: Blog) => void;
}

const BlogPost = ({ blog, onDelete, onUpdate }: BlogPostProps): JSX.Element => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [currentOperation, setCurrentOperation] = useState<
    'publish' | 'delete' | null
  >(null);

  const handleDelete = (): void => {
    if (isPending) {
      toast.error(
        `Please wait, ${
          currentOperation === 'publish' ? 'publishing' : 'deleting'
        } operation in progress...`,
      );
      return;
    }

    setCurrentOperation('delete');

    startTransition(() => {
      deleteBlog(getRequestHandler(), blog.blogId)
        .then(() => {
          onDelete(blog.blogId);
          toast.success('Blog deleted successfully');
        })
        .catch((error) => {
          console.error('Failed to delete blog:', error);
          toast.error('Failed to delete blog. Please try again.');
        })
        .finally(() => {
          setCurrentOperation(null);
        });
    });
  };

  const handlePublish = (): void => {
    if (isPending) {
      toast.error(
        `Please wait, ${
          currentOperation === 'delete' ? 'deleting' : 'publishing'
        } operation in progress...`,
      );
      return;
    }

    setCurrentOperation('publish');

    startTransition(() => {
      updateBlog(getRequestHandler(), {
        ...blog,
        isPublished: true,
      })
        .then((updatedBlog) => {
          onUpdate(updatedBlog);
          toast.success('Blog published successfully');
        })
        .catch((error) => {
          console.error('Failed to publish blog:', error);
          toast.error('Failed to publish blog. Please try again.');
        })
        .finally(() => {
          setCurrentOperation(null);
        });
    });
  };

  const getPublishButtonText = () => {
    if (!isPending) return 'Publish';
    return currentOperation === 'publish' ? 'Publishing...' : 'Publish';
  };

  const handleTitleClick = () => {
    navigate(`/blogs/${blog.blogId}`);
  };

  const handleEditClick = () => {
    navigate(`/blogs/${blog.blogId}/edit`);
  };

  const isDeleteLoading = isPending && currentOperation === 'delete';

  return (
    <div className={styles.blogPost}>
      <div className={styles.info}>
        <div className={styles.details}>
          <div
            className={styles.title}
            onClick={handleTitleClick}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {blog.title}
          </div>
          <div className={styles.author}>By {blog.author}</div>
        </div>
        <div
          className={`${styles.pill} ${
            blog.isPublished ? styles.published : styles.draft
          }`}
        >
          {blog.isPublished ? 'Published' : 'Draft'}
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          onClick={handleEditClick}
          disabled={isPending}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 0,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginRight: '0.5rem',
            transition: 'background-color 0.2s',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          Edit
        </button>
        {!blog.isPublished && (
          <button
            className={styles.publishBtn}
            onClick={handlePublish}
            disabled={isPending}
          >
            {getPublishButtonText()}
          </button>
        )}
        <ConfirmDelete
          itemName={blog.title}
          deleteFunction={handleDelete}
          isLoading={isDeleteLoading}
        />
      </div>
    </div>
  );
};

export default BlogPost;
