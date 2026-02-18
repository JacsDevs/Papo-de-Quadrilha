import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, profile, isAdmin, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  const navClassName = ({ isActive }) => `menu-link ${isActive ? 'active' : ''}`

  return (
    <div className="page-shell">
      <header className="site-header">
        <Link to="/" className="brand-block">
          <img src="/media/logo2023PQ.png" alt="Papo de Quadrilha" className="brand-logo" />
        </Link>

        <nav className="menu-links" aria-label="Navegação principal">
          <NavLink to="/" className={navClassName} end>
            Início
          </NavLink>
          <NavLink to="/noticias" className={navClassName}>
            Notícias
          </NavLink>
          <NavLink to="/anuncios" className={navClassName}>
            Anúncios
          </NavLink>
          {user ? (
            <NavLink to="/perfil" className={navClassName}>
              Meu perfil
            </NavLink>
          ) : null}
        </nav>

        <div className="auth-actions">
          {user ? (
            <>
              <span className="user-chip">
                {profile?.displayName || user.displayName || user.email}
                {isAdmin ? <span className="role-admin"> (admin)</span> : null}
              </span>
              <button type="button" className="ghost-button" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button type="button" className="ghost-button">
                  Entrar
                </button>
              </Link>
              <Link to="/cadastro">
                <button type="button" className="primary-button">
                  Criar conta
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        Papo de Quadrilha - {new Date().getFullYear()} - Comunidade em ritmo de festa
      </footer>
    </div>
  )
}
