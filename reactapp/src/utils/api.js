import axios from "axios"
import { getAuthHeader } from "./auth"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader()
    if (authHeader) {
      config.headers.Authorization = authHeader
    }
    return config
  },
  (error) => Promise.reject(error),
)

// api.interceptors.request.use(
//   (config) => {
//     console.log("[v0] API Request:", config.method?.toUpperCase(), config.url)
//     return config
//   },
//   (error) => {
//     console.log("[v0] API Request Error:", error)
//     return Promise.reject(error)
//   },
// )

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error handling for better user experience
    if (error.code === "ERR_NETWORK") {
      error.message = "Unable to connect to server. Please check if the backend is running."
    }
    return Promise.reject(error)
  },
)

// Auth API functions
export const loginUser = async (username, password) => {
  const token = btoa(`${username}:${password}`)
  const response = await api.get("/auth/login", {
    headers: {
      Authorization: `Basic ${token}`,
    },
  })
  return response.data
}

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData)
  return response.data
}

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
