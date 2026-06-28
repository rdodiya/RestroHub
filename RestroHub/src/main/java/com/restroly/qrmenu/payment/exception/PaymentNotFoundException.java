package com.restroly.qrmenu.payment.exception;
import com.restroly.qrmenu.exception.ResourceNotFoundException;

public class PaymentNotFoundException extends ResourceNotFoundException {
    public PaymentNotFoundException(String message) {
        super(message);
    }
}

