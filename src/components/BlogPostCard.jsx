import { Link } from 'react-router-dom';

export default function BlogPostCard({ post }) {
  return (
    <div className="card">
      <h3>
        <Link to={`/blog/${post._id}`}>{post.title}</Link>
      </h3>
      <p style={{ color: '#718096', fontSize: '0.9rem' }}>
        By {post.author?.username || 'Anonymous'} · {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p style={{ marginTop: '0.5rem' }}>{post.content.slice(0, 120)}...</p>
    </div>
  );
}
