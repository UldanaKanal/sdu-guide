package repositories

import (
	"context"
	"sdu-guide/internal/structures"

	"github.com/jackc/pgx/v5/pgxpool"
)

type File struct {
	db *pgxpool.Pool
}

func newFileRepo(db *pgxpool.Pool) *File {
	return &File{db: db}
}

func (r *File) CreateFile(file structures.File) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO files (hash, name, path, file_type) VALUES ($1, $2, $3, $4)`,
		file.Hash, file.Name, file.Path, file.FileType)
	return err
}

func (r *File) UpadteXLSX(file structures.File) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE files SET name=$1, path=$2, file_type=$3 WHERE id=$4`,
		file.Name, file.Path, file.FileType, file.ID)
	return err
}

func (r *File) GetFile(hash string) (structures.File, error) {
	var f structures.File
	err := r.db.QueryRow(context.Background(),
		`SELECT id, hash, name, path, file_type FROM files WHERE hash=$1`, hash).
		Scan(&f.ID, &f.Hash, &f.Name, &f.Path, &f.FileType)
	return f, err
}

func (r *File) Delete(hash string) error {
	_, err := r.db.Exec(context.Background(), `DELETE FROM files WHERE hash=$1`, hash)
	return err
}
