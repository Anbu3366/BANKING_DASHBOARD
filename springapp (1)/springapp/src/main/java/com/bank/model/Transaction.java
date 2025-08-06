package com.bank.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private Long accountId;
    private Double amount;
    private String transactionType;
    private String description;
    private LocalDateTime transactionDate = LocalDateTime.now();
    private Long recipientAccountId;
}
