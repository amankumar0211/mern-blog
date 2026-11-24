import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postApi } from '../api/postApi.js';
import Alert from '../components/Alert.jsx';
import PostForm from '../components/PostForm.jsx';
import Spinner from '../components/Spinner.jsx';

export default function PostFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Load existing post when editing
  useEffect(() => {
    if (!isEdit) return;

    let ignore = false;
    setLoading(true);
    setLoadError('');

    postApi
      .getById(id)
      .then((data) => {
        if (!ignore) setPost(data);
      })
      .catch((err) => {
        if (!ignore) setLoadError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, isEdit]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError('');

    try {
      if (isEdit) {
        await postApi.update(id, data);
        navigate(`/posts/${id}`, { state: { message: 'Post updated successfully.' } });
      } else {
        const created = await postApi.create(data);
        navigate(`/posts/${created.id}`, { state: { message: 'Post published successfully.' } });
      }
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  if (isEdit && loading) return <Spinner label="Loading post..." />;

  return (
    <>
      <Link className="back-link" to={isEdit ? `/posts/${id}` : '/'}>
        ← Back
      </Link>

      <h1 style={{ marginTop: 0 }}>{isEdit ? 'Edit Post' : 'Create New Post'}</h1>

      <Alert message={loadError} />
      <Alert message={submitError} onClose={() => setSubmitError('')} />

      {!loadError && (
        <PostForm
          key={post?._id || 'new'}
          initialValues={post}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel={isEdit ? 'Update Post' : 'Publish Post'}
        />
      )}
    </>
  );
}
