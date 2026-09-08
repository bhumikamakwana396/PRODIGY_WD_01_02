package com.employeemanagementsystem.services;

import com.employeemanagementsystem.models.Employee;
import com.employeemanagementsystem.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // ADD
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // VIEW ALL
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // VIEW BY ID
    public Employee getEmployeeById(String id) {
        Optional<Employee> employee =
                employeeRepository.findById(id);

        return employee.orElse(null);
    }

    // UPDATE
    public Employee updateEmployee(String id, Employee employee) {

        Optional<Employee> existingEmployee =
                employeeRepository.findById(id);

        if (existingEmployee.isEmpty()) {
            return null;
        }

        Employee oldEmployee = existingEmployee.get();

        oldEmployee.setFirstname(employee.getFirstname());
        oldEmployee.setLastname(employee.getLastname());
        oldEmployee.setEmail(employee.getEmail());
        oldEmployee.setDepartment(employee.getDepartment());
        oldEmployee.setSalary(employee.getSalary());

        return employeeRepository.save(oldEmployee);
    }

    // DELETE
    public boolean deleteEmployee(String id) {

        if (!employeeRepository.existsById(id)) {
            return false;
        }

        employeeRepository.deleteById(id);
        return true;
    }
}