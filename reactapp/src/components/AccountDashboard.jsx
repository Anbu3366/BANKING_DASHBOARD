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
      setError(err.response?.data?.message || "Failed to load accounts. Please verify if the server is running.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <div className="loading-spinner"></div>
        <span className="text-muted-foreground font-semibold animate-pulse">Retrieving your accounts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">Connection Failure</h3>
          <p className="text-sm text-foreground/80 mb-4">{error}</p>
          <button onClick={loadAccounts} className="banking-button-primary">
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Summary Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Accounts Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and monitor all your active bank accounts</p>
        </div>
        <Link to="/accounts/create" className="banking-button-secondary py-3 px-6 rounded-xl flex items-center gap-2">
          <span>+ Create New Account</span>
        </Link>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-16 max-w-lg mx-auto bg-card/45 backdrop-blur-md rounded-2xl border border-border p-8">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="text-xl font-bold mb-2">No Accounts Found</h3>
          <p className="text-muted-foreground text-sm mb-6">
            You don't have any savings or checking accounts set up yet. Create one now to start saving and transferring funds.
          </p>
          <Link to="/accounts/create" className="banking-button-primary py-3 px-6 rounded-xl">
            Create Your First Account
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accounts.map((account) => {
            const isChecking = account.accountType === "Checking"
            return (
              <div
                key={account.accountId}
                className={`credit-card flex flex-col justify-between h-56 ${
                  isChecking ? "credit-card-checking" : ""
                }`}
              >
                {/* Card Top */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">SecureBank</p>
                    <h3 className="font-extrabold text-lg tracking-tight mt-0.5">{account.accountHolderName}</h3>
                  </div>
                  <span className="text-xs font-bold bg-white/20 text-white backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider">
                    {account.accountType}
                  </span>
                </div>

                {/* Card Middle: Chip & Card Number */}
                <div className="space-y-2">
                  {/* Micro Chip Graphic */}
                  <div className="w-10 h-7 bg-amber-200/90 rounded-md relative overflow-hidden shadow-inner">
                    <div className="absolute inset-x-2 inset-y-1 border border-amber-800/20 rounded"></div>
                  </div>
                  <p className="font-mono-numbers text-lg tracking-[0.2em] font-medium opacity-90">
                    ••••  ••••  {account.accountNumber.slice(-4)}
                  </p>
                </div>

                {/* Card Bottom: Balance & Action */}
                <div className="flex justify-between items-end border-t border-white/10 pt-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider opacity-75">Available Balance</p>
                    <p className="font-mono-numbers text-xl font-extrabold text-white">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  <Link
                    to={`/accounts/${account.accountId}`}
                    className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/90 active:scale-95 transition-all shadow-md"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AccountDashboard
