package com.bank.springapp.service;

import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.springapp.model.Account;
import com.bank.springapp.model.Transaction;
import com.bank.springapp.repository.AccountRepository;
import com.bank.springapp.repository.TransactionRepository;

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
Account savedAccount = accountRepository.save(account);

Transaction transaction = new Transaction();
transaction.setAccountId(accountId);
transaction.setAmount(amount);
transaction.setTransactionType("DEPOSIT");
transaction.setDescription(description);
transactionRepository.save(transaction);

return savedAccount;
}

@Override
@Transactional
public Account withdraw(Long accountId, Double amount, String description) {
if (amount == null || amount <= 0) {
throw new IllegalArgumentException("Amount must be greater than 0");
}
Account account = accountRepository.findById(accountId)
.orElseThrow(() -> new NoSuchElementException("Account not found"));
if (account.getBalance() - amount < 500.0) {throw new IllegalArgumentException("Insufficient funds. Minimum balance of 500.00 must be maintained.");}
account.setBalance(account.getBalance() - amount);
Account savedAccount = accountRepository.save(account);
Transaction transaction = new Transaction();
transaction.setAccountId(accountId);
transaction.setAmount(amount);
transaction.setTransactionType("WITHDRAW");
transaction.setDescription(description);
transactionRepository.save(transaction);
return savedAccount;}
@Override
@Transactional
public Account transfer(Long fromAccountId, Long toAccountId, Double amount, String description) {
if (fromAccountId.equals(toAccountId)) {
throw new IllegalArgumentException("Cannot transfer to the same account");}
if (amount == null || amount <= 0) {
throw new IllegalArgumentException("Amount must be greater than 0");}
Account fromAccount = accountRepository.findById(fromAccountId)
.orElseThrow(() -> new NoSuchElementException("From account not found"));
Account toAccount = accountRepository.findById(toAccountId)
.orElseThrow(() -> new NoSuchElementException("To account not found"));
if (fromAccount.getBalance() - amount < 500.0) {
throw new IllegalArgumentException("Insufficient funds. Minimum balance of 500.00 must be maintained.");}
fromAccount.setBalance(fromAccount.getBalance() - amount);
toAccount.setBalance(toAccount.getBalance() + amount);
Account savedFromAccount = accountRepository.save(fromAccount);
accountRepository.save(toAccount);
Transaction fromTransaction = new Transaction();
fromTransaction.setAccountId(fromAccountId);
fromTransaction.setAmount(amount);
fromTransaction.setTransactionType("TRANSFER");
fromTransaction.setDescription(description);
fromTransaction.setRecipientAccountId(toAccountId);
transactionRepository.save(fromTransaction);
Transaction toTransaction = new Transaction();
toTransaction.setAccountId(toAccountId);
toTransaction.setAmount(amount);
toTransaction.setTransactionType("TRANSFER");
toTransaction.setDescription(description);
toTransaction.setRecipientAccountId(fromAccountId);
transactionRepository.save(toTransaction);
return savedFromAccount;}
@Override
public List<Transaction> getTransactionHistory(Long accountId) {
if (!accountRepository.existsById(accountId)) {
throw new NoSuchElementException("Account not found");}
return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId);}}