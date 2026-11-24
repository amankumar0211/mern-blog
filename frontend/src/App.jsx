import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import PostFormPage from './pages/PostFormPage.jsx';

const NotFound = () => (
  <div className="empty">
    <h2>Page not found</h2>
    <Link to="/">Go back to all posts</Link>
  </div>
);

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/new" element={<PostFormPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/posts/:id/edit" element={<PostFormPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
