package com.examly.springapp.controller;

import com.examly.springapp.dto.CreateAccountRequest;
import com.examly.springapp.model.Account;
import com.examly.springapp.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AccountController{
    
    @Autowired
    private AccountService accountService;
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAccount(@PathVariable Long id) {
        try {
            Account account = accountService.getAccountById(id);
            return ResponseEntity.ok(account);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }
    
    @PostMapping
    public ResponseEntity<?> createAccount(@Valid @RequestBody CreateAccountRequest request, BindingResult bindingResult) {
        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().get(0).getDefaultMessage();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse(errorMessage));
            }
            
            Account account = new Account();
            account.setAccountNumber(request.getAccountNumber());
            account.setAccountHolderName(request.getAccountHolderName());
            account.setBalance(request.getBalance());
            account.setAccountType(request.getAccountType());
            
            Account createdAccount = accountService.createAccount(account);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Error response class
    public static class ErrorResponse {
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
