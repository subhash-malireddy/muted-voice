import React, { useState, useTransition } from 'react';
import { Blog } from '@baseline/types/blog';
import { deleteBlog, updateBlog } from '@baseline/client-api/blog';
import ConfirmDelete from '../../../../components/confirm-delete/ConfirmDelete';
import styles from './BlogPost.module.scss';
import { getRequestHandler } from '@baseline/client-api/request-handler';

interface BlogPostProps {
  blog: Blog;
  onDelete: (blogId: string) => void;
  onUpdate: (updatedBlog: Blog) => void;
  onError: (error: string) => void;
}

const BlogPost = ({
  blog,
  onDelete,
  onUpdate,
  onError,
}: BlogPostProps): JSX.Element => {
  const [isPending, startTransition] = useTransition();
  const [currentOperation, setCurrentOperation] = useState<
    'publish' | 'delete' | null
  >(null);

  const handleDelete = async (): Promise<void> => {
    if (isPending) {
      onError(
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
        })
        .catch((error) => {
          console.error('Failed to delete blog:', error);
          onError('Failed to delete blog. Please try again.');
        })
        .finally(() => {
          setCurrentOperation(null);
        });
    });
  };

  const handlePublish = async (): Promise<void> => {
    if (isPending) {
      onError(
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
        })
        .catch((error) => {
          console.error('Failed to publish blog:', error);
          onError('Failed to publish blog. Please try again.');
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

  const isDeleteLoading = isPending && currentOperation === 'delete';

  return (
    <div className={styles.blogPost}>
      <div className={styles.info}>
        <div className={styles.details}>
          <div className={styles.title}>{blog.title}</div>
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
