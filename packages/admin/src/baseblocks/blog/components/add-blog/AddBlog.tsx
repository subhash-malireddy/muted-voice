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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

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
    }
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
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  Publish immediately
                </label>
              </div>

              <div className={styles.buttons}>
                <button type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Create Blog</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBlog;
