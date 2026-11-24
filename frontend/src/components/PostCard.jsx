import { Link } from 'react-router-dom';
import { excerpt, formatDate } from '../utils/format.js';

export default function PostCard({ post }) {
  return (
    <article className="card">
      <h2 className="card-title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>

      <div className="meta">
        <span>✍️ {post.author}</span>
        <span>📅 {formatDate(post.createdAt)}</span>
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

      <p className="excerpt">{excerpt(post.content)}</p>
      <Link className="read-more" to={`/posts/${post.id}`}>
        Read more →
      </Link>
    </article>
  );
}
