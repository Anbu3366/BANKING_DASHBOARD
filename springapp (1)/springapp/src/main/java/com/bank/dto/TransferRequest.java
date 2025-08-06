package com.bank.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private Long senderId;
    private Long receiverId;
    private Double amount;
    private String description;
    public Object getFromAccountId() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFromAccountId'");
    }
    public Object getToAccountId() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getToAccountId'");
    }
}