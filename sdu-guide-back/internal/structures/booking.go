package structures

import "time"

type Booking struct {
	ID          int64     `json:"id"`
	RoomID      int64     `json:"roomId"`
	RoomSEF     string    `json:"roomSef"`
	StudentName string    `json:"studentName"`
	StudentID   string    `json:"studentId"`
	Date        string    `json:"date"`
	TimeSlot    string    `json:"timeSlot"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
}

type BookingFilter struct {
	StudentID string
	RoomID    int64
	Date      string
	Status    string
}

type SlotAvailability struct {
	Slot      string `json:"slot"`
	Booked    int    `json:"booked"`
	Available int    `json:"available"`
}

type RoomAvailability struct {
	Capacity int                `json:"capacity"`
	RoomSEF  string             `json:"roomSef"`
	Date     string             `json:"date"`
	Slots    []SlotAvailability `json:"slots"`
}
