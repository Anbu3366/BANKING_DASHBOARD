package com.bank.dto;

import jakarta.validation.constraints.*;

public class TransferRequest {
    
    @NotNull(message = "From account ID is required")
    private Long fromAccountId;
    
    @NotNull(message = "To account ID is required")
    private Long toAccountId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;
    
    private String description;
    
    // Constructors
    public TransferRequest() {}
    
    public TransferRequest(Long fromAccountId, Long toAccountId, Double amount, String description) {
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getFromAccountId() {
        return fromAccountId;
    }
    
    public void setFromAccountId(Long fromAccountId) {
        this.fromAccountId = fromAccountId;
    }
    
    public Long getToAccountId() {
        return toAccountId;
    }
    
    public void setToAccountId(Long toAccountId) {
        this.toAccountId = toAccountId;
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
