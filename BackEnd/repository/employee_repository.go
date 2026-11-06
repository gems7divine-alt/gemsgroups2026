package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"BackEnd/models"
)

var ErrNotFound = errors.New("employee not found")

type EmployeeRepository struct {
	DB *pgxpool.Pool
}

func (r *EmployeeRepository) Delete(id string) any {
	panic("unimplemented")
}

func NewEmployeeRepository(db *pgxpool.Pool) *EmployeeRepository {
	return &EmployeeRepository{DB: db}
}

func (r *EmployeeRepository) Create(emp models.EmployeeRequest) error {
	query := `
        INSERT INTO employees
        (employee_id, username, email)
        VALUES ($1, $2, $3)
    `

	_, err := r.DB.Exec(
		context.Background(),
		query,
		emp.EmployeeID,
		emp.Username,
		emp.Email,
	)

	return err
}

func (r *EmployeeRepository) GetAll() ([]models.Employee, error) {
	query := `
        SELECT employee_id, username, email,
               role, created_at, updated_at
        FROM employees
        ORDER BY created_at DESC
    `

	rows, err := r.DB.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	employees := []models.Employee{}

	for rows.Next() {
		var emp models.Employee

		err := rows.Scan(
			&emp.EmployeeID,
			&emp.Username,
			&emp.Email,
			&emp.Role,
			&emp.CreatedAt,
			&emp.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		employees = append(employees, emp)
	}

	return employees, rows.Err()
}

func (r *EmployeeRepository) Update(
	id string,
	emp models.EmployeeRequest,
) error {
	query := `
        UPDATE employees
        SET employee_id = $1,
            username = $2,
            email = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE employee_id = $4
    `

	result, err := r.DB.Exec(
		context.Background(),
		query,
		emp.EmployeeID,
		emp.Username,
		emp.Email,
		id,
	)

	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}

func (r *EmployeeRepository) DeleteEmployee(
	ctx context.Context,
	employeeID string,
) error {

	query := `DELETE FROM employees WHERE employee_id = $1`

	result, err := r.DB.Exec(ctx, query, employeeID)

	if err != nil {
		return fmt.Errorf("database delete error: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("employee not found")
	}

	return nil
}
