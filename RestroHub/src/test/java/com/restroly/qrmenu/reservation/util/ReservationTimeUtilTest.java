package com.restroly.qrmenu.reservation.util;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

// 2026-11-08 - Table reservation time util test - Verify 15-min gap buffer calculation
class ReservationTimeUtilTest {

  @Test
  void defaultBufferMinutesShouldBe15() {
    assertEquals(15, ReservationTimeUtil.DEFAULT_BUFFER_MINUTES);
  }

  @Test
  void hasConflictMinutesWith15MinBuffer() {
    // Booking 1: 8:00 PM - 9:00 PM (1200 to 1260 min)
    int start1 = 1200;
    int end1 = 1260;
    int buffer = 15;

    // Next booking at 9:15 PM - 10:15 PM (1275 to 1335 min): exact 15-min gap -> NO conflict
    assertFalse(ReservationTimeUtil.hasConflictMinutes(1275, 1335, start1, end1, buffer));

    // Next booking at 9:10 PM - 10:10 PM (1270 to 1330 min): 10-min gap < 15 min -> CONFLICT
    assertTrue(ReservationTimeUtil.hasConflictMinutes(1270, 1330, start1, end1, buffer));

    // Next booking at 9:00 PM - 10:00 PM (1260 to 1320 min): 0-min gap -> CONFLICT
    assertTrue(ReservationTimeUtil.hasConflictMinutes(1260, 1320, start1, end1, buffer));

    // Prior booking at 6:45 PM - 7:45 PM (1125 to 1185 min): gap 7:45 to 8:00 is 15 min -> NO
    // conflict
    assertFalse(ReservationTimeUtil.hasConflictMinutes(1125, 1185, start1, end1, buffer));

    // Prior booking at 6:50 PM - 7:50 PM (1130 to 1190 min): gap 7:50 to 8:00 is 10 min -> CONFLICT
    assertTrue(ReservationTimeUtil.hasConflictMinutes(1130, 1190, start1, end1, buffer));
  }
}
