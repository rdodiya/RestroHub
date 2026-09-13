package com.restroly.qrmenu.payment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restroly.qrmenu.payment.dto.UpiLinkRequestDTO;
import com.restroly.qrmenu.payment.dto.UpiLinkResponseDTO;
import com.restroly.qrmenu.payment.service.UpiLinkService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION + "/upi-links")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "UPI Links", description = "Endpoints for managing branch UPI payment accounts")
public class UpiLinkController {

    private final UpiLinkService upiLinkService;

    @GetMapping(value = "/branch/{branchId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get all UPI links for a branch")
    public ResponseEntity<List<UpiLinkResponseDTO>> getUpiLinksByBranch(@PathVariable Long branchId) {
        log.debug("GET upi-links for branch: {}", branchId);
        return ResponseEntity.ok(upiLinkService.getUpiLinksByBranch(branchId));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get a single UPI link by ID")
    public ResponseEntity<UpiLinkResponseDTO> getUpiLinkById(@PathVariable Long id) {
        return ResponseEntity.ok(upiLinkService.getUpiLinkById(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Create a new UPI link")
    public ResponseEntity<UpiLinkResponseDTO> createUpiLink(
            @RequestParam(required = false) Long branchId,
            @Valid @RequestBody UpiLinkRequestDTO requestDTO) {

        Long effectiveBranchId = branchId != null ? branchId : requestDTO.getBranchId();
        if (effectiveBranchId == null) {
            throw new IllegalArgumentException("branchId must be provided either in query param or body");
        }

        UpiLinkResponseDTO created = upiLinkService.createUpiLink(effectiveBranchId, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(value = "/{id}/default", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Set a UPI link as default payment account")
    public ResponseEntity<UpiLinkResponseDTO> setDefaultUpiLink(
            @PathVariable Long id,
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(upiLinkService.setDefaultUpiLink(branchId, id));
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Delete a UPI link")
    public ResponseEntity<Map<String, String>> deleteUpiLink(@PathVariable Long id) {
        upiLinkService.deleteUpiLink(id);
        return ResponseEntity.ok(Map.of("message", "UPI link deleted successfully", "id", String.valueOf(id)));
    }

    @PostMapping(value = "/verify", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Test verify a UPI link")
    public ResponseEntity<Map<String, Object>> verifyUpiLink(@RequestBody Map<String, Object> payload) {
        Object linkIdObj = payload.get("linkId");
        Long linkId = linkIdObj instanceof Number ? ((Number) linkIdObj).longValue() : Long.parseLong(String.valueOf(linkIdObj));
        boolean isValid = upiLinkService.testVerifyUpiLink(linkId);
        return ResponseEntity.ok(Map.of("success", isValid, "status", isValid ? "VERIFIED" : "FAILED"));
    }
}
