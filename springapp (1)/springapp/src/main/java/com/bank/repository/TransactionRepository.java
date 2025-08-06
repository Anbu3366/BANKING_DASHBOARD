package com.bank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.model.Transaction;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountId(Long accountId);

    List<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId);
}