package handlers

import (
	"encoding/json"
	"fmt"
	"sdu-guide/internal/conv"
	"sdu-guide/internal/logger"
	"sdu-guide/internal/structures"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) createEvent() gin.HandlerFunc {
	return func(c *gin.Context) {
		var event *structures.Event
		err := json.NewDecoder(c.Request.Body).Decode(&event)
		if err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": "Bad request"})
			return
		}
		if err := h.Service.EventService.CreateEvent(*event); err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": fmt.Sprintf("Bad request (%s)", err.Error())})
			return
		}
		c.JSON(200, gin.H{"Status": "Event successfuly created"})
	}
}

func (h *Handler) getEvent() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		event, err := h.Service.EventService.GetEvent(conv.Int64(id))
		if err != nil {
			logger.Error.Println(err)
			c.JSON(500, gin.H{"error": "Can't get event"})
			return
		}
		c.JSON(200, gin.H{"data": event})
	}
}

func (h *Handler) updateEvent() gin.HandlerFunc {
	return func(c *gin.Context) {
		var event structures.Event
		err := json.NewDecoder(c.Request.Body).Decode(&event)
		if err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": "Bad request"})
			return
		}
		if err := h.Service.EventService.UpdateEvent(event); err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": fmt.Sprintf("Bad request (%s)", err.Error())})
			return
		}
		c.JSON(200, gin.H{"Status": "Event successfuly updated"})
	}
}

func (h *Handler) getAllEvents() gin.HandlerFunc {
	return func(c *gin.Context) {
		// accept both "limit" and legacy "filter" param names
		limitStr := c.Query("limit")
		if limitStr == "" {
			limitStr = c.Query("filter")
		}
		ended := c.Query("withEnded")
		today := c.Query("today")
		upcoming := c.Query("upcoming")

		filter := structures.EventFilter{}

		if ended != "true" {
			f := false
			filter.Ended = &f
		}

		if limitStr != "" {
			parsedLimit, err := strconv.ParseInt(limitStr, 10, 64)
			if err != nil {
				c.JSON(400, gin.H{"error": "Invalid limit value"})
				return
			}
			filter.Limit = parsedLimit
		}

		if today == "true" {
			now := time.Now()
			startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
			endOfDay := startOfDay.Add(24 * time.Hour)
			filter.DateGTE = &startOfDay
			filter.DateLT = &endOfDay
		}

		if upcoming == "true" {
			now := time.Now()
			filter.DateGTE = &now
			filter.Upcoming = true
		}

		result, err := h.Service.EventService.GetAll(filter)
		if err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": fmt.Sprintf("Bad request (%s)", err.Error())})
			return
		}

		c.JSON(200, gin.H{"data": result})
	}
}

func (h *Handler) deleteEvent() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if conv.Uint64(id) == 0 {
			c.JSON(400, gin.H{"error": "Wrong id format"})
			return
		}
		if err := h.Service.EventService.Delete(conv.Uint64(id)); err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": fmt.Sprintf("Bad request (%s)", err.Error())})
			return
		}
		c.JSON(200, gin.H{"Status": "Event successfuly deleted"})
	}
}

func (h *Handler) getAllEventsForCallendar() gin.HandlerFunc {
	return func(c *gin.Context) {
		now := time.Now()
		startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
		endOfMonth := startOfMonth.AddDate(0, 1, 0)

		filter := structures.EventFilter{
			DateGTE: &startOfMonth,
			DateLT:  &endOfMonth,
		}

		result, err := h.Service.EventService.GetAll(filter)
		if err != nil {
			logger.Error.Println(err)
			c.JSON(400, gin.H{"error": fmt.Sprintf("Bad request (%s)", err.Error())})
			return
		}

		c.JSON(200, gin.H{"data": result})
	}
}
