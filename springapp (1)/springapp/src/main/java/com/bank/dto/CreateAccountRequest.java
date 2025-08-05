package com.bank.dto;

import com.bank.model.Account;
import com.bank.service.AccountServiceImpl;

import lombok.Data;

@Data
public class CreateAccountRequest {
    public Account createAccount(AccountServiceImpl accountServiceImpl) {
        Account acc = new Account(null, getAccountNumber(), getAccountHolderName(),
                getAccountType(), getBalance(), null);
        return accountServiceImpl.accountRepo.save(acc);
    }
    private String accountNumber;
    private String accountHolderName;
    private String accountType;
    private Double balance;
}
