package repositories

import (
	"context"
	"fmt"
	"sdu-guide/internal/structures"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Room struct {
	db *pgxpool.Pool
}

func newRoomRepo(db *pgxpool.Pool) *Room {
	return &Room{db: db}
}

const roomSelect = `SELECT id, block, number, sef, schedule_hash, deleted, updated FROM rooms`

func scanRoom(row interface{ Scan(...any) error }) (structures.Room, error) {
	var r structures.Room
	err := row.Scan(&r.ID, &r.Block, &r.Number, &r.SEF, &r.ScheduleHash, &r.Deleted, &r.Updated)
	return r, err
}

func (r *Room) Create(room structures.Room) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO rooms (block, number, sef, schedule_hash, deleted, updated) VALUES ($1, $2, $3, $4, $5, $6)`,
		room.Block, room.Number, room.SEF, room.ScheduleHash, room.Deleted, room.Updated)
	return err
}

func (r *Room) GetBy(field string, value interface{}) (structures.Room, error) {
	col, err := roomFieldToColumn(field)
	if err != nil {
		return structures.Room{}, err
	}
	row := r.db.QueryRow(context.Background(),
		fmt.Sprintf(roomSelect+` WHERE %s = $1 AND deleted = FALSE`, col), value)
	return scanRoom(row)
}

func roomFieldToColumn(field string) (string, error) {
	switch field {
	case "_id", "id":
		return "id", nil
	case "sef":
		return "sef", nil
	}
	return "", fmt.Errorf("unknown room field: %s", field)
}

func (r *Room) GetAll(filter structures.RoomFilter) ([]structures.Room, error) {
	query := roomSelect + ` WHERE deleted = FALSE`
	args := []interface{}{}
	i := 1

	if filter.Block != "" {
		query += fmt.Sprintf(" AND block = $%d", i)
		args = append(args, filter.Block)
		i++
	}
	if filter.Number > 0 {
		query += fmt.Sprintf(" AND number = $%d", i)
		args = append(args, filter.Number)
		i++
	}
	_ = i

	rows, err := r.db.Query(context.Background(), query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rooms []structures.Room
	for rows.Next() {
		room, err := scanRoom(rows)
		if err != nil {
			return nil, err
		}
		rooms = append(rooms, room)
	}
	return rooms, rows.Err()
}

func (r *Room) Update(room structures.Room) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE rooms SET block=$1, number=$2, sef=$3, schedule_hash=$4, deleted=$5, updated=$6 WHERE id=$7`,
		room.Block, room.Number, room.SEF, room.ScheduleHash, room.Deleted, room.Updated, room.ID)
	return err
}

func (r *Room) Delete(id uint64) error {
	_, err := r.db.Exec(context.Background(), `UPDATE rooms SET deleted=TRUE WHERE id=$1`, id)
	return err
}
