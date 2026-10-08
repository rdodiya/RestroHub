// com/restro/qrmenu/order/entity/Order.java
package com.restroly.qrmenu.order.entity;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.common.enums.OrderPaymentStatus;
import com.restroly.qrmenu.common.enums.OrderSource;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.table.entity.Tables;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "T_order_master")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_id")
  private Long orderId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "branch_id", nullable = false)
  private Branch branch;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "table_id", nullable = false)
  private Tables table;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "total_amount")
  private BigDecimal totalAmount;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  @Builder.Default
  private OrderStatus status = OrderStatus.PENDING;

  @Column(name = "customer_name")
  private String customerName;

  @Column(name = "customer_phone")
  private String customerPhone;

  @Column(name = "special_instructions")
  private String specialInstructions;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<OrderItem> orderItems = new ArrayList<>();

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_status")
  @Builder.Default
  private OrderPaymentStatus paymentStatus = OrderPaymentStatus.UNPAID;

  @Enumerated(EnumType.STRING)
  @Column(name = "order_source")
  private OrderSource orderSource;

  /** Client-supplied key; a repeat of the same key returns this order instead of a new one. */
  @Column(name = "idempotency_key", length = 64, unique = true)
  private String idempotencyKey;

  // Not storing in database only for better payment utility
  @Transient private String paymentId;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  //    // Helper method to add order items
  //    public void addOrderItem(OrderItem item) {
  //        orderItems.add(item);
  ////        item.setOrder(this);
  //    }
  //
  //    public void removeOrderItem(OrderItem item) {
  //        orderItems.remove(item);
  ////        item.setOrder(null);
  //    }
  //
  //	public void setStatus(OrderStatus status) {
  //		this.status=status;
  //	}

}
