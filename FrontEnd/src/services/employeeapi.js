import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all employees
export const getEmployees = async () => {
  const response = await API.get("/employees");
  return response.data;
};

// Add employee
export const createEmployee = async (employee) => {
  const response = await API.post("/employees", employee);
  return response.data;
};

// Update employee
export const updateEmployee = async (id, employee) => {
  const response = await API.put(
    `/employees/${encodeURIComponent(id)}`,
    employee
  );
  return response.data;
};

// Delete employee
export const deleteEmployee = async (employeeID) => {
    console.log("Sending DELETE request:", employeeID);

    const response = await API.delete(
        `/employees/${encodeURIComponent(employeeID)}`
    );

    return response.data;
};