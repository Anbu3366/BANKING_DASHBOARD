import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api"
const USE_MOCK_DATA = false // Set to false when backend is available

const mockAccounts = [
  { id: 1, accountNumber: "ACC001", accountType: "SAVINGS", balance: 5000.0, accountHolderName: "John Doe" },
  { id: 2, accountNumber: "ACC002", accountType: "CHECKING", balance: 2500.5, accountHolderName: "Jane Smith" },
]

const mockTransactions = [
  {
    id: 1,
    accountId: 1,
    type: "DEPOSIT",
    amount: 1000.0,
    timestamp: "2024-01-15T10:30:00",
    description: "Salary deposit",
  },
  {
    id: 2,
    accountId: 1,
    type: "WITHDRAWAL",
    amount: 200.0,
    timestamp: "2024-01-14T14:20:00",
    description: "ATM withdrawal",
  },
]

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Account API functions
export const fetchAccounts = async () => {
  if (USE_MOCK_DATA) {
    await delay(500) // Simulate network delay
    return mockAccounts
  }
  const response = await api.get("/accounts")
  return response.data
}

export const fetchAccount = async (accountId) => {
  if (USE_MOCK_DATA) {
    await delay(300)
    return mockAccounts.find((acc) => acc.id === Number.parseInt(accountId))
  }
  const response = await api.get(`/accounts/${accountId}`)
  return response.data
}

export const createAccount = async (accountData) => {
  if (USE_MOCK_DATA) {
    await delay(800)
    const newAccount = {
      id: mockAccounts.length + 1,
      accountNumber: `ACC${String(mockAccounts.length + 1).padStart(3, "0")}`,
      ...accountData,
      balance: 0.0,
    }
    mockAccounts.push(newAccount)
    return newAccount
  }
  const response = await api.post("/accounts", accountData)
  return response.data
}

// Transaction API functions
export const deposit = async (transactionData) => {
  if (USE_MOCK_DATA) {
    await delay(600)
    const account = mockAccounts.find((acc) => acc.id === Number.parseInt(transactionData.accountId))
    if (account) {
      account.balance += Number.parseFloat(transactionData.amount)
      const transaction = {
        id: mockTransactions.length + 1,
        accountId: Number.parseInt(transactionData.accountId),
        type: "DEPOSIT",
        amount: Number.parseFloat(transactionData.amount),
        timestamp: new Date().toISOString(),
        description: transactionData.description || "Deposit",
      }
      mockTransactions.push(transaction)
      return transaction
    }
  }
  const response = await api.post("/transactions/deposit", transactionData)
  return response.data
}

export const withdraw = async (transactionData) => {
  if (USE_MOCK_DATA) {
    await delay(600)
    const account = mockAccounts.find((acc) => acc.id === Number.parseInt(transactionData.accountId))
    if (account && account.balance >= Number.parseFloat(transactionData.amount)) {
      account.balance -= Number.parseFloat(transactionData.amount)
      const transaction = {
        id: mockTransactions.length + 1,
        accountId: Number.parseInt(transactionData.accountId),
        type: "WITHDRAWAL",
        amount: Number.parseFloat(transactionData.amount),
        timestamp: new Date().toISOString(),
        description: transactionData.description || "Withdrawal",
      }
      mockTransactions.push(transaction)
      return transaction
    }
    throw new Error("Insufficient funds")
  }
  const response = await api.post("/transactions/withdraw", transactionData)
  return response.data
}

export const transfer = async (transferData) => {
  if (USE_MOCK_DATA) {
    await delay(700)
    const fromAccount = mockAccounts.find((acc) => acc.id === Number.parseInt(transferData.fromAccountId))
    const toAccount = mockAccounts.find((acc) => acc.id === Number.parseInt(transferData.toAccountId))

    if (fromAccount && toAccount && fromAccount.balance >= Number.parseFloat(transferData.amount)) {
      fromAccount.balance -= Number.parseFloat(transferData.amount)
      toAccount.balance += Number.parseFloat(transferData.amount)

      const transaction = {
        id: mockTransactions.length + 1,
        accountId: Number.parseInt(transferData.fromAccountId),
        type: "TRANSFER",
        amount: Number.parseFloat(transferData.amount),
        timestamp: new Date().toISOString(),
        description: `Transfer to ${toAccount.accountHolderName}`,
      }
      mockTransactions.push(transaction)
      return transaction
    }
    throw new Error("Transfer failed: insufficient funds or invalid accounts")
  }
  const response = await api.post("/transactions/transfer", transferData)
  return response.data
}

export const fetchTransactionHistory = async (accountId) => {
  if (USE_MOCK_DATA) {
    await delay(400)
    return mockTransactions.filter((tx) => tx.accountId === Number.parseInt(accountId))
  }
  const response = await api.get(`/transactions/account/${accountId}`)
  return response.data
}

export default api
