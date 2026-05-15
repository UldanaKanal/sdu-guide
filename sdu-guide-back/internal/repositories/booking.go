package repositories

import (
	"context"
	"fmt"
	"sdu-guide/internal/structures"

	"github.com/jackc/pgx/v5/pgxpool"
)

type BookingRepoImpl struct {
	db *pgxpool.Pool
}

func newBookingRepo(db *pgxpool.Pool) *BookingRepoImpl {
	return &BookingRepoImpl{db: db}
}

var timeSlots = []string{
	"8:00-9:30",
	"9:40-11:10",
	"11:30-13:00",
	"13:20-14:50",
	"15:00-16:30",
	"16:40-18:10",
}

func (r *BookingRepoImpl) Create(b structures.Booking) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO bookings (room_id, student_name, student_id, date, time_slot, status)
		 VALUES ($1, $2, $3, $4, $5, 'active')`,
		b.RoomID, b.StudentName, b.StudentID, b.Date, b.TimeSlot)
	return err
}

func (r *BookingRepoImpl) Cancel(id int64, studentID string) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE bookings SET status = 'cancelled'
		 WHERE id = $1 AND student_id = $2`,
		id, studentID)
	return err
}

func (r *BookingRepoImpl) GetByStudent(studentID string) ([]structures.Booking, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT b.id, b.room_id, r.sef, b.student_name, b.student_id,
		        b.date::text, b.time_slot, b.status, b.created_at
		 FROM bookings b
		 JOIN rooms r ON r.id = b.room_id
		 WHERE b.student_id = $1 AND b.status = 'active'
		 ORDER BY b.date DESC, b.time_slot`,
		studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []structures.Booking
	for rows.Next() {
		var b structures.Booking
		if err := rows.Scan(&b.ID, &b.RoomID, &b.RoomSEF, &b.StudentName, &b.StudentID,
			&b.Date, &b.TimeSlot, &b.Status, &b.CreatedAt); err != nil {
			return nil, err
		}
		result = append(result, b)
	}
	return result, rows.Err()
}

func (r *BookingRepoImpl) GetAvailability(sef, date string) (int, map[string]int, error) {
	var capacity int
	err := r.db.QueryRow(context.Background(),
		`SELECT capacity FROM rooms WHERE sef = $1 AND deleted = FALSE`, sef).Scan(&capacity)
	if err != nil {
		return 0, nil, fmt.Errorf("room not found: %w", err)
	}

	rows, err := r.db.Query(context.Background(),
		`SELECT b.time_slot, COUNT(*) as cnt
		 FROM bookings b
		 JOIN rooms r ON r.id = b.room_id
		 WHERE r.sef = $1 AND b.date = $2 AND b.status = 'active'
		 GROUP BY b.time_slot`,
		sef, date)
	if err != nil {
		return 0, nil, err
	}
	defer rows.Close()

	booked := make(map[string]int)
	for rows.Next() {
		var slot string
		var cnt int
		if err := rows.Scan(&slot, &cnt); err != nil {
			return 0, nil, err
		}
		booked[slot] = cnt
	}
	return capacity, booked, rows.Err()
}

func (r *BookingRepoImpl) GetRoomIDByISEF(sef string) (int64, error) {
	var id int64
	err := r.db.QueryRow(context.Background(),
		`SELECT id FROM rooms WHERE sef = $1 AND deleted = FALSE`, sef).Scan(&id)
	return id, err
}

func (r *BookingRepoImpl) TimeSlots() []string { return timeSlots }
