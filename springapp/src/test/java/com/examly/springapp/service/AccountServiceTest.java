package com.examly.springapp.service;

import com.examly.springapp.model.Account;
import com.examly.springapp.repository.AccountRepository;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class AccountServiceTest {
    private AccountRepository accountRepository;
    private Validator validator;
    private AccountServiceImpl accountService;

    @BeforeEach
    public void setup() {
        accountRepository = Mockito.mock(AccountRepository.class);
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        accountService = new AccountServiceImpl(accountRepository, validator);
    }

    @Test
    public void testCreateAccount_Success() {
        Account acc = new Account();
        acc.setAccountNumber("1234567890");
        acc.setAccountHolderName("John Doe");
        acc.setBalance(1000.00);
        acc.setAccountType("Savings");

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.empty());
        when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));
        Account created = accountService.createAccount(acc);
        assertEquals("1234567890", created.getAccountNumber());
        assertEquals("John Doe", created.getAccountHolderName());
        assertEquals(1000.00, created.getBalance());
        assertEquals("Savings", created.getAccountType());
    }

    @Test
    public void testCreateAccount_InvalidAccountNumber() {
        Account acc = new Account();
        acc.setAccountNumber("12345");
        acc.setAccountHolderName("John Doe");
        acc.setBalance(1000.00);
        acc.setAccountType("Savings");
        assertThrows(IllegalArgumentException.class, () -> accountService.createAccount(acc));
    }

    @Test
    public void testCreateAccount_AccountNumberNotUnique() {
        Account acc = new Account();
        acc.setAccountNumber("1234567890");
        acc.setAccountHolderName("John");
        acc.setBalance(600.00);
        acc.setAccountType("Savings");
        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(acc));
        assertThrows(IllegalArgumentException.class, () -> accountService.createAccount(acc));
    }

    @Test
    public void testCreateAccount_AccountHolderNameEmpty() {
        Account acc = new Account();
        acc.setAccountNumber("1234567890");
        acc.setAccountHolderName("");
        acc.setBalance(600.0);
        acc.setAccountType("Savings");
        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> accountService.createAccount(acc));
    }

    @Test
    public void testCreateAccount_MinBalanceValidation() {
        Account acc = new Account();
        acc.setAccountNumber("1234567894");
        acc.setAccountHolderName("Alice");
        acc.setBalance(400.0);
        acc.setAccountType("Savings");
        when(accountRepository.findByAccountNumber("1234567894")).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> accountService.createAccount(acc));
    }

    @Test
    public void testCreateAccount_InvalidAccountType() {
        Account acc = new Account();
        acc.setAccountNumber("1234567811");
        acc.setAccountHolderName("Type");
        acc.setBalance(1000.0);
        acc.setAccountType("NonStandardType");
        when(accountRepository.findByAccountNumber("1234567811")).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> accountService.createAccount(acc));
    }

    @Test
    public void testGetAccountById_NotFound() {
        when(accountRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> accountService.getAccountById(999L));
    }

    @Test
    public void testGetAllAccounts() {
        when(accountRepository.findAll()).thenReturn(List.of());
        assertEquals(0, accountService.getAllAccounts().size());
    }
}
