import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const NavBar = () => {
  const { currentUser, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">Account Manager</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/account">Account</NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-secondary" type="button" onClick={logout}>
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="btn btn-primary" to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
