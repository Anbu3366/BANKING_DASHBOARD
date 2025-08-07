package com.examly.springapp.service;

import com.examly.springapp.model.Account;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.repository.AccountRepository;
import com.examly.springapp.repository.TransactionRepository;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import java.time.LocalDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class TransactionServiceTest {
    private AccountRepository accountRepository;
    private TransactionRepository transactionRepository;
    private Validator validator;
    private TransactionServiceImpl transactionService;

    @BeforeEach
    public void setup() {
        accountRepository = Mockito.mock(AccountRepository.class);
        transactionRepository = Mockito.mock(TransactionRepository.class);
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        transactionService = new TransactionServiceImpl(accountRepository, transactionRepository, validator);
    }

    @Test
    public void testDeposit_Success() {
        Account acc = new Account();
        acc.setAccountId(1L);
        acc.setAccountNumber("1234567890");
        acc.setAccountHolderName("John");
        acc.setBalance(1000.0);
        acc.setAccountType("Savings");
        when(accountRepository.findById(1L)).thenReturn(Optional.of(acc));
        when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArgument(0));
        Account result = transactionService.deposit(1L, 500.0, "Deposit");
        assertEquals(1500.0, result.getBalance());
    }

    @Test
    public void testDeposit_InvalidAmount() {
        assertThrows(IllegalArgumentException.class, () -> transactionService.deposit(1L, 0.0, "Deposit"));
    }

    @Test
    public void testWithdraw_Success() {
        Account acc = new Account();
        acc.setAccountId(1L);
        acc.setBalance(2000.0);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(acc));
        when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArgument(0));
        Account result = transactionService.withdraw(1L, 1000.0, "Withdraw");
        assertEquals(1000.0, result.getBalance());
    }

    @Test
    public void testWithdraw_InsufficientFunds() {
        Account acc = new Account();
        acc.setAccountId(2L);
        acc.setBalance(600.0);
        when(accountRepository.findById(2L)).thenReturn(Optional.of(acc));
        assertThrows(IllegalArgumentException.class, () -> transactionService.withdraw(2L, 200.01, "Withdraw"));
    }

    @Test
    public void testTransfer_Success() {
        Account from = new Account();
        from.setAccountId(1L);
        from.setBalance(1200.0);
        Account to = new Account();
        to.setAccountId(2L);
        to.setBalance(600.0);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(from));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(to));
        when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArgument(0));
        Account updated = transactionService.transfer(1L, 2L, 300.0, "Rent");
        assertEquals(900.0, updated.getBalance());
        assertEquals(900.0, from.getBalance());
        assertEquals(900.0, to.getBalance());
    }

    @Test
    public void testTransfer_InsufficientFunds() {
        Account from = new Account();
        from.setAccountId(1L);
        from.setBalance(700.0);
        Account to = new Account();
        to.setAccountId(2L);
        to.setBalance(700.0);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(from));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(to));
        assertThrows(IllegalArgumentException.class, () -> transactionService.transfer(1L, 2L, 300.1, "Big Transfer"));
    }

    @Test
    public void testTransfer_ToSameAccount() {
        assertThrows(IllegalArgumentException.class, () -> transactionService.transfer(1L, 1L, 100.0, "Self Transfer"));
    }

    @Test
    public void testGetTransactionHistory_AccountNotFound() {
        when(accountRepository.existsById(33L)).thenReturn(false);
        assertThrows(NoSuchElementException.class, () -> transactionService.getTransactionHistory(33L));
    }

    @Test
    public void testGetTransactionHistory_Order() {
        Transaction t1 = new Transaction();
        t1.setTransactionId(1L); t1.setAccountId(1L);
        t1.setTransactionDate(LocalDateTime.now().minusMinutes(10));
        Transaction t2 = new Transaction();
        t2.setTransactionId(2L); t2.setAccountId(1L);
        t2.setTransactionDate(LocalDateTime.now());
        when(accountRepository.existsById(1L)).thenReturn(true);
        when(transactionRepository.findByAccountIdOrderByTransactionDateDesc(1L)).thenReturn(Arrays.asList(t2, t1));
        var result = transactionService.getTransactionHistory(1L);
        assertEquals(2, result.size());
        assertEquals(t2.getTransactionId(), result.get(0).getTransactionId());
        assertEquals(t1.getTransactionId(), result.get(1).getTransactionId());
    }
}
