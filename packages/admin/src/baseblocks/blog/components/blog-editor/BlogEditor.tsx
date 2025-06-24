import React, { useState, useEffect } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';

interface BlogEditorProps {
  initialBlog?: Partial<Blog>;
  onSubmit: (blogData: Partial<Blog>) => void;
  onCancel: () => void;
  submitButtonText: string;
  isLoading: boolean;
}

const BlogEditor = ({
  initialBlog,
  onSubmit,
  onCancel,
  submitButtonText,
  isLoading,
}: BlogEditorProps): JSX.Element => {
  // Form state with initial values
  const [title, setTitle] = useState(initialBlog?.title || '');
  const [content, setContent] = useState(initialBlog?.content || '');
  const [author, setAuthor] = useState(initialBlog?.author || '');
  const [isPublished, setIsPublished] = useState(
    initialBlog?.isPublished || false,
  );

  // Track if form has been modified
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = initialBlog
      ? // Edit mode: compare with original values
        title !== (initialBlog.title || '') ||
        content !== (initialBlog.content || '') ||
        author !== (initialBlog.author || '') ||
        isPublished !== (initialBlog.isPublished || false)
      : // Create mode: check if any fields have content
        title.trim() !== '' ||
        content.trim() !== '' ||
        author.trim() !== '' ||
        isPublished !== false;

    setHasUnsavedChanges(hasChanges);
  }, [title, content, author, isPublished, initialBlog]);

  // Warn user about unsaved changes when leaving page
  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (hasUnsavedChanges && !isLoading) {
          event.preventDefault();
        }
      },
      [hasUnsavedChanges, isLoading],
    ),
  );

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const blogData: Partial<Blog> = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      isPublished,
    };

    // Include blogId for edit mode
    if (initialBlog?.blogId) {
      (blogData as any).blogId = initialBlog.blogId;
    }

    onSubmit(blogData);
  };

  const handleCancel = (): void => {
    if (hasUnsavedChanges && !isLoading) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
      );
      if (!confirmLeave) return;
    }
    onCancel();
  };

  const isFormValid = title.trim() && content.trim() && author.trim();
  const isEditMode = !!initialBlog?.blogId;

  return (
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
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          placeholder="Enter blog title..."
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            transition: 'border-color 0.2s, opacity 0.2s',
            backgroundColor: isLoading ? '#f8f9fa' : '#fff',
            color: isLoading ? '#6c757d' : '#333',
            opacity: isLoading ? 0.6 : 1,
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
          Author *
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={isLoading}
          placeholder="Enter author name..."
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            transition: 'border-color 0.2s, opacity 0.2s',
            backgroundColor: isLoading ? '#f8f9fa' : '#fff',
            color: isLoading ? '#6c757d' : '#333',
            opacity: isLoading ? 0.6 : 1,
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
          Content *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          disabled={isLoading}
          placeholder="Write your blog content here..."
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
            backgroundColor: isLoading ? '#f8f9fa' : '#fff',
            color: isLoading ? '#6c757d' : '#333',
            opacity: isLoading ? 0.6 : 1,
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
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            disabled={isLoading}
            style={{ marginRight: '0.5rem', cursor: 'inherit' }}
          />
          {isEditMode ? 'Published' : 'Publish immediately'}
        </label>
        {!isEditMode && (
          <small
            style={{
              display: 'block',
              marginTop: '0.25rem',
              color: '#666',
              fontSize: '0.85rem',
            }}
          >
            If unchecked, the blog will be saved as a draft
          </small>
        )}
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
          disabled={isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 0,
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
            opacity: isLoading ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isLoading || (isEditMode ? !hasUnsavedChanges : !isFormValid)
          }
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isEditMode
              ? hasUnsavedChanges && !isLoading
                ? '#28a745'
                : '#6c757d'
              : isFormValid && !isLoading
              ? '#28a745'
              : '#6c757d',
            color: '#fff',
            border: 0,
            borderRadius: '4px',
            cursor: isEditMode
              ? isLoading || !hasUnsavedChanges
                ? 'not-allowed'
                : 'pointer'
              : isLoading || !isFormValid
              ? 'not-allowed'
              : 'pointer',
            fontSize: '0.95rem',
            opacity: isEditMode
              ? isLoading || !hasUnsavedChanges
                ? 0.6
                : 1
              : isLoading || !isFormValid
              ? 0.6
              : 1,
            transition: 'all 0.2s',
          }}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default BlogEditor;
