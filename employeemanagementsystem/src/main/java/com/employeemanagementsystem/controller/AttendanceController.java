package com.employeemanagementsystem.controller;

import com.employeemanagementsystem.models.Attendance;
import com.employeemanagementsystem.services.AttendanceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }

    // ================= ADD =================

    @PostMapping
    public ResponseEntity<Attendance> addAttendance(
            @RequestBody Attendance attendance) {

        Attendance saved =
                attendanceService.addAttendance(attendance);

        return new ResponseEntity<>(
                saved,
                HttpStatus.CREATED
        );
    }

    // ================= VIEW ALL =================

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        List<Attendance> attendance =
                attendanceService.getAllAttendance();

        return ResponseEntity.ok(attendance);
    }

    // ================= VIEW BY ID =================

    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(
            @PathVariable String id) {

        Attendance attendance =
                attendanceService.getAttendanceById(id);

        if (attendance == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(attendance);
    }

    // ================= UPDATE =================

    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable String id,
            @RequestBody Attendance attendance) {

        Attendance updated =
                attendanceService.updateAttendance(
                        id,
                        attendance
                );

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    // ================= DELETE =================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttendance(
            @PathVariable String id) {

        boolean deleted =
                attendanceService.deleteAttendance(id);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Attendance not found");
        }

        return ResponseEntity.ok(
                "Attendance deleted successfully"
        );
    }
}