package com.workflow.controller;

import com.workflow.model.User;
import com.workflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            
            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
            }
            
            // Try database authentication
            Optional<User> userOpt = userService.authenticate(username, password);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setPassword(null);
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", "token-" + System.currentTimeMillis());
                response.put("user", user);
                response.put("message", "Login successful");
                
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error"));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "OK"));
    }
}