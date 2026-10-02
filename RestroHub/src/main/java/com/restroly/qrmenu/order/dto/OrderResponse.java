// com/Restroly/qrmenu/order/dto/OrderResponse.java
package com.restroly.qrmenu.order.dto;

import com.restroly.qrmenu.common.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

  private Long orderId;
  private Long branchId;
  private String branchName;
  private Long tableId;
  private Integer tableNumber;
  private String customerName;
  private String customerPhone;
  private String specialInstructions;
  private BigDecimal totalAmount;
  private String paymentLink;
  private OrderStatus status;
  private com.restroly.qrmenu.common.enums.OrderPaymentStatus paymentStatus;
  private com.restroly.qrmenu.common.enums.OrderSource orderSource;
  private LocalDateTime createdAt;
  private List<OrderItemResponse> items;

  public Long getOrderId() {
    return orderId;
  }

  public void setOrderId(Long orderId) {
    this.orderId = orderId;
  }

  public Long getBranchId() {
    return branchId;
  }

  public void setBranchId(Long branchId) {
    this.branchId = branchId;
  }

  public String getBranchName() {
    return branchName;
  }

  public void setBranchName(String branchName) {
    this.branchName = branchName;
  }

  public Long getTableId() {
    return tableId;
  }

  public void setTableId(Long tableId) {
    this.tableId = tableId;
  }

  public Integer getTableNumber() {
    return tableNumber;
  }

  public void setTableNumber(Integer tableNumber) {
    this.tableNumber = tableNumber;
  }

  public String getCustomerName() {
    return customerName;
  }

  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  public String getCustomerPhone() {
    return customerPhone;
  }

  public void setCustomerPhone(String customerPhone) {
    this.customerPhone = customerPhone;
  }

  public String getSpecialInstructions() {
    return specialInstructions;
  }

  public void setSpecialInstructions(String specialInstructions) {
    this.specialInstructions = specialInstructions;
  }

  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  public void setTotalAmount(BigDecimal totalAmount) {
    this.totalAmount = totalAmount;
  }

  public OrderStatus getStatus() {
    return status;
  }

  public void setStatus(OrderStatus status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public List<OrderItemResponse> getItems() {
    return items;
  }

  public void setItems(List<OrderItemResponse> items) {
    this.items = items;
  }

  public String getPaymentLink() {
    return paymentLink;
  }

  public void setPaymentLink(String paymentLink) {
    this.paymentLink = paymentLink;
  }

  /** Clears amounts and payment details for roles without VIEW_FINANCIALS; returns this. */
  public OrderResponse withoutFinancials() {
    this.totalAmount = null;
    this.paymentLink = null;
    if (items != null) {
      items.forEach(
          item -> {
            item.setUnitPrice(null);
            item.setSubtotal(null);
          });
    }
    return this;
  }
}
