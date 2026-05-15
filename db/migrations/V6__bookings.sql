-- Добавляем вместимость к аудиториям
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS capacity INT NOT NULL DEFAULT 20;

-- Таблица бронирований
CREATE TABLE IF NOT EXISTS bookings (
    id         BIGSERIAL PRIMARY KEY,
    room_id    BIGINT NOT NULL REFERENCES rooms(id),
    user_id    BIGINT NOT NULL REFERENCES users(id),
    date       DATE NOT NULL,
    time_slot  TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (room_id, user_id, date, time_slot)
);

CREATE INDEX IF NOT EXISTS idx_bookings_room_date
    ON bookings(room_id, date)
    WHERE status = 'active';
