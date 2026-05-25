import { Link } from 'react-router-dom'
import type { Project } from '../types'

type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link className="card" to={`/projects/${project.id}`}>
      <img
        className="card-cover"
        src={project.cover}
        alt={project.title}
      />
      <div className="card-body">
        <p className="card-title">{project.title}</p>
        <p className="card-desc">{project.description}</p>
        <div className="card-meta">
          <div className="card-tags">
            {project.tags.map((tag) => (
              <span className="card-tag" key={tag}>{tag}</span>
            ))}
          </div>
          {project.year && <span className="card-year">{project.year}</span>}
        </div>
      </div>
    </Link>
  )
}
