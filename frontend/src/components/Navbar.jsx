import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          📝 MERN Blog
        </Link>
        <Link to="/posts/new" className="btn btn-primary">
          + New Post
        </Link>
      </div>
    </nav>
  );
}
