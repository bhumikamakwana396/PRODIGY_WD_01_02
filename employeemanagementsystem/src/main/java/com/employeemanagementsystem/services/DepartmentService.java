package com.employeemanagementsystem.services;

import com.employeemanagementsystem.models.Department;
import com.employeemanagementsystem.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // ADD
    public Department addDepartment(Department department) {
        return departmentRepository.save(department);
    }

    // VIEW ALL
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // VIEW BY ID
    public Department getDepartmentById(String id) {

        Optional<Department> department =
                departmentRepository.findById(id);

        return department.orElse(null);
    }

    // UPDATE
    public Department updateDepartment(
            String id,
            Department department) {

        Optional<Department> existing =
                departmentRepository.findById(id);

        if (existing.isEmpty()) {
            return null;
        }

        Department oldDepartment = existing.get();

        oldDepartment.setName(department.getName());
        oldDepartment.setDescription(
                department.getDescription()
        );

        return departmentRepository.save(oldDepartment);
    }

    // DELETE
    public boolean deleteDepartment(String id) {

        if (!departmentRepository.existsById(id)) {
            return false;
        }

        departmentRepository.deleteById(id);

        return true;
    }
}