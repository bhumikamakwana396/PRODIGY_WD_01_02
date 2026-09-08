package com.employeemanagementsystem.services;

import com.employeemanagementsystem.models.Leave;
import com.employeemanagementsystem.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;

    public LeaveService(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    public Leave addLeave(Leave leave) {
        return leaveRepository.save(leave);
    }

    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    public Optional<Leave> getLeaveById(String id) {
        return leaveRepository.findById(id);
    }

    public Leave updateLeave(String id, Leave leave) {

        Optional<Leave> existing =
                leaveRepository.findById(id);

        if (existing.isEmpty()) {
            return null;
        }

        leave.setId(id);

        return leaveRepository.save(leave);
    }

    public boolean deleteLeave(String id) {

        if (!leaveRepository.existsById(id)) {
            return false;
        }

        leaveRepository.deleteById(id);

        return true;
    }
}