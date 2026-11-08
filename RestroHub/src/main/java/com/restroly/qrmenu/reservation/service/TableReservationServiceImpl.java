package com.restroly.qrmenu.reservation.service;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.reservation.dto.ReservationRequest;
import com.restroly.qrmenu.reservation.dto.ReservationResponse;
import com.restroly.qrmenu.reservation.entity.TableReservation;
import com.restroly.qrmenu.reservation.repository.TableReservationRepository;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 2026-11-08 - Table reservation service implementation - Link reservation with branch tables and
// update table status
@Slf4j
@Service
@RequiredArgsConstructor
public class TableReservationServiceImpl implements TableReservationService {

  private final TableReservationRepository reservationRepository;
  private final TablesRepository tablesRepository;
  private final BranchRepository branchRepository;

  @Override
  @Transactional
  public ReservationResponse createReservation(ReservationRequest request) {
    Long branchId = request.getBranchId();
    if (branchId == null || branchId <= 0) {
      branchId =
          branchRepository.findByIsDeleteFalse().stream()
              .findFirst()
              .map(Branch::getBranchId)
              .orElse(1L);
    }

    int guestsCount = request.getParsedGuestsCount();
    log.info(
        "Processing reservation for branch: {}, guests: {}, customer: {}",
        branchId,
        guestsCount,
        request.getCustomerName());

    // 1. Locate and allocate an available table
    Tables allocatedTable = null;
    if (request.getTableId() != null) {
      allocatedTable =
          tablesRepository.findByTableIdAndIsActiveTrue(request.getTableId()).orElse(null);
    }

    if (allocatedTable == null) {
      List<Tables> availableTables =
          tablesRepository
              .findByBranchBranchIdAndStatusIgnoreCaseAndIsActiveTrue(branchId, "available")
              .stream()
              .filter(t -> t.getTableNumber() == null || t.getTableNumber() > 0)
              .toList();

      if (!availableTables.isEmpty()) {
        allocatedTable =
            availableTables.stream()
                .filter(t -> t.getCapacity() != null && t.getCapacity() >= guestsCount)
                .min(Comparator.comparingInt(Tables::getCapacity))
                .orElseGet(
                    () ->
                        availableTables.stream()
                            .max(
                                Comparator.comparingInt(
                                    t -> t.getCapacity() != null ? t.getCapacity() : 0))
                            .orElse(availableTables.get(0)));
      }
    }

    // 2. Mark table as reserved if allocated
    if (allocatedTable != null) {
      allocatedTable.setStatus("reserved");
      tablesRepository.save(allocatedTable);
      log.info(
          "Table {} (ID: {}) reserved for branch {}",
          allocatedTable.getTableNumber(),
          allocatedTable.getTableId(),
          branchId);
    } else {
      log.warn(
          "No available table found to allocate for branch {} with {} guests. Recording reservation without table lock.",
          branchId,
          guestsCount);
    }

    // 3. Generate confirmation number
    String confirmationNumber =
        "RSV-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();

    // 4. Save reservation record
    TableReservation reservation =
        TableReservation.builder()
            .branchId(branchId)
            .tableId(allocatedTable != null ? allocatedTable.getTableId() : null)
            .tableNumber(allocatedTable != null ? allocatedTable.getTableNumber() : null)
            .customerName(request.getCustomerName())
            .customerEmail(request.getCustomerEmail())
            .customerPhone(request.getCustomerPhone())
            .reservationDate(request.getReservationDate())
            .timeSlot(request.getTimeSlot())
            .guestsCount(guestsCount)
            .specialRequests(request.getSpecialRequests())
            .status("CONFIRMED")
            .confirmationNumber(confirmationNumber)
            .build();

    TableReservation saved = reservationRepository.save(reservation);
    log.info(
        "Reservation saved with id: {}, confirmation: {}",
        saved.getId(),
        saved.getConfirmationNumber());

    return toResponse(saved, true, "Reservation confirmed successfully");
  }

  @Override
  @Transactional(readOnly = true)
  public ReservationResponse getReservationByConfirmationNumber(String confirmationNumber) {
    TableReservation reservation =
        reservationRepository
            .findByConfirmationNumber(confirmationNumber)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Reservation not found with confirmation: " + confirmationNumber));
    return toResponse(reservation, true, "Reservation details fetched");
  }

  @Override
  @Transactional(readOnly = true)
  public List<ReservationResponse> getReservationsByBranch(Long branchId) {
    return reservationRepository.findByBranchIdOrderByCreatedAtDesc(branchId).stream()
        .map(r -> toResponse(r, true, "OK"))
        .toList();
  }

  private ReservationResponse toResponse(TableReservation entity, boolean success, String message) {
    return ReservationResponse.builder()
        .success(success)
        .message(message)
        .confirmationNumber(entity.getConfirmationNumber())
        .reservationId(entity.getId())
        .branchId(entity.getBranchId())
        .tableId(entity.getTableId())
        .tableNumber(entity.getTableNumber())
        .customerName(entity.getCustomerName())
        .customerEmail(entity.getCustomerEmail())
        .customerPhone(entity.getCustomerPhone())
        .reservationDate(entity.getReservationDate())
        .timeSlot(entity.getTimeSlot())
        .guestsCount(entity.getGuestsCount())
        .specialRequests(entity.getSpecialRequests())
        .status(entity.getStatus())
        .createdAt(entity.getCreatedAt())
        .build();
  }
}
