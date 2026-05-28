package com.restroly.qrmenu.table.service;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.common.exception.ResourceAlreadyExistsException;
import com.restroly.qrmenu.common.exception.ResourceNotFoundException;
import com.restroly.qrmenu.table.dto.TableRequestDTO;
import com.restroly.qrmenu.table.dto.TableResponseDTO;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TableServiceImplTest {

    @Mock
    private TablesRepository tablesRepository;

    @Mock
    private BranchRepository branchRepository;

    @InjectMocks
    private TableServiceImpl tableService;

    @Test
    void createTableShouldPersistBranchScopedTable() {
        Branch branch = Branch.builder().branchId(1L).build();
        TableRequestDTO request = TableRequestDTO.builder()
                .tableNumber(5)
                .capacity(4)
                .status("available")
                .build();

        when(branchRepository.findByBranchIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(branch));
        when(tablesRepository.existsByBranch_BranchIdAndTableNumber(1L, 5)).thenReturn(false);
        when(tablesRepository.save(any(Tables.class))).thenAnswer(invocation -> {
            Tables table = invocation.getArgument(0);
            table.setTableId(10L);
            return table;
        });

        TableResponseDTO response = tableService.createTable(1L, request);

        assertEquals(10L, response.getTableId());
        assertEquals(1L, response.getBranchId());
        assertEquals(5, response.getTableNumber());
        assertTrue(response.getIsActive());
        verify(tablesRepository).save(any(Tables.class));
    }

    @Test
    void createTableShouldApplyDefaultsWhenOptionalFieldsAreMissing() {
        Branch branch = Branch.builder().branchId(1L).build();
        TableRequestDTO request = TableRequestDTO.builder()
                .tableNumber(7)
                .build();

        when(branchRepository.findByBranchIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(branch));
        when(tablesRepository.existsByBranch_BranchIdAndTableNumber(1L, 7)).thenReturn(false);
        when(tablesRepository.save(any(Tables.class))).thenAnswer(invocation -> {
            Tables table = invocation.getArgument(0);
            table.setTableId(11L);
            return table;
        });

        TableResponseDTO response = tableService.createTable(1L, request);

        assertEquals(4, response.getCapacity());
        assertEquals("available", response.getStatus());
        assertTrue(response.getIsActive());
    }

    @Test
    void createTableShouldRejectMissingBranch() {
        TableRequestDTO request = TableRequestDTO.builder().tableNumber(5).build();

        when(branchRepository.findByBranchIdAndIsDeleteFalse(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tableService.createTable(99L, request));
        verify(tablesRepository, never()).save(any(Tables.class));
    }

    @Test
    void createTableShouldRejectDuplicateTableNumberInBranch() {
        TableRequestDTO request = TableRequestDTO.builder().tableNumber(5).build();

        when(branchRepository.findByBranchIdAndIsDeleteFalse(1L))
                .thenReturn(Optional.of(Branch.builder().branchId(1L).build()));
        when(tablesRepository.existsByBranch_BranchIdAndTableNumber(1L, 5)).thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> tableService.createTable(1L, request));
        verify(tablesRepository, never()).save(any(Tables.class));
    }

    @Test
    void getTablesByBranchShouldRejectMissingBranch() {
        when(branchRepository.findByBranchIdAndIsDeleteFalse(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tableService.getTablesByBranch(99L));
        verify(tablesRepository, never()).findByBranch_BranchId(99L);
    }

    @Test
    void deleteTableShouldDeactivateTable() {
        Tables table = Tables.builder()
                .tableId(10L)
                .branch(Branch.builder().branchId(1L).build())
                .tableNumber(5)
                .isActive(true)
                .build();

        when(tablesRepository.findById(10L)).thenReturn(Optional.of(table));
        when(tablesRepository.save(table)).thenReturn(table);

        tableService.deleteTable(10L);

        assertFalse(table.getIsActive());
        verify(tablesRepository).save(table);
    }

    @Test
    void deleteTableShouldRejectMissingTable() {
        when(tablesRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tableService.deleteTable(99L));
        verify(tablesRepository, never()).save(any(Tables.class));
    }

    @Test
    void updateTableShouldChangeDetailsAndKeepExistingCapacityWhenMissing() {
        Branch branch = Branch.builder().branchId(1L).build();
        Tables table = Tables.builder()
                .tableId(10L)
                .branch(branch)
                .tableNumber(5)
                .capacity(6)
                .status("reserved")
                .isActive(true)
                .build();
        TableRequestDTO request = TableRequestDTO.builder()
                .tableNumber(8)
                .status("occupied")
                .qrCodeUrl("https://example.com/qr/table-8")
                .build();

        when(tablesRepository.findById(10L)).thenReturn(Optional.of(table));
        when(tablesRepository.existsByBranch_BranchIdAndTableNumberAndTableIdNot(1L, 8, 10L)).thenReturn(false);
        when(tablesRepository.save(table)).thenReturn(table);

        TableResponseDTO response = tableService.updateTable(10L, request);

        assertEquals(8, response.getTableNumber());
        assertEquals(6, response.getCapacity());
        assertEquals("occupied", response.getStatus());
        assertEquals("https://example.com/qr/table-8", response.getQrCodeUrl());
    }

    @Test
    void updateTableShouldKeepExistingStatusWhenMissing() {
        Branch branch = Branch.builder().branchId(1L).build();
        Tables table = Tables.builder()
                .tableId(10L)
                .branch(branch)
                .tableNumber(5)
                .capacity(6)
                .status("reserved")
                .isActive(true)
                .build();
        TableRequestDTO request = TableRequestDTO.builder()
                .tableNumber(5)
                .capacity(8)
                .build();

        when(tablesRepository.findById(10L)).thenReturn(Optional.of(table));
        when(tablesRepository.existsByBranch_BranchIdAndTableNumberAndTableIdNot(1L, 5, 10L)).thenReturn(false);
        when(tablesRepository.save(table)).thenReturn(table);

        TableResponseDTO response = tableService.updateTable(10L, request);

        assertEquals(8, response.getCapacity());
        assertEquals("reserved", response.getStatus());
    }

    @Test
    void updateTableShouldRejectDuplicateTableNumberInBranch() {
        Branch branch = Branch.builder().branchId(1L).build();
        Tables table = Tables.builder()
                .tableId(10L)
                .branch(branch)
                .tableNumber(5)
                .isActive(true)
                .build();
        TableRequestDTO request = TableRequestDTO.builder().tableNumber(8).build();

        when(tablesRepository.findById(10L)).thenReturn(Optional.of(table));
        when(tablesRepository.existsByBranch_BranchIdAndTableNumberAndTableIdNot(1L, 8, 10L)).thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> tableService.updateTable(10L, request));
        verify(tablesRepository, never()).save(any(Tables.class));
    }

    @Test
    void updateTableShouldRejectMissingTable() {
        TableRequestDTO request = TableRequestDTO.builder().tableNumber(8).build();

        when(tablesRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tableService.updateTable(99L, request));
    }

    @Test
    void restoreTableShouldReactivateTable() {
        Tables table = Tables.builder()
                .tableId(10L)
                .branch(Branch.builder().branchId(1L).build())
                .tableNumber(5)
                .isActive(false)
                .build();

        when(tablesRepository.findById(10L)).thenReturn(Optional.of(table));
        when(tablesRepository.existsByBranch_BranchIdAndTableNumberAndIsActiveTrueAndTableIdNot(1L, 5, 10L))
                .thenReturn(false);
        when(tablesRepository.save(table)).thenReturn(table);

        TableResponseDTO response = tableService.restoreTable(10L);

        assertTrue(response.getIsActive());
        verify(tablesRepository).save(table);
    }

    @Test
    void restoreTableShouldRejectMissingTable() {
        when(tablesRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tableService.restoreTable(99L));
        verify(tablesRepository, never()).save(any(Tables.class));
    }

    @Test
    void restoreTableShouldRejectActiveDuplicateTableNumber() {
        Branch branch = Branch.builder().branchId(1L).build();
        Tables inactiveTable = Tables.builder()
                .tableId(10L)
                .branch(branch)
                .tableNumber(5)
                .isActive(false)
                .build();
        when(tablesRepository.findById(10L)).thenReturn(Optional.of(inactiveTable));
        when(tablesRepository.existsByBranch_BranchIdAndTableNumberAndIsActiveTrueAndTableIdNot(1L, 5, 10L))
                .thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> tableService.restoreTable(10L));
        verify(tablesRepository, never()).save(any(Tables.class));
    }

    @Test
    void getTablesByBranchShouldReturnAllBranchTables() {
        Branch branch = Branch.builder().branchId(1L).build();
        Tables activeTable = Tables.builder()
                .tableId(10L)
                .branch(branch)
                .tableNumber(1)
                .isActive(true)
                .build();
        Tables inactiveTable = Tables.builder()
                .tableId(11L)
                .branch(branch)
                .tableNumber(2)
                .isActive(false)
                .build();

        when(branchRepository.findByBranchIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(branch));
        when(tablesRepository.findByBranch_BranchId(1L)).thenReturn(List.of(activeTable, inactiveTable));

        List<TableResponseDTO> response = tableService.getTablesByBranch(1L);

        assertEquals(2, response.size());
        assertFalse(response.get(1).getIsActive());
    }
}
