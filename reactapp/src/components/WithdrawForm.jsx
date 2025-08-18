"use client"

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { withdraw } from "../utils/api"
import { validateAmount } from "../utils/helpers"
import { ERROR_MESSAGES } from "../utils/constants"

const WithdrawForm = () => {
  const { accountId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount) {
      newErrors.amount = "Amount must be a positive number"
    } else if (!validateAmount(formData.amount)) {
      newErrors.amount = "Amount must be a positive number"
    }

    if (!formData.description.trim()) {
      newErrors.description = ERROR_MESSAGES.REQUIRED_FIELD
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

      const withdrawData = {
        accountId: Number.parseInt(accountId),
        amount: Number.parseFloat(formData.amount),
        description: formData.description,
      }

      await withdraw(withdrawData)
      navigate(`/accounts/${accountId}`)
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to process withdrawal")
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
        <Link to={`/accounts/${accountId}`} className="hover:text-primary">
          Account Details
        </Link>
        <span>/</span>
        <span>Withdraw</span>
      </div>

      <div className="banking-card">
        <h2 className="text-2xl font-bold font-sans mb-6">Withdraw Money</h2>

        {apiError && (
          <div className="error-message bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-6">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="banking-input"
              placeholder="Enter withdrawal amount"
              min="0"
              step="0.01"
              data-testid="amount-input"
            />
            {errors.amount && <div className="error-message">{errors.amount}</div>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="banking-input"
              placeholder="Enter withdrawal description"
              data-testid="description-input"
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> A minimum balance of $500.00 must be maintained in your account.
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="banking-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="withdraw-submit"
            >
              {loading ? "Processing..." : "Withdraw Money"}
            </button>
            <Link to={`/accounts/${accountId}`} className="banking-button-secondary flex-1 text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WithdrawForm
