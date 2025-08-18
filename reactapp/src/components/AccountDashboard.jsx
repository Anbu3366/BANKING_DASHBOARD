"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fetchAccounts } from "../utils/api"
import { formatCurrency } from "../utils/helpers"

const AccountDashboard = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const data = await fetchAccounts()
      setAccounts(data)
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load accounts")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-muted-foreground">Loading accounts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="error-message text-lg">{error}</div>
        <button onClick={loadAccounts} className="banking-button-primary mt-4">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-sans text-foreground">Account Dashboard</h2>
        <Link to="/accounts/create" className="banking-button-secondary">
          Create New Account
        </Link>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No accounts found</p>
          <Link to="/accounts/create" className="banking-button-primary">
            Create Your First Account
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div key={account.accountId} className="banking-card">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg font-sans">{account.accountHolderName}</h3>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">{account.accountType}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Account Number: {account.accountNumber}</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(account.balance)}</p>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/accounts/${account.accountId}`}
                    className="banking-button-primary w-full text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AccountDashboard
