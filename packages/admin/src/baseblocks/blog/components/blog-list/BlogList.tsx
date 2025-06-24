import React, { useState } from 'react';
import { Blog } from '@baseline/types/blog';
import { deleteBlog, updateBlog } from '@baseline/client-api/blog';
import ConfirmDelete from '../../../../components/confirm-delete/ConfirmDelete';
import styles from './BlogList.module.scss';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import AddBlog from '../add-blog/AddBlog';

interface Props {
  blogs: Blog[];
}

const BlogList = (props: Props): JSX.Element => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>(props?.blogs || []);

  const handleDelete = async (blogId: string): Promise<void> => {
    await deleteBlog(getRequestHandler(), blogId);
    setAllBlogs((blogs) => blogs.filter((blog) => blog.blogId !== blogId));
  };

  const handlePublish = async (blogId: string): Promise<void> => {
    try {
      const blogToUpdate = allBlogs.find((blog) => blog.blogId === blogId);
      if (blogToUpdate) {
        const updatedBlog = await updateBlog(getRequestHandler(), {
          ...blogToUpdate,
          isPublished: true,
        });
        setAllBlogs((blogs) =>
          blogs.map((blog) => (blog.blogId === blogId ? updatedBlog : blog)),
        );
      }
    } catch (error) {
      console.error('Failed to publish blog:', error);
    }
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
        {allBlogs.map((blog) => (
          <div key={blog.blogId} className={styles.blog}>
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
                  onClick={() => handlePublish(blog.blogId)}
                >
                  Publish
                </button>
              )}
              <ConfirmDelete
                itemName={blog.title}
                deleteFunction={async () => {
                  await handleDelete(blog.blogId);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
