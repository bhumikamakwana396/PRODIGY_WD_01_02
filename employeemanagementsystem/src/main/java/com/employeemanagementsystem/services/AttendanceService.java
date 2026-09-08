package com.employeemanagementsystem.services;

import com.employeemanagementsystem.models.Attendance;
import com.employeemanagementsystem.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository) {

        this.attendanceRepository = attendanceRepository;
    }

    // ================= ADD =================

    public Attendance addAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    // ================= VIEW ALL =================

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // ================= VIEW BY ID =================

    public Attendance getAttendanceById(String id) {

        Optional<Attendance> attendance =
                attendanceRepository.findById(id);

        return attendance.orElse(null);
    }

    // ================= UPDATE =================

    public Attendance updateAttendance(
            String id,
            Attendance attendance) {

        Optional<Attendance> existing =
                attendanceRepository.findById(id);

        if (existing.isEmpty()) {
            return null;
        }

        Attendance oldAttendance = existing.get();

        oldAttendance.setEmployeeId(
                attendance.getEmployeeId()
        );

        oldAttendance.setEmployeeName(
                attendance.getEmployeeName()
        );

        oldAttendance.setDate(
                attendance.getDate()
        );

        oldAttendance.setStatus(
                attendance.getStatus()
        );

        return attendanceRepository.save(oldAttendance);
    }

    // ================= DELETE =================

    public boolean deleteAttendance(String id) {

        if (!attendanceRepository.existsById(id)) {
            return false;
        }

        attendanceRepository.deleteById(id);

        return true;
    }
}