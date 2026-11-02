import { useState } from 'react';
import API_URL from '../api.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setStatus({ type: 'success', text: 'Message sent! I will get back to you soon.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Contact Me</h1>
      <form onSubmit={handleSubmit} className="card">
        {status && (
          <div className={`alert alert-${status.type}`}>{status.text}</div>
        )}
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn">Send Message</button>
      </form>
    </div>
  );
}
