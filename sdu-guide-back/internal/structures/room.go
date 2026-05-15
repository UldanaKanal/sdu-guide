package structures

import "time"

type Room struct {
	ID           uint64    `json:"id"`
	Block        string    `json:"block"`
	Number       int64     `json:"number"`
	SEF          string    `json:"sef"`
	ScheduleHash string    `json:"hash"`
	Deleted      bool      `json:"deleted"`
	Updated      time.Time `json:"updated"`
}

type File struct {
	ID       uint64 `json:"id"`
	Hash     string `json:"hash"`
	Name     string `json:"name"`
	Path     string `json:"path"`
	FileType string `json:"fileType"`
}

type RoomFilter struct {
	Block  string
	Number int64
}
