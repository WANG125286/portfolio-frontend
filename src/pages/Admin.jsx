import { useState, useEffect } from 'react';
import API_URL from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('projects'); // projects | blog

  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', imageUrl: '', repoUrl: '', liveUrl: '',
  });
  const [editingProject, setEditingProject] = useState(null);

  const [postForm, setPostForm] = useState({ title: '', content: '' });
  const [editingPost, setEditingPost] = useState(null);

  const [error, setError] = useState('');

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user.token}`,
  });

  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`);
    setProjects(await res.json());
  };

  const fetchPosts = async () => {
    const res = await fetch(`${API_URL}/blog`);
    setPosts(await res.json());
  };

  useEffect(() => {
    fetchProjects();
    fetchPosts();
  }, []);

  // Project handlers
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = editingProject
        ? `${API_URL}/projects/${editingProject._id}`
        : `${API_URL}/projects`;
      const method = editingProject ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(projectForm),
      });
      if (!res.ok) throw new Error('Project save failed');
      setProjectForm({ title: '', description: '', imageUrl: '', repoUrl: '', liveUrl: '' });
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProjectDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: authHeaders() });
    fetchProjects();
  };

  const startEditProject = (p) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title, description: p.description, imageUrl: p.imageUrl || '',
      repoUrl: p.repoUrl || '', liveUrl: p.liveUrl || '',
    });
  };

  // Blog handlers
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = editingPost ? `${API_URL}/blog/${editingPost._id}` : `${API_URL}/blog`;
      const method = editingPost ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(postForm),
      });
      if (!res.ok) throw new Error('Post save failed');
      setPostForm({ title: '', content: '' });
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePostDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`${API_URL}/blog/${id}`, { method: 'DELETE', headers: authHeaders() });
    fetchPosts();
  };

  const startEditPost = (p) => {
    setEditingPost(p);
    setPostForm({ title: p.title, content: p.content });
  };

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ marginBottom: '1.5rem' }}>
        <button
          className={`btn ${tab === 'projects' ? '' : 'btn-sm'}`}
          onClick={() => setTab('projects')}
          style={{ marginRight: '0.5rem' }}
        >
          Manage Projects
        </button>
        <button
          className={`btn ${tab === 'blog' ? '' : 'btn-sm'}`}
          onClick={() => setTab('blog')}
        >
          Manage Blog Posts
        </button>
      </div>

      {tab === 'projects' && (
        <>
          <form onSubmit={handleProjectSubmit} className="card">
            <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                value={projectForm.imageUrl}
                onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Repo URL</label>
              <input
                value={projectForm.repoUrl}
                onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Live URL</label>
              <input
                value={projectForm.liveUrl}
                onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
              />
            </div>
            <button type="submit" className="btn">
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
            {editingProject && (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({ title: '', description: '', imageUrl: '', repoUrl: '', liveUrl: '' });
                }}
                style={{ marginLeft: '0.5rem' }}
              >
                Cancel
              </button>
            )}
          </form>

          {projects.map((p) => (
            <div key={p._id} className="card">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <button onClick={() => startEditProject(p)} className="btn btn-sm" style={{ marginTop: '0.5rem' }}>
                Edit
              </button>
              <button
                onClick={() => handleProjectDelete(p._id)}
                className="btn btn-sm btn-danger"
                style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}

      {tab === 'blog' && (
        <>
          <form onSubmit={handlePostSubmit} className="card">
            <h3>{editingPost ? 'Edit Post' : 'Add New Post'}</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                style={{ minHeight: '200px' }}
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn">
              {editingPost ? 'Update Post' : 'Create Post'}
            </button>
            {editingPost && (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  setEditingPost(null);
                  setPostForm({ title: '', content: '' });
                }}
                style={{ marginLeft: '0.5rem' }}
              >
                Cancel
              </button>
            )}
          </form>

          {posts.map((p) => (
            <div key={p._id} className="card">
              <h3>{p.title}</h3>
              <p>{p.content.slice(0, 150)}...</p>
              <button onClick={() => startEditPost(p)} className="btn btn-sm" style={{ marginTop: '0.5rem' }}>
                Edit
              </button>
              <button
                onClick={() => handlePostDelete(p._id)}
                className="btn btn-sm btn-danger"
                style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
