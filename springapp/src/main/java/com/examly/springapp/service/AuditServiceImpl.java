package com.examly.springapp.service;

import com.examly.springapp.model.AuditLog;
import com.examly.springapp.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AuditServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void log(String action, Long accountId, Long relatedAccountId, Double amount, String description) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setAccountId(accountId);
        log.setRelatedAccountId(relatedAccountId);
        log.setAmount(amount);
        log.setDescription(description);
        auditLogRepository.save(log);
    }
}


