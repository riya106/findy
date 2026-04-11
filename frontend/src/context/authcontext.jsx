import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('findy_token')
      const storedUser  = localStorage.getItem('findy_user')

      // ✅ check for "undefined" string before parsing
      if (storedToken && storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      // ✅ clear corrupted localStorage data
      console.log('Auth storage error, clearing...', e)
      localStorage.removeItem('findy_token')
      localStorage.removeItem('findy_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('findy_token', jwt)
    localStorage.setItem('findy_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('findy_token')
    localStorage.removeItem('findy_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)