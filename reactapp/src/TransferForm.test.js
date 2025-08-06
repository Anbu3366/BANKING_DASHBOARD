import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TransferForm from '../components/TransferForm';
import * as api from '../utils/api';
jest.mock('axios');

describe('TransferForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders transfer form and validates recipient and amount', async () => {
    jest.spyOn(api, 'fetchAccounts').mockResolvedValueOnce([
      { accountId: 1, accountNumber: '123', accountHolderName:'A' },
      { accountId: 2, accountNumber: '456', accountHolderName:'B' }
    ]);
    render(
      <MemoryRouter initialEntries={["/accounts/1/transfer"]}>
        <Routes><Route path="/accounts/:accountId/transfer" element={<TransferForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('recipient-select'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('transfer-submit'));
    await screen.findByText(/recipient/i);
  });

  it('calls transfer API and navigates on success', async () => {
    jest.spyOn(api, 'fetchAccounts').mockResolvedValueOnce([
      { accountId: 1, accountNumber: '123', accountHolderName:'A' },
      { accountId: 2, accountNumber: '456', accountHolderName:'B' }
    ]);
    jest.spyOn(api, 'transfer').mockResolvedValue();
    render(
      <MemoryRouter initialEntries={["/accounts/1/transfer"]}>
        <Routes><Route path="/accounts/:accountId/transfer" element={<TransferForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('recipient-select'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '25' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Rent' } });
    fireEvent.click(screen.getByTestId('transfer-submit'));
    await waitFor(() => expect(api.transfer).toHaveBeenCalled());
  });

  it('shows API error', async () => {
    jest.spyOn(api, 'fetchAccounts').mockResolvedValueOnce([{ accountId: 1, accountNumber: '123', accountHolderName:'A' },{ accountId: 2, accountNumber: '456', accountHolderName:'B' }]);
    jest.spyOn(api, 'transfer').mockRejectedValue({ response: { data: { message: 'Transfer error' } } });
    render(
      <MemoryRouter initialEntries={["/accounts/1/transfer"]}>
        <Routes><Route path="/accounts/:accountId/transfer" element={<TransferForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('recipient-select'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '25' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Rent' } });
    fireEvent.click(screen.getByTestId('transfer-submit'));
    await screen.findByText('Transfer error');
  });
});
