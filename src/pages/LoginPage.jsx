import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (currentUser) {
      navigate('/account', { replace: true })
    }
  }, [currentUser, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    const result = login(email, password)

    if (!result.ok) {
      setError(result.message)
      return
    }

    const redirectTo = location.state?.from?.pathname ?? '/account'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h4 text-center mb-4">Welcome Back</h1>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Sign in</button>
            </form>
            <p className="text-center mt-3 mb-0">
              Need an account?{' '}
              <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
