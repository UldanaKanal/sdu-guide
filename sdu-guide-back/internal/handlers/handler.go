package handlers

import (
	"sdu-guide/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/cache/v9"
)

type Handler struct {
	Gin     *gin.Engine
	Service *services.Service
	Cache   *cache.Cache
}

func NewHandler(service *services.Service, cache *cache.Cache) *Handler {
	return &Handler{
		Gin:     gin.Default(),
		Service: service,
		Cache:   cache,
	}
}

func (h *Handler) Router() {
	h.Gin.POST("/sign-in", h.signIn())
	h.Gin.POST("/sign-up", h.signUp())
	h.Gin.GET("/xlsx/:hash", h.getXLSX)
	h.Gin.GET("/room/:id", h.getRoom())
	h.Gin.GET("/image/:hash", h.getImage)
	h.Gin.GET("/getAll-events", h.getAllEvents())
	h.Gin.GET("/event/:id", h.getEvent())
	h.Gin.GET("/getAll-events-currentMonth", h.getAllEventsForCallendar())
	h.Gin.GET("/schedule/:sef", h.getSchedule())
	h.Gin.GET("/translations", h.getLanguage())
	h.Gin.GET("/room-availability", h.getRoomAvailability())
	h.Gin.POST("/book-room", h.bookRoom())
	h.Gin.DELETE("/cancel-booking/:id", h.cancelBooking())
	h.Gin.GET("/my-bookings", h.myBookings())

	protected := h.Gin.Group("/")
	protected.Use(h.AuthRequired)
	{
		protected.GET("/ping", func(ctx *gin.Context) {
			ctx.JSON(200, gin.H{"Status": "Check"})
		})
		protected.GET("/logout", h.logout())
		protected.POST("/upload-XLSX", h.uploadXLSX())
		protected.POST("/upload-image", h.uploadImage())
		protected.POST("/create-room", h.createRoom())
		protected.PUT("/update-room", h.updateRoom())
		protected.GET("/profile", h.getProfile())
		protected.GET("/getAll-rooms", h.getAllRooms())
		protected.PUT("/update-user", h.updateUser())
		protected.DELETE("/delete-room/:id", h.deleteRoom())
		protected.POST("/create-event", h.createEvent())
		protected.PUT("/update-event", h.updateEvent())
		protected.DELETE("/delete-event/:id", h.deleteEvent())
	}
}
