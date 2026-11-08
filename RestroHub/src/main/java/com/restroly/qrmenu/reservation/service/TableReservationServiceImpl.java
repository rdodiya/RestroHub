package com.restroly.qrmenu.reservation.service;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.reservation.dto.ReservationAvailabilityResponse;
import com.restroly.qrmenu.reservation.dto.ReservationRequest;
import com.restroly.qrmenu.reservation.dto.ReservationResponse;
import com.restroly.qrmenu.reservation.entity.TableReservation;
import com.restroly.qrmenu.reservation.repository.TableReservationRepository;
import com.restroly.qrmenu.reservation.util.ReservationTimeUtil;
import com.restroly.qrmenu.reservation.util.ReservationTimeUtil.ParsedTimeSlot;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 2026-11-08 - Table reservation service implementation - Multi-time booking with 15-min gap
// enforcement and best-fit allocation
// enforcement
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
    ParsedTimeSlot timeSlot =
        ReservationTimeUtil.parse(
            request.getTimeSlot(), request.getStartTime(), request.getEndTime());

    log.info(
        "Processing reservation for branch: {}, date: {}, slot: {}, guests: {}, customer: {}",
        branchId,
        request.getReservationDate(),
        timeSlot.getTimeRange(),
        guestsCount,
        request.getCustomerName());

    // 1. Fetch existing confirmed reservations for this branch on the same date
    List<TableReservation> existingReservations =
        reservationRepository.findByBranchIdAndReservationDateAndStatusNot(
            branchId, request.getReservationDate(), "CANCELLED");

    // 2. Locate and allocate an available table with 15-min gap buffer and minimum empty seat
    // difference
    Tables allocatedTable = null;

    if (request.getTableId() != null) {
      Tables requestedTable =
          tablesRepository
              .findByTableIdAndIsActiveTrue(request.getTableId())
              .orElseThrow(
                  () ->
                      new ResourceNotFoundException(
                          "Table not found with id: " + request.getTableId()));

      if (requestedTable.getCapacity() != null && requestedTable.getCapacity() < guestsCount) {
        throw new ResourceAlreadyExistsException(
            "Table "
                + requestedTable.getTableNumber()
                + " has a capacity of "
                + requestedTable.getCapacity()
                + ", which cannot accommodate "
                + guestsCount
                + " guests.");
      }

      TableReservation conflicting =
          findConflictForTable(
              requestedTable.getTableId(),
              existingReservations,
              timeSlot.getStartMinutes(),
              timeSlot.getEndMinutes());
      if (conflicting != null) {
        throw new ResourceAlreadyExistsException(
            "Table "
                + requestedTable.getTableNumber()
                + " is already booked for "
                + conflicting.getTimeRange()
                + ". Bookings require at least a 15-minute gap.");
      }
      allocatedTable = requestedTable;
    } else {
      List<Tables> allTables =
          tablesRepository.findByBranchBranchIdAndIsActiveTrue(branchId).stream()
              .filter(t -> t.getTableNumber() == null || t.getTableNumber() > 0)
              .toList();

      // 2026-11-08 - issue: table booking collision - reason: filter unreserved tables fitting
      // guest count
      List<Tables> suitableEmptyTables = new ArrayList<>();
      for (Tables table : allTables) {
        int capacity = table.getCapacity() != null ? table.getCapacity() : 4;
        if (capacity >= guestsCount) {
          TableReservation conflict =
              findConflictForTable(
                  table.getTableId(),
                  existingReservations,
                  timeSlot.getStartMinutes(),
                  timeSlot.getEndMinutes());
          if (conflict == null) {
            suitableEmptyTables.add(table);
          }
        }
      }

      // 2026-11-08 - issue: booking unavailable tables - reason: throw error if no table is empty
      if (suitableEmptyTables.isEmpty()) {
        throw new ResourceAlreadyExistsException(
            "No tables available for "
                + guestsCount
                + " guest"
                + (guestsCount > 1 ? "s" : "")
                + " for "
                + timeSlot.getTimeRange()
                + " on "
                + request.getReservationDate()
                + ". All suitable tables are currently reserved (minimum 15-minute gap required between bookings).");
      }

      // 2026-11-08 - issue: table selection - reason: prioritise empty tables with minimum empty
      // seat difference
      suitableEmptyTables.sort(
          Comparator.comparingInt(
                  (Tables t) -> (t.getCapacity() != null ? t.getCapacity() : 4) - guestsCount)
              .thenComparing(t -> t.getTableNumber() != null ? t.getTableNumber() : 0));

      allocatedTable = suitableEmptyTables.get(0);
    }

    log.info(
        "Allocated Table {} (ID: {}) for time range {}",
        allocatedTable.getTableNumber(),
        allocatedTable.getTableId(),
        timeSlot.getTimeRange());

    // 3. Generate confirmation number
    String confirmationNumber =
        "RSV-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();

    // 4. Save reservation record with time range
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
            .startTime(timeSlot.getStartTime())
            .endTime(timeSlot.getEndTime())
            .timeRange(timeSlot.getTimeRange())
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

  @Override
  @Transactional(readOnly = true)
  public ReservationAvailabilityResponse checkAvailability(
      Long branchId, String date, String time, Integer guests) {
    if (branchId == null || branchId <= 0) {
      branchId = 1L;
    }
    int guestsCount = (guests != null && guests > 0) ? guests : 2;
    ParsedTimeSlot timeSlot = ReservationTimeUtil.parse(time, null, null);

    List<TableReservation> existingReservations =
        reservationRepository.findByBranchIdAndReservationDateAndStatusNot(
            branchId, date, "CANCELLED");

    List<Tables> allTables =
        tablesRepository.findByBranchBranchIdAndIsActiveTrue(branchId).stream()
            .filter(t -> t.getTableNumber() == null || t.getTableNumber() > 0)
            .toList();

    int availableCount = 0;
    for (Tables table : allTables) {
      if (table.getCapacity() != null && table.getCapacity() >= guestsCount) {
        if (findConflictForTable(
                table.getTableId(),
                existingReservations,
                timeSlot.getStartMinutes(),
                timeSlot.getEndMinutes())
            == null) {
          availableCount++;
        }
      }
    }

    boolean available = availableCount > 0;
    String message =
        available
            ? "Table is available for " + timeSlot.getTimeRange()
            : "No tables available for "
                + guestsCount
                + " guest"
                + (guestsCount > 1 ? "s" : "")
                + " for "
                + timeSlot.getTimeRange()
                + " (minimum 15-minute gap required between bookings)";

    return ReservationAvailabilityResponse.builder()
        .available(available)
        .availableTablesCount(availableCount)
        .requestedTimeRange(timeSlot.getTimeRange())
        .message(message)
        .build();
  }

  private TableReservation findConflictForTable(
      Long tableId, List<TableReservation> reservations, int reqStartMin, int reqEndMin) {
    for (TableReservation res : reservations) {
      if (tableId.equals(res.getTableId())) {
        int resStartMin = ReservationTimeUtil.parseMinutes(res.getStartTime(), res.getTimeSlot());
        int resEndMin =
            ReservationTimeUtil.parseMinutes(
                res.getEndTime(),
                res.getStartTime() != null ? res.getStartTime() : res.getTimeSlot());
        if (resEndMin <= resStartMin) {
          resEndMin = resStartMin + ReservationTimeUtil.DEFAULT_DURATION_MINUTES;
        }

        if (ReservationTimeUtil.hasConflictMinutes(
            reqStartMin,
            reqEndMin,
            resStartMin,
            resEndMin,
            ReservationTimeUtil.DEFAULT_BUFFER_MINUTES)) {
          return res;
        }
      }
    }
    return null;
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
        .startTime(entity.getStartTime())
        .endTime(entity.getEndTime())
        .timeRange(entity.getTimeRange())
        .guestsCount(entity.getGuestsCount())
        .specialRequests(entity.getSpecialRequests())
        .status(entity.getStatus())
        .createdAt(entity.getCreatedAt())
        .build();
  }
}
