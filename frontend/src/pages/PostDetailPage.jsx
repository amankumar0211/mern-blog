import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { postApi } from '../api/postApi.js';
import Alert from '../components/Alert.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatDate } from '../utils/format.js';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState(location.state?.message || '');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    postApi
      .getById(id)
      .then((data) => {
        if (!ignore) setPost(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post permanently? This action cannot be undone.')) return;

    setDeleting(true);
    setError('');
    try {
      await postApi.remove(id);
      navigate('/', { state: { message: 'Post deleted successfully.' } });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading post..." />;

  if (!post) {
    return (
      <>
        <Alert message={error || 'Post not found'} />
        <Link className="back-link" to="/">
          ← Back to all posts
        </Link>
      </>
    );
  }

  return (
    <>
      <Link className="back-link" to="/">
        ← Back to all posts
      </Link>

      <Alert type="success" message={flash} onClose={() => setFlash('')} />
      <Alert message={error} onClose={() => setError('')} />

      <article className="card">
        <h1>{post.title}</h1>
        <div className="meta">
          <span>✍️ {post.author}</span>
          <span>📅 {formatDate(post.createdAt)}</span>
          {post.updatedAt !== post.createdAt && <span>✏️ Edited {formatDate(post.updatedAt)}</span>}
        </div>

        {post.tags?.length > 0 && (
          <div className="tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-content">{post.content}</div>

        <div className="actions">
          <Link className="btn btn-secondary" to={`/posts/${post.id}/edit`}>
            Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </article>
    </>
  );
}
