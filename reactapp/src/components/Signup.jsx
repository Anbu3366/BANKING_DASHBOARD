"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../utils/api"

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        password: formData.password,
      }

      await registerUser(payload)
      setSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 mb-12">
      <div className="banking-card relative overflow-hidden border border-border shadow-2xl rounded-2xl p-8 bg-card/65 backdrop-blur-md">
        {/* Glow Element */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary/15 rounded-full blur-2xl"></div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-foreground mb-2 text-center tracking-tight">Create Account</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">Join SecureBank and manage your finances smarter</p>

          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-center font-medium animate-pulse mb-6">
              Registration successful! Redirecting to sign in...
            </div>
          ) : (
            <>
              {apiError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-1.5" htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`banking-input px-4 py-3 rounded-xl border ${errors.fullName ? "border-destructive focus:ring-destructive/30" : "border-border"}`}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <p className="text-destructive text-xs mt-1 font-medium">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-1.5" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`banking-input px-4 py-3 rounded-xl border ${errors.email ? "border-destructive focus:ring-destructive/30" : "border-border"}`}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-1.5" htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`banking-input px-4 py-3 rounded-xl border ${errors.username ? "border-destructive focus:ring-destructive/30" : "border-border"}`}
                    placeholder="john_doe"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && <p className="text-destructive text-xs mt-1 font-medium">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-1.5" htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`banking-input px-4 py-3 rounded-xl border ${errors.password ? "border-destructive focus:ring-destructive/30" : "border-border"}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className="text-destructive text-xs mt-1 font-medium">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`banking-input px-4 py-3 rounded-xl border ${errors.confirmPassword ? "border-destructive focus:ring-destructive/30" : "border-border"}`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && <p className="text-destructive text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="banking-button-primary w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition duration-300 mt-6 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>
            </>
          )}

          <div className="text-center mt-6">
            <span className="text-sm text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
