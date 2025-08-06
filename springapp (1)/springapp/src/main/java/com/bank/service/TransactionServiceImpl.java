package com.bank.service;

import com.bank.dto.DepositWithdrawRequest;
import com.bank.dto.TransferRequest;
import com.bank.model.Account;
import com.bank.model.Transaction;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private static final double MIN_BALANCE = 500.00;

    @Override
    @Transactional
    public Account deposit(DepositWithdrawRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow();

        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        account.setBalance(account.getBalance() + request.getAmount());
        accountRepository.save(account);

        Transaction txn = new Transaction(null, account.getAccountId(), request.getAmount(),
                "DEPOSIT", request.getDescription(), LocalDateTime.now(), null);
        transactionRepository.save(txn);

        return account;
    }

    @Override
    @Transactional
    public Account withdraw(DepositWithdrawRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow();

        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        if (account.getBalance() - request.getAmount() < MIN_BALANCE) {
            throw new IllegalArgumentException("Insufficient funds. Minimum balance of 500.00 must be maintained.");
        }

        account.setBalance(account.getBalance() - request.getAmount());
        accountRepository.save(account);

        Transaction txn = new Transaction(null, account.getAccountId(), request.getAmount(),
                "WITHDRAWAL", request.getDescription(), LocalDateTime.now(), null);
        transactionRepository.save(txn);

        return account;
    }

    @Override
    @Transactional
    public Account transfer(TransferRequest request) {
        if (request.getFromAccountId().equals(request.getToAccountId())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        Account fromAccount = accountRepository.findById((Long) request.getFromAccountId())
                .orElseThrow();

        Account toAccount = accountRepository.findById((Long) request.getToAccountId())
                .orElseThrow();

        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        if (fromAccount.getBalance() - request.getAmount() < MIN_BALANCE) {
            throw new IllegalArgumentException("Insufficient funds. Minimum balance of 500.00 must be maintained.");
        }

        // Deduct from sender
        fromAccount.setBalance(fromAccount.getBalance() - request.getAmount());
        accountRepository.save(fromAccount);

        // Credit to recipient
        toAccount.setBalance(toAccount.getBalance() + request.getAmount());
        accountRepository.save(toAccount);

        Transaction txn = new Transaction(null, fromAccount.getAccountId(), request.getAmount(),
                "TRANSFER", request.getDescription(), LocalDateTime.now(), toAccount.getAccountId());
        transactionRepository.save(txn);

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
