package services

import (
	"errors"
	"sdu-guide/internal/repositories"
	"sdu-guide/internal/structures"
	"strings"
)

type BookingServiceImpl struct {
	repo *repositories.Repository
}

func newBookingService(repo *repositories.Repository) *BookingServiceImpl {
	return &BookingServiceImpl{repo: repo}
}

func (s *BookingServiceImpl) GetAvailability(sef, date string) (structures.RoomAvailability, error) {
	capacity, booked, err := s.repo.BookingRepo.GetAvailability(sef, date)
	if err != nil {
		return structures.RoomAvailability{}, err
	}
	slots := make([]structures.SlotAvailability, 0, len(s.repo.BookingRepo.TimeSlots()))
	for _, slot := range s.repo.BookingRepo.TimeSlots() {
		b := booked[slot]
		avail := capacity - b
		if avail < 0 {
			avail = 0
		}
		slots = append(slots, structures.SlotAvailability{
			Slot:      slot,
			Booked:    b,
			Available: avail,
		})
	}
	return structures.RoomAvailability{
		Capacity: capacity,
		RoomSEF:  sef,
		Date:     date,
		Slots:    slots,
	}, nil
}

func (s *BookingServiceImpl) Book(studentName, studentID, sef, date, timeSlot string) error {
	studentName = strings.TrimSpace(studentName)
	studentID   = strings.TrimSpace(studentID)
	if studentName == "" || studentID == "" {
		return errors.New("введите имя и ID студента")
	}
	if sef == "" || date == "" || timeSlot == "" {
		return errors.New("не указана аудитория, дата или слот")
	}

	capacity, booked, err := s.repo.BookingRepo.GetAvailability(sef, date)
	if err != nil {
		return errors.New("аудитория не найдена")
	}
	if booked[timeSlot] >= capacity {
		return errors.New("в этом слоте нет свободных мест")
	}

	roomID, err := s.repo.BookingRepo.GetRoomIDByISEF(sef)
	if err != nil {
		return errors.New("аудитория не найдена")
	}

	return s.repo.BookingRepo.Create(structures.Booking{
		RoomID:      roomID,
		StudentName: studentName,
		StudentID:   studentID,
		Date:        date,
		TimeSlot:    timeSlot,
	})
}

func (s *BookingServiceImpl) Cancel(bookingID int64, studentID string) error {
	return s.repo.BookingRepo.Cancel(bookingID, studentID)
}

func (s *BookingServiceImpl) MyBookings(studentID string) ([]structures.Booking, error) {
	return s.repo.BookingRepo.GetByStudent(studentID)
}
