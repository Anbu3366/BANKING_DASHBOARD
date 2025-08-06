package com.examly.springapp.service;

import com.examly.springapp.model.Account;
import java.util.List;

public interface AccountService {
    Account createAccount(Account account);
    Account getAccountById(Long accountId);
    List<Account> getAllAccounts();
}
