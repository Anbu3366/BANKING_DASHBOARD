package com.bank.springapp.controller;

import com.bank.springapp.dto.DepositWithdrawRequest;
import com.bank.springapp.dto.TransferRequest;
import com.bank.springapp.model.Account;
import com.bank.springapp.model.Transaction;
import com.bank.springapp.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
  
  @Autowired
  private TransactionService transactionService;
  
  @PostMapping("/deposit")
  public ResponseEntity<?> deposit(@Valid @RequestBody DepositWithdrawRequest request) {
    try {
      Account account = transactionService.deposit(
          request.getAccountId(), 
          request.getAmount(), 
          request.getDescription()
      );
      return ResponseEntity.ok(account);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ErrorResponse(e.getMessage()));
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ErrorResponse(e.getMessage()));
    }
  }
  
  @PostMapping("/withdraw")
  public ResponseEntity<?> withdraw(@Valid @RequestBody DepositWithdrawRequest request) {
    try {
      Account account = transactionService.withdraw(
          request.getAccountId(), 
          request.getAmount(), 
          request.getDescription()
      );
      return ResponseEntity.ok(account);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ErrorResponse(e.getMessage()));
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ErrorResponse(e.getMessage()));
    }
  }
  
  @PostMapping("/transfer")
  public ResponseEntity<?> transfer(@Valid @RequestBody TransferRequest request) {
    try {
      Account account = transactionService.transfer(
          request.getFromAccountId(),
          request.getToAccountId(),
          request.getAmount(),
          request.getDescription()
      );
      return ResponseEntity.ok(account);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ErrorResponse(e.getMessage()));
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ErrorResponse(e.getMessage()));
    }
  }
  
  @GetMapping("/account/{accountId}")
  public ResponseEntity<?> getTransactionHistory(@PathVariable Long accountId) {
    try {
      List<Transaction> transactions = transactionService.getTransactionHistory(accountId);
      return ResponseEntity.ok(transactions);
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new ErrorResponse(e.getMessage()));
    }
  }
  
  private static class ErrorResponse {
    private String message;
    
    public ErrorResponse(String message) {
      this.message = message;
    }
    
    public String getMessage() {
      return message;
    }
    
    public void setMessage(String message) {
      this.message = message;
    }
  }
}
