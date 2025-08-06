package com.bank.dto;

import lombok.Data;

@Data
public class DepositWithdrawRequest {
    private Long accountId;
    private Double amount;
    private String description;
}