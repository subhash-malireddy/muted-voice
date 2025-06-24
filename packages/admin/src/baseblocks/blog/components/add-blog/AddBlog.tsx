import React, { useState } from 'react';
import { Blog } from '@baseline/types/blog';
import { createBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import styles from './AddBlog.module.scss';

interface Props {
  setAllBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
}

const AddBlog = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const blogData: Partial<Blog> = {
      title,
      content,
      author,
      isPublished,
    };

    try {
      const newBlog = await createBlog(getRequestHandler(), blogData);
      props.setAllBlogs((blogs) => [...blogs, newBlog]);

      // Reset form
      setTitle('');
      setContent('');
      setAuthor('');
      setIsPublished(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create blog:', error);
      setError('Failed to create blog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setTitle('');
    setContent('');
    setAuthor('');
    setIsPublished(false);
  };

  return (
    <>
      <button className={styles.addButton} onClick={() => setIsOpen(true)}>
        Add Blog
      </button>

      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add New Blog</h2>

            {error && (
              <div className={styles.errorMessage}>
                {error}
                <button
                  className={styles.dismissError}
                  onClick={() => setError(null)}
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    disabled={isLoading}
                  />
                  Publish immediately
                </label>
              </div>

              <div className={styles.buttons}>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBlog;
