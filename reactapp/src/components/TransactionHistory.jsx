import { formatCurrency, formatDate, getAmountDisplay, getTransactionTypeDisplay } from "../utils/helpers"

const TransactionHistory = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-card/15 rounded-xl border border-dashed border-border">
        <p className="text-sm">No transaction records found for this account.</p>
      </div>
    )
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))

  return (
    <div className="banking-table-container">
      <table className="banking-table">
        <thead>
          <tr>
            <th>Tx ID</th>
            <th>Type</th>
            <th>Description</th>
            <th>Recipient Acc</th>
            <th>Date & Time</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => {
            const amount = getAmountDisplay(
              transaction.amount,
              transaction.transactionType,
              transaction.accountId,
              transaction.recipientAccountId,
            )
            const displayType = getTransactionTypeDisplay(
              transaction.transactionType,
              transaction.accountId,
              transaction.recipientAccountId,
            )

            const isDeposit = transaction.transactionType === "DEPOSIT"
            const isWithdrawal = transaction.transactionType === "WITHDRAWAL"
            const isTransfer = transaction.transactionType === "TRANSFER"

            let badgeStyle = "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            if (isDeposit) {
              badgeStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            } else if (isWithdrawal) {
              badgeStyle = "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            } else if (isTransfer && transaction.recipientAccountId) {
              badgeStyle = "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }

            return (
              <tr key={transaction.transactionId}>
                <td className="font-mono-numbers text-xs text-muted-foreground">
                  #{transaction.transactionId}
                </td>
                <td>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${badgeStyle}`}>
                    {displayType}
                  </span>
                </td>
                <td className="text-foreground/90 max-w-[200px] truncate">
                  {transaction.description}
                </td>
                <td className="font-mono-numbers text-xs text-muted-foreground">
                  {transaction.recipientAccountId ? `#${transaction.recipientAccountId}` : "—"}
                </td>
                <td className="text-muted-foreground text-xs">
                  {formatDate(transaction.transactionDate)}
                </td>
                <td className={`text-right font-mono-numbers font-bold text-sm ${amount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {amount >= 0 ? "+" : ""}
                  {formatCurrency(amount)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionHistory
