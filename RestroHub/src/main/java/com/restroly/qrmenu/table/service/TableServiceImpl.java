package com.restroly.qrmenu.table.service;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.common.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.table.dto.TableRequestDTO;
import com.restroly.qrmenu.table.dto.TableResponseDTO;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TableServiceImpl implements TableService {

    private static final String TABLE_NOT_FOUND = "Table not found with id: %s";

    private final TablesRepository tablesRepository;
    private final BranchRepository branchRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TableResponseDTO> getTablesByBranch(Long branchId) {
        validateBranchExists(branchId);
        return tablesRepository.findByBranch_BranchId(branchId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public TableResponseDTO createTable(Long branchId, TableRequestDTO requestDTO) {
        log.info("Creating table {} for branch {}", requestDTO.getTableNumber(), branchId);

        Branch branch = branchRepository.findByBranchIdAndIsDeleteFalse(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));

        if (tablesRepository.existsByBranch_BranchIdAndTableNumber(branchId, requestDTO.getTableNumber())) {
            throw duplicateTableNumber(branchId, requestDTO.getTableNumber());
        }

        Tables table = Tables.builder()
                .branch(branch)
                .tableNumber(requestDTO.getTableNumber())
                .capacity(requestDTO.getCapacity() != null ? requestDTO.getCapacity() : 4)
                .status(normalizeStatus(requestDTO.getStatus()))
                .qrCodeUrl(requestDTO.getQrCodeUrl())
                .isActive(true)
                .build();

        return toResponseDTO(tablesRepository.save(table));
    }

    @Override
    public TableResponseDTO updateTable(Long tableId, TableRequestDTO requestDTO) {
        log.info("Updating table {}", tableId);

        Tables table = findTableOrThrow(tableId);
        Long branchId = table.getBranch().getBranchId();

        if (tablesRepository.existsByBranch_BranchIdAndTableNumberAndTableIdNot(
                branchId, requestDTO.getTableNumber(), tableId)) {
            throw duplicateTableNumber(branchId, requestDTO.getTableNumber());
        }

        table.setTableNumber(requestDTO.getTableNumber());
        table.setCapacity(requestDTO.getCapacity() != null ? requestDTO.getCapacity() : table.getCapacity());
        table.setStatus(hasText(requestDTO.getStatus()) ? normalizeStatus(requestDTO.getStatus()) : table.getStatus());
        table.setQrCodeUrl(requestDTO.getQrCodeUrl());

        return toResponseDTO(tablesRepository.save(table));
    }

    @Override
    public void deleteTable(Long tableId) {
        log.info("Soft deleting table {}", tableId);

        Tables table = findTableOrThrow(tableId);
        table.setIsActive(false);
        tablesRepository.save(table);
    }

    @Override
    public TableResponseDTO restoreTable(Long tableId) {
        log.info("Restoring table {}", tableId);

        Tables table = findTableOrThrow(tableId);
        Long branchId = table.getBranch().getBranchId();

        if (tablesRepository.existsByBranch_BranchIdAndTableNumberAndIsActiveTrueAndTableIdNot(
                branchId, table.getTableNumber(), tableId)) {
            throw duplicateTableNumber(branchId, table.getTableNumber());
        }

        table.setIsActive(true);
        return toResponseDTO(tablesRepository.save(table));
    }

    private void validateBranchExists(Long branchId) {
        if (branchRepository.findByBranchIdAndIsDeleteFalse(branchId).isEmpty()) {
            throw new ResourceNotFoundException("Branch not found with id: " + branchId);
        }
    }

    private Tables findTableOrThrow(Long tableId) {
        return tablesRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(TABLE_NOT_FOUND, tableId)));
    }

    private ResourceAlreadyExistsException duplicateTableNumber(Long branchId, Integer tableNumber) {
        return new ResourceAlreadyExistsException(
                "Table number " + tableNumber + " already exists for branch id: " + branchId);
    }

    private String normalizeStatus(String status) {
        return status == null || status.isBlank() ? "available" : status.toLowerCase();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private TableResponseDTO toResponseDTO(Tables table) {
        return TableResponseDTO.builder()
                .tableId(table.getTableId())
                .branchId(table.getBranch() != null ? table.getBranch().getBranchId() : null)
                .tableNumber(table.getTableNumber())
                .capacity(table.getCapacity())
                .status(table.getStatus())
                .qrCodeUrl(table.getQrCodeUrl())
                .isActive(table.getIsActive())
                .createdDate(table.getCreatedDate())
                .updatedDate(table.getUpdatedDate())
                .build();
    }
}
