package com.employeemanagementsystem.repository;

import com.employeemanagementsystem.models.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository
        extends MongoRepository<Attendance, String> {

}