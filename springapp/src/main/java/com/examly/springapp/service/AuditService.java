package com.examly.springapp.service;

public interface AuditService {
    void log(String action, Long accountId, Long relatedAccountId, Double amount, String description);
}


