import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthProvider'

const AccountPage = () => {
  const { currentUser, updateAccount } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName)
      setEmail(currentUser.email)
    }
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="text-center">
        <p className="lead">No account found.</p>
      </div>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setStatus('')

    const result = updateAccount({ fullName, email, password })

    if (!result.ok) {
      setError(result.message)
      return
    }

    setPassword('')
    setStatus('Account details updated successfully.')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card shadow-sm mb-4">
          <div className="card-body p-4">
            <h1 className="h4 mb-3">Account overview</h1>
            <dl className="row mb-0">
              <dt className="col-sm-3">Full name</dt>
              <dd className="col-sm-9">{currentUser.fullName}</dd>
              <dt className="col-sm-3">Email</dt>
              <dd className="col-sm-9">{currentUser.email}</dd>
            </dl>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h5 mb-3">Edit account</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {status && (
              <div className="alert alert-success" role="alert">
                {status}
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">New password</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Leave blank to keep current password"
                />
                <div className="form-text">
                  Must be at least 6 characters if you set a new password.
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
