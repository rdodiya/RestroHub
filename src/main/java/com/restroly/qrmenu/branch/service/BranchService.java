package com.restroly.qrmenu.branch.service;

import com.restroly.qrmenu.branch.dto.BranchRequestDTO;
import com.restroly.qrmenu.branch.dto.BranchResponseDTO;
import com.restroly.qrmenu.common.generic.PageResponseDTO;

import org.springframework.data.domain.Pageable;

public interface BranchService {

    // ========== CREATE ==========
    BranchResponseDTO createBranch(BranchRequestDTO requestDTO);

    // ========== READ ==========
    BranchResponseDTO getBranchById(Long branchId);

    PageResponseDTO<BranchResponseDTO> getAllBranches(Pageable pageable);

    PageResponseDTO<BranchResponseDTO> getBranchesByRestaurantId(Long restId, Pageable pageable);

    // ========== UPDATE ==========
    BranchResponseDTO updateBranch(Long branchId, BranchRequestDTO requestDTO);

    // ========== DELETE ==========
    void deleteBranch(Long branchId);

    void hardDeleteBranch(Long branchId);

    // ========== RESTORE ==========
    BranchResponseDTO restoreBranch(Long branchId);

    // ========== SEARCH ==========
    PageResponseDTO<BranchResponseDTO> searchBranches(String keyword, Long restId,
                                                      String city, String state, Pageable pageable);

    // ========== COUNT ==========
    long countBranchesByRestaurant(Long restId);

    // ========== EXISTS ==========
    boolean existsByName(String name, Long restId);
}