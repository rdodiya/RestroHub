package com.restroly.qrmenu.reservation.repository;

import com.restroly.qrmenu.reservation.entity.TableReservation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// 2026-11-08 - Table reservation repository - Persistence operations with date and status filters
@Repository
public interface TableReservationRepository extends JpaRepository<TableReservation, Long> {

  Optional<TableReservation> findByConfirmationNumber(String confirmationNumber);

  List<TableReservation> findByBranchIdOrderByCreatedAtDesc(Long branchId);

  List<TableReservation> findByBranchIdAndStatusNot(Long branchId, String status);

  List<TableReservation> findByBranchIdAndReservationDateAndStatusNot(
      Long branchId, String reservationDate, String status);

  List<TableReservation> findByTableIdAndReservationDateAndStatusNot(
      Long tableId, String reservationDate, String status);
}
