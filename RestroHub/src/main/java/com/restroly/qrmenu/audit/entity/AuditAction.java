package com.restroly.qrmenu.audit.entity;

/** Sensitive actions recorded in the audit log (PHASE1 §6.1). */
public enum AuditAction {
  ROLE_ASSIGNED,
  ROLE_REMOVED,
  SUBSCRIPTION_CHANGED,
  UPI_VPA_CHANGED
}
