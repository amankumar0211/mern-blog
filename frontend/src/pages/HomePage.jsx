import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { postApi } from '../api/postApi.js';
import Alert from '../components/Alert.jsx';
import PostCard from '../components/PostCard.jsx';
import Spinner from '../components/Spinner.jsx';

export default function HomePage() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState(location.state?.message || '');

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await postApi.getAll();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Latest Posts</h1>
        <Link to="/posts/new" className="btn btn-primary">
          + Write a post
        </Link>
      </div>

      <Alert type="success" message={flash} onClose={() => setFlash('')} />
      <Alert message={error} onClose={() => setError('')} />
      {error && (
        <button className="btn btn-secondary" onClick={loadPosts} style={{ marginBottom: '1rem' }}>
          Retry
        </button>
      )}

      {loading ? (
        <Spinner label="Loading posts..." />
      ) : posts.length === 0 ? (
        !error && (
          <div className="empty">
            <p>No posts yet. Be the first to write one!</p>
          </div>
        )
      ) : (
        <div className="grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
