// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Validate account number (10 digits)
export const validateAccountNumber = (accountNumber) => {
  return /^\d{10}$/.test(accountNumber)
}

// Validate positive amount
export const validateAmount = (amount) => {
  const num = Number.parseFloat(amount)
  return !isNaN(num) && num > 0
}

// Get transaction type display
export const getTransactionTypeDisplay = (type, accountId, recipientAccountId) => {
  if (type === "TRANSFER" && recipientAccountId) {
    return "TRANSFER OUT"
  }
  return type
}

// Get amount display with sign
export const getAmountDisplay = (amount, type, accountId, recipientAccountId) => {
  if (type === "WITHDRAWAL" || (type === "TRANSFER" && recipientAccountId)) {
    return -Math.abs(amount)
  }
  return Math.abs(amount)
}
