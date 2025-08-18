import { formatCurrency, formatDate, getAmountDisplay, getTransactionTypeDisplay } from "../utils/helpers"

const TransactionHistory = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No transactions found</p>
      </div>
    )
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))

  return (
    <div className="overflow-x-auto">
      <table className="banking-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Recipient</th>
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

            return (
              <tr key={transaction.transactionId} className="hover:bg-muted/50">
                <td className="font-mono">{transaction.transactionId}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.transactionType === "DEPOSIT"
                        ? "bg-green-100 text-green-800"
                        : transaction.transactionType === "WITHDRAWAL"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {displayType}
                  </span>
                </td>
                <td className={`font-semibold ${amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {amount >= 0 ? "+" : ""}
                  {formatCurrency(amount)}
                </td>
                <td>{transaction.description}</td>
                <td className="text-sm">{formatDate(transaction.transactionDate)}</td>
                <td className="font-mono text-sm">{transaction.recipientAccountId || "-"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionHistory
