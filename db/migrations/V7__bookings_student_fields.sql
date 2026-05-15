-- Добавляем поля студента
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS student_name TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS student_id   TEXT NOT NULL DEFAULT '';

-- user_id больше не обязателен
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;

-- Обновляем уникальный индекс: один студент — один слот в одной аудитории
ALTER TABLE bookings
    DROP CONSTRAINT IF EXISTS bookings_room_id_user_id_date_time_slot_key;

ALTER TABLE bookings
    ADD CONSTRAINT bookings_student_slot_unique
    UNIQUE (room_id, student_id, date, time_slot);
