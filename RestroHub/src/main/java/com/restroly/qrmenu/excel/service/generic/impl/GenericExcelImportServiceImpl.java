package com.restroly.qrmenu.excel.service.generic.impl;

import java.io.InputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.restroly.qrmenu.excel.service.generic.GenericExcelImportService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class GenericExcelImportServiceImpl<T> implements GenericExcelImportService<T> {

    /**
     * Child class defines how to traverse the Workbook and extract data into a List.
     */
    protected abstract List<T> extractDataFromWorkbook(Workbook workbook) throws Exception;

    @Override
    public List<T> parseExcel(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream();
            Workbook workbook = new XSSFWorkbook(is)) {
            
            log.debug("Successfully opened Excel file stream. Delegating to child class for extraction.");
            return extractDataFromWorkbook(workbook);
        }
    }

    // --- Protected Reusable Cell Extraction Utilities ---

    protected String getCellValueAsString(Cell cell) {
        if (cell == null)
            return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> null;
        };
    }

    protected Double getCellValueAsDouble(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue().trim()); 
            } catch (NumberFormatException e) {
                return 0.0;
            }
        }
        return null;
    }

    protected Integer getCellValueAsInteger(Cell cell) {
        if (cell == null || cell.getCellType() != CellType.NUMERIC)
            return null;
        return (int) cell.getNumericCellValue();
    }

    protected Boolean getCellValueAsBoolean(Cell cell) {
        if (cell == null)
            return null;
        if (cell.getCellType() == CellType.BOOLEAN)
            return cell.getBooleanCellValue();
        if (cell.getCellType() == CellType.STRING) {
            String val = cell.getStringCellValue().trim().toLowerCase();
            return TRUTHY_VALUES.contains(val);
        }
        return null;
    }
}