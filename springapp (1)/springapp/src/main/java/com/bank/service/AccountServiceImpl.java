package com.bank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bank.dto.CreateAccountRequest;
import com.bank.dto.DepositWithdrawRequest;
import com.bank.dto.TransferRequest;
import com.bank.model.Account;
import com.bank.model.Transaction;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;

import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    public AccountRepository accountRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    @Override
    public Account createAccount(CreateAccountRequest request) {
        Account account = new Account();
        account.setAccountHolderName(request.getAccountHolderName());
        account.setBalance(request.getBalance());
        accountRepo.save(account);

        transactionRepo.save(new Transaction(null, account.getAccountId(), request.getBalance(),
                "ACCOUNT_OPENING", "Initial deposit", null, null));

        return account;
    }

    @Override
    public Account deposit(DepositWithdrawRequest request) {
        Account acc = accountRepo.findById(request.getAccountId()).orElseThrow();
        acc.setBalance(acc.getBalance() + request.getAmount());
        accountRepo.save(acc);
        transactionRepo.save(new Transaction(null, acc.getAccountId(), request.getAmount(),
                "DEPOSIT", request.getDescription(), null, null));
        return acc;
    }

    @Override
    public Account withdraw(DepositWithdrawRequest request) {
        Account acc = accountRepo.findById(request.getAccountId()).orElseThrow();
        if (acc.getBalance() < request.getAmount())
            throw new IllegalArgumentException("Insufficient balance");
        acc.setBalance(acc.getBalance() - request.getAmount());
        accountRepo.save(acc);
        transactionRepo.save(new Transaction(null, acc.getAccountId(), request.getAmount(),
                "WITHDRAW", request.getDescription(), null, null));
        return acc;
    }

    @Override
    public Account transfer(TransferRequest request) {
        if (request.getSenderId().equals(request.getReceiverId()))
            throw new IllegalArgumentException("Sender and receiver cannot be same");

        Account sender = accountRepo.findById(request.getSenderId()).orElseThrow();
        Account receiver = accountRepo.findById(request.getReceiverId()).orElseThrow();

        if (sender.getBalance() < request.getAmount())
            throw new IllegalArgumentException("Insufficient balance");

        sender.setBalance(sender.getBalance() - request.getAmount());
        receiver.setBalance(receiver.getBalance() + request.getAmount());

        accountRepo.save(sender);
        accountRepo.save(receiver);

        transactionRepo.save(new Transaction(null, sender.getAccountId(), request.getAmount(),
                "TRANSFER", request.getDescription(), null, receiver.getAccountId()));

        return sender;
    }

    @Override
    public List<Transaction> getTransactionHistory(Long accountId) {
        return transactionRepo.findByAccountId(accountId);
    }
}
