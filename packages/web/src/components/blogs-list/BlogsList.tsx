import React from 'react';
import { Blog } from '@baseline/types/blog';
import styles from './BlogsList.module.scss';
import BlogCard from '../blog-card/BlogCard';

interface BlogsListProps {
  blogs: Blog[];
}

const BlogsList = ({ blogs }: BlogsListProps): JSX.Element => {
  return (
    <div className={styles.blogsPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>In depth articles</p>
        </header>

        {blogs.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No blog posts yet</h3>
            <p>Check back soon for new content!</p>
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {blogs.map((blog) => (
              <BlogCard key={blog.blogId} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsList;
