package com.restroly.qrmenu.branch.service;

import com.restroly.qrmenu.branch.dto.BranchRequestDTO;
import com.restroly.qrmenu.branch.dto.BranchResponseDTO;
import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.mapper.BranchMapper;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.branch.service.BranchService;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.common.generic.PageResponseDTO;
import com.restroly.qrmenu.menu.entity.Menu;
import com.restroly.qrmenu.menu.repository.MenuRepository;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.restaurant.repository.RestaurantRepository;

import com.restroly.qrmenu.user.exception.DuplicateResourceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;
    private final BranchMapper branchMapper;

    // ========== CREATE ==========
    @Override
    public BranchResponseDTO createBranch(BranchRequestDTO requestDTO) {
        log.info("Creating new branch: {}", requestDTO.getName());

        // Validate restaurant exists
        Restaurant restaurant = restaurantRepository.findById(requestDTO.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Restaurant not found with ID: " + requestDTO.getRestaurantId()));

        // Check for duplicate branch name
        if (branchRepository.existsByNameAndRestaurant_RestId(
                requestDTO.getName(), requestDTO.getRestaurantId())) {
            throw new DuplicateResourceException(
                    "Branch with name '" + requestDTO.getName() + "' already exists for this restaurant");
        }

        // Get menu if provided
        Menu menu = null;
        if (requestDTO.getMenuId() != null) {
            menu = menuRepository.findById(requestDTO.getMenuId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Menu not found with ID: " + requestDTO.getMenuId()));
        }

        // Convert DTO to Entity
        Branch branch = branchMapper.toEntity(requestDTO, restaurant, menu);

        // Save and return
        Branch savedBranch = branchRepository.save(branch);
        log.info("Branch created successfully with ID: {}", savedBranch.getBranchId());

        return branchMapper.toResponseDTO(savedBranch);
    }

    // ========== READ BY ID ==========
    @Override
    @Transactional(readOnly = true)
    public BranchResponseDTO getBranchById(Long branchId) {
        log.debug("Fetching branch with ID: {}", branchId);

        Branch branch = branchRepository.findByBranchIdAndIsDeleteFalse(branchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch not found with ID: " + branchId));

        return branchMapper.toResponseDTO(branch);
    }

    // ========== READ ALL (Paginated) ==========
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<BranchResponseDTO> getAllBranches(Pageable pageable) {
        log.debug("Fetching all branches with pagination");

        Page<Branch> branchPage = branchRepository.findByIsDeleteFalse(pageable);

        List<BranchResponseDTO> content = branchMapper.toSummaryDTOList(branchPage.getContent());

        return PageResponseDTO.<BranchResponseDTO>builder()
                .content(content)
                .pageNumber(branchPage.getNumber())
                .pageSize(branchPage.getSize())
                .totalElements(branchPage.getTotalElements())
                .totalPages(branchPage.getTotalPages())
                .first(branchPage.isFirst())
                .last(branchPage.isLast())
                .build();
    }

    // ========== READ BY RESTAURANT (Paginated) ==========
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<BranchResponseDTO> getBranchesByRestaurantId(Long restId, Pageable pageable) {
        log.debug("Fetching branches for restaurant ID: {}", restId);

        // Validate restaurant exists
        if (!restaurantRepository.existsById(restId)) {
            throw new ResourceNotFoundException("Restaurant not found with ID: " + restId);
        }

        Page<Branch> branchPage = branchRepository.findByRestaurant_RestIdAndIsDeleteFalse(restId, pageable);

        List<BranchResponseDTO> content = branchMapper.toSummaryDTOList(branchPage.getContent());

        return PageResponseDTO.<BranchResponseDTO>builder()
                .content(content)
                .pageNumber(branchPage.getNumber())
                .pageSize(branchPage.getSize())
                .totalElements(branchPage.getTotalElements())
                .totalPages(branchPage.getTotalPages())
                .first(branchPage.isFirst())
                .last(branchPage.isLast())
                .build();
    }

    // ========== UPDATE ==========
    @Override
    public BranchResponseDTO updateBranch(Long branchId, BranchRequestDTO requestDTO) {
        log.info("Updating branch with ID: {}", branchId);

        // Find existing branch
        Branch existingBranch = branchRepository.findByBranchIdAndIsDeleteFalse(branchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch not found with ID: " + branchId));

        // Check for duplicate name (excluding current branch)
        if (branchRepository.existsByNameAndRestaurant_RestIdAndBranchIdNot(
                requestDTO.getName(),
                existingBranch.getRestaurant().getRestId(),
                branchId)) {
            throw new DuplicateResourceException(
                    "Branch with name '" + requestDTO.getName() + "' already exists for this restaurant");
        }

        // Get menu if provided
        Menu menu = null;
        if (requestDTO.getMenuId() != null) {
            menu = menuRepository.findById(requestDTO.getMenuId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Menu not found with ID: " + requestDTO.getMenuId()));
        }

        // Update entity from DTO
        branchMapper.updateEntityFromDTO(existingBranch, requestDTO, menu);

        // Save and return
        Branch updatedBranch = branchRepository.save(existingBranch);
        log.info("Branch updated successfully with ID: {}", updatedBranch.getBranchId());

        return branchMapper.toResponseDTO(updatedBranch);
    }

    // ========== SOFT DELETE ==========
    @Override
    public void deleteBranch(Long branchId) {
        log.info("Soft deleting branch with ID: {}", branchId);

        Branch branch = branchRepository.findByBranchIdAndIsDeleteFalse(branchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch not found with ID: " + branchId));

        branch.setIsDelete(true);
        branchRepository.save(branch);

        log.info("Branch soft deleted successfully with ID: {}", branchId);
    }

    // ========== HARD DELETE ==========
    @Override
    public void hardDeleteBranch(Long branchId) {
        log.info("Hard deleting branch with ID: {}", branchId);

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch not found with ID: " + branchId));

        branchRepository.delete(branch);

        log.info("Branch hard deleted successfully with ID: {}", branchId);
    }

    // ========== RESTORE ==========
    @Override
    public BranchResponseDTO restoreBranch(Long branchId) {
        log.info("Restoring branch with ID: {}", branchId);

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch not found with ID: " + branchId));

        if (!branch.getIsDelete()) {
            log.warn("Branch with ID: {} is already active", branchId);
            return branchMapper.toResponseDTO(branch);
        }

        branch.setIsDelete(false);
        Branch restoredBranch = branchRepository.save(branch);

        log.info("Branch restored successfully with ID: {}", branchId);

        return branchMapper.toResponseDTO(restoredBranch);
    }

    // ========== SEARCH ==========
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<BranchResponseDTO> searchBranches(String keyword, Long restId,
                                                             String city, String state, Pageable pageable) {
        log.debug("Searching branches with filters - keyword: {}, restId: {}, city: {}, state: {}",
                keyword, restId, city, state);

        Page<Branch> branchPage = branchRepository.searchBranches(keyword, restId, city, state, pageable);

        List<BranchResponseDTO> content = branchMapper.toSummaryDTOList(branchPage.getContent());

        return PageResponseDTO.<BranchResponseDTO>builder()
                .content(content)
                .pageNumber(branchPage.getNumber())
                .pageSize(branchPage.getSize())
                .totalElements(branchPage.getTotalElements())
                .totalPages(branchPage.getTotalPages())
                .first(branchPage.isFirst())
                .last(branchPage.isLast())
                .build();
    }

    // ========== COUNT ==========
    @Override
    @Transactional(readOnly = true)
    public long countBranchesByRestaurant(Long restId) {
        return branchRepository.countByRestaurant_RestIdAndIsDeleteFalse(restId);
    }

    // ========== EXISTS ==========
    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name, Long restId) {
        return branchRepository.existsByNameAndRestaurant_RestId(name, restId);
    }
}