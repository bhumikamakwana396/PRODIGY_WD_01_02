package com.employeemanagementsystem.repository;

import com.employeemanagementsystem.models.Leave;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveRepository extends MongoRepository<Leave, String> {
}