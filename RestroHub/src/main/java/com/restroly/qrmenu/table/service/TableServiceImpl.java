package com.restroly.qrmenu.table.service;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.reservation.entity.TableReservation;
import com.restroly.qrmenu.reservation.repository.TableReservationRepository;
import com.restroly.qrmenu.reservation.util.ReservationTimeUtil;
import com.restroly.qrmenu.table.dto.TableBookingSlotDTO;
import com.restroly.qrmenu.table.dto.TableRequestDTO;
import com.restroly.qrmenu.table.dto.TableResponseDTO;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 2026-11-08 - Table service implementation - Enrich tables with booked time ranges and active
// status
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TableServiceImpl implements TableService {

  private static final String TABLE_NOT_FOUND = "Table not found with id: %s";

  private final TablesRepository tablesRepository;
  private final BranchRepository branchRepository;
  private final TableReservationRepository reservationRepository;

  @Override
  @Transactional(readOnly = true)
  public List<TableResponseDTO> getTablesByBranch(Long branchId) {
    validateBranchExists(branchId);
    List<TableReservation> reservations =
        reservationRepository.findByBranchIdAndStatusNot(branchId, "CANCELLED");

    Map<Long, List<TableReservation>> reservationsByTable =
        reservations.stream()
            .filter(r -> r.getTableId() != null)
            .collect(Collectors.groupingBy(TableReservation::getTableId));

    return tablesRepository.findByBranch_BranchId(branchId).stream()
        .map(
            table ->
                toResponseDTO(
                    table,
                    reservationsByTable.getOrDefault(table.getTableId(), Collections.emptyList())))
        .toList();
  }

  @Override
  public TableResponseDTO createTable(Long branchId, TableRequestDTO requestDTO) {
    log.info("Creating table {} for branch {}", requestDTO.getTableNumber(), branchId);

    Branch branch =
        branchRepository
            .findByBranchIdAndIsDeleteFalse(branchId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Branch not found with id: " + branchId));

    if (tablesRepository.existsByBranch_BranchIdAndTableNumber(
        branchId, requestDTO.getTableNumber())) {
      throw duplicateTableNumber(branchId, requestDTO.getTableNumber());
    }

    Tables table =
        Tables.builder()
            .branch(branch)
            .tableNumber(requestDTO.getTableNumber())
            .capacity(requestDTO.getCapacity() != null ? requestDTO.getCapacity() : 4)
            .status(normalizeStatus(requestDTO.getStatus()))
            .qrCodeUrl(requestDTO.getQrCodeUrl())
            .isActive(true)
            .build();

    return toResponseDTO(tablesRepository.save(table));
  }

  @Override
  public TableResponseDTO updateTable(Long tableId, TableRequestDTO requestDTO) {
    log.info("Updating table {}", tableId);

    Tables table = findTableOrThrow(tableId);
    Long branchId = table.getBranch().getBranchId();

    if (tablesRepository.existsByBranch_BranchIdAndTableNumberAndTableIdNot(
        branchId, requestDTO.getTableNumber(), tableId)) {
      throw duplicateTableNumber(branchId, requestDTO.getTableNumber());
    }

    table.setTableNumber(requestDTO.getTableNumber());
    table.setCapacity(
        requestDTO.getCapacity() != null ? requestDTO.getCapacity() : table.getCapacity());

    if (hasText(requestDTO.getStatus())) {
      table.setStatus(normalizeStatus(requestDTO.getStatus()));
    }

    if (requestDTO.getIsActive() != null) {
      table.setIsActive(requestDTO.getIsActive());
    }

    if (requestDTO.getQrCodeUrl() != null) {
      table.setQrCodeUrl(requestDTO.getQrCodeUrl());
    }

    return toResponseDTO(tablesRepository.save(table));
  }

  @Override
  public void deleteTable(Long tableId) {
    log.info("Deleting table {}", tableId);
    Tables table = findTableOrThrow(tableId);
    tablesRepository.delete(table);
  }

  private void validateBranchExists(Long branchId) {
    branchRepository
        .findByBranchIdAndIsDeleteFalse(branchId)
        .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));
  }

  private Tables findTableOrThrow(Long tableId) {
    return tablesRepository
        .findById(tableId)
        .orElseThrow(() -> new ResourceNotFoundException(String.format(TABLE_NOT_FOUND, tableId)));
  }

  private ResourceAlreadyExistsException duplicateTableNumber(Long branchId, Integer tableNumber) {
    return new ResourceAlreadyExistsException(
        "Table number " + tableNumber + " already exists for branch id: " + branchId);
  }

  private String normalizeStatus(String status) {
    return status == null || status.isBlank() ? "available" : status.toLowerCase();
  }

  private boolean hasText(String value) {
    return value != null && !value.isBlank();
  }

  private TableResponseDTO toResponseDTO(Tables table) {
    return TableResponseDTO.builder()
        .tableId(table.getTableId())
        .branchId(table.getBranch() != null ? table.getBranch().getBranchId() : null)
        .tableNumber(table.getTableNumber())
        .capacity(table.getCapacity())
        .status(table.getStatus())
        .qrCodeUrl(table.getQrCodeUrl())
        .isActive(table.getIsActive())
        .bookedSlots(Collections.emptyList())
        .createdDate(table.getCreatedDate())
        .updatedDate(table.getUpdatedDate())
        .build();
  }

  // 2026-11-08 - Table booked time range - Attach booked slots and compute active reserved status
  // for branch tables
  private TableResponseDTO toResponseDTO(Tables table, List<TableReservation> reservations) {
    List<TableBookingSlotDTO> bookedSlots =
        reservations.stream()
            .map(
                r ->
                    TableBookingSlotDTO.builder()
                        .reservationId(r.getId())
                        .confirmationNumber(r.getConfirmationNumber())
                        .reservationDate(r.getReservationDate())
                        .timeSlot(r.getTimeSlot())
                        .startTime(r.getStartTime() != null ? r.getStartTime() : r.getTimeSlot())
                        .endTime(r.getEndTime())
                        .timeRange(r.getTimeRange() != null ? r.getTimeRange() : r.getTimeSlot())
                        .customerName(r.getCustomerName())
                        .customerPhone(r.getCustomerPhone())
                        .guestsCount(r.getGuestsCount())
                        .status(r.getStatus())
                        .build())
            .sorted(
                Comparator.comparing(
                        TableBookingSlotDTO::getReservationDate,
                        Comparator.nullsLast(String::compareTo))
                    .thenComparing(
                        TableBookingSlotDTO::getStartTime, Comparator.nullsLast(String::compareTo)))
            .toList();

    String currentStatus = table.getStatus();
    String today = LocalDate.now().toString();
    int nowMinutes = LocalTime.now().getHour() * 60 + LocalTime.now().getMinute();

    boolean currentlyReserved =
        bookedSlots.stream()
            .anyMatch(
                s -> {
                  if (!today.equals(s.getReservationDate())) {
                    return false;
                  }
                  int sMin = ReservationTimeUtil.parseMinutes(s.getStartTime(), s.getTimeSlot());
                  int eMin =
                      ReservationTimeUtil.parseMinutes(
                          s.getEndTime(),
                          s.getStartTime() != null ? s.getStartTime() : s.getTimeSlot());
                  if (eMin <= sMin) {
                    eMin = sMin + ReservationTimeUtil.DEFAULT_DURATION_MINUTES;
                  }
                  return nowMinutes >= sMin && nowMinutes <= eMin;
                });

    if (currentlyReserved && !"occupied".equalsIgnoreCase(currentStatus)) {
      currentStatus = "reserved";
    }

    return TableResponseDTO.builder()
        .tableId(table.getTableId())
        .branchId(table.getBranch() != null ? table.getBranch().getBranchId() : null)
        .tableNumber(table.getTableNumber())
        .capacity(table.getCapacity())
        .status(currentStatus)
        .qrCodeUrl(table.getQrCodeUrl())
        .isActive(table.getIsActive())
        .bookedSlots(bookedSlots)
        .createdDate(table.getCreatedDate())
        .updatedDate(table.getUpdatedDate())
        .build();
  }
}
