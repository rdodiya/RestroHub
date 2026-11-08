package com.restroly.qrmenu.reservation.repository;

import com.restroly.qrmenu.reservation.entity.TableReservation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// 2026-11-08 - Table reservation repository - Persistence operations for reservations
@Repository
public interface TableReservationRepository extends JpaRepository<TableReservation, Long> {

  Optional<TableReservation> findByConfirmationNumber(String confirmationNumber);

  List<TableReservation> findByBranchIdOrderByCreatedAtDesc(Long branchId);
}
