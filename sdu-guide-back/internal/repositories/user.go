package repositories

import (
	"context"
	"fmt"
	"sdu-guide/internal/structures"

	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	db *pgxpool.Pool
}

func newUserRepo(db *pgxpool.Pool) *User {
	return &User{db: db}
}

const userSelect = `SELECT id, username, email, password_hash, first_name, last_name, registration_date, last_login, image_hash FROM users`

func scanUser(row interface{ Scan(...any) error }) (structures.User, error) {
	var u structures.User
	err := row.Scan(&u.ID, &u.Username, &u.Email, &u.PasswordHash, &u.FirstName, &u.LastName, &u.RegistrationDate, &u.LastLogin, &u.ImageHash)
	return u, err
}

func (r *User) Get(id int64) (structures.User, error) {
	row := r.db.QueryRow(context.Background(), userSelect+` WHERE id = $1`, id)
	return scanUser(row)
}

func (r *User) GetBy(field string, value interface{}) (structures.User, error) {
	col, err := userFieldToColumn(field)
	if err != nil {
		return structures.User{}, err
	}
	row := r.db.QueryRow(context.Background(), fmt.Sprintf(userSelect+` WHERE %s = $1`, col), value)
	return scanUser(row)
}

func userFieldToColumn(field string) (string, error) {
	switch field {
	case "_id", "id":
		return "id", nil
	case "email":
		return "email", nil
	case "username":
		return "username", nil
	}
	return "", fmt.Errorf("unknown user field: %s", field)
}

func (r *User) Create(user structures.User) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO users (username, email, password_hash, first_name, last_name, registration_date, last_login, image_hash)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		user.Username, user.Email, user.PasswordHash, user.FirstName, user.LastName,
		user.RegistrationDate, user.LastLogin, user.ImageHash)
	return err
}

func (r *User) Upadte(user structures.User) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE users SET username=$1, email=$2, password_hash=$3, first_name=$4, last_name=$5, last_login=$6, image_hash=$7 WHERE id=$8`,
		user.Username, user.Email, user.PasswordHash, user.FirstName, user.LastName,
		user.LastLogin, user.ImageHash, user.ID)
	return err
}
