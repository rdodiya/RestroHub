-- 2026-11-08 - Table reservation time range - Add start_time, end_time and time_range columns to support multi-booking with 30-min gap
ALTER TABLE t_table_reservation
ADD COLUMN IF NOT EXISTS start_time VARCHAR(20),
ADD COLUMN IF NOT EXISTS end_time VARCHAR(20),
ADD COLUMN IF NOT EXISTS time_range VARCHAR(60);
