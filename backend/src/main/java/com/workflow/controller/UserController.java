package com.workflow.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workflow.model.User;
import com.workflow.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List<User> getAllUsers() {
        System.out.println("📋 Fetching all users from database");
        List<User> users = userService.getAllUsers();
        users.forEach(user -> user.setPassword(null));
        System.out.println("Found " + users.size() + " users");
        return users;
    }
    
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        System.out.println("Fetching users by role: " + role);
        List<User> users = userService.getUsersByRole(role);
        users.forEach(user -> user.setPassword(null));
        return users;
    }
    
    @GetMapping("/department/{department}")
    public List<User> getUsersByDepartment(@PathVariable String department) {
        System.out.println("Fetching users by department: " + department);
        List<User> users = userService.getUsersByDepartment(department);
        users.forEach(user -> user.setPassword(null));
        return users;
    }
    
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        System.out.println("🆕 Creating new user: " + user.getUsername());
        try {
            User createdUser = userService.createUser(user);
            createdUser.setPassword(null);
            System.out.println("User created successfully: " + createdUser.getUsername());
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User user) {
        System.out.println("Updating user: " + userId);
        try {
            User updatedUser = userService.updateUser(userId, user);
            updatedUser.setPassword(null);
            System.out.println("User updated successfully: " + updatedUser.getUsername());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        System.out.println("🗑️ Deleting user: " + userId);
        try {
            userService.deleteUser(userId);
            System.out.println("User deleted successfully: " + userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        System.out.println("Fetching user by ID: " + userId);
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            user.get().setPassword(null);
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
