import React, { useState, useEffect } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import { Blog } from '@baseline/types/blog';
import styles from './BlogEditor.module.scss';

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
      <div className={styles.formGroup}>
        <label className={styles.label}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          placeholder="Enter blog title..."
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Author *</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={isLoading}
          placeholder="Enter author name..."
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Content *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          disabled={isLoading}
          placeholder="Write your blog content here..."
          required
          className={styles.textarea}
        />
      </div>

      <div className={styles.checkboxGroup}>
        <label
          className={`${styles.checkboxLabel} ${
            isLoading ? styles.disabled : ''
          }`}
        >
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            disabled={isLoading}
          />
          {isEditMode ? 'Published' : 'Publish immediately'}
        </label>
        {!isEditMode && (
          <small className={styles.helpText}>
            If unchecked, the blog will be saved as a draft
          </small>
        )}
      </div>

      {/* Action buttons */}
      <div className={styles.actionButtons}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className={`${styles.button} ${styles.cancel}`}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isLoading || (isEditMode ? !hasUnsavedChanges : !isFormValid)
          }
          className={`${styles.button} ${styles.submit} ${
            isEditMode
              ? !hasUnsavedChanges || isLoading
                ? styles.disabled
                : ''
              : !isFormValid || isLoading
              ? styles.disabled
              : ''
          }`}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default BlogEditor;
