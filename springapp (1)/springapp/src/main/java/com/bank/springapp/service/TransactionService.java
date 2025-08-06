package com.bank.springapp.service;

import java.util.List;

import com.bank.springapp.model.Account;
import com.bank.springapp.model.Transaction;

public interface TransactionService {
    Account deposit(Long accountId, Double amount, String description);
    Account withdraw(Long accountId, Double amount, String description);
    Account transfer(Long fromAccountId, Long toAccountId, Double amount, String description);
    List<Transaction> getTransactionHistory(Long accountId);
}
