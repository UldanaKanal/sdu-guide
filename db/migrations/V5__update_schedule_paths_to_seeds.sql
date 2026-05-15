-- Перенос путей расписаний из uploads (ручной docker cp)
-- в /app/seeds (bind-mount из репозитория db/schedules/)
UPDATE files SET path = './seeds/d-101.xlsx' WHERE hash = 'sd101x';
UPDATE files SET path = './seeds/d-102.xlsx' WHERE hash = 'sd102x';
UPDATE files SET path = './seeds/d-103.xlsx' WHERE hash = 'sd103x';
UPDATE files SET path = './seeds/d-104.xlsx' WHERE hash = 'sd104x';
UPDATE files SET path = './seeds/d-105.xlsx' WHERE hash = 'sd105x';
UPDATE files SET path = './seeds/d-201.xlsx' WHERE hash = 'sd201x';
UPDATE files SET path = './seeds/d-202.xlsx' WHERE hash = 'sd202x';
UPDATE files SET path = './seeds/d-203.xlsx' WHERE hash = 'sd203x';
UPDATE files SET path = './seeds/d-204.xlsx' WHERE hash = 'sd204x';
UPDATE files SET path = './seeds/d-205.xlsx' WHERE hash = 'sd205x';
UPDATE files SET path = './seeds/d-301.xlsx' WHERE hash = 'sd301x';
UPDATE files SET path = './seeds/d-302.xlsx' WHERE hash = 'sd302x';
UPDATE files SET path = './seeds/d-303.xlsx' WHERE hash = 'sd303x';
UPDATE files SET path = './seeds/d-304.xlsx' WHERE hash = 'sd304x';
UPDATE files SET path = './seeds/d-305.xlsx' WHERE hash = 'sd305x';
