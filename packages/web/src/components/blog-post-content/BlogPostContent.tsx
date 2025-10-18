import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import styles from './BlogPostContent.module.scss';

interface BlogPostContentProps {
  blog: Blog;
}

const BlogPostContent = ({ blog }: BlogPostContentProps): JSX.Element => {
  const navigate = useNavigate();

  const handleBackToBlogs = () => {
    navigate('/blogs');
  };

  return (
    <div className={styles.blogPostPage}>
      <div className={styles.container}>
        {/* Navigation */}
        <div className={styles.navigation}>
          <button onClick={handleBackToBlogs} className={styles.backButton}>
            ← Back to Blog
          </button>
        </div>

        {/* Article */}
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{blog.title}</h1>
            <div className={styles.meta}>
              <span className={styles.author}>By {blog.author}</span>
            </div>
          </header>

          <div className={styles.content}>{blog.content}</div>
        </article>

        {/* Back navigation footer */}
        <footer className={styles.footer}>
          <button
            onClick={handleBackToBlogs}
            className={styles.backButtonSecondary}
          >
            ← Back to Blog
          </button>
        </footer>
      </div>
    </div>
  );
};

export default BlogPostContent;
