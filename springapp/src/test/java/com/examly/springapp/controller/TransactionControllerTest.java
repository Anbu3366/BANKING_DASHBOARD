package com.examly.springapp.controller;

import com.examly.springapp.dto.DepositWithdrawRequest;
import com.examly.springapp.dto.TransferRequest;
import com.examly.springapp.model.Account;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.service.TransactionService;
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
import java.util.List;
import java.util.NoSuchElementException;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionController.class)
public class TransactionControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService transactionService;

    @Autowired
    private ObjectMapper objectMapper;

    private Account sampleAccount;
    private Transaction sampleTx;

    @BeforeEach
    public void setup() {
        sampleAccount = new Account();
        sampleAccount.setAccountId(1L);
        sampleAccount.setAccountNumber("1234567890");
        sampleAccount.setAccountHolderName("John Doe");
        sampleAccount.setBalance(1000.0);
        sampleAccount.setAccountType("Savings");
        sampleAccount.setCreatedDate(LocalDateTime.now());

        sampleTx = new Transaction();
        sampleTx.setTransactionId(1L);
        sampleTx.setAccountId(1L);
        sampleTx.setAmount(500.0);
        sampleTx.setTransactionType("DEPOSIT");
        sampleTx.setDescription("Salary deposit");
        sampleTx.setRecipientAccountId(null);
        sampleTx.setTransactionDate(LocalDateTime.now());
    }

    @Test
    public void testDeposit_Success() throws Exception {
        DepositWithdrawRequest req = new DepositWithdrawRequest();
        req.setAccountId(1L);
        req.setAmount(400.0);
        req.setDescription("desc");
        when(transactionService.deposit(1L, 400.0, "desc")).thenReturn(sampleAccount);
        mockMvc.perform(post("/api/transactions/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountNumber").value("1234567890"));
    }

    @Test
    public void testWithdraw_Insufficient() throws Exception {
        DepositWithdrawRequest req = new DepositWithdrawRequest();
        req.setAccountId(1L);
        req.setAmount(700.0);
        req.setDescription("try withdraw");
        when(transactionService.withdraw(1L, 700.0, "try withdraw")).thenThrow(new IllegalArgumentException("Insufficient funds. Minimum balance of 500.00 must be maintained."));
        mockMvc.perform(post("/api/transactions/withdraw")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Insufficient funds. Minimum balance of 500.00 must be maintained."));
    }

    @Test
    public void testTransfer_Success() throws Exception {
        TransferRequest req = new TransferRequest();
        req.setFromAccountId(1L);
        req.setToAccountId(2L);
        req.setAmount(100.0);
        req.setDescription("Transfer desc");
        when(transactionService.transfer(1L, 2L, 100.0, "Transfer desc")).thenReturn(sampleAccount);
        mockMvc.perform(post("/api/transactions/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountNumber").value("1234567890"));
    }

    @Test
    public void testTransfer_SameAccount() throws Exception {
        TransferRequest req = new TransferRequest();
        req.setFromAccountId(1L);
        req.setToAccountId(1L);
        req.setAmount(100.0);
        req.setDescription("Self transfer");
        when(transactionService.transfer(1L, 1L, 100.0, "Self transfer")).thenThrow(new IllegalArgumentException("Cannot transfer to the same account"));
        mockMvc.perform(post("/api/transactions/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cannot transfer to the same account"));
    }

    @Test
    public void testGetTransactionHistory_Success() throws Exception {
        when(transactionService.getTransactionHistory(1L)).thenReturn(List.of(sampleTx));
        mockMvc.perform(get("/api/transactions/account/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].transactionType").value("DEPOSIT"));
    }

    @Test
    public void testGetTransactionHistory_AccountNotFound() throws Exception {
        when(transactionService.getTransactionHistory(888L)).thenThrow(new NoSuchElementException("Account not found"));
        mockMvc.perform(get("/api/transactions/account/888"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Account not found"));
    }
}
