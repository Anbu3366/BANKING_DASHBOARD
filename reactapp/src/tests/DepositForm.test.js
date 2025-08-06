import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import DepositForm from '../components/DepositForm';
import * as api from '../utils/api';
jest.mock('axios');

describe('DepositForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders deposit form and validates inputs', async () => {
    render(
      <MemoryRouter initialEntries={["/accounts/1/deposit"]}>
        <Routes><Route path="/accounts/:accountId/deposit" element={<DepositForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('deposit-submit'));
    await screen.findByText(/positive/);
  });

  it('calls deposit API and navigates on success', async () => {
    jest.spyOn(api, 'deposit').mockResolvedValue();
    const { container } = render(
      <MemoryRouter initialEntries={["/accounts/1/deposit"]}>
        <Routes><Route path="/accounts/:accountId/deposit" element={<DepositForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '100' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Salary' } });
    fireEvent.click(screen.getByTestId('deposit-submit'));
    await waitFor(() => expect(api.deposit).toHaveBeenCalled());
  });

  it('shows API error', async () => {
    jest.spyOn(api, 'deposit').mockRejectedValue({ response: { data: { message: 'Deposit error' } } });
    render(
      <MemoryRouter initialEntries={["/accounts/1/deposit"]}>
        <Routes><Route path="/accounts/:accountId/deposit" element={<DepositForm />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '10' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'test' } });
    fireEvent.click(screen.getByTestId('deposit-submit'));
    await screen.findByText('Deposit error');
  });
});
