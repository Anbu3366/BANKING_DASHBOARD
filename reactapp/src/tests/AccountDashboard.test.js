import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AccountDashboard from '../components/AccountDashboard';
import * as api from '../utils/api';
jest.mock('axios');

describe('AccountDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and loads account list', async () => {
    jest.spyOn(api, 'fetchAccounts').mockResolvedValueOnce([
      { accountId: 1, accountNumber: '1234567890', accountHolderName: 'John Doe', balance: 1500.50, accountType: 'Savings' },
    ]);
    render(
      <BrowserRouter>
        <AccountDashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await screen.findByText(/John Doe/);
    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
    expect(screen.getByText('$1500.50')).toBeInTheDocument();
  });

  it('shows empty state if accounts list is empty', async () => {
    jest.spyOn(api, 'fetchAccounts').mockResolvedValueOnce([]);
    render(<BrowserRouter><AccountDashboard /></BrowserRouter>);
    await screen.findByText(/No accounts found/i);
  });

  it('shows error if API call fails', async () => {
    jest.spyOn(api, 'fetchAccounts').mockRejectedValueOnce({ response: { data: { message: 'API error' } } });
    render(<BrowserRouter><AccountDashboard /></BrowserRouter>);
    await screen.findByText(/API error/);
  });

  it('navigates to create new account form', async () => {
    jest.spyOn(api, 'fetchAccounts').mockResolvedValueOnce([]);
    render(<BrowserRouter><AccountDashboard /></BrowserRouter>);
    fireEvent.click(screen.getByText(/Create New Account/i));
    // Let router handle navigation, no assertion other than no crash
  });
});
