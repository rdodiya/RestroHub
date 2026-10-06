package com.restroly.qrmenu.audit.repository;

import com.restroly.qrmenu.audit.entity.AuditLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntry, Long> {}
