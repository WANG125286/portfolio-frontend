export default function Home() {
  return (
    <div className="container">
      <h1 className="page-title">Welcome to My Portfolio</h1>
      <div className="card">
        <h2>About Me</h2>
        <p>
          Hi! I'm a web developer passionate about building full-stack applications with
          Node.js, Express, MongoDB, and React. This is my capstone project — a complete
          personal portfolio and blog application.
        </p>
        <p style={{ marginTop: '1rem' }}>
          Explore my <a href="/projects">projects</a>, read my <a href="/blog">blog</a>, or{' '}
          <a href="/contact">get in touch</a>.
        </p>
      </div>
    </div>
  );
}
