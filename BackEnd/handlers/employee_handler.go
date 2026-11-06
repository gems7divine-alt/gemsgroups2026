package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"

    "BackEnd/models"
    "BackEnd/repository"
)

type EmployeeHandler struct {
    Repo *repository.EmployeeRepository
}

func NewEmployeeHandler(repo *repository.EmployeeRepository) *EmployeeHandler {
    return &EmployeeHandler{Repo: repo}
}

// POST /api/employees
func (h *EmployeeHandler) Create(c *gin.Context) {
    var req models.EmployeeRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Invalid employee details",
        })
        return
    }

    if err := h.Repo.Create(req); err != nil {
        c.JSON(http.StatusConflict, gin.H{
            "error": "Employee ID or email already exists",
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "Employee created successfully",
        "employee": req,
    })
}

// GET /api/employees
func (h *EmployeeHandler) GetAll(c *gin.Context) {
    employees, err := h.Repo.GetAll()

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Unable to fetch employees",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "employees": employees,
    })
}

// PUT /api/employees/:id
func (h *EmployeeHandler) Update(c *gin.Context) {
    id := c.Param("id")

    var req models.EmployeeRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Invalid employee details",
        })
        return
    }

    if err := h.Repo.Update(id, req); err != nil {
        if err == repository.ErrNotFound {
            c.JSON(http.StatusNotFound, gin.H{
                "error": "Employee not found",
            })
            return
        }

        c.JSON(http.StatusConflict, gin.H{
            "error": "Unable to update employee; check duplicate ID or email",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Employee updated successfully",
    })
}

// DELETE /api/employees/:id
func (h *EmployeeHandler) DeleteEmployee(c *gin.Context) {

    employeeID := c.Param("id")

    if employeeID == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Employee ID is required",
        })
        return
    }

    err := h.Repo.DeleteEmployee(
        c.Request.Context(),
        employeeID,
    )

    if err != nil {
        if err.Error() == "employee not found" {
            c.JSON(http.StatusNotFound, gin.H{
                "error": "Employee not found",
            })
            return
        }

        c.JSON(http.StatusInternalServerError, gin.H{
            "error": err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Employee deleted successfully",
        "employee_id": employeeID,
    })
}