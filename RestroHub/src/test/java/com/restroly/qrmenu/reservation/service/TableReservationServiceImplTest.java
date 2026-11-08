package com.restroly.qrmenu.reservation.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.reservation.dto.ReservationAvailabilityResponse;
import com.restroly.qrmenu.reservation.dto.ReservationRequest;
import com.restroly.qrmenu.reservation.dto.ReservationResponse;
import com.restroly.qrmenu.reservation.entity.TableReservation;
import com.restroly.qrmenu.reservation.repository.TableReservationRepository;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

// 2026-11-08 - Table reservation tests - Validate multi-time booking and 30-min buffer gap
@ExtendWith(MockitoExtension.class)
class TableReservationServiceImplTest {

  @Mock private TableReservationRepository reservationRepository;

  @Mock private TablesRepository tablesRepository;

  @Mock private BranchRepository branchRepository;

  @InjectMocks private TableReservationServiceImpl reservationService;

  @Test
  void createReservationShouldAllocateAvailableTableAndSetTimeRange() {
    Tables table1 =
        Tables.builder()
            .tableId(2L)
            .tableNumber(1)
            .capacity(2)
            .status("available")
            .isActive(true)
            .build();
    Tables table2 =
        Tables.builder()
            .tableId(3L)
            .tableNumber(2)
            .capacity(4)
            .status("available")
            .isActive(true)
            .build();

    ReservationRequest request =
        ReservationRequest.builder()
            .branchId(1L)
            .customerName("John Doe")
            .customerEmail("john@example.com")
            .customerPhone("+91 9876543210")
            .reservationDate("2026-11-10")
            .timeSlot("7:00 PM")
            .guests(3)
            .specialRequests("Window seat")
            .build();

    when(tablesRepository.findByBranchBranchIdAndIsActiveTrue(1L))
        .thenReturn(List.of(table1, table2));
    when(reservationRepository.findByBranchIdAndReservationDateAndStatusNot(
            1L, "2026-11-10", "CANCELLED"))
        .thenReturn(Collections.emptyList());
    when(reservationRepository.save(any(TableReservation.class)))
        .thenAnswer(
            i -> {
              TableReservation res = i.getArgument(0);
              res.setId(101L);
              res.setCreatedAt(LocalDateTime.now());
              res.setUpdatedAt(LocalDateTime.now());
              return res;
            });

    ReservationResponse response = reservationService.createReservation(request);

    assertNotNull(response);
    assertTrue(response.isSuccess());
    assertNotNull(response.getConfirmationNumber());
    assertTrue(response.getConfirmationNumber().startsWith("RSV-"));
    assertEquals(101L, response.getReservationId());
    assertEquals(3L, response.getTableId());
    assertEquals(2, response.getTableNumber());
    assertEquals("07:00 PM", response.getStartTime());
    assertEquals("08:00 PM", response.getEndTime());
    assertEquals("07:00 PM - 08:00 PM", response.getTimeRange());

    verify(reservationRepository).save(any(TableReservation.class));
  }

  // 2026-11-08 - Table reservation test - Verify another person can book same table at different
  // time with > 30 min gap
  @Test
  void createReservationOnSameTableWithDifferentTimeAnd30MinGapShouldSucceed() {
    Tables table1 =
        Tables.builder()
            .tableId(2L)
            .tableNumber(1)
            .capacity(4)
            .status("available")
            .isActive(true)
            .build();

    // Existing booking on Table 1 from 11:00 AM to 12:00 PM
    TableReservation existingRes =
        TableReservation.builder()
            .id(50L)
            .branchId(1L)
            .tableId(2L)
            .tableNumber(1)
            .reservationDate("2026-11-10")
            .timeSlot("11:00 AM - 12:00 PM")
            .startTime("11:00 AM")
            .endTime("12:00 PM")
            .timeRange("11:00 AM - 12:00 PM")
            .status("CONFIRMED")
            .build();

    // New booking for same Table 1 from 1:00 PM (gap between 12:00 PM and 1:00 PM is 60 min > 30
    // min)
    ReservationRequest request =
        ReservationRequest.builder()
            .branchId(1L)
            .customerName("Alice Smith")
            .customerPhone("9876543210")
            .reservationDate("2026-11-10")
            .timeSlot("1:00 PM")
            .guests(4)
            .build();

    when(tablesRepository.findByBranchBranchIdAndIsActiveTrue(1L)).thenReturn(List.of(table1));
    when(reservationRepository.findByBranchIdAndReservationDateAndStatusNot(
            1L, "2026-11-10", "CANCELLED"))
        .thenReturn(List.of(existingRes));
    when(reservationRepository.save(any(TableReservation.class)))
        .thenAnswer(
            i -> {
              TableReservation res = i.getArgument(0);
              res.setId(102L);
              return res;
            });

    ReservationResponse response = reservationService.createReservation(request);

    assertNotNull(response);
    assertTrue(response.isSuccess());
    assertEquals(2L, response.getTableId());
    assertEquals(1, response.getTableNumber());
    assertEquals("01:00 PM - 02:00 PM", response.getTimeRange());
  }

  // 2026-11-08 - Table reservation test - Verify booking is rejected or shifts table when gap is <
  // 30 mins
  @Test
  void createReservationWithConflictLessThan30MinGapShouldAllocateAlternativeTable() {
    Tables table1 =
        Tables.builder()
            .tableId(2L)
            .tableNumber(1)
            .capacity(4)
            .status("available")
            .isActive(true)
            .build();
    Tables table2 =
        Tables.builder()
            .tableId(3L)
            .tableNumber(2)
            .capacity(4)
            .status("available")
            .isActive(true)
            .build();

    // Table 1 is booked 11:00 AM - 12:00 PM
    TableReservation existingRes =
        TableReservation.builder()
            .id(50L)
            .branchId(1L)
            .tableId(2L)
            .tableNumber(1)
            .reservationDate("2026-11-10")
            .timeSlot("11:00 AM - 12:00 PM")
            .startTime("11:00 AM")
            .endTime("12:00 PM")
            .timeRange("11:00 AM - 12:00 PM")
            .status("CONFIRMED")
            .build();

    // New booking at 12:15 PM (gap from 12:00 PM is 15 min < 30 min buffer)
    ReservationRequest request =
        ReservationRequest.builder()
            .branchId(1L)
            .customerName("Bob")
            .customerPhone("9876543210")
            .reservationDate("2026-11-10")
            .timeSlot("12:15 PM")
            .guests(4)
            .build();

    when(tablesRepository.findByBranchBranchIdAndIsActiveTrue(1L))
        .thenReturn(List.of(table1, table2));
    when(reservationRepository.findByBranchIdAndReservationDateAndStatusNot(
            1L, "2026-11-10", "CANCELLED"))
        .thenReturn(List.of(existingRes));
    when(reservationRepository.save(any(TableReservation.class))).thenAnswer(i -> i.getArgument(0));

    ReservationResponse response = reservationService.createReservation(request);

    assertNotNull(response);
    // Table 1 had conflict (< 30 min gap), so Table 2 must be allocated!
    assertEquals(3L, response.getTableId());
    assertEquals(2, response.getTableNumber());
  }

  @Test
  void createReservationForExplicitTableWithConflictShouldThrowException() {
    Tables table1 =
        Tables.builder()
            .tableId(2L)
            .tableNumber(1)
            .capacity(4)
            .status("available")
            .isActive(true)
            .build();

    TableReservation existingRes =
        TableReservation.builder()
            .id(50L)
            .branchId(1L)
            .tableId(2L)
            .tableNumber(1)
            .reservationDate("2026-11-10")
            .timeSlot("11:00 AM - 12:00 PM")
            .startTime("11:00 AM")
            .endTime("12:00 PM")
            .timeRange("11:00 AM - 12:00 PM")
            .status("CONFIRMED")
            .build();

    ReservationRequest request =
        ReservationRequest.builder()
            .branchId(1L)
            .tableId(2L)
            .customerName("Bob")
            .customerPhone("9876543210")
            .reservationDate("2026-11-10")
            .timeSlot("12:15 PM")
            .guests(4)
            .build();

    when(tablesRepository.findByTableIdAndIsActiveTrue(2L)).thenReturn(Optional.of(table1));
    when(reservationRepository.findByBranchIdAndReservationDateAndStatusNot(
            1L, "2026-11-10", "CANCELLED"))
        .thenReturn(List.of(existingRes));

    assertThrows(
        ResourceAlreadyExistsException.class, () -> reservationService.createReservation(request));
  }

  @Test
  void checkAvailabilityShouldReturnTrueWhenTablesAvailable() {
    Tables table1 =
        Tables.builder()
            .tableId(2L)
            .tableNumber(1)
            .capacity(4)
            .status("available")
            .isActive(true)
            .build();

    when(tablesRepository.findByBranchBranchIdAndIsActiveTrue(1L)).thenReturn(List.of(table1));
    when(reservationRepository.findByBranchIdAndReservationDateAndStatusNot(
            1L, "2026-11-10", "CANCELLED"))
        .thenReturn(Collections.emptyList());

    ReservationAvailabilityResponse res =
        reservationService.checkAvailability(1L, "2026-11-10", "7:00 PM", 2);

    assertTrue(res.isAvailable());
    assertEquals(1, res.getAvailableTablesCount());
    assertEquals("07:00 PM - 08:00 PM", res.getRequestedTimeRange());
  }

  @Test
  void getReservationByConfirmationNumberShouldReturnReservation() {
    TableReservation res =
        TableReservation.builder()
            .id(1L)
            .branchId(1L)
            .tableId(2L)
            .tableNumber(1)
            .customerName("Alice")
            .customerEmail("alice@example.com")
            .customerPhone("9876543212")
            .reservationDate("2026-11-12")
            .timeSlot("6:30 PM")
            .startTime("06:30 PM")
            .endTime("07:30 PM")
            .timeRange("06:30 PM - 07:30 PM")
            .guestsCount(2)
            .status("CONFIRMED")
            .confirmationNumber("RSV-ABC12345")
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    when(reservationRepository.findByConfirmationNumber("RSV-ABC12345"))
        .thenReturn(Optional.of(res));

    ReservationResponse response =
        reservationService.getReservationByConfirmationNumber("RSV-ABC12345");

    assertNotNull(response);
    assertEquals("RSV-ABC12345", response.getConfirmationNumber());
    assertEquals("Alice", response.getCustomerName());
    assertEquals(2L, response.getTableId());
    assertEquals("06:30 PM - 07:30 PM", response.getTimeRange());
  }
}
