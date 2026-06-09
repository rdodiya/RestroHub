package com.restroly.qrmenu.excel.service.generic;

import java.util.List;

public interface GenericExcelExportService<T> {
    byte[] exportToExcel(List<T> data);
}
