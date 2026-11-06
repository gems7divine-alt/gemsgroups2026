
package database

import (
    "context"
    "net"
    "net/url"
    "time"

    "github.com/jackc/pgx/v5/pgxpool"

    "BackEnd/config"
)

func ConnectDB(cfg *config.Config) (*pgxpool.Pool, error) {

    dbURL := url.URL{
        Scheme: "postgres",
        User: url.UserPassword(cfg.DBUser, cfg.DBPassword),
        Host: net.JoinHostPort(cfg.DBHost, cfg.DBPort),
        Path: "/" + cfg.DBName,
    }

    query := url.Values{}
    query.Set("sslmode", cfg.DBSSLMode)
    dbURL.RawQuery = query.Encode()

    poolConfig, err := pgxpool.ParseConfig(dbURL.String())
    if err != nil {
        return nil, err
    }

    poolConfig.MaxConns = 10
    poolConfig.MinConns = 1
    poolConfig.MaxConnLifetime = time.Hour

    ctx, cancel := context.WithTimeout(
        context.Background(),
        5*time.Second,
    )
    defer cancel()

    db, err := pgxpool.NewWithConfig(ctx, poolConfig)
    if err != nil {
        return nil, err
    }

    if err := db.Ping(ctx); err != nil {
        db.Close()
        return nil, err
    }

    return db, nil
}
