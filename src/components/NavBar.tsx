import { useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

type NavBarProps = {
  variant?: 'home' | 'back'
}

export default function NavBar({ variant = 'home' }: NavBarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToHash = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      e.preventDefault()
      if (location.pathname !== '/') {
        navigate('/')
        // After navigation, scroll to the element
        setTimeout(() => {
          const el = document.querySelector(hash)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 50)
      } else {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [location.pathname, navigate],
  )

  return (
    <nav className="nav">
      <div className="nav__inner">
        {variant === 'back' ? (
          <>
            <Link className="back-link" to="/">
              <span className="back-arrow">&larr;</span> Back
            </Link>
            <span className="nav__brand">My Site</span>
          </>
        ) : (
          <>
            <Link className="nav__logo" to="/">MY SITE</Link>
            <div className="nav__links">
              <a href="/#about" onClick={(e) => scrollToHash(e, '#about')}>About</a>
              <a href="/#works" onClick={(e) => scrollToHash(e, '#works')}>Works</a>
              <Link className="nav__admin" to="/admin/login">Admin</Link>
              <ThemeToggle />
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
