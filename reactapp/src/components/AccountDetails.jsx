"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchAccount, fetchTransactionHistory } from "../utils/api"
import { formatCurrency, formatDate } from "../utils/helpers"
import TransactionHistory from "./TransactionHistory.jsx"

const AccountDetails = () => {
  const { accountId } = useParams()
  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadAccountData()
  }, [accountId])

  const loadAccountData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading account data for ID:", accountId)
      console.log("[v0] API Base URL:", "http://localhost:8080/api")

      const [accountData, transactionData] = await Promise.all([
        fetchAccount(accountId),
        fetchTransactionHistory(accountId),
      ])

      console.log("[v0] Account data received:", accountData)
      console.log("[v0] Transaction data received:", transactionData)

      setAccount(accountData)
      setTransactions(transactionData)
      setError("")
    } catch (err) {
      console.log("[v0] API Error:", err)
      console.log("[v0] Error response:", err.response)
      console.log("[v0] Error message:", err.message)

      let errorMessage = "Failed to load account details"

      if (err.code === "ECONNREFUSED" || err.message.includes("Network Error")) {
        errorMessage = "Cannot connect to server. Make sure your Spring Boot backend is running on port 8080."
      } else if (err.response?.status === 404) {
        errorMessage = "Account not found"
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Check your backend logs."
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-muted-foreground">Loading account details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="error-message text-lg">{error}</div>
        <Link to="/accounts" className="banking-button-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <div className="error-message text-lg">Account not found</div>
        <Link to="/accounts" className="banking-button-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link to="/accounts" className="hover:text-primary">
          Accounts
        </Link>
        <span>/</span>
        <span>{account.accountHolderName}</span>
      </div>

      {/* Account Details Card */}
      <div className="banking-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-sans">{account.accountHolderName}</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Account Number</span>
                <p className="font-mono text-lg">{account.accountNumber}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Account Type</span>
                <p className="text-lg">{account.accountType}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Created Date</span>
                <p className="text-lg">{formatDate(account.createdDate)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <p className="text-3xl font-bold text-primary">{formatCurrency(account.balance)}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to={`/accounts/${accountId}/deposit`} className="banking-button-primary text-center">
                Deposit
              </Link>
              <Link to={`/accounts/${accountId}/withdraw`} className="banking-button-primary text-center">
                Withdraw
              </Link>
              <Link to={`/accounts/${accountId}/transfer`} className="banking-button-secondary text-center">
                Transfer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="banking-card">
        <h3 className="text-xl font-bold font-sans mb-6">Transaction History</h3>
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  )
}

export default AccountDetails
