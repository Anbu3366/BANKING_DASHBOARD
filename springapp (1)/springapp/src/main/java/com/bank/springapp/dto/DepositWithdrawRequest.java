package com.bank.springapp.dto;

import jakarta.validation.constraints.*;

public class DepositWithdrawRequest {
    
    @NotNull(message = "Account ID is required")
    private Long accountId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;
    
    private String description;
    
    // Constructors
    public DepositWithdrawRequest() {}
    
    public DepositWithdrawRequest(Long accountId, Double amount, String description) {
        this.accountId = accountId;
        this.amount = amount;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getAccountId() {
        return accountId;
    }
    
    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
