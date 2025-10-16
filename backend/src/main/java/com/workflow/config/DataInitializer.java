package com.workflow.config;

import com.workflow.model.User;
import com.workflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        userRepository.deleteAll();
        
        System.out.println("🚀 Creating users...");
        
        // Create users with PLAIN TEXT passwords
        User admin = new User("admin", "admin@company.com", "admin123", "ADMIN", "IT");
        admin.setPassword("admin123");
        userRepository.save(admin);
        
        User manager = new User("manager", "manager@company.com", "manager123", "MANAGER", "Engineering");
        manager.setPassword("manager123");
        userRepository.save(manager);
        
        User user = new User("user", "user@company.com", "user123", "USER", "Engineering");
        user.setPassword("user123");
        userRepository.save(user);
        
        System.out.println("✅ Users created!");
    }
}