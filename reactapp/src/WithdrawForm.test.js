import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WithdrawForm from '../components/WithdrawForm';
import * as api from '../utils/api';
jest.mock('axios');

describe('WithdrawForm', () => {
  beforeEach(() => jest.clearAllMocks());
  it('renders withdraw form and validates inputs', async () => {
    render(
      <MemoryRouter initialEntries={["/accounts/1/withdraw"]}>
        <Routes><Route path="/accounts/:accountId/withdraw" element={<WithdrawForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('withdraw-submit'));
    await screen.findByText(/positive/);
  });
  it('calls withdraw API and navigates on success', async () => {
    jest.spyOn(api, 'withdraw').mockResolvedValue();
    render(
      <MemoryRouter initialEntries={["/accounts/1/withdraw"]}>
        <Routes><Route path="/accounts/:accountId/withdraw" element={<WithdrawForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '100' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'ATM' } });
    fireEvent.click(screen.getByTestId('withdraw-submit'));
    await waitFor(() => expect(api.withdraw).toHaveBeenCalled());
  });
  it('shows API error', async () => {
    jest.spyOn(api, 'withdraw').mockRejectedValue({ response: { data: { message: 'Withdraw error' } } });
    render(
      <MemoryRouter initialEntries={["/accounts/1/withdraw"]}>
        <Routes><Route path="/accounts/:accountId/withdraw" element={<WithdrawForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByTestId('withdraw-submit'));
    await screen.findByText('Withdraw error');
  });
});
