package repositories

import (
	"context"
	"fmt"
	"sdu-guide/internal/structures"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Event struct {
	db *pgxpool.Pool
}

func newEventRepo(db *pgxpool.Pool) *Event {
	return &Event{db: db}
}

const eventSelect = `SELECT id, name, date, place, start_time, end_time, ended, hash, short_name FROM events`

func scanEvent(row interface{ Scan(...any) error }) (structures.Event, error) {
	var e structures.Event
	err := row.Scan(&e.ID, &e.Name, &e.Date, &e.Place, &e.StartTime, &e.EndTime, &e.Ended, &e.Hash, &e.ShortName)
	return e, err
}

func (r *Event) Create(event structures.Event) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO events (name, date, place, start_time, end_time, ended, hash, short_name)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		event.Name, event.Date, event.Place, event.StartTime, event.EndTime,
		event.Ended, event.Hash, event.ShortName)
	return err
}

func (r *Event) Update(event structures.Event) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE events SET name=$1, date=$2, place=$3, start_time=$4, end_time=$5, ended=$6, hash=$7, short_name=$8 WHERE id=$9`,
		event.Name, event.Date, event.Place, event.StartTime, event.EndTime,
		event.Ended, event.Hash, event.ShortName, event.ID)
	return err
}

func (r *Event) Delete(id int64) error {
	_, err := r.db.Exec(context.Background(), `DELETE FROM events WHERE id=$1`, id)
	return err
}

func (r *Event) Get(id int64) (structures.Event, error) {
	row := r.db.QueryRow(context.Background(), eventSelect+` WHERE id=$1`, id)
	return scanEvent(row)
}

func (r *Event) GetAll(filter structures.EventFilter) ([]structures.Event, error) {
	query := eventSelect + ` WHERE TRUE`
	args := []interface{}{}
	i := 1

	if filter.Ended != nil {
		query += fmt.Sprintf(" AND ended = $%d", i)
		args = append(args, *filter.Ended)
		i++
	}
	if filter.DateGTE != nil {
		query += fmt.Sprintf(" AND date >= $%d", i)
		args = append(args, *filter.DateGTE)
		i++
	}
	if filter.DateLT != nil {
		query += fmt.Sprintf(" AND date < $%d", i)
		args = append(args, *filter.DateLT)
		i++
	}

	if filter.Upcoming {
		query += " ORDER BY date ASC"
	} else {
		query += " ORDER BY date DESC"
	}

	if filter.Limit > 0 {
		query += fmt.Sprintf(" LIMIT $%d", i)
		args = append(args, filter.Limit)
		i++
	}
	_ = i

	rows, err := r.db.Query(context.Background(), query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []structures.Event
	for rows.Next() {
		e, err := scanEvent(rows)
		if err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	return events, rows.Err()
}

func (r *Event) MarkPastEventsAsEnded() error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE events SET ended=TRUE WHERE date < $1 AND ended=FALSE`, time.Now())
	return err
}
