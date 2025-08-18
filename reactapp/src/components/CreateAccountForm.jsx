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
      setApiError(err.response?.data?.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link to="/accounts" className="hover:text-primary">
          Accounts
        </Link>
        <span>/</span>
        <span>Create New Account</span>
      </div>

      <div className="banking-card">
        <h2 className="text-2xl font-bold font-sans mb-6">Create New Account</h2>

        {apiError && (
          <div className="error-message bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-6">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium mb-2">
              Account Number *
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="banking-input"
              placeholder="Enter 10-digit account number"
              maxLength="10"
            />
            {errors.accountNumber && <div className="error-message">{errors.accountNumber}</div>}
          </div>

          <div>
            <label htmlFor="accountHolderName" className="block text-sm font-medium mb-2">
              Account Holder Name *
            </label>
            <input
              type="text"
              id="accountHolderName"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              className="banking-input"
              placeholder="Enter full name"
            />
            {errors.accountHolderName && <div className="error-message">{errors.accountHolderName}</div>}
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-medium mb-2">
              Initial Balance *
            </label>
            <input
              type="number"
              id="balance"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="banking-input"
              placeholder="Enter initial balance"
              min="0"
              step="0.01"
            />
            {errors.balance && <div className="error-message">{errors.balance}</div>}
            <div className="text-sm text-muted-foreground mt-1">
              Minimum initial balance: ${MINIMUM_INITIAL_BALANCE}
            </div>
          </div>

          <div>
            <label htmlFor="accountType" className="block text-sm font-medium mb-2">
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
                  {type}
                </option>
              ))}
            </select>
            {errors.accountType && <div className="error-message">{errors.accountType}</div>}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="banking-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <Link to="/accounts" className="banking-button-secondary flex-1 text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAccountForm
