import React, { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mv:user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    localStorage.setItem('mv:user', JSON.stringify(user))
  }, [user])

  const login = (username, pin) => {
    const newUser = { id: username, pin }
    setUser(newUser)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
