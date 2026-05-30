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

  const handleQuickAdd = (value) => {
    setFormData((prev) => ({
      ...prev,
      amount: value.toString(),
    }))
    if (errors.amount) {
      setErrors((prev) => ({
        ...prev,
        amount: "",
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
      setApiError(err.response?.data?.message || "Failed to process withdrawal. Check account limits.")
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
        <Link to={`/accounts/${accountId}`} className="hover:text-primary transition-colors font-medium">
          Account Details
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-semibold">Withdraw</span>
      </div>

      <div className="banking-card relative overflow-hidden border border-border shadow-2xl rounded-2xl p-8 bg-card/65 backdrop-blur-md">
        {/* Glow Element */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Withdraw Funds</h2>
          <p className="text-sm text-muted-foreground mb-6">Debit money from your SecureBank account securely</p>

          {apiError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-foreground/80 mb-2">
                Withdrawal Amount *
              </label>
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono-numbers font-medium">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`banking-input pl-8 ${errors.amount ? "border-destructive focus:ring-destructive/35" : ""}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  data-testid="amount-input"
                />
              </div>
              {errors.amount && <div className="error-message">{errors.amount}</div>}

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2.5 mt-3">
                {[50, 100, 250, 500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAdd(val)}
                    className="bg-muted hover:bg-primary/20 text-foreground hover:text-primary border border-border hover:border-primary/30 font-mono-numbers text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-foreground/80 mb-2">
                Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`banking-input ${errors.description ? "border-destructive focus:ring-destructive/35" : ""}`}
                placeholder="Enter withdrawal description (e.g. ATM, Bills, Grocery)"
                data-testid="description-input"
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>

            {/* Note Panel */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-500">
              <span className="text-lg">⚠️</span>
              <p className="text-xs font-semibold leading-relaxed">
                <strong>Attention:</strong> A minimum balance of $500.00 must be maintained in this account after completing the withdrawal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="banking-button-primary flex-1 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 transition duration-300"
                data-testid="withdraw-submit"
              >
                {loading ? "Processing..." : "Confirm Withdrawal"}
              </button>
              <Link
                to={`/accounts/${accountId}`}
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

export default WithdrawForm
