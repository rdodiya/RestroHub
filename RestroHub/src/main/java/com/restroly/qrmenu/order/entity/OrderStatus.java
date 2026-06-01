package com.restroly.qrmenu.order.entity;

/**
 * @deprecated Use {@link com.restroly.qrmenu.common.enums.OrderStatus} instead.
 * This duplicate enum is kept only for backward compatibility and will be removed.
 */
@Deprecated
public enum OrderStatus {
	PENDING,
    CONFIRMED,
    PREPARING,
    READY,
    SERVED,
    COMPLETED,
    BILLED,
    CANCELLED

}
