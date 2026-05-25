import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import ProjectCard from '../components/ProjectCard'
import { profile } from '../data/profile'
import { projects } from '../data/projects'

const categoryGroups = [
  { key: '项目', en: 'Projects', cn: '项目' },
  { key: '文章', en: 'Articles', cn: '文章' },
  { key: '摄影', en: 'Photography', cn: '摄影' },
] as const

export default function HomePage() {
  return (
    <div className="page-shell">
      <NavBar />

      <main>
        {/* Hero */}
        <header className="hero">
          <p className="hero-quote">{profile.role}</p>
          <div className="hero-divider" />
          <p className="hero-name">{profile.name}</p>
          <p className="hero-location">
            {profile.details.find((d) => d.label === 'Location')?.value}
          </p>
        </header>

        {/* About */}
        <section id="about">
          <p className="section-label">About</p>
          {profile.about.map((p, i) => (
            <p className="about-desc" key={i}>{p}</p>
          ))}
          <div className="about-links">
            <a
              className="about-link"
              href="https://github.com/qimingxing26"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a className="about-link" href="mailto:2053982446@qq.com">
              Email
            </a>
          </div>
        </section>

        {/* Works */}
        <section id="works">
          {categoryGroups.map((group) => {
            const items = projects.filter((p) => p.category === group.key)
            if (items.length === 0) return null
            return (
              <div className="works-section" key={group.key}>
                <div className="works-section-header">
                  <span className="works-section-title">{group.en}</span>
                  <span className="works-section-cn">{group.cn}</span>
                </div>
                <div className="card-grid">
                  {items.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      </main>

      <Footer />
    </div>
  )
}
