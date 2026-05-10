package com.restroly.qrmenu.common.util;

public final class ApiConstants {

    private ApiConstants() {}

    public static final String APP_NAME = "restroly";

    public static final String API_VERSION = "/api/v1";
    public static final String SECURE_API_VERSION = "/secure"+API_VERSION;
    public static final String PUBLIC_API_VERSION = "/public"+API_VERSION;

    public static final String SORT_ASC = "asc";
    public static final String SORT_DESC = "desc";

    public static final String DEFAULT_PAGE = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_FIELD = "name";
    public static final String DEFAULT_SORT_DIRECTION = SORT_ASC;

    public static final int MAX_PAGE_SIZE = 100;

}