package com.restroly.qrmenu.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restroly.qrmenu.payment.entity.UpiLink;

@Repository
public interface UpiLinkRepository extends JpaRepository<UpiLink, Long> {

    List<UpiLink> findByBranch_BranchIdAndIsActiveTrueOrderByIsDefaultDescCreatedDateDesc(Long branchId);

    Optional<UpiLink> findByBranch_BranchIdAndIsDefaultTrueAndIsActiveTrue(Long branchId);

    Optional<UpiLink> findByIdAndIsActiveTrue(Long id);

    List<UpiLink> findByBranch_BranchId(Long branchId);
}
