package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"

	"BackEnd/config"
	"BackEnd/database"
	"BackEnd/repository"
	"BackEnd/routes"
)



func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found; using environment variables")
	}

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Configuration error: ", err)
	}

	db, err := database.ConnectDB(cfg)
	if err != nil {
		log.Fatal("Database connection failed: ", err)
	}
	defer db.Close()

	repo := repository.NewEmployeeRepository(db)

	router := routes.SetupRoutes(repo)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("GEMS Groups backend running on port:", port)

	if err := router.Run(":" + port); err != nil {
		log.Fatal("Server failed:", err)
	}
}
