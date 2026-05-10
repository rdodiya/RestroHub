// src/main/java/com/Restroly/qrmenu/common/util/Constants.java
package com.restroly.qrmenu.common.util;

public final class Constants {

    private Constants() {
        throw new IllegalStateException("Utility class should not be instantiated");
    }

    public static final String API_VERSION = "v1";
    public static final String API_BASE_PATH = "/api/" + API_VERSION;

    // Pagination defaults
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;

    // Cache names
    public static final String CACHE_FOODS = "foods";
    public static final String CACHE_FOOD = "food";
    public static final String CACHE_CATEGORIES = "categories";

    // Error codes
    public static final String ERROR_RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";
    public static final String ERROR_RESOURCE_EXISTS = "RESOURCE_ALREADY_EXISTS";
    public static final String ERROR_VALIDATION = "VALIDATION_ERROR";
    public static final String ERROR_BUSINESS = "BUSINESS_ERROR";
}