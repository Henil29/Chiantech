import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const ACCOUNTS_KEY = 'account-manager:accounts'
const CURRENT_USER_KEY = 'account-manager:currentUser'
const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem(ACCOUNTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to read accounts from storage', error)
      return []
    }
  })

  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      return localStorage.getItem(CURRENT_USER_KEY)
    } catch (error) {
      console.error('Failed to read current user from storage', error)
      return null
    }
  })

  const currentUser = useMemo(
    () => accounts.find((account) => account.id === currentUserId) ?? null,
    [accounts, currentUserId],
  )

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(CURRENT_USER_KEY, currentUserId)
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }, [currentUserId])

  const register = useCallback(
    ({ fullName, email, password }) => {
      const trimmedName = fullName.trim()
      const normalizedEmail = email.trim().toLowerCase()

      if (!trimmedName) {
        return { ok: false, message: 'Full name is required.' }
      }

      if (!normalizedEmail) {
        return { ok: false, message: 'Email is required.' }
      }

      if (password.length < 6) {
        return { ok: false, message: 'Password must be at least 6 characters.' }
      }

      if (accounts.some((account) => account.email === normalizedEmail)) {
        return { ok: false, message: 'An account with this email already exists.' }
      }

      const newAccount = {
        id: generateId(),
        fullName: trimmedName,
        email: normalizedEmail,
        password,
      }

      setAccounts((prev) => [...prev, newAccount])
      setCurrentUserId(newAccount.id)
      return { ok: true, account: newAccount }
    },
    [accounts],
  )

  const login = useCallback(
    (email, password) => {
      const normalizedEmail = email.trim().toLowerCase()
      const match = accounts.find(
        (account) => account.email === normalizedEmail && account.password === password,
      )

      if (!match) {
        return { ok: false, message: 'Invalid email or password.' }
      }

      setCurrentUserId(match.id)
      return { ok: true, account: match }
    },
    [accounts],
  )

  const logout = useCallback(() => {
    setCurrentUserId(null)
  }, [])

  const updateAccount = useCallback(
    ({ fullName, email, password }) => {
      if (!currentUserId) {
        return { ok: false, message: 'You must be logged in to update your account.' }
      }

      const updates = {}

      if (typeof fullName === 'string') {
        const trimmedName = fullName.trim()
        if (!trimmedName) {
          return { ok: false, message: 'Full name cannot be empty.' }
        }
        updates.fullName = trimmedName
      }

      if (typeof email === 'string') {
        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedEmail) {
          return { ok: false, message: 'Email cannot be empty.' }
        }
        const emailTaken = accounts.some(
          (account) => account.email === normalizedEmail && account.id !== currentUserId,
        )
        if (emailTaken) {
          return { ok: false, message: 'Another account already uses this email.' }
        }
        updates.email = normalizedEmail
      }

      if (typeof password === 'string') {
        if (password && password.length < 6) {
          return { ok: false, message: 'Password must be at least 6 characters.' }
        }
        if (password) {
          updates.password = password
        }
      }

      setAccounts((prev) =>
        prev.map((account) =>
          account.id === currentUserId ? { ...account, ...updates } : account,
        ),
      )

      return { ok: true }
    },
    [accounts, currentUserId],
  )

  const value = useMemo(
    () => ({
      accounts,
      currentUser,
      register,
      login,
      logout,
      updateAccount,
    }),
    [accounts, currentUser, login, logout, register, updateAccount],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
