import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import { AuthProvider, useAuth } from './context/AuthProvider'
import AccountPage from './pages/AccountPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './routes/ProtectedRoute'

const HomeRedirect = () => {
  const { currentUser } = useAuth()
  return <Navigate to={currentUser ? '/account' : '/login'} replace />
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <div className="bg-body-tertiary min-vh-100 d-flex flex-column">
        <NavBar />
        <main className="container flex-grow-1 pb-5">
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="account" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-light border-top py-3 mt-auto">
          <div className="container text-center small text-muted">
            © {new Date().getFullYear()} Account Manager Demo
          </div>
        </footer>
      </div>
    </AuthProvider>
  </BrowserRouter>
)

export default App