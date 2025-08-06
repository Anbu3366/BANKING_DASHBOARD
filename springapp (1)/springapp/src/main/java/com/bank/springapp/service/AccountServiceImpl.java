package com.bank.springapp.service;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bank.springapp.model.Account;
import com.bank.springapp.repository.AccountRepository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final Validator validator;
    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository, Validator validator) {
        this.accountRepository = accountRepository;
        this.validator = validator;
    }
    @Override
    public Account createAccount(Account account) {
        Set<ConstraintViolation<Account>> violations = validator.validate(account);
        if (!violations.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            for (ConstraintViolation<Account> violation : violations) {
                sb.append(violation.getMessage()).append("; ");
            }
            throw new IllegalArgumentException(sb.toString());
        }
        Optional<Account> existingAccount = accountRepository.findByAccountNumber(account.getAccountNumber());
        if (existingAccount.isPresent()) {
 throw new IllegalArgumentException("Account number already exists");
 }
 if (account.getAccountNumber() == null || !account.getAccountNumber().matches("\\d{10}")) {
 throw new IllegalArgumentException("Account number must be exactly 10 digits");
 }
 if (account.getAccountHolderName() == null || account.getAccountHolderName().trim().isEmpty()) {
 throw new IllegalArgumentException("Account holder name cannot be empty");
 }
 if (account.getBalance() == null || account.getBalance() < 500.0) {
 throw new IllegalArgumentException("Minimum balance of 500.00 must be maintained");
 }
 if (account.getAccountType() == null || (!account.getAccountType().equals("Savings") && !account.getAccountType().equals("Checking"))) {
 throw new IllegalArgumentException("Account type must be Savings or Checking");
 }
 return accountRepository.save(account);
 }
 @Override
 public Account getAccountById(Long accountId) {
 return accountRepository.findById(accountId)
 .orElseThrow(() -> new NoSuchElementException("Account not found"));
 }
 @Override
 public List<Account> getAllAccounts() {
 return accountRepository.findAll();
 }}