package com.workflow.repository;

import com.workflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Find user by username
    Optional<User> findByUsername(String username);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find users by role
    List<User> findByRole(String role);

    // Find users by department
    List<User> findByDepartment(String department);

    // Check if a username already exists
    boolean existsByUsername(String username);

    // Check if an email already exists
    boolean existsByEmail(String email);
}
