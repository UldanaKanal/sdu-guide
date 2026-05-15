-- Файлы расписаний
INSERT INTO files (hash, name, path, file_type) VALUES
('sd101x', 'd-101.xlsx', './uploads/sd101x_d-101.xlsx', '.xlsx'),
('sd102x', 'd-102.xlsx', './uploads/sd102x_d-102.xlsx', '.xlsx'),
('sd103x', 'd-103.xlsx', './uploads/sd103x_d-103.xlsx', '.xlsx'),
('sd104x', 'd-104.xlsx', './uploads/sd104x_d-104.xlsx', '.xlsx'),
('sd105x', 'd-105.xlsx', './uploads/sd105x_d-105.xlsx', '.xlsx'),
('sd201x', 'd-201.xlsx', './uploads/sd201x_d-201.xlsx', '.xlsx'),
('sd202x', 'd-202.xlsx', './uploads/sd202x_d-202.xlsx', '.xlsx'),
('sd203x', 'd-203.xlsx', './uploads/sd203x_d-203.xlsx', '.xlsx'),
('sd204x', 'd-204.xlsx', './uploads/sd204x_d-204.xlsx', '.xlsx'),
('sd205x', 'd-205.xlsx', './uploads/sd205x_d-205.xlsx', '.xlsx'),
('sd301x', 'd-301.xlsx', './uploads/sd301x_d-301.xlsx', '.xlsx'),
('sd302x', 'd-302.xlsx', './uploads/sd302x_d-302.xlsx', '.xlsx'),
('sd303x', 'd-303.xlsx', './uploads/sd303x_d-303.xlsx', '.xlsx'),
('sd304x', 'd-304.xlsx', './uploads/sd304x_d-304.xlsx', '.xlsx'),
('sd305x', 'd-305.xlsx', './uploads/sd305x_d-305.xlsx', '.xlsx');

-- Кабинеты Block D
INSERT INTO rooms (block, number, sef, schedule_hash, deleted, updated) VALUES
('D', 101, 'd-101', 'sd101x', false, NOW()),
('D', 102, 'd-102', 'sd102x', false, NOW()),
('D', 103, 'd-103', 'sd103x', false, NOW()),
('D', 104, 'd-104', 'sd104x', false, NOW()),
('D', 105, 'd-105', 'sd105x', false, NOW()),
('D', 201, 'd-201', 'sd201x', false, NOW()),
('D', 202, 'd-202', 'sd202x', false, NOW()),
('D', 203, 'd-203', 'sd203x', false, NOW()),
('D', 204, 'd-204', 'sd204x', false, NOW()),
('D', 205, 'd-205', 'sd205x', false, NOW()),
('D', 301, 'd-301', 'sd301x', false, NOW()),
('D', 302, 'd-302', 'sd302x', false, NOW()),
('D', 303, 'd-303', 'sd303x', false, NOW()),
('D', 304, 'd-304', 'sd304x', false, NOW()),
('D', 305, 'd-305', 'sd305x', false, NOW());
