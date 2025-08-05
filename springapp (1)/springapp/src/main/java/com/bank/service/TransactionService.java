package com.bank.service;

import com.bank.dto.DepositWithdrawRequest;
import com.bank.dto.TransferRequest;
import com.bank.model.Account;
import com.bank.model.Transaction;

import java.util.List;

public interface TransactionService {
    Account deposit(DepositWithdrawRequest request);
    Account withdraw(DepositWithdrawRequest request);
    Account transfer(TransferRequest request);
    List<Transaction> getTransactionHistory(Long accountId);
}
