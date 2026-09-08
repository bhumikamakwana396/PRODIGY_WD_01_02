package com.employeemanagementsystem.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")   // ✅ correct position
    public String Home() {
        return "Tomcat started on port 8081 Welcome to EMS 🚀";
    }
}
