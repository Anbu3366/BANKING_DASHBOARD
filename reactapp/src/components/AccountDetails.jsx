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
      const [accountData, transactionData] = await Promise.all([
        fetchAccount(accountId),
        fetchTransactionHistory(accountId),
      ])

      setAccount(accountData)
      setTransactions(transactionData)
      setError("")
    } catch (err) {
      console.error("API Error loading account details:", err)
      let errorMessage = "Failed to load account details"

      if (err.code === "ECONNREFUSED" || err.message?.includes("Network Error")) {
        errorMessage = "Cannot connect to server. Make sure your Spring Boot backend is running."
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
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <div className="loading-spinner"></div>
        <span className="text-muted-foreground font-semibold animate-pulse">Loading account data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">Error Loading Account</h3>
          <p className="text-sm text-foreground/80 mb-6">{error}</p>
          <Link to="/accounts" className="banking-button-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold mb-2 text-destructive">Account Not Found</h3>
        <Link to="/accounts" className="banking-button-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  // Calculate some simple statistics from transactions
  const deposits = transactions.filter(t => t.transactionType === "DEPOSIT")
  const withdrawals = transactions.filter(t => t.transactionType === "WITHDRAWAL" || (t.transactionType === "TRANSFER" && t.recipientAccountId))
  
  const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-8">
      {/* Navigation & Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-card/20 py-2 px-4 rounded-xl border border-border/40 w-fit">
        <Link to="/accounts" className="hover:text-primary transition-colors font-medium">
          Dashboard
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-semibold">{account.accountHolderName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Account Info Card & Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="banking-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Holder</span>
                <h2 className="text-2xl font-extrabold text-foreground mt-0.5">{account.accountHolderName}</h2>
              </div>
              <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider">
                {account.accountType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Number</span>
                <p className="font-mono-numbers text-lg text-foreground/90 mt-1 font-medium tracking-wide">
                  {account.accountNumber}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Created Date</span>
                <p className="text-foreground/90 mt-1 font-medium">
                  {formatDate(account.createdDate)}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Balance</span>
              <p className="font-mono-numbers text-4xl font-extrabold text-primary mt-1">
                {formatCurrency(account.balance)}
              </p>
            </div>
          </div>

          {/* Quick Transaction Stats Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Total Deposits</span>
              <p className="font-mono-numbers text-2xl font-extrabold text-emerald-400 mt-1">
                {formatCurrency(totalDeposits)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">From {deposits.length} credits</p>
            </div>
            
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Total Outgoings</span>
              <p className="font-mono-numbers text-2xl font-extrabold text-rose-400 mt-1">
                {formatCurrency(totalWithdrawals)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">From {withdrawals.length} debits</p>
            </div>
          </div>
        </div>

        {/* Right Side: Account Actions Card */}
        <div className="space-y-6">
          <div className="banking-card bg-slate-900/40 backdrop-blur-lg">
            <h3 className="text-lg font-bold mb-4 tracking-tight">Perform Transaction</h3>
            <p className="text-xs text-muted-foreground mb-6">Select a financial action to run on this account.</p>
            
            <div className="flex flex-col gap-3">
              <Link
                to={`/accounts/${accountId}/deposit`}
                className="banking-button-primary text-center py-3 rounded-xl flex items-center justify-center gap-2 hover:translate-x-1 transition-transform"
              >
                <span>📥 Deposit Funds</span>
              </Link>
              <Link
                to={`/accounts/${accountId}/withdraw`}
                className="banking-button-primary bg-indigo-600 hover:bg-indigo-500 text-center py-3 rounded-xl flex items-center justify-center gap-2 hover:translate-x-1 transition-transform"
              >
                <span>📤 Withdraw Funds</span>
              </Link>
              <Link
                to={`/accounts/${accountId}/transfer`}
                className="banking-button-secondary text-center py-3 rounded-xl flex items-center justify-center gap-2 hover:translate-x-1 transition-transform"
              >
                <span>🔄 Transfer Money</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="banking-card">
        <div className="flex justify-between items-center mb-6 border-b border-border/80 pb-4">
          <h3 className="text-xl font-bold tracking-tight">Recent Transactions</h3>
          <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full font-semibold">
            {transactions.length} total records
          </span>
        </div>
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  )
}

export default AccountDetails
