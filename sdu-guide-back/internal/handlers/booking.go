package handlers

import (
	"sdu-guide/internal/conv"
	"sdu-guide/internal/logger"
	"sdu-guide/internal/structures"

	"github.com/gin-gonic/gin"
)

// GET /room-availability?sef=d-301&date=2026-05-11
func (h *Handler) getRoomAvailability() gin.HandlerFunc {
	return func(c *gin.Context) {
		sef  := c.Query("sef")
		date := c.Query("date")
		if sef == "" || date == "" {
			c.JSON(400, gin.H{"error": "sef and date are required"})
			return
		}
		avail, err := h.Service.BookingService.GetAvailability(sef, date)
		if err != nil {
			logger.Error.Println(err)
			c.JSON(404, gin.H{"error": "Аудитория не найдена"})
			return
		}
		c.JSON(200, gin.H{"data": avail})
	}
}

// POST /book-room  { sef, date, timeSlot, studentName, studentId }
func (h *Handler) bookRoom() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			SEF         string `json:"sef"`
			Date        string `json:"date"`
			TimeSlot    string `json:"timeSlot"`
			StudentName string `json:"studentName"`
			StudentID   string `json:"studentId"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": "Неверный запрос"})
			return
		}
		if err := h.Service.BookingService.Book(
			req.StudentName, req.StudentID, req.SEF, req.Date, req.TimeSlot,
		); err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"status": "Место успешно забронировано"})
	}
}

// DELETE /cancel-booking/:id?studentId=XXX
func (h *Handler) cancelBooking() gin.HandlerFunc {
	return func(c *gin.Context) {
		id        := conv.Int64(c.Param("id"))
		studentID := c.Query("studentId")
		if id == 0 || studentID == "" {
			c.JSON(400, gin.H{"error": "id и studentId обязательны"})
			return
		}
		if err := h.Service.BookingService.Cancel(id, studentID); err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"status": "Бронирование отменено"})
	}
}

// GET /my-bookings?studentId=XXX
func (h *Handler) myBookings() gin.HandlerFunc {
	return func(c *gin.Context) {
		studentID := c.Query("studentId")
		if studentID == "" {
			c.JSON(400, gin.H{"error": "studentId обязателен"})
			return
		}
		bookings, err := h.Service.BookingService.MyBookings(studentID)
		if err != nil {
			logger.Error.Println(err)
			c.JSON(500, gin.H{"error": "Ошибка получения бронирований"})
			return
		}
		if bookings == nil {
			bookings = []structures.Booking{}
		}
		c.JSON(200, gin.H{"data": bookings})
	}
}
