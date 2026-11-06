package models

import "time"

type Employee struct {
    EmployeeID string    `json:"employeeId"`
    Username   string    `json:"username"`
    Email      string    `json:"email"`
    Role       string    `json:"role"`
    CreatedAt  time.Time `json:"createdAt"`
    UpdatedAt  time.Time `json:"updatedAt"`
}

type EmployeeRequest struct {
    EmployeeID string `json:"employeeId" binding:"required"`
    Username   string `json:"username" binding:"required"`
    Email      string `json:"email" binding:"required,email"`
}