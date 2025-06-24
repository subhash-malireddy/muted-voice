import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps): JSX.Element => {
  const navigate = useNavigate();

  // Extract preview from content (first 150 characters)
  const getPreview = (content: string): string => {
    if (content.length <= 150) return content;
    return content.substring(0, 150).trim() + '...';
  };

  const handleCardClick = () => {
    navigate(`/blogs/${blog.blogId}`);
  };

  return (
    <article className={styles.blogCard} onClick={handleCardClick}>
      <div className={styles.content}>
        <h2 className={styles.title}>{blog.title}</h2>
        <p className={styles.author}>By {blog.author}</p>
        <p className={styles.preview}>{getPreview(blog.content)}</p>
        <button className={styles.readMore}>Read More →</button>
      </div>
    </article>
  );
};

export default BlogCard;
