const STORAGE_KEY = "banking_basic_auth"

export const setCredentials = (username, password) => {
  const token = btoa(`${username}:${password}`)
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ username, token, savedAt: Date.now() }),
  )
}

export const clearCredentials = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getAuthHeader = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    if (!parsed?.token) return undefined
    return `Basic ${parsed.token}`
  } catch {
    return undefined
  }
}

export const isAuthenticated = () => {
  return Boolean(getAuthHeader())
}


