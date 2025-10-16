package com.workflow.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception e) {
        System.err.println("💥 GLOBAL EXCEPTION: " + e.getMessage());
        e.printStackTrace();
        
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal server error");
        response.put("message", e.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(500).body(response);
    }
}
