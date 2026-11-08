package com.restroly.qrmenu.reservation.service;

import com.restroly.qrmenu.reservation.dto.ReservationAvailabilityResponse;
import com.restroly.qrmenu.reservation.dto.ReservationRequest;
import com.restroly.qrmenu.reservation.dto.ReservationResponse;
import java.util.List;

// 2026-11-08 - Table reservation service - Interface for multi-slot reserving and availability
// check
public interface TableReservationService {

  ReservationResponse createReservation(ReservationRequest request);

  ReservationResponse getReservationByConfirmationNumber(String confirmationNumber);

  List<ReservationResponse> getReservationsByBranch(Long branchId);

  ReservationAvailabilityResponse checkAvailability(
      Long branchId, String date, String time, Integer guests);
}
