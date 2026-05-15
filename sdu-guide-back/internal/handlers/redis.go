package handlers

import (
	"context"
	"os"

	"github.com/go-redis/cache/v9"
	"github.com/redis/go-redis/v9"
)

func NewCache() (*cache.Cache, error) {
	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		addr = "localhost:6379"
	}
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "",
		DB:       0,
	})

	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		return nil, err
	}

	myCache := cache.New(&cache.Options{
		Redis: client,
	})
	return myCache, nil
}
