package com.employeemanagementsystem.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.employeemanagementsystem.models.Users;
import com.employeemanagementsystem.services.UserServices;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")

public class UserController {

    @Autowired
    private UserServices userServices;

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@RequestBody Users user) {

        Users savedUser = userServices.signUp(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Users request) {

    try {
        Users user = userServices.login(request.getEmail(), request.getPassword());

        return ResponseEntity.ok(user);

    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}