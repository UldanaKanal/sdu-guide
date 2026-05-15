package repositories

import (
	"sdu-guide/internal/structures"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	UserRepo
	RoomRepo
	FileRepo
	EventRepo
	BookingRepo
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{
		UserRepo:    newUserRepo(db),
		RoomRepo:    newRoomRepo(db),
		FileRepo:    newFileRepo(db),
		EventRepo:   newEventRepo(db),
		BookingRepo: newBookingRepo(db),
	}
}

type UserRepo interface {
	Get(id int64) (structures.User, error)
	GetBy(field string, value interface{}) (structures.User, error)
	Create(user structures.User) error
	Upadte(user structures.User) error
}

type RoomRepo interface {
	Create(room structures.Room) error
	GetBy(field string, value interface{}) (structures.Room, error)
	GetAll(filter structures.RoomFilter) ([]structures.Room, error)
	Update(room structures.Room) error
	Delete(id uint64) error
}

type FileRepo interface {
	CreateFile(file structures.File) error
	UpadteXLSX(file structures.File) error
	GetFile(hash string) (structures.File, error)
	Delete(hash string) error
}

type EventRepo interface {
	Create(event structures.Event) error
	Update(event structures.Event) error
	Delete(id int64) error
	Get(id int64) (structures.Event, error)
	GetAll(filter structures.EventFilter) ([]structures.Event, error)
	MarkPastEventsAsEnded() error
}

type BookingRepo interface {
	Create(b structures.Booking) error
	Cancel(id int64, studentID string) error
	GetByStudent(studentID string) ([]structures.Booking, error)
	GetAvailability(sef, date string) (int, map[string]int, error)
	GetRoomIDByISEF(sef string) (int64, error)
	TimeSlots() []string
}
