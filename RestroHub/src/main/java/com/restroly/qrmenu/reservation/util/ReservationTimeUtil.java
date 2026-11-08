package com.restroly.qrmenu.reservation.util;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Locale;
import lombok.Builder;
import lombok.Getter;

// 2026-11-08 - Table reservation time util - Parse time ranges and enforce 30-min buffer between
// bookings
public final class ReservationTimeUtil {

  public static final int DEFAULT_DURATION_MINUTES = 60;
  public static final int DEFAULT_BUFFER_MINUTES = 30;

  private static final DateTimeFormatter DISPLAY_FORMAT =
      DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

  private ReservationTimeUtil() {}

  @Getter
  @Builder
  public static class ParsedTimeSlot {
    private final String startTime;
    private final String endTime;
    private final String timeRange;
    private final int startMinutes;
    private final int endMinutes;
  }

  public static ParsedTimeSlot parse(String timeSlot, String explicitStart, String explicitEnd) {
    LocalTime start = null;
    LocalTime end = null;

    if (explicitStart != null && !explicitStart.isBlank()) {
      start = parseLocalTime(explicitStart);
    }
    if (explicitEnd != null && !explicitEnd.isBlank()) {
      end = parseLocalTime(explicitEnd);
    }

    if (start == null && timeSlot != null && !timeSlot.isBlank()) {
      String clean = timeSlot.trim();
      String separator = clean.contains(" - ") ? " - " : (clean.contains("-") ? "-" : null);
      if (separator == null && clean.contains(" to ")) {
        separator = " to ";
      }

      if (separator != null) {
        String[] parts = clean.split(separator, 2);
        start = parseLocalTime(parts[0].trim());
        if (parts.length > 1 && !parts[1].isBlank()) {
          end = parseLocalTime(parts[1].trim());
        }
      } else {
        start = parseLocalTime(clean);
      }
    }

    if (start == null) {
      start = LocalTime.of(12, 0);
    }

    if (end == null || !end.isAfter(start)) {
      end = start.plusMinutes(DEFAULT_DURATION_MINUTES);
    }

    String formattedStart = start.format(DISPLAY_FORMAT);
    String formattedEnd = end.format(DISPLAY_FORMAT);
    String formattedRange = formattedStart + " - " + formattedEnd;

    int startMin = start.getHour() * 60 + start.getMinute();
    int endMin = end.getHour() * 60 + end.getMinute();
    if (endMin <= startMin) {
      endMin = startMin + DEFAULT_DURATION_MINUTES;
    }

    return ParsedTimeSlot.builder()
        .startTime(formattedStart)
        .endTime(formattedEnd)
        .timeRange(formattedRange)
        .startMinutes(startMin)
        .endMinutes(endMin)
        .build();
  }

  public static LocalTime parseLocalTime(String timeStr) {
    if (timeStr == null || timeStr.isBlank()) {
      return null;
    }
    String s = timeStr.trim().toUpperCase(Locale.ENGLISH);

    String[] patterns = {"h:mm a", "hh:mm a", "h:mma", "hh:mma", "h a", "ha", "H:mm", "HH:mm"};

    for (String pattern : patterns) {
      try {
        DateTimeFormatter dtf =
            new DateTimeFormatterBuilder()
                .parseCaseInsensitive()
                .appendPattern(pattern)
                .toFormatter(Locale.ENGLISH);
        return LocalTime.parse(s, dtf);
      } catch (Exception ignored) {
      }
    }
    return null;
  }

  public static int parseMinutes(String timeStr, String fallbackSlot) {
    LocalTime lt = parseLocalTime(timeStr);
    if (lt == null && fallbackSlot != null) {
      ParsedTimeSlot parsed = parse(fallbackSlot, null, null);
      return parsed.getStartMinutes();
    }
    return lt != null ? lt.getHour() * 60 + lt.getMinute() : 720;
  }

  public static boolean hasConflictMinutes(
      int start1, int end1, int start2, int end2, int bufferMinutes) {
    int bufEnd1 = end1 + bufferMinutes;
    int bufEnd2 = end2 + bufferMinutes;
    boolean noConflict = (start2 >= bufEnd1) || (start1 >= bufEnd2);
    return !noConflict;
  }
}
