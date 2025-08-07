package com.examly.springapp.controller;

import com.examly.springapp.dto.CreateAccountRequest;
import com.examly.springapp.model.Account;
import com.examly.springapp.service.AccountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AccountController.class)
public class AccountControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountService accountService;

    @Autowired
    private ObjectMapper objectMapper;

    private Account sampleAccount;

    @BeforeEach
    public void setup() {
        sampleAccount = new Account();
        sampleAccount.setAccountId(1L);
        sampleAccount.setAccountNumber("1234567890");
        sampleAccount.setAccountHolderName("John Doe");
        sampleAccount.setBalance(2000.00);
        sampleAccount.setAccountType("Savings");
        sampleAccount.setCreatedDate(LocalDateTime.now());
    }

    @Test
    public void testGetAccount_Success() throws Exception {
        when(accountService.getAccountById(1L)).thenReturn(sampleAccount);
        mockMvc.perform(get("/api/accounts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountNumber").value("1234567890"));
    }

    @Test
    public void testGetAccount_NotFound() throws Exception {
        when(accountService.getAccountById(89L)).thenThrow(new NoSuchElementException("Account not found"));
        mockMvc.perform(get("/api/accounts/89"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Account not found"));
    }

    @Test
    public void testGetAllAccounts() throws Exception {
        List<Account> list = new ArrayList<>();
        list.add(sampleAccount);
        when(accountService.getAllAccounts()).thenReturn(list);
        mockMvc.perform(get("/api/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].accountNumber").value("1234567890"));
    }

    @Test
    public void testCreateAccount_Success() throws Exception {
        CreateAccountRequest req = new CreateAccountRequest();
        req.setAccountNumber("9876543210");
        req.setAccountHolderName("Jane");
        req.setBalance(800.00);
        req.setAccountType("Checking");
        Account acc = new Account();
        acc.setAccountId(2L);
        acc.setAccountNumber("9876543210");
        acc.setAccountHolderName("Jane");
        acc.setBalance(800.00);
        acc.setAccountType("Checking");
        acc.setCreatedDate(LocalDateTime.now());
        when(accountService.createAccount(Mockito.any(Account.class))).thenReturn(acc);
        mockMvc.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountId").value(2))
                .andExpect(jsonPath("$.accountHolderName").value("Jane"));
    }

    @Test
    public void testCreateAccount_ValidationError() throws Exception {
        CreateAccountRequest req = new CreateAccountRequest();
        req.setAccountNumber("123");
        req.setAccountHolderName("John");
        req.setBalance(300.0);
        req.setAccountType("");
        mockMvc.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }
}
