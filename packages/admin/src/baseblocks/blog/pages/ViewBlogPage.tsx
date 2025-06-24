import React from 'react';
import {
  useLoaderData,
  LoaderFunctionArgs,
  useNavigate,
} from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { getBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import PageContent from '../../../components/page-content/PageContent';
import styles from './ViewBlogPage.module.scss';

export async function viewBlogLoader({ params }: LoaderFunctionArgs) {
  const blog = await getBlog(getRequestHandler(), params.id);
  return { blog };
}

const ViewBlogPage = (): JSX.Element => {
  const { blog } = useLoaderData() as { blog: Blog };
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate('/blogs');
  };

  const handleEdit = () => {
    navigate(`/blogs/${blog.blogId}/edit`);
  };

  return (
    <PageContent>
      <div className={styles.container}>
        {/* Header with navigation */}
        <div className={styles.header}>
          <button
            onClick={handleBackToList}
            className={`${styles.button} ${styles.back}`}
          >
            ← Back to List
          </button>

          <button
            onClick={handleEdit}
            className={`${styles.button} ${styles.edit}`}
          >
            Edit Post
          </button>
        </div>

        {/* Blog content */}
        <article className={styles.article}>
          {/* Title and metadata */}
          <header className={styles.articleHeader}>
            <h1 className={styles.title}>{blog.title}</h1>

            <div className={styles.metadata}>
              <span className={styles.author}>
                By <strong>{blog.author}</strong>
              </span>
              <span className={styles.divider}>•</span>
              <div
                className={`${styles.statusPill} ${
                  blog.isPublished ? styles.published : styles.draft
                }`}
              >
                {blog.isPublished ? 'Published' : 'Draft'}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className={styles.content}>{blog.content}</div>
        </article>
      </div>
    </PageContent>
  );
};

export default ViewBlogPage;
