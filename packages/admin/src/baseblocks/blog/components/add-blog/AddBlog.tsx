import React, { useState, useTransition } from 'react';
import { Blog } from '@baseline/types/blog';
import { createBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import { toast } from 'react-toastify';
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
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (isPending) {
      toast.error('Please wait, blog creation in progress...');
      return;
    }

    const blogData: Partial<Blog> = {
      title,
      content,
      author,
      isPublished,
    };

    startTransition(() => {
      createBlog(getRequestHandler(), blogData)
        .then((newBlog) => {
          props.setAllBlogs((blogs) => [...blogs, newBlog]);
          toast.success('Blog created successfully');

          // Reset form
          setTitle('');
          setContent('');
          setAuthor('');
          setIsPublished(false);
          setIsOpen(false);
        })
        .catch((error) => {
          console.error('Failed to create blog:', error);
          toast.error('Failed to create blog. Please try again.');
        });
    });
  };

  const handleClose = () => {
    if (isPending) {
      toast.error('Please wait, blog creation in progress...');
      return;
    }

    setIsOpen(false);
    setTitle('');
    setContent('');
    setAuthor('');
    setIsPublished(false);
  };

  const getButtonText = () => {
    return isPending ? 'Creating...' : 'Create Blog';
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

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  disabled={isPending}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    disabled={isPending}
                  />
                  Publish immediately
                </label>
              </div>

              <div className={styles.buttons}>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending}>
                  {getButtonText()}
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
