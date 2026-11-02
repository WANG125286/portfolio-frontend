export default function ProjectCard({ project }) {
  return (
    <div className="card">
      <h3>{project.title}</h3>
      <p style={{ margin: '0.5rem 0' }}>{project.description}</p>
      <div style={{ marginTop: '1rem' }}>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer" style={{ marginRight: '1rem' }}>
            Code
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
