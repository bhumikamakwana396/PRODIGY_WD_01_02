package com.employeemanagementsystem.controller;

import com.employeemanagementsystem.models.Department;
import com.employeemanagementsystem.services.DepartmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@CrossOrigin(origins = "http://localhost:3000")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(
            DepartmentService departmentService) {

        this.departmentService = departmentService;
    }

    // ================= ADD =================

    @PostMapping
    public ResponseEntity<Department> addDepartment(
            @RequestBody Department department) {

        Department saved =
                departmentService.addDepartment(department);

        return new ResponseEntity<>(
                saved,
                HttpStatus.CREATED
        );
    }

    // ================= VIEW ALL =================

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {

        List<Department> departments =
                departmentService.getAllDepartments();

        return ResponseEntity.ok(departments);
    }

    // ================= VIEW BY ID =================

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(
            @PathVariable String id) {

        Department department =
                departmentService.getDepartmentById(id);

        if (department == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(department);
    }

    // ================= UPDATE =================

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable String id,
            @RequestBody Department department) {

        Department updated =
                departmentService.updateDepartment(
                        id,
                        department
                );

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    // ================= DELETE =================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(
            @PathVariable String id) {

        boolean deleted =
                departmentService.deleteDepartment(id);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Department not found");
        }

        return ResponseEntity.ok(
                "Department deleted successfully"
        );
    }
}