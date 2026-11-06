package routes

import (
    "os"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"

    "BackEnd/handlers"
    "BackEnd/repository"
)

func SetupRoutes(repo *repository.EmployeeRepository) *gin.Engine {
    router := gin.Default()

    router.Use(cors.New(cors.Config{
        AllowOrigins: []string{
            os.Getenv("FRONTEND_URL"),
        },
        AllowMethods: []string{
            "GET", "POST", "PUT", "DELETE", "OPTIONS",
        },
        AllowHeaders: []string{
            "Origin", "Content-Type", "Authorization",
        },
        AllowCredentials: true,
    }))

    employeeHandler := handlers.NewEmployeeHandler(repo)

    api := router.Group("/api")
    {
        api.GET("/health", func(c *gin.Context) {
            c.JSON(200, gin.H{
                "message": "GEMS Groups API is running",
            })
        })

        api.POST("/employees", employeeHandler.Create)
        api.GET("/employees", employeeHandler.GetAll)
        api.PUT("/employees/:id", employeeHandler.Update)
        api.DELETE("/employees/:id", employeeHandler.DeleteEmployee)
    }

    return router
}