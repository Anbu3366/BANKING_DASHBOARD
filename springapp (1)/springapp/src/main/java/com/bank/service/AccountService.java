package com.bank.service;

import java.util.List;

import com.bank.dto.CreateAccountRequest;
import com.bank.dto.DepositWithdrawRequest;
import com.bank.dto.TransferRequest;
import com.bank.model.Account;
import com.bank.model.Transaction;

public interface AccountService {
    Account createAccount(CreateAccountRequest request);
    Account deposit(DepositWithdrawRequest request);
    Account withdraw(DepositWithdrawRequest request);
    Account transfer(TransferRequest request);
    List<Transaction> getTransactionHistory(Long accountId);
}