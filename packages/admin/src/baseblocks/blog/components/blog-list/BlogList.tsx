import React, { useState } from 'react';
import { Blog } from '@baseline/types/blog';
import styles from './BlogList.module.scss';
import AddBlog from '../add-blog/AddBlog';
import BlogPost from '../blog-post/BlogPost';

interface BlogListProps {
  blogs: Blog[];
}

const BlogList = ({ blogs }: BlogListProps): JSX.Element => {
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

  return (
    <div className={styles.blogList}>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={styles.blogCount}>
            You have {allBlogs.length} blog posts
          </div>
          <AddBlog setAllBlogs={setAllBlogs} />
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
