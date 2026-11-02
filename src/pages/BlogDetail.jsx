import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');

  const fetchPost = async () => {
    try {
      const res = await fetch(`${API_URL}/blog/${id}`);
      if (!res.ok) throw new Error('Failed to load post');
      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    try {
      const res = await fetch(`${API_URL}/blog/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ body: comment }),
      });
      if (!res.ok) throw new Error('Failed to post comment');
      setComment('');
      fetchPost();
    } catch (err) {
      setCommentError(err.message);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container alert alert-error">{error}</div>;
  if (!post) return <div className="container">Post not found.</div>;

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <p style={{ color: '#718096' }}>
        By {post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="card" style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        {post.content}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Comments</h2>
      {post.comments?.map((c) => (
        <div key={c._id} className="card">
          <strong>{c.author?.username}</strong>
          <p style={{ fontSize: '0.85rem', color: '#718096' }}>
            {new Date(c.createdAt).toLocaleString()}
          </p>
          <p style={{ marginTop: '0.5rem' }}>{c.body}</p>
        </div>
      ))}

      {user ? (
        <form onSubmit={handleCommentSubmit} className="card">
          <h3>Leave a comment</h3>
          {commentError && <div className="alert alert-error">{commentError}</div>}
          <div className="form-group">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Post Comment</button>
        </form>
      ) : (
        <p style={{ marginTop: '1rem' }}>
          Please <a href="/login">log in</a> to leave a comment.
        </p>
      )}
    </div>
  );
}
