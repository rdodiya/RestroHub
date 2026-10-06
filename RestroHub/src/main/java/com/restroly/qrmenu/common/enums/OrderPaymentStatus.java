package com.restroly.qrmenu.common.enums;

/** Manual payment tracking for an order (UPI is verified by staff, not by a gateway). */
public enum OrderPaymentStatus {
  UNPAID,
  LINK_SENT,
  VERIFIED_BY_STAFF
}
