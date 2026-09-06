package com.restroly.qrmenu.excel.service.impl;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.category.entity.Category;
import com.restroly.qrmenu.category.repository.CategoryRepository;
import com.restroly.qrmenu.config.ExcelMappingConfig;
import com.restroly.qrmenu.excel.service.MenuExcelService;
import com.restroly.qrmenu.excel.service.generic.impl.GenericExcelServiceImpl;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.food.repository.FoodRepository;
import com.restroly.qrmenu.menu.entity.Menu;
import com.restroly.qrmenu.menu.repository.MenuRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

//================================= INTERNAL DTOs FOR PARSING DATA ================================
@Data
class ParsedMenu {
    String name;
    String desc;
    List<ParsedCategory> categories = new ArrayList<>();
}

@Data
class ParsedCategory {
    String name;
    String desc;
    List<ParsedFood> foods = new ArrayList<>();
}

@Data
class ParsedFood {
    String name;
    String desc;
    Double price;
    Boolean isVeg;
    Boolean isAvailable;
    String imageUrl;
}

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuExcelServiceImpl extends GenericExcelServiceImpl<ParsedMenu> implements MenuExcelService {

    private final MenuRepository menuRepository;
    private final CategoryRepository categoryRepository;
    private final FoodRepository foodRepository;
    private final BranchRepository branchRepository;
    
    private final ExcelMappingConfig excelConfig;

    // ========================================== IMPORT PART
    // ==============================================
    @Override
    public void processImport(MultipartFile file, Long branchId) throws Exception {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        List<ParsedMenu> parsedData = this.parseExcel(file);

        if (parsedData.isEmpty())
            throw new IllegalArgumentException("File empty");
        
        saveParsedDataToDatabase(branch, parsedData);
    }

    @Transactional(rollbackFor = Exception.class)
    public void saveParsedDataToDatabase(Branch branch, List<ParsedMenu> parsedData) {
        Map<String, Category> categoryMap = upsertCategories(parsedData);
        Map<String, Menu> menuMap = upsertMenus(parsedData, branch);
        linkMenusAndCategories(parsedData, menuMap, categoryMap);
        upsertFoodItems(parsedData, categoryMap);
    }
    
    @Override
    protected List<ParsedMenu> extractDataFromWorkbook(Workbook workbook) {
        List<ParsedMenu> menus = new ArrayList<>();

        for (int sheetIdx = 0; sheetIdx < workbook.getNumberOfSheets(); sheetIdx++) {
            Sheet sheet = workbook.getSheetAt(sheetIdx);
            Row menuRow = sheet.getRow(0);
            String extractedMenuName = getCellValueAsString(menuRow.getCell(1));
            if (extractedMenuName == null || extractedMenuName.isEmpty()) {
                throw new IllegalArgumentException(
                    "Format Error in Sheet '" + sheet.getSheetName() + 
                    "': The Menu Name cannot be blank. Please provide a name in cell B1."
                );
            }
            ParsedMenu currentMenu = new ParsedMenu();
            currentMenu.setName(getCellValueAsString(menuRow.getCell(1)));
            currentMenu.setDesc(getCellValueAsString(menuRow.getCell(3)));
            ParsedCategory currentCategory = null;

            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null)
                    continue;
                boolean isRowEmpty = true;
                for (int c = Math.max(0, row.getFirstCellNum()); c < row.getLastCellNum(); c++) {
                    Cell cell = row.getCell(c);
                    if (cell != null && cell.getCellType() != CellType.BLANK) {
                        isRowEmpty = false;
                        break;
                    }
                }
                if (isRowEmpty) continue;

                String colA = getCellValueAsString(row.getCell(0));

                if (colA == null || colA.isEmpty())
                    throw new IllegalArgumentException(
                        "Format Error in Sheet '" + sheet.getSheetName() + "' at Row " + (r + 1) + 
                        ": Column A cannot be blank if the row contains data."
                    );
                else if (colA.toLowerCase().startsWith("category")) {
                    currentCategory = new ParsedCategory();
                    currentCategory.setName(getCellValueAsString(row.getCell(1)));
                    currentCategory.setDesc(getCellValueAsString(row.getCell(3)));
                    currentMenu.getCategories().add(currentCategory);
                } 
                else if (colA.toLowerCase().startsWith("food"))
                    continue;
                else if (currentCategory != null) {
                    ParsedFood food = new ParsedFood();
                    food.setName(colA);
                    food.setDesc(getCellValueAsString(row.getCell(1)));
                    food.setPrice(getCellValueAsDouble(row.getCell(2)));
                    food.setIsVeg(getCellValueAsBoolean(row.getCell(3)));
                    food.setIsAvailable(getCellValueAsBoolean(row.getCell(4)));
                    food.setImageUrl(getCellValueAsString(row.getCell(5)));
                    currentCategory.getFoods().add(food);
                } else {
                    throw new IllegalArgumentException(
                            "Format Error in Sheet '" + sheet.getSheetName() + "' at Row " + (r + 1) +
                                    ": Found data before a valid 'Category Name:' header was declared.");
                }
            }
            menus.add(currentMenu);
        }
        return menus;
    }

    private Map<String, Category> upsertCategories(List<ParsedMenu> data) {
        Map<String, String> uniqueCategories = new HashMap<>();

        for (ParsedMenu menu : data) {
            for (ParsedCategory cat : menu.getCategories()) {
                if (cat.getName() != null && !cat.getName().trim().isEmpty()) {
                    uniqueCategories.putIfAbsent(cat.getName().trim(), cat.getDesc());
                }
            }
        }

        List<Category> existingCats = categoryRepository.findByNameInAndIsDeleteFalse(uniqueCategories.keySet());

        Map<String, Category> categoryMap = existingCats.stream()
                .filter(c -> uniqueCategories.containsKey(c.getName()))
                .collect(Collectors.toMap(Category::getName, c -> c));

        List<Category> newCats = new ArrayList<>();
        for (Map.Entry<String, String> entry : uniqueCategories.entrySet()) {
            if (!categoryMap.containsKey(entry.getKey())) {
                Category cat = Category.builder()
                        .name(entry.getKey())
                        .description(entry.getValue())
                        .isDelete(false)
                        .updatedDate(LocalDateTime.now())
                        .foods(new HashSet<>())
                        .menu(new HashSet<>())
                        .build();
                newCats.add(cat);
            }
        }

        if (!newCats.isEmpty()) {
            List<Category> savedCats = categoryRepository.saveAll(newCats);
            savedCats.forEach(c -> categoryMap.put(c.getName(), c));
        }

        return categoryMap;
    }

    private Map<String, Menu> upsertMenus(List<ParsedMenu> data, Branch branch) {
        Set<String> uniqueNames = data.stream()
                .map(ParsedMenu::getName)
                .filter(name -> name != null && !name.trim().isEmpty())
                .map(String::trim)
                .collect(Collectors.toSet());

        List<Menu> existingMenus = menuRepository.findByBranch_BranchIdAndIsDeletedFalse(branch.getBranchId());
        Map<String, Menu> menuMap = existingMenus.stream()
                .filter(m -> uniqueNames.contains(m.getMenuName()))
                .collect(Collectors.toMap(Menu::getMenuName, m -> m));

        List<Menu> newMenus = new ArrayList<>();
        long currentTime = System.currentTimeMillis();

        for (String name : uniqueNames) {
            if (!menuMap.containsKey(name)) {
                String desc = data.stream()
                        .filter(r -> name.equals(r.getName()))
                        .map(r -> r.getDesc() != null ? r.getDesc() : "")
                        .findFirst()
                        .orElse("");

                Menu menu = Menu.builder()
                        .menuName(name)
                        .menuDesc(desc)
                        .branch(branch)
                        .isDeleted(false)
                        .createdDate(new Date(currentTime))
                        .updatedDate(new Date(currentTime))
                        .categories(new ArrayList<>())
                        .build();
                newMenus.add(menu);
            }
        }

        if (!newMenus.isEmpty()) {
            List<Menu> savedMenus = menuRepository.saveAll(newMenus);
            savedMenus.forEach(m -> menuMap.put(m.getMenuName(), m));
        }

        return menuMap;
    }

    private void linkMenusAndCategories(List<ParsedMenu> data, Map<String, Menu> menuMap,
            Map<String, Category> categoryMap) {
        Set<Menu> menusToUpdate = new HashSet<>();

        for (ParsedMenu parsedMenu : data) {
            Menu menu = menuMap.get(parsedMenu.getName().trim());
            if (menu == null)
                continue;

            for (ParsedCategory parsedCat : parsedMenu.getCategories()) {
                Category category = categoryMap.get(parsedCat.getName().trim());
                if (category != null) {
                    if (menu.getCategories() == null) {
                        menu.setCategories(new ArrayList<>());
                    }

                    boolean categoryExists = menu.getCategories().stream()
                            .anyMatch(c -> c.getCategoryId().equals(category.getCategoryId()));

                    if (!categoryExists) {
                        menu.getCategories().add(category);
                        menusToUpdate.add(menu);
                    }
                }
            }
        }

        if (!menusToUpdate.isEmpty()) {
            menuRepository.saveAll(menusToUpdate);
        }
    }

    private void upsertFoodItems(List<ParsedMenu> data, Map<String, Category> categoryMap) {
        Map<String, ParsedFood> uniqueItems = new HashMap<>();

        for (ParsedMenu menu : data) {
            for (ParsedCategory cat : menu.getCategories()) {
                for (ParsedFood food : cat.getFoods()) {
                    if (food.getName() != null && !food.getName().trim().isEmpty() && cat.getName() != null) {
                        String key = food.getName().trim() + "|" + cat.getName().trim();
                        uniqueItems.put(key, food);
                    }
                }
            }
        }

        List<Long> categoryIds = categoryMap.values().stream().map(Category::getCategoryId).toList();

        if (categoryIds.isEmpty())
            return;

        List<Food> existingItems = foodRepository.findByCategory_CategoryIdInAndIsDeleteFalse(categoryIds);

        Map<String, Food> foodItemMap = existingItems.stream()
                .collect(Collectors.toMap(f -> f.getName().trim() + "|" + f.getCategory().getName().trim(), f -> f));

        List<Food> itemsToSave = new ArrayList<>();

        for (Map.Entry<String, ParsedFood> entry : uniqueItems.entrySet()) {
            ParsedFood parsedFood = entry.getValue();
            String key = entry.getKey();
            String categoryName = key.split("\\|")[1];

            Category category = categoryMap.get(categoryName);
            if (category == null)
                continue;

            Food item = foodItemMap.getOrDefault(key, Food.builder().build());

            item.setName(parsedFood.getName().trim());
            item.setDescription(parsedFood.getDesc());
            item.setPrice(parsedFood.getPrice() != null ? BigDecimal.valueOf(parsedFood.getPrice()) : BigDecimal.ZERO);
            item.setImageUrl(parsedFood.getImageUrl());
            item.setIsAvailable(parsedFood.getIsAvailable() == null || parsedFood.getIsAvailable());
            item.setIsVeg(parsedFood.getIsVeg() != null && parsedFood.getIsVeg());
            item.setIsDelete(false);
            item.setCategory(category);

            itemsToSave.add(item);
        }

        if (!itemsToSave.isEmpty()) {
            foodRepository.saveAll(itemsToSave);
        }
    }

    // ======================================= EXPORT PART ==============================================

    @Transactional(readOnly = true)
    @Override
    public byte[] exportMenuToExcel(Long branchId) {
        if (!branchRepository.existsById(branchId))
            throw new ResourceNotFoundException("Branch not found");

        List<Menu> menus = menuRepository.findByBranch_BranchIdAndIsDeletedFalse(branchId);

        // This will ensure the blank branches gets template if they click export
        if (menus.isEmpty()) {
            return getTemplate();
        }

        List<ParsedMenu> parsedData = convertEntitiesToParsedMenu(menus);

        return generateFromTemplate(parsedData);
    }

    @Override
    public byte[] getTemplate() {
        org.springframework.core.io.ClassPathResource resource = 
                new org.springframework.core.io.ClassPathResource(excelConfig.getTemplatePath());
        try (InputStream is = resource.getInputStream()) {
            return is.readAllBytes();
        } catch (Exception e) {
            log.error("Failed to read static template file from resources", e);
            throw new RuntimeException("Template file not found at: " + excelConfig.getTemplatePath(), e);
        }
    }

    private byte[] generateFromTemplate(List<ParsedMenu> data) {
        org.springframework.core.io.ClassPathResource resource = new org.springframework.core.io.ClassPathResource(
                excelConfig.getTemplatePath());

        try (InputStream is = resource.getInputStream();
                Workbook workbook = WorkbookFactory.create(is);
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            CellStyle boldStyle = workbook.createCellStyle();
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldStyle.setFont(boldFont);

            Sheet templateSheet = workbook.getSheetAt(0);

            for (int m = 0; m < data.size(); m++) {
                ParsedMenu menu = data.get(m);

                String safeSheetName = menu.getName().replaceAll("[\\\\/?*\\[\\]]", "").trim();
                if (safeSheetName.isEmpty())
                    safeSheetName = "Menu_" + m;
                if (safeSheetName.length() > 31)
                    safeSheetName = safeSheetName.substring(0, 31);

                Sheet sheet = (m == 0) ? templateSheet : workbook.cloneSheet(0);
                workbook.setSheetName(workbook.getSheetIndex(sheet), safeSheetName);

                int rowIdx = 0;

                // --- MENU HEADER ---
                Row menuRow = sheet.createRow(rowIdx++);
                createStyledCell(menuRow, 0, "Menu Name:", boldStyle);
                createStyledCell(menuRow, 1, menu.getName(), null);
                createStyledCell(menuRow, 2, "Description:", boldStyle);
                createStyledCell(menuRow, 3, menu.getDesc(), null);
                rowIdx++;

                // --- CATEGORIES & FOODS ---
                for (ParsedCategory category : menu.getCategories()) {
                    Row catRow = sheet.createRow(rowIdx++);
                    createStyledCell(catRow, 0, "Category Name:", boldStyle);
                    createStyledCell(catRow, 1, category.getName(), null);
                    createStyledCell(catRow, 2, "Description:", boldStyle);
                    createStyledCell(catRow, 3, category.getDesc(), null);

                    Row foodHeaderRow = sheet.createRow(rowIdx++);

                    String[] foodHeaders = {"Food Name", "Description", "Price", "Is Veg", "Is Available", "Image URL"};
                    for (int i = 0; i < foodHeaders.length; i++) {
                        createStyledCell(foodHeaderRow, i, foodHeaders[i], boldStyle);
                    }

                    for (ParsedFood food : category.getFoods()) {
                        Row fRow = sheet.createRow(rowIdx++);
                        createStyledCell(fRow, 0, food.getName(), null);
                        createStyledCell(fRow, 1, food.getDesc(), null);
                        createStyledCell(fRow, 2, food.getPrice(), null);
                        createStyledCell(fRow, 3, food.getIsVeg(), null);
                        createStyledCell(fRow, 4, food.getIsAvailable(), null);
                        createStyledCell(fRow, 5, food.getImageUrl(), null);
                    }
                    rowIdx++;
                }
                for (int i = 0; i < 6; i++)
                    sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            log.error("Failed to generate Excel file from template", e);
            throw new RuntimeException("Failed to generate Excel from template: " + e.getMessage(), e);
        }
    }

    @Override
    protected void buildWorkbookFromData(Workbook workbook, List<ParsedMenu> data) {

    }

    private List<ParsedMenu> convertEntitiesToParsedMenu(List<Menu> menus) {
        List<ParsedMenu> parsedData = new ArrayList<>();

        if (menus == null || menus.isEmpty()) {
            return parsedData;
        }

        for (Menu menu : menus) {
            // Skip soft-deleted menus
            if (menu.isDeleted())
                continue;

            ParsedMenu pMenu = new ParsedMenu();
            pMenu.setName(menu.getMenuName());
            pMenu.setDesc(menu.getMenuDesc());

            if (menu.getCategories() != null) {
                for (Category cat : menu.getCategories()) {
                    // Skip soft-deleted categories
                    if (Boolean.TRUE.equals(cat.getIsDelete()))
                        continue;

                    ParsedCategory pCat = new ParsedCategory();
                    pCat.setName(cat.getName());
                    pCat.setDesc(cat.getDescription());

                    if (cat.getFoods() != null) {
                        for (Food food : cat.getFoods()) {
                            // Skip soft-deleted foods
                            if (Boolean.TRUE.equals(food.getIsDelete()))
                                continue;

                            ParsedFood pFood = new ParsedFood();
                            pFood.setName(food.getName());
                            pFood.setDesc(food.getDescription());
                            // Handle BigDecimal to Double conversion safely
                            pFood.setPrice(food.getPrice() != null ? food.getPrice().doubleValue() : 0.0);
                            pFood.setIsVeg(food.getIsVeg());
                            pFood.setIsAvailable(food.getIsAvailable());
                            pFood.setImageUrl(food.getImageUrl());

                            pCat.getFoods().add(pFood);
                        }
                    }
                    pMenu.getCategories().add(pCat);
                }
            }
            parsedData.add(pMenu);
        }

        return parsedData;
    }

    private void createStyledCell(Row row, int colIdx, Object value, CellStyle style) {
        Cell cell = row.createCell(colIdx);
        if (value instanceof String)
            cell.setCellValue((String) value);
        else if (value instanceof Double)
            cell.setCellValue((Double) value);
        else if (value instanceof Boolean)
            cell.setCellValue((Boolean) value);
        if (style != null)
            cell.setCellStyle(style);
    }
}