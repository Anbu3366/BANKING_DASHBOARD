import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AccountDashboard from "./components/AccountDashboard.jsx"
import AccountDetails from "./components/AccountDetails.jsx"
import CreateAccountForm from "./components/CreateAccountForm.jsx"
import DepositForm from "./components/DepositForm.jsx"
import WithdrawForm from "./components/WithdrawForm.jsx"
import TransferForm from "./components/TransferForm.jsx"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold font-sans">SecureBank Dashboard</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/accounts" replace />} />
            <Route path="/accounts" element={<AccountDashboard />} />
            <Route path="/accounts/create" element={<CreateAccountForm />} />
            <Route path="/accounts/:accountId" element={<AccountDetails />} />
            <Route path="/accounts/:accountId/deposit" element={<DepositForm />} />
            <Route path="/accounts/:accountId/withdraw" element={<WithdrawForm />} />
            <Route path="/accounts/:accountId/transfer" element={<TransferForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
