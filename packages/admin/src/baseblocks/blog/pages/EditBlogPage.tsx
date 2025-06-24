import React, { useState, useTransition, useEffect } from 'react';
import {
  useLoaderData,
  LoaderFunctionArgs,
  useNavigate,
  useBeforeUnload,
} from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import { getBlog, updateBlog } from '@baseline/client-api/blog';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import { toast } from 'react-toastify';
import PageContent from '../../../components/page-content/PageContent';

export async function editBlogLoader({ params }: LoaderFunctionArgs) {
  const blog = await getBlog(getRequestHandler(), params.id!);
  return { blog };
}

const EditBlogPage = (): JSX.Element => {
  const { blog } = useLoaderData() as { blog: Blog };
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [author, setAuthor] = useState(blog.author);
  const [isPublished, setIsPublished] = useState(blog.isPublished);

  // Track if form has been modified
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges =
      title !== blog.title ||
      content !== blog.content ||
      author !== blog.author ||
      isPublished !== blog.isPublished;

    setHasUnsavedChanges(hasChanges);
  }, [title, content, author, isPublished, blog]);

  // Warn user about unsaved changes when leaving page
  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (hasUnsavedChanges && !isPending) {
          event.preventDefault();
        }
      },
      [hasUnsavedChanges, isPending],
    ),
  );

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (isPending) {
      toast.error('Please wait, update in progress...');
      return;
    }

    const updatedBlog: Partial<Blog> & { blogId: string } = {
      blogId: blog.blogId,
      title,
      content,
      author,
      isPublished,
    };

    startTransition(() => {
      updateBlog(getRequestHandler(), updatedBlog)
        .then(() => {
          toast.success('Blog updated successfully');
          setHasUnsavedChanges(false);
          navigate('/blogs');
        })
        .catch((error) => {
          console.error('Failed to update blog:', error);
          toast.error('Failed to update blog. Please try again.');
        });
    });
  };

  const handleCancel = (): void => {
    if (hasUnsavedChanges && !isPending) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  const handleBackToView = (): void => {
    if (hasUnsavedChanges && !isPending) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
      );
      if (!confirmLeave) return;
    }
    navigate(`/blogs/${blog.blogId}`);
  };

  const getSubmitButtonText = () => {
    return isPending ? 'Updating...' : 'Update Blog';
  };

  return (
    <PageContent>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e1e5e9',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: 0,
            }}
          >
            Edit Blog Post
          </h1>

          <button
            onClick={handleBackToView}
            disabled={isPending}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 0,
              borderRadius: '4px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              opacity: isPending ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            ← Back to View
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                transition: 'border-color 0.2s, opacity 0.2s',
                backgroundColor: isPending ? '#f8f9fa' : '#fff',
                color: isPending ? '#6c757d' : '#333',
                opacity: isPending ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={isPending}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                transition: 'border-color 0.2s, opacity 0.2s',
                backgroundColor: isPending ? '#f8f9fa' : '#fff',
                color: isPending ? '#6c757d' : '#333',
                opacity: isPending ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              disabled={isPending}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical',
                minHeight: '300px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, opacity 0.2s',
                backgroundColor: isPending ? '#f8f9fa' : '#fff',
                color: isPending ? '#6c757d' : '#333',
                opacity: isPending ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: '500',
                color: '#333',
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                disabled={isPending}
                style={{ marginRight: '0.5rem', cursor: 'inherit' }}
              />
              Published
            </label>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              borderTop: '1px solid #e1e5e9',
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 0,
                borderRadius: '4px',
                cursor: isPending ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                opacity: isPending ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || !hasUnsavedChanges}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor:
                  hasUnsavedChanges && !isPending ? '#28a745' : '#6c757d',
                color: '#fff',
                border: 0,
                borderRadius: '4px',
                cursor:
                  isPending || !hasUnsavedChanges ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                opacity: isPending || !hasUnsavedChanges ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              {getSubmitButtonText()}
            </button>
          </div>
        </form>
      </div>
    </PageContent>
  );
};

export default EditBlogPage;
