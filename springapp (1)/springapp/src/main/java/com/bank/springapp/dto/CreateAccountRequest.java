package com.bank.springapp.dto;

import jakarta.validation.constraints.*;

public class CreateAccountRequest {
    
    @NotBlank(message = "Account number is required")
    @Pattern(regexp = "\\d{10}", message = "Account number must be exactly 10 digits")
    private String accountNumber;
    
    @NotBlank(message = "Account holder name is required")
    private String accountHolderName;
    
    @NotNull(message = "Balance is required")
    @DecimalMin(value = "500.0", message = "Minimum balance of 500.00 must be maintained")
    private Double balance;
    
    @NotBlank(message = "Account type is required")
    @Pattern(regexp = "Savings|Checking", message = "Account type must be Savings or Checking")
    private String accountType;
    
    // Constructors
    public CreateAccountRequest() {}
    
    public CreateAccountRequest(String accountNumber, String accountHolderName, Double balance, String accountType) {
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
        this.accountType = accountType;
    }
    
    // Getters and Setters
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }
    
    public String getAccountHolderName() {
        return accountHolderName;
    }
    
    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }
    
    public Double getBalance() {
        return balance;
    }
    
    public void setBalance(Double balance) {
        this.balance = balance;
    }
    
    public String getAccountType() {
        return accountType;
    }
    
    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }
}
