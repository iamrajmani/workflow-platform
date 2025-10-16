package com.workflow.service;

import com.workflow.model.User;
import com.workflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Authenticate user by username and password
    public Optional<User> authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password));
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get users by role
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    // Get users by department
    public List<User> getUsersByDepartment(String department) {
        return userRepository.findByDepartment(department);
    }

    // Create new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Update existing user
    public User updateUser(String id, User userDetails) throws Exception {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setUsername(userDetails.getUsername());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setRole(userDetails.getRole());
            existingUser.setDepartment(userDetails.getDepartment());
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                existingUser.setPassword(userDetails.getPassword());
            }
            return userRepository.save(existingUser);
        } else {
            throw new Exception("User not found with id: " + id);
        }
    }

    // Delete user by ID
    public void deleteUser(String id) {
        userRepository.findById(id).ifPresent(userRepository::delete);
    }

    // Get user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // Get user by username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
