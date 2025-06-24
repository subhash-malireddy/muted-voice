import React, { useState } from 'react';
import { Blog } from '@baseline/types/blog';
import { useNavigate } from 'react-router-dom';
import styles from './BlogList.module.scss';
import BlogPost from '../blog-post/BlogPost';

interface BlogListProps {
  blogs: Blog[];
}

const BlogList = ({ blogs }: BlogListProps): JSX.Element => {
  const navigate = useNavigate();
  const [allBlogs, setAllBlogs] = useState<Blog[]>(blogs);

  const handleBlogDelete = (blogId: string) => {
    setAllBlogs((blogs) => blogs.filter((blog) => blog.blogId !== blogId));
  };

  const handleBlogUpdate = (updatedBlog: Blog) => {
    setAllBlogs((blogs) =>
      blogs.map((blog) =>
        blog.blogId === updatedBlog.blogId ? updatedBlog : blog,
      ),
    );
  };

  const handleNewBlogClick = () => {
    navigate('/blogs/new');
  };

  return (
    <div className={styles.blogList}>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={styles.blogCount}>
            You have {allBlogs.length} blog posts
          </div>
          <button
            onClick={handleNewBlogClick}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 0,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
          >
            New Blog
          </button>
        </div>

        <div className={styles.blogPosts}>
          {allBlogs.map((blog) => (
            <BlogPost
              key={blog.blogId}
              blog={blog}
              onDelete={handleBlogDelete}
              onUpdate={handleBlogUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
