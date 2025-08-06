import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateAccountForm from '../components/CreateAccountForm';
import * as api from '../utils/api';
jest.mock('axios');

describe('CreateAccountForm', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('renders all fields', () => {
    render(<BrowserRouter><CreateAccountForm /></BrowserRouter>);
    expect(screen.getByLabelText(/Account Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Holder Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Initial Balance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty/invalid fields', async () => {
    render(<BrowserRouter><CreateAccountForm /></BrowserRouter>);
    fireEvent.click(screen.getByText(/Create Account/i));
    await waitFor(() => expect(screen.getAllByText(/must/i)[0]).toBeInTheDocument());
  });

  it('calls API and navigates on submit', async () => {
    jest.spyOn(api, 'createAccount').mockResolvedValue();
    render(<BrowserRouter><CreateAccountForm /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText(/Account Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Account Holder Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Initial Balance/i), { target: { value: '800' } });
    fireEvent.change(screen.getByLabelText(/Account Type/i), { target: { value: 'Savings' } });
    fireEvent.click(screen.getByText(/Create Account/i));
    await waitFor(() => expect(api.createAccount).toHaveBeenCalled());
  });

  it('shows API error', async () => {
    jest.spyOn(api, 'createAccount').mockRejectedValue({ response: { data: { message: 'Account number exists' } } });
    render(<BrowserRouter><CreateAccountForm /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText(/Account Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Account Holder Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Initial Balance/i), { target: { value: '800' } });
    fireEvent.change(screen.getByLabelText(/Account Type/i), { target: { value: 'Savings' } });
    fireEvent.click(screen.getByText(/Create Account/i));
    await screen.findByText(/exists/);
  });
});
