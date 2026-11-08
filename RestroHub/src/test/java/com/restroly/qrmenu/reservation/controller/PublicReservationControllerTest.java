package com.restroly.qrmenu.reservation.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.restroly.qrmenu.reservation.dto.ReservationRequest;
import com.restroly.qrmenu.reservation.dto.ReservationResponse;
import com.restroly.qrmenu.reservation.service.TableReservationService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// 2026-11-08 - Public reservation controller test - Verify controller endpoints and HTTP responses
class PublicReservationControllerTest {

  private final TableReservationService reservationService = mock(TableReservationService.class);
  private final PublicReservationController controller =
      new PublicReservationController(reservationService);

  @Test
  void createReservationReturnsCreatedStatusWithResponse() {
    ReservationRequest request =
        ReservationRequest.builder()
            .branchId(1L)
            .customerName("Jane Doe")
            .customerPhone("9876543210")
            .reservationDate("2026-11-15")
            .timeSlot("7:30 PM")
            .guests(2)
            .build();

    ReservationResponse mockResponse =
        ReservationResponse.builder()
            .success(true)
            .confirmationNumber("RSV-TEST1234")
            .reservationId(50L)
            .tableId(2L)
            .tableNumber(1)
            .status("CONFIRMED")
            .build();

    when(reservationService.createReservation(any(ReservationRequest.class)))
        .thenReturn(mockResponse);

    ResponseEntity<ReservationResponse> response = controller.createReservation(request);

    assertEquals(HttpStatus.CREATED, response.getStatusCode());
    assertTrue(response.getBody().isSuccess());
    assertEquals("RSV-TEST1234", response.getBody().getConfirmationNumber());
    assertEquals(2L, response.getBody().getTableId());
    verify(reservationService).createReservation(any(ReservationRequest.class));
  }

  @Test
  void getReservationByConfirmationNumberReturnsOk() {
    ReservationResponse mockResponse =
        ReservationResponse.builder()
            .success(true)
            .confirmationNumber("RSV-TEST1234")
            .reservationId(50L)
            .status("CONFIRMED")
            .build();

    when(reservationService.getReservationByConfirmationNumber("RSV-TEST1234"))
        .thenReturn(mockResponse);

    ResponseEntity<ReservationResponse> response = controller.getReservation("RSV-TEST1234");

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("RSV-TEST1234", response.getBody().getConfirmationNumber());
    verify(reservationService).getReservationByConfirmationNumber("RSV-TEST1234");
  }
}
