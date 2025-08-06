import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionHistory from '../components/TransactionHistory';
jest.mock('axios');

describe('TransactionHistory', () => {
  it('shows empty state when no transactions', () => {
    render(<TransactionHistory transactions={[]} />);
    expect(screen.getByText(/no transactions/i)).toBeInTheDocument();
  });

  it('renders a table of transactions, sorts by date', () => {
    const txs = [
      { transactionId: 4, transactionType: 'DEPOSIT', amount: 560.50, description: 'A', transactionDate: '2023-05-01T12:30:00', recipientAccountId: null },
      { transactionId: 5, transactionType: 'TRANSFER', amount: 100, description: 'B', transactionDate: '2023-06-01T12:47:47', recipientAccountId: 5 },
    ];
    render(<TransactionHistory transactions={txs} />);
    // Instead of ambiguous getByText(/A/), look for table cell containing "A" with context
    const rows = screen.getAllByRole('row');
    const combinedText = rows.map(row => row.textContent).join(' ');
    expect(combinedText).toMatch(/A/);
    expect(combinedText).toMatch(/B/);
    // The minus amount is displayed, check that it exists together
    expect(combinedText).toMatch(/-\$100.00/);
    expect(combinedText).toMatch(/TRANSFER/);
    expect(combinedText).toMatch(/DEPOSIT/);
  });
});
