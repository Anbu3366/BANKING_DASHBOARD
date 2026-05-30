"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { setCredentials, clearCredentials } from "../utils/auth"
import { loginUser } from "../utils/api"

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!username || !password) {
      setError("Username and password are required")
      setLoading(false)
      return
    }

    try {
      // Validate credentials with the backend Auth endpoint
      await loginUser(username.trim(), password)
      
      // Store credentials upon successful response
      setCredentials(username.trim(), password)
      navigate("/accounts", { replace: true })
    } catch (err) {
      console.error("Login error:", err)
      if (err.response?.status === 401) {
        setError("Invalid username or password")
      } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        setError("Unable to connect to server. Please check if the backend is running.")
      } else {
        setError(err.response?.data?.message || "An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    clearCredentials()
    setUsername("")
    setPassword("")
    setError("")
  }

  return (
    <div className="max-w-md mx-auto mt-16 mb-16">
      <div className="banking-card relative overflow-hidden border border-border shadow-2xl rounded-2xl p-8 bg-card/65 backdrop-blur-md">
        {/* Glow Element */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary/15 rounded-full blur-2xl"></div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-foreground mb-2 text-center tracking-tight">Sign In</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">Welcome back to SecureBank</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-1.5" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="banking-input px-4 py-3 rounded-xl border border-border"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="banking-input px-4 py-3 rounded-xl border border-border"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="banking-button-primary flex-1 py-3 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition duration-300 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="banking-button-secondary py-3 px-5 rounded-xl font-semibold transition duration-300"
              >
                Clear
              </button>
            </div>
          </form>

          <div className="text-center mt-8 border-t border-border pt-6">
            <span className="text-sm text-muted-foreground font-sans">Don't have an account? </span>
            <Link to="/signup" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
