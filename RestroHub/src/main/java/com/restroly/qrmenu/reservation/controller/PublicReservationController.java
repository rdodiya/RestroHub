package com.restroly.qrmenu.reservation.controller;

import static com.restroly.qrmenu.common.util.ApiConstants.PUBLIC_API_VERSION;

import com.restroly.qrmenu.reservation.dto.ReservationRequest;
import com.restroly.qrmenu.reservation.dto.ReservationResponse;
import com.restroly.qrmenu.reservation.service.TableReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// 2026-11-08 - Public reservation controller - Expose public endpoints for table reservation from
// website
@RestController
@RequestMapping(PUBLIC_API_VERSION + "/reservations")
@RequiredArgsConstructor
@Tag(name = "Public Reservations", description = "Public APIs for website table reservations")
public class PublicReservationController {

  private final TableReservationService reservationService;

  @PostMapping
  @Operation(summary = "Submit a table reservation request")
  public ResponseEntity<ReservationResponse> createReservation(
      @Valid @RequestBody ReservationRequest request) {
    ReservationResponse response = reservationService.createReservation(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/{confirmationNumber}")
  @Operation(summary = "Lookup reservation details by confirmation number")
  public ResponseEntity<ReservationResponse> getReservation(
      @PathVariable String confirmationNumber) {
    ReservationResponse response =
        reservationService.getReservationByConfirmationNumber(confirmationNumber);
    return ResponseEntity.ok(response);
  }
}
