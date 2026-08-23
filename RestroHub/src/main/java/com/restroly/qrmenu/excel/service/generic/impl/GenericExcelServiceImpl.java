package com.restroly.qrmenu.excel.service.generic.impl;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.restroly.qrmenu.excel.service.generic.GenericExcelExportService;
import com.restroly.qrmenu.excel.service.generic.GenericExcelImportService;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

public abstract class GenericExcelServiceImpl<T> implements GenericExcelImportService<T>, GenericExcelExportService<T> {

    // ====================== ABSTRACT METHODS TO OVERRIDE ======================

    /**
     * Child class defines how to traverse the Workbook and extract data into a
     * List.
     */
    protected abstract List<T> extractDataFromWorkbook(Workbook workbook) throws Exception;

    /**
     * Child class defines how to build sheets, rows, and cells using the provided
     * data.
     */
    protected abstract void buildWorkbookFromData(Workbook workbook, List<T> data) throws Exception;

    // ====================== IMPORT BOILERPLATE ================================

    /**
     * Handles file streams, creates the Workbook, and safely closes resources.
     */
    public List<T> parseExcel(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(is)) {

            // Delegate the actual parsing logic to the child class
            return extractDataFromWorkbook(workbook);
        }
    }

    // ====================== EXPORT BOILERPLATE ================================

    /**
     * Creates a Workbook, delegates building to child, and converts to a byte array
     * for download.
     */
    public byte[] exportToExcel(List<T> data) {
        try (Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Delegate the actual sheet/row creation to the child class!
            buildWorkbookFromData(workbook, data);

            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel file: " + e.getMessage(), e);
        }
    }

    // ========================== CELL UTILITIES ===============================

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
        if (cell == null)
            return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException(
                        "Invalid Number Format: Cannot parse '" + cell.getStringCellValue() + "' as a valid Price.");
            }
        }
        return null;
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

    protected void setCellValue(Cell cell, String value) {
        if (value != null)
            cell.setCellValue(value);
    }

    protected void setCellValue(Cell cell, Double value) {
        if (value != null)
            cell.setCellValue(value);
    }

    protected void setCellValue(Cell cell, Integer value) {
        if (value != null)
            cell.setCellValue(value);
    }

    protected void setCellValue(Cell cell, Boolean value) {
        if (value != null)
            cell.setCellValue(value);
    }
}