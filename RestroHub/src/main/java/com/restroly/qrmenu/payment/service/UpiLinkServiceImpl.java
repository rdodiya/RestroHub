package com.restroly.qrmenu.payment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.payment.dto.UpiLinkRequestDTO;
import com.restroly.qrmenu.payment.dto.UpiLinkResponseDTO;
import com.restroly.qrmenu.payment.entity.UpiLink;
import com.restroly.qrmenu.payment.repository.UpiLinkRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UpiLinkServiceImpl implements UpiLinkService {

    private final UpiLinkRepository upiLinkRepository;
    private final BranchRepository branchRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UpiLinkResponseDTO> getUpiLinksByBranch(Long branchId) {
        log.debug("Fetching UPI links for branchId: {}", branchId);
        List<UpiLink> links = upiLinkRepository.findByBranch_BranchIdAndIsActiveTrueOrderByIsDefaultDescCreatedDateDesc(branchId);
        return links.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UpiLinkResponseDTO getUpiLinkById(Long id) {
        log.debug("Fetching UPI link by id: {}", id);
        UpiLink link = upiLinkRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("UPI Link not found with id: " + id));
        return mapToResponseDTO(link);
    }

    @Override
    public UpiLinkResponseDTO createUpiLink(Long branchId, UpiLinkRequestDTO requestDTO) {
        log.info("Creating new UPI link for branch: {}, name: {}, upiId: {}", branchId, requestDTO.getName(), requestDTO.getUpiId());

        Branch branch = branchRepository.findByBranchIdAndIsDeleteFalse(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));

        List<UpiLink> existingLinks = upiLinkRepository.findByBranch_BranchIdAndIsActiveTrueOrderByIsDefaultDescCreatedDateDesc(branchId);
        boolean shouldBeDefault = Boolean.TRUE.equals(requestDTO.getIsDefault()) || existingLinks.isEmpty();

        if (shouldBeDefault && !existingLinks.isEmpty()) {
            for (UpiLink existing : existingLinks) {
                if (Boolean.TRUE.equals(existing.getIsDefault())) {
                    existing.setIsDefault(false);
                    upiLinkRepository.save(existing);
                }
            }
        }

        UpiLink upiLink = UpiLink.builder()
                .branch(branch)
                .name(requestDTO.getName().trim())
                .upiId(requestDTO.getUpiId().trim())
                .isDefault(shouldBeDefault)
                .isActive(true)
                .build();

        UpiLink saved = upiLinkRepository.save(upiLink);

        // Synchronize default UPI with Branch entity
        if (shouldBeDefault) {
            branch.setBranchUpiId(saved.getUpiId());
            branchRepository.save(branch);
        }

        return mapToResponseDTO(saved);
    }

    @Override
    public UpiLinkResponseDTO setDefaultUpiLink(Long branchId, Long linkId) {
        log.info("Setting default UPI link id: {} for branch: {}", linkId, branchId);

        UpiLink targetLink = upiLinkRepository.findByIdAndIsActiveTrue(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("UPI Link not found with id: " + linkId));

        Branch branch = targetLink.getBranch();

        // Unset all other defaults for this branch
        List<UpiLink> branchLinks = upiLinkRepository.findByBranch_BranchIdAndIsActiveTrueOrderByIsDefaultDescCreatedDateDesc(branch.getBranchId());
        for (UpiLink link : branchLinks) {
            link.setIsDefault(link.getId().equals(linkId));
            upiLinkRepository.save(link);
        }

        // Update branch active UPI ID
        branch.setBranchUpiId(targetLink.getUpiId());
        branchRepository.save(branch);

        targetLink.setIsDefault(true);
        return mapToResponseDTO(targetLink);
    }

    @Override
    public void deleteUpiLink(Long linkId) {
        log.info("Deleting UPI link with id: {}", linkId);

        UpiLink link = upiLinkRepository.findByIdAndIsActiveTrue(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("UPI Link not found with id: " + linkId));

        boolean wasDefault = Boolean.TRUE.equals(link.getIsDefault());
        link.setIsActive(false);
        link.setIsDefault(false);
        upiLinkRepository.save(link);

        // If the deleted link was default, pick the next active one or clear
        if (wasDefault) {
            Branch branch = link.getBranch();
            List<UpiLink> remaining = upiLinkRepository.findByBranch_BranchIdAndIsActiveTrueOrderByIsDefaultDescCreatedDateDesc(branch.getBranchId());
            if (!remaining.isEmpty()) {
                UpiLink nextDefault = remaining.get(0);
                nextDefault.setIsDefault(true);
                upiLinkRepository.save(nextDefault);
                branch.setBranchUpiId(nextDefault.getUpiId());
            } else {
                branch.setBranchUpiId(null);
            }
            branchRepository.save(branch);
        }
    }

    @Override
    public boolean testVerifyUpiLink(Long linkId) {
        UpiLink link = upiLinkRepository.findByIdAndIsActiveTrue(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("UPI Link not found with id: " + linkId));
        return link.getUpiId() != null && link.getUpiId().contains("@");
    }

    private UpiLinkResponseDTO mapToResponseDTO(UpiLink link) {
        if (link == null) return null;

        return UpiLinkResponseDTO.builder()
                .id(link.getId())
                .branchId(link.getBranch() != null ? link.getBranch().getBranchId() : null)
                .branchName(link.getBranch() != null ? link.getBranch().getName() : null)
                .name(link.getName())
                .upiId(link.getUpiId())
                .isDefault(link.getIsDefault())
                .isActive(link.getIsActive())
                .transactions(link.getTransactionsCount() != null ? link.getTransactionsCount() : 0)
                .revenue(link.getTotalRevenue())
                .createdDate(link.getCreatedDate())
                .updatedDate(link.getUpdatedDate())
                .build();
    }
}
