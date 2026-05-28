package com.restroly.qrmenu.table.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restroly.qrmenu.table.entity.Tables;

@Repository
public interface TablesRepository extends JpaRepository<Tables, Long> {

	List<Tables> findByBranchBranchIdAndIsActiveTrue(Long branchId);

	Optional<Tables> findByTableIdAndIsActiveTrue(Long tableId);

	List<Tables> findByBranch_BranchId(Long branchId);

	boolean existsByBranch_BranchIdAndTableNumber(Long branchId, Integer tableNumber);

	boolean existsByBranch_BranchIdAndTableNumberAndTableIdNot(Long branchId, Integer tableNumber, Long tableId);

	boolean existsByBranch_BranchIdAndTableNumberAndIsActiveTrueAndTableIdNot(
			Long branchId, Integer tableNumber, Long tableId);

	Tables findByTableNumber(Integer tableNumber);
}
