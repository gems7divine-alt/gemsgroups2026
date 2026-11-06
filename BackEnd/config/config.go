package config

import (
    "os"
    "strconv"

    "github.com/joho/godotenv"
)

type Config struct {
    Port         string
    DBHost       string
    DBPort       string
    DBUser       string
    DBPassword   string
    DBName       string
    DBSSLMode    string
    JWTSecret    string
    FrontendURL  string
}

func LoadConfig() (*Config, error) {

    _ = godotenv.Load()

    cfg := &Config{
        Port:        getEnv("PORT", "8080"),
        DBHost:      getEnv("DB_HOST", "localhost"),
        DBPort:      getEnv("DB_PORT", "5432"),
        DBUser:      getEnv("DB_USER", "postgres"),
        DBPassword:  os.Getenv("DB_PASSWORD"),
        DBName:      getEnv("DB_NAME", "gemsgroups"),
        DBSSLMode:   getEnv("DB_SSLMODE", "disable"),
        JWTSecret:   os.Getenv("JWT_SECRET"),
        FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),
    }

    if cfg.DBPassword == "" {
        return nil, strconv.ErrSyntax
    }

    if cfg.JWTSecret == "" {
        return nil, strconv.ErrSyntax
    }

    return cfg, nil
}

func getEnv(key, fallback string) string {
    value := os.Getenv(key)

    if value == "" {
        return fallback
    }

    return value
}