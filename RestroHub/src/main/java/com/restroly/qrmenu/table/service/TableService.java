package com.restroly.qrmenu.table.service;

import com.restroly.qrmenu.table.dto.TableRequestDTO;
import com.restroly.qrmenu.table.dto.TableResponseDTO;

import java.util.List;

public interface TableService {

    List<TableResponseDTO> getTablesByBranch(Long branchId);

    TableResponseDTO createTable(Long branchId, TableRequestDTO requestDTO);

    TableResponseDTO updateTable(Long tableId, TableRequestDTO requestDTO);

    void deleteTable(Long tableId);

    TableResponseDTO restoreTable(Long tableId);
}
