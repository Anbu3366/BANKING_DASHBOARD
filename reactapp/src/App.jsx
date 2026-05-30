import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import AccountDashboard from "./components/AccountDashboard.jsx"
import AccountDetails from "./components/AccountDetails.jsx"
import CreateAccountForm from "./components/CreateAccountForm.jsx"
import DepositForm from "./components/DepositForm.jsx"
import WithdrawForm from "./components/WithdrawForm.jsx"
import TransferForm from "./components/TransferForm.jsx"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import { isAuthenticated, clearCredentials } from "./utils/auth"
import "./App.css"

function RequireAuth({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function LogoutButton() {
  const navigate = useNavigate()
  if (!isAuthenticated()) return null
  const onLogout = () => {
    clearCredentials()
    navigate("/login", { replace: true })
  }
  return (
    <button onClick={onLogout} className="banking-button-secondary">Logout</button>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold font-sans">SecureBank Dashboard</h1>
            <LogoutButton />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/accounts" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/accounts" element={<RequireAuth><AccountDashboard /></RequireAuth>} />
            <Route path="/accounts/create" element={<RequireAuth><CreateAccountForm /></RequireAuth>} />
            <Route path="/accounts/:accountId" element={<RequireAuth><AccountDetails /></RequireAuth>} />
            <Route path="/accounts/:accountId/deposit" element={<RequireAuth><DepositForm /></RequireAuth>} />
            <Route path="/accounts/:accountId/withdraw" element={<RequireAuth><WithdrawForm /></RequireAuth>} />
            <Route path="/accounts/:accountId/transfer" element={<RequireAuth><TransferForm /></RequireAuth>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
