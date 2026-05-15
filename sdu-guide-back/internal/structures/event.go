package structures

import "time"

type Event struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Date      time.Time `json:"date"`
	Place     string    `json:"place"`
	StartTime string    `json:"startTime"`
	EndTime   string    `json:"endTime"`
	Ended     bool      `json:"ended"`
	Hash      string    `json:"hash"`
	ShortName string    `json:"shortName"`
}

type EventFilter struct {
	Limit    int64
	Ended    *bool
	DateGTE  *time.Time
	DateLT   *time.Time
	Upcoming bool
}
