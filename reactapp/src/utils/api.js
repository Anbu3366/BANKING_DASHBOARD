import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Account API functions
export const fetchAccounts = async () => {
  const response = await api.get("/accounts")
  return response.data
}

export const fetchAccount = async (accountId) => {
  const response = await api.get(`/accounts/${accountId}`)
  return response.data
}

export const createAccount = async (accountData) => {
  const response = await api.post("/accounts", accountData)
  return response.data
}

// Transaction API functions
export const deposit = async (transactionData) => {
  const response = await api.post("/transactions/deposit", transactionData)
  return response.data
}

export const withdraw = async (transactionData) => {
  const response = await api.post("/transactions/withdraw", transactionData)
  return response.data
}

export const transfer = async (transferData) => {
  const response = await api.post("/transactions/transfer", transferData)
  return response.data
}

export const fetchTransactionHistory = async (accountId) => {
  const response = await api.get(`/transactions/account/${accountId}`)
  return response.data
}

export default api
