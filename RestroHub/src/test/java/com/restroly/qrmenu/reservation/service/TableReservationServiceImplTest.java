package com.restroly.qrmenu.reservation.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.reservation.dto.ReservationRequest;
import com.restroly.qrmenu.reservation.dto.ReservationResponse;
import com.restroly.qrmenu.reservation.entity.TableReservation;
import com.restroly.qrmenu.reservation.repository.TableReservationRepository;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

// 2026-11-08 - Table reservation tests - Validate table allocation and status update
@ExtendWith(MockitoExtension.class)
class TableReservationServiceImplTest {

  @Mock private TableReservationRepository reservationRepository;

  @Mock private TablesRepository tablesRepository;

  @Mock private BranchRepository branchRepository;

  @InjectMocks private TableReservationServiceImpl reservationService;

  @Test
  void createReservationShouldAllocateAvailableTableAndSetStatusReserved() {
    Branch branch = Branch.builder().branchId(1L).build();
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

    when(tablesRepository.findByBranchBranchIdAndStatusIgnoreCaseAndIsActiveTrue(1L, "available"))
        .thenReturn(List.of(table1, table2));
    when(tablesRepository.save(any(Tables.class))).thenAnswer(i -> i.getArgument(0));
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
    assertEquals("reserved", table2.getStatus());

    verify(tablesRepository).save(table2);
    verify(reservationRepository).save(any(TableReservation.class));
  }

  @Test
  void createReservationWhenNoAvailableTableShouldStillSaveReservation() {
    ReservationRequest request =
        ReservationRequest.builder()
            .branchId(1L)
            .customerName("Jane Doe")
            .customerPhone("9876543211")
            .reservationDate("2026-11-10")
            .timeSlot("8:00 PM")
            .guests(2)
            .build();

    when(tablesRepository.findByBranchBranchIdAndStatusIgnoreCaseAndIsActiveTrue(1L, "available"))
        .thenReturn(List.of());
    when(reservationRepository.save(any(TableReservation.class)))
        .thenAnswer(
            i -> {
              TableReservation res = i.getArgument(0);
              res.setId(102L);
              res.setCreatedAt(LocalDateTime.now());
              res.setUpdatedAt(LocalDateTime.now());
              return res;
            });

    ReservationResponse response = reservationService.createReservation(request);

    assertNotNull(response);
    assertTrue(response.isSuccess());
    assertNull(response.getTableId());
    assertNull(response.getTableNumber());
    verify(tablesRepository, never()).save(any(Tables.class));
    verify(reservationRepository).save(any(TableReservation.class));
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
  }
}
