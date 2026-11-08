package com.restroly.qrmenu.table.repository;

import com.restroly.qrmenu.table.entity.Tables;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TablesRepository extends JpaRepository<Tables, Long> {

  List<Tables> findByBranchBranchIdAndIsActiveTrue(Long branchId);

  // 2026-11-08 - Table reservation - Find available active tables in branch for reservation
  // allocation
  List<Tables> findByBranchBranchIdAndStatusIgnoreCaseAndIsActiveTrue(Long branchId, String status);

  Optional<Tables> findByTableIdAndIsActiveTrue(Long tableId);

  List<Tables> findByBranch_BranchId(Long branchId);

  boolean existsByBranch_BranchIdAndTableNumber(Long branchId, Integer tableNumber);

  boolean existsByBranch_BranchIdAndTableNumberAndTableIdNot(
      Long branchId, Integer tableNumber, Long tableId);

  Tables findByTableNumber(Integer tableNumber);
}
