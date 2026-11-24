import { useEffect, useState } from 'react';

const emptyForm = { title: '', content: '', author: '', tags: '' };

export default function PostForm({ initialValues, onSubmit, submitting, submitLabel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Populate the form when editing an existing post
  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        content: initialValues.content || '',
        author: initialValues.author || '',
        tags: (initialValues.tags || []).join(', '),
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.trim().length > 200) newErrors.title = 'Title must be 200 characters or fewer';
    if (!form.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: form.title.trim(),
      content: form.content.trim(),
      author: form.author.trim() || 'Anonymous',
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="An engaging title"
          maxLength={200}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="author">Author</label>
        <input
          id="author"
          name="author"
          type="text"
          value={form.author}
          onChange={handleChange}
          placeholder="Anonymous"
          maxLength={100}
        />
      </div>

      <div className="field">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          placeholder="react, javascript, tutorial"
        />
        <span className="hint">Separate tags with commas.</span>
      </div>

      <div className="field">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your post..."
        />
        {errors.content && <span className="field-error">{errors.content}</span>}
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
