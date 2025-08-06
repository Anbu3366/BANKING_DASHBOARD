import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import AccountDetails from '../components/AccountDetails';
import * as api from '../utils/api';
jest.mock('axios');

describe('AccountDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads and displays account details and transaction history', async () => {
    jest.spyOn(api, 'fetchAccount').mockResolvedValueOnce({
      accountId: 5, accountNumber: '9999999999', accountHolderName:'Test', balance: 500.1, accountType: 'Savings', createdDate: '2023-06-01T09:00:00'
    });
    jest.spyOn(api, 'fetchTransactionHistory').mockResolvedValueOnce([
      { transactionId: 1, accountId: 5, amount: 200, transactionType: 'DEPOSIT', description: 'Salary', transactionDate: '2023-07-01T10:00:00', recipientAccountId: null },
      { transactionId: 2, accountId: 5, amount: 50, transactionType: 'WITHDRAWAL', description: 'Groceries', transactionDate: '2023-07-03T14:35:30', recipientAccountId: null },
    ]);
    render(
      <MemoryRouter initialEntries={['/accounts/5']}>
        <Routes>
          <Route path="/accounts/:accountId" element={<AccountDetails />} />
        </Routes>
      </MemoryRouter>
    );
    await screen.findByText(/Test/);
    expect(screen.getByText(/Account Number/)).toBeInTheDocument();
    expect(screen.getByText(/9999999999/)).toBeInTheDocument();
    expect(screen.getByText(/Salary/)).toBeInTheDocument();
    expect(screen.getByText(/Groceries/)).toBeInTheDocument();
    expect(screen.getByText('DEPOSIT')).toBeInTheDocument();
    expect(screen.getByText('$500.10')).toBeInTheDocument();
  });

  it('handles api error gracefully', async () => {
    jest.spyOn(api, 'fetchAccount').mockRejectedValueOnce({ response: { data: { message: 'Not found' } } });
    render(<BrowserRouter><AccountDetails /></BrowserRouter>);
    await screen.findByText('Not found');
  });
});
