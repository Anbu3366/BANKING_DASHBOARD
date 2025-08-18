export const ACCOUNT_TYPES = ["Savings", "Checking"]

export const TRANSACTION_TYPES = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
  TRANSFER: "TRANSFER",
}

export const MINIMUM_BALANCE = 500.0
export const MINIMUM_INITIAL_BALANCE = 500.0

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_ACCOUNT_NUMBER: "Account number must be exactly 10 digits",
  INVALID_AMOUNT: "Amount must be a positive number",
  INSUFFICIENT_FUNDS: "Insufficient funds",
  MINIMUM_BALANCE: `Minimum balance of $${MINIMUM_BALANCE} must be maintained`,
  ACCOUNT_NOT_FOUND: "Account not found",
  SAME_ACCOUNT_TRANSFER: "Cannot transfer to the same account",
}
