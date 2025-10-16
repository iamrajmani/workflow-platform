package com.workflow.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.workflow.model.Workflow;

@Service
public class AIService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String ML_SERVICE_URL = "http://localhost:8000";
    
    public Map<String, Object> getApprovalPrediction(Workflow workflow) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("title", workflow.getTitle());
            request.put("description", workflow.getDescription());
            request.put("type", workflow.getType());
            request.put("amount", workflow.getAmount());
            request.put("department", workflow.getDepartment());
            
            Map response = restTemplate.postForObject(
                ML_SERVICE_URL + "/api/predict-approval", 
                request, 
                Map.class
            );
            return response != null ? response : getFallbackPrediction(workflow);
        } catch (Exception e) {
            return getFallbackPrediction(workflow);
        }
    }
    
    // Add this method for analytics
    public Map<String, Object> getAnalyticsData() {
        try {
            Map response = restTemplate.getForObject(
                ML_SERVICE_URL + "/api/analytics", 
                Map.class
            );
            return response != null ? response : getFallbackAnalytics();
        } catch (Exception e) {
            System.err.println("Error fetching analytics from ML service: " + e.getMessage());
            return getFallbackAnalytics();
        }
    }
    
    private Map<String, Object> getFallbackPrediction(Workflow workflow) {
        Map<String, Object> prediction = new HashMap<>();
        double baseScore = 0.5;
        
        if (workflow.getAmount() != null) {
            if (workflow.getAmount() < 1000) baseScore += 0.3;
            else if (workflow.getAmount() > 5000) baseScore -= 0.2;
        }
        
        switch (workflow.getType()) {
            case "LEAVE": baseScore += 0.1; break;
            case "BUDGET": baseScore -= 0.1; break;
            case "PURCHASE": baseScore += 0.05; break;
        }
        
        double probability = Math.max(0, Math.min(1, baseScore));
        prediction.put("approvalProbability", probability);
        prediction.put("suggestion", probability > 0.6 ? "APPROVE" : "REVIEW");
        prediction.put("confidence", 0.85);
        prediction.put("fallback", true);
        
        return prediction;
    }
    
    // Add fallback analytics data
    private Map<String, Object> getFallbackAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        Map<String, Object> summary = new HashMap<>();
        
        summary.put("totalWorkflows", 156);
        summary.put("pendingWorkflows", 23);
        summary.put("approvedWorkflows", 98);
        summary.put("rejectedWorkflows", 35);
        summary.put("approvalRate", 63);
        summary.put("avgProcessingTime", "2.3 days");
        summary.put("totalAmountProcessed", 452800);
        
        analytics.put("summary", summary);
        analytics.put("fallback", true);
        
        return analytics;
    }
}