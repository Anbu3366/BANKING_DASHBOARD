"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { createAccount } from "../utils/api"
import { validateAccountNumber, validateAmount } from "../utils/helpers"
import { ACCOUNT_TYPES, MINIMUM_INITIAL_BALANCE, ERROR_MESSAGES } from "../utils/constants"

const CreateAccountForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountHolderName: "",
    balance: "",
    accountType: "Savings",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = ERROR_MESSAGES.REQUIRED_FIELD
    } else if (!validateAccountNumber(formData.accountNumber)) {
      newErrors.accountNumber = ERROR_MESSAGES.INVALID_ACCOUNT_NUMBER
    }

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = ERROR_MESSAGES.REQUIRED_FIELD
    }

    if (!formData.balance) {
      newErrors.balance = ERROR_MESSAGES.REQUIRED_FIELD
    } else if (!validateAmount(formData.balance)) {
      newErrors.balance = ERROR_MESSAGES.INVALID_AMOUNT
    } else if (Number.parseFloat(formData.balance) < MINIMUM_INITIAL_BALANCE) {
      newErrors.balance = `Initial balance must be at least $${MINIMUM_INITIAL_BALANCE}`
    }

    if (!formData.accountType) {
      newErrors.accountType = ERROR_MESSAGES.REQUIRED_FIELD
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setApiError("")

      const accountData = {
        ...formData,
        balance: Number.parseFloat(formData.balance),
      }

      await createAccount(accountData)
      navigate("/accounts")
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create account. Please verify connectivity.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-card/20 py-2 px-4 rounded-xl border border-border/40 w-fit">
        <Link to="/accounts" className="hover:text-primary transition-colors font-medium">
          Dashboard
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-semibold">Create Account</span>
      </div>

      <div className="banking-card relative overflow-hidden border border-border shadow-2xl rounded-2xl p-8 bg-card/65 backdrop-blur-md">
        {/* Glow Element */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Create New Account</h2>
          <p className="text-sm text-muted-foreground mb-6">Open a new savings or checking account with SecureBank</p>

          {apiError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-semibold text-foreground/80 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className={`banking-input ${errors.accountNumber ? "border-destructive focus:ring-destructive/35" : ""}`}
                placeholder="Enter 10-digit account number"
                maxLength="10"
              />
              {errors.accountNumber && <div className="error-message">{errors.accountNumber}</div>}
            </div>

            <div>
              <label htmlFor="accountHolderName" className="block text-sm font-semibold text-foreground/80 mb-2">
                Account Holder Name *
              </label>
              <input
                type="text"
                id="accountHolderName"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                className={`banking-input ${errors.accountHolderName ? "border-destructive focus:ring-destructive/35" : ""}`}
                placeholder="Enter full name"
              />
              {errors.accountHolderName && <div className="error-message">{errors.accountHolderName}</div>}
            </div>

            <div>
              <label htmlFor="balance" className="block text-sm font-semibold text-foreground/80 mb-2">
                Initial Deposit Balance *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono-numbers font-medium">$</span>
                <input
                  type="number"
                  id="balance"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  className={`banking-input pl-8 ${errors.balance ? "border-destructive focus:ring-destructive/35" : ""}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.balance && <div className="error-message">{errors.balance}</div>}
              <div className="text-xs text-muted-foreground/80 mt-1.5 flex items-center gap-1.5">
                <span>ℹ️</span> Minimum initial deposit: ${MINIMUM_INITIAL_BALANCE}
              </div>
            </div>

            <div>
              <label htmlFor="accountType" className="block text-sm font-semibold text-foreground/80 mb-2">
                Account Type *
              </label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="banking-select"
              >
                {ACCOUNT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type} Account
                  </option>
                ))}
              </select>
              {errors.accountType && <div className="error-message">{errors.accountType}</div>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="banking-button-primary flex-1 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition duration-300"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <Link
                to="/accounts"
                className="banking-button-secondary flex-1 py-3.5 rounded-xl font-semibold text-center hover:bg-slate-700/80 transition duration-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountForm
