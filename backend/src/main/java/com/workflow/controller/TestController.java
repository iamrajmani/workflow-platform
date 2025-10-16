package com.workflow.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "status", "OK",
            "service", "Workflow Backend",
            "timestamp", System.currentTimeMillis()
        );
    }
    
    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody Map<String, Object> data) {
        return Map.of(
            "received", data,
            "timestamp", System.currentTimeMillis()
        );
    }
}