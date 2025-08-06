package com.bank.springapp.service;

import java.util.List;

import com.bank.springapp.model.Account;

public interface AccountService {
    Account createAccount(Account account);
    Account getAccountById(Long accountId);
    List<Account> getAllAccounts();
}
