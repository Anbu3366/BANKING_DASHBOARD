package com.bank.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;
    
    @Column(unique = true, nullable = false)
    @Pattern(regexp = "\\d{10}", message = "Account number must be exactly 10 digits")
    private String accountNumber;
    
    @Column(nullable = false)
    @NotBlank(message = "Account holder name cannot be empty")
    private String accountHolderName;
    
    @Column(nullable = false)
    @DecimalMin(value = "500.0", message = "Minimum balance of 500.00 must be maintained")
    private Double balance;
    
    @Column(nullable = false)
    @Pattern(regexp = "Savings|Checking", message = "Account type must be Savings or Checking")
    private String accountType;
    
    @Column(nullable = false)
    private LocalDateTime createdDate;
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
    public Account() {}
    public Account(String accountNumber, String accountHolderName, Double balance, String accountType) {
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
        this.accountType = accountType;
        this.createdDate = LocalDateTime.now();
    }
    public Long getAccountId() {
        return accountId;
    }
    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }
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
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
