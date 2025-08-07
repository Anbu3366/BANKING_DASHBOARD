package com.examly.springapp.service;

import com.examly.springapp.model.Account;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.repository.AccountRepository;
import com.examly.springapp.repository.TransactionRepository;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TransactionServiceImpl implements TransactionService {
    
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final Validator validator;
    
    @Autowired
    public TransactionServiceImpl(AccountRepository accountRepository, 
                                TransactionRepository transactionRepository, 
                                Validator validator) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.validator = validator;
    }
    
    @Override
    @Transactional
    public Account deposit(Long accountId, Double amount, String description) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NoSuchElementException("Account not found"));
        
        account.setBalance(account.getBalance() + amount);
        
        Transaction transaction = new Transaction();
        transaction.setAccountId(accountId);
        transaction.setAmount(amount);
        transaction.setTransactionType("DEPOSIT");
        transaction.setDescription(description);
        transaction.setTransactionDate(LocalDateTime.now());
        
        transactionRepository.save(transaction);
        return accountRepository.save(account);
    }
    
    @Override
    @Transactional
    public Account withdraw(Long accountId, Double amount, String description) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NoSuchElementException("Account not found"));
        
        if (account.getBalance() - amount < 500.0) {
            throw new IllegalArgumentException("Insufficient funds. Minimum balance of 500.00 must be maintained.");
        }
        
        account.setBalance(account.getBalance() - amount);
        
        Transaction transaction = new Transaction();
        transaction.setAccountId(accountId);
        transaction.setAmount(amount);
        transaction.setTransactionType("WITHDRAW");
        transaction.setDescription(description);
        transaction.setTransactionDate(LocalDateTime.now());
        
        transactionRepository.save(transaction);
        return accountRepository.save(account);
    }
    
    @Override
    @Transactional
    public Account transfer(Long fromAccountId, Long toAccountId, Double amount, String description) {
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
        
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        
        Account fromAccount = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new NoSuchElementException("From account not found"));
        
        Account toAccount = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new NoSuchElementException("To account not found"));
        
        if (fromAccount.getBalance() - amount < 500.0) {
            throw new IllegalArgumentException("Insufficient funds. Minimum balance of 500.00 must be maintained.");
        }
        
        fromAccount.setBalance(fromAccount.getBalance() - amount);
        toAccount.setBalance(toAccount.getBalance() + amount);
        
        // Create debit transaction for sender
        Transaction debitTransaction = new Transaction();
        debitTransaction.setAccountId(fromAccountId);
        debitTransaction.setAmount(amount);
        debitTransaction.setTransactionType("TRANSFER_OUT");
        debitTransaction.setDescription(description);
        debitTransaction.setRecipientAccountId(toAccountId);
        debitTransaction.setTransactionDate(LocalDateTime.now());
        
        // Create credit transaction for receiver
        Transaction creditTransaction = new Transaction();
        creditTransaction.setAccountId(toAccountId);
        creditTransaction.setAmount(amount);
        creditTransaction.setTransactionType("TRANSFER_IN");
        creditTransaction.setDescription(description);
        creditTransaction.setRecipientAccountId(fromAccountId);
        creditTransaction.setTransactionDate(LocalDateTime.now());
        
        transactionRepository.save(debitTransaction);
        transactionRepository.save(creditTransaction);
        
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
        
        return fromAccount;
    }
    
    @Override
    public List<Transaction> getTransactionHistory(Long accountId) {
        if (!accountRepository.existsById(accountId)) {
            throw new NoSuchElementException("Account not found");
        }
        
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId);
    }
}
