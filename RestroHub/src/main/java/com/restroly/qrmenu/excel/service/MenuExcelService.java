package com.restroly.qrmenu.excel.service;

import org.springframework.web.multipart.MultipartFile;

public interface MenuExcelService {
    public void processImport(MultipartFile file, Long branchId) throws Exception;
    public byte[] exportMenuToExcel(Long branchId);
    public byte[] getTemplate();
}
