package com.restroly.qrmenu.excel.service.generic.impl;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.restroly.qrmenu.excel.service.generic.GenericExcelExportService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class GenericExcelExportServiceImpl<T> implements GenericExcelExportService<T> {

    /**
     * Child class defines how to build sheets, rows, and cells using the provided data.
     */
    protected abstract void buildWorkbookFromData(Workbook workbook, List<T> data) throws Exception;

    @Override
    public byte[] exportToExcel(List<T> data) {
        try (Workbook workbook = new XSSFWorkbook();
            ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            log.debug("Created empty workbook. Delegating to child class for data population.");
            
            // Hand control to the child class to build out the sheets and rows
            buildWorkbookFromData(workbook, data);

            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            log.error("Failed to generate Excel file", e);
            throw new RuntimeException("Failed to generate Excel file: " + e.getMessage(), e);
        }
    }

    // --- Protected Reusable Cell Writing Utilities ---

    protected void setCellValue(Cell cell, String value) {
        if (value != null) cell.setCellValue(value);
    }

    protected void setCellValue(Cell cell, Double value) {
        if (value != null) cell.setCellValue(value);
    }

    protected void setCellValue(Cell cell, Integer value) {
        if (value != null) cell.setCellValue(value);
    }

    protected void setCellValue(Cell cell, Boolean value) {
        if (value != null) cell.setCellValue(value);
    }
}