CREATE TABLE IF NOT EXISTS users (
    id                BIGSERIAL PRIMARY KEY,
    username          TEXT NOT NULL DEFAULT '',
    email             TEXT UNIQUE NOT NULL,
    password_hash     TEXT NOT NULL DEFAULT '',
    first_name        TEXT NOT NULL DEFAULT '',
    last_name         TEXT NOT NULL DEFAULT '',
    registration_date TIMESTAMPTZ,
    last_login        TIMESTAMPTZ,
    image_hash        TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS rooms (
    id            BIGSERIAL PRIMARY KEY,
    block         TEXT NOT NULL DEFAULT '',
    number        BIGINT NOT NULL DEFAULT 0,
    sef           TEXT UNIQUE NOT NULL,
    schedule_hash TEXT NOT NULL DEFAULT '',
    deleted       BOOLEAN NOT NULL DEFAULT FALSE,
    updated       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS files (
    id        BIGSERIAL PRIMARY KEY,
    hash      TEXT UNIQUE NOT NULL,
    name      TEXT NOT NULL DEFAULT '',
    path      TEXT NOT NULL DEFAULT '',
    file_type TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS events (
    id         BIGSERIAL PRIMARY KEY,
    name       TEXT NOT NULL DEFAULT '',
    date       TIMESTAMPTZ,
    place      TEXT NOT NULL DEFAULT '',
    start_time TEXT NOT NULL DEFAULT '',
    end_time   TEXT NOT NULL DEFAULT '',
    ended      BOOLEAN NOT NULL DEFAULT FALSE,
    hash       TEXT NOT NULL DEFAULT '',
    short_name TEXT NOT NULL DEFAULT ''
);
