package com.restroly.qrmenu.excel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.restroly.qrmenu.common.dto.ApiResponse;
import com.restroly.qrmenu.excel.service.MenuExcelService;
import com.restroly.qrmenu.exception.ApiErrorResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

@RestController
@RequestMapping(SECURE_API_VERSION + "/excel")
public class ExcelFeatureController {
        @Autowired
        private MenuExcelService excelService;

        @PostMapping("/menu/{branchId}")
        @Operation(summary = "Import menu data from Excel file", description = "Uploads and processes an Excel file containing menu data for the specified branch. Existing categories, menu items, variants, and addon mappings are created or updated based on the spreadsheet contents.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu imported successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class), examples = @ExampleObject(value = """
                                        {
                                            "success": true,
                                            "message": "Successfully Imported Menu",
                                            "data": null,
                                            "timestamp": "2024-01-15T10:30:00"
                                        }
                                        """))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file format or validation failed", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class), examples = @ExampleObject(value = """
                                        {
                                            "status": 400,
                                            "error": "BAD_REQUEST",
                                            "message": "Invalid Excel file format",
                                            "path": "/api/v1/excel/menu/1",
                                            "timestamp": "2024-01-15T10:30:00",
                                            "traceId": "abc123"
                                        }
                                        """))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Branch not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error while processing Excel file", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Excel file containing menu data", required = true, content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE, schema = @Schema(type = "object", requiredProperties = {
                        "file" })))
        public ResponseEntity<ApiResponse<Object>> importData(@RequestParam("file") MultipartFile file, @PathVariable Long branchId)
                        throws Exception {
                excelService.processImport(file, branchId);
                ApiResponse<Object> response = ApiResponse.builder()
                                .success(true)
                                .message("Successfully Imported Menu")
                                .data(null)
                                .build();
                return ResponseEntity.ok(response);
        }

        // ==============================================================================================================================================================================================
        @GetMapping(value = "/menu/template", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        @Operation(summary = "Download menu import template", description = "Downloads a pre-formatted Excel template that can be used to import menu data into the system.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Template downloaded successfully", content = @Content(mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", schema = @Schema(type = "string", format = "binary"))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Failed to generate template", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<byte[]> getTemplate() throws Exception {
                byte[] excelBytes = excelService.getTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Branch_Menu_Template.xlsx");
                return ResponseEntity.ok()
                                .headers(headers)
                                .body(excelBytes);
        }

        // =======================================================================================================================================
        @GetMapping(value = "/menu/{branchId}", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        @Operation(summary = "Export branch menu to Excel", description = "Generates and downloads an Excel file containing all categories, menu items, variants, addons, and related mappings for the specified branch.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu exported successfully", content = @Content(mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", schema = @Schema(type = "string", format = "binary"))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Branch not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class), examples = @ExampleObject(value = """
                                        {
                                            "status": 404,
                                            "error": "NOT_FOUND",
                                            "message": "Branch not found with id: 1",
                                            "path": "/api/v1/excel/menu/1",
                                            "timestamp": "2024-01-15T10:30:00",
                                            "traceId": "abc123"
                                        }
                                        """))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Failed to generate Excel export", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
        })
        public ResponseEntity<byte[]> exportData(@PathVariable Long branchId) throws Exception {
                byte[] excelBytes = excelService.exportMenuToExcel(branchId);
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Branch_" + branchId + "_Menu.xlsx");
                return ResponseEntity.ok()
                                .headers(headers)
                                .body(excelBytes);
        }

}
