import { useState, useEffect } from 'react';
import API_URL from '../api.js';
import BlogPostCard from '../components/BlogPostCard.jsx';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/blog`);
        if (!res.ok) throw new Error('Failed to load posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container alert alert-error">{error}</div>;

  return (
    <div className="container">
      <h1 className="page-title">Blog</h1>
      <div className="grid">
        {posts.map((p) => (
          <BlogPostCard key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
