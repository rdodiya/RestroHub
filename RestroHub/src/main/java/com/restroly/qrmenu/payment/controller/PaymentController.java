

//Preferred : only use for testing purpose, as this module is a plug-and-play type and should not have any external dependencies. --- IGNORE ---
// Written By Contributor who formally made this module --- IGNORE ---




package com.restroly.qrmenu.payment.controller;

import com.restroly.qrmenu.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.restroly.qrmenu.common.util.ApiConstants.*;
@RestController
@RequestMapping(PUBLIC_API_VERSION+"/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/link")
    public ResponseEntity<String> generatePaymentLink(
            @RequestParam double amount,
            @RequestParam(required = false) Long orderId,
            @RequestParam String upiId) {
        String link = paymentService.generatePaymentLink(amount, orderId, upiId);
        return ResponseEntity.ok(link);
    }

    @GetMapping("/qr")
    public ResponseEntity<Resource> generateUPIQR(
            @RequestParam double amount,
            @RequestParam String upiId,
            @RequestParam(required = false, defaultValue = "RestroHub Payment") String description) {
        Resource qrResource = paymentService.generateUPIQR(amount, upiId, description);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"upi-qr.png\"")
                .body(qrResource);
    }

    @GetMapping("/verify/{paymentId}")
    public ResponseEntity<Boolean> verifyPayment(@PathVariable String paymentId) {
        boolean verified = paymentService.verifyPayment(paymentId);
        return ResponseEntity.ok(verified);
    }
}
