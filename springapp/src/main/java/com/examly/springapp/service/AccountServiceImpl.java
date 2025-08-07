package com.examly.springapp.service;

import com.examly.springapp.model.Account;
import com.examly.springapp.repository.AccountRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        // Check if account number already exists
        Optional<Account> existingAccount = accountRepository.findByAccountNumber(account.getAccountNumber());
        if (existingAccount.isPresent()) {
            throw new IllegalArgumentException("Account number already exists");
        }
        
        // Validate account number format
        if (account.getAccountNumber() == null || !account.getAccountNumber().matches("\\d{10}")) {
            throw new IllegalArgumentException("Account number must be exactly 10 digits");
        }
        
        // Validate account holder name
        if (account.getAccountHolderName() == null || account.getAccountHolderName().trim().isEmpty()) {
            throw new IllegalArgumentException("Account holder name cannot be empty");
        }
        
        // Validate minimum balance
        if (account.getBalance() == null || account.getBalance() < 500.0) {
            throw new IllegalArgumentException("Minimum balance of 500.00 must be maintained");
        }
        
        // Validate account type
        if (account.getAccountType() == null || 
            (!account.getAccountType().equals("Savings") && !account.getAccountType().equals("Checking"))) {
            throw new IllegalArgumentException("Account type must be either 'Savings' or 'Checking'");
        }
        
        // Set creation date if not already set
        if (account.getCreatedDate() == null) {
            account.setCreatedDate(LocalDateTime.now());
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
    }
}
