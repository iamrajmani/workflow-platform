package com.workflow.service;

import com.workflow.model.Workflow;
import com.workflow.model.User;
import com.workflow.repository.WorkflowRepository;
import com.workflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class WorkflowService {

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AIService aiService;

    public Workflow createWorkflow(Workflow workflow, String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + username);
        }

        User user = userOpt.get();
        workflow.setSubmittedBy(user);
        workflow.setDepartment(user.getDepartment());
        workflow.setStatus("PENDING");
        workflow.setCreatedAt(LocalDateTime.now());
        workflow.setUpdatedAt(LocalDateTime.now());

        return workflowRepository.save(workflow);
    }

    public List<Workflow> getAllWorkflows() {
        return workflowRepository.findAll();
    }

    public List<Workflow> getUserWorkflows(String username) {
        return workflowRepository.findBySubmittedByUsername(username);
    }

    public List<Workflow> getDepartmentWorkflows(String department) {
        return workflowRepository.findByDepartment(department);
    }

    public List<Workflow> getPendingWorkflows(String department) {
        return workflowRepository.findPendingByDepartment(department);
    }

    public Optional<Workflow> updateWorkflowStatus(String workflowId, String status, String managerUsername) {
        Optional<Workflow> workflowOpt = workflowRepository.findById(workflowId);
        Optional<User> managerOpt = userRepository.findByUsername(managerUsername);

        if (workflowOpt.isPresent() && managerOpt.isPresent()) {
            Workflow workflow = workflowOpt.get();
            workflow.setStatus(status);
            workflow.setApprovedBy(managerOpt.get());
            workflow.setUpdatedAt(LocalDateTime.now());
            workflowRepository.save(workflow);
            return Optional.of(workflow);
        }
        return Optional.empty();
    }

    public Map<String, Object> getAnalytics() {
        try {
            Map<String, Object> aiAnalytics = aiService.getAnalyticsData();
            if (aiAnalytics != null && !aiAnalytics.containsKey("fallback")) {
                return aiAnalytics;
            }
        } catch (Exception e) {
            System.err.println("Error fetching analytics from AI service: " + e.getMessage());
        }
        return generateDatabaseAnalytics();
    }

    private Map<String, Object> generateDatabaseAnalytics() {
        long totalWorkflows = workflowRepository.count();
        long pendingWorkflows = workflowRepository.findByStatus("PENDING").size();
        long approvedWorkflows = workflowRepository.findByStatus("APPROVED").size();
        long rejectedWorkflows = workflowRepository.findByStatus("REJECTED").size();
        double approvalRate = totalWorkflows > 0 ? (double) approvedWorkflows / totalWorkflows * 100 : 0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalWorkflows", totalWorkflows);
        summary.put("pendingWorkflows", pendingWorkflows);
        summary.put("approvedWorkflows", approvedWorkflows);
        summary.put("rejectedWorkflows", rejectedWorkflows);
        summary.put("approvalRate", Math.round(approvalRate));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("summary", summary);
        analytics.put("source", "database");
        return analytics;
    }

    public Object getAIPrediction(String workflowId) {
        Optional<Workflow> workflowOpt = workflowRepository.findById(workflowId);
        if (workflowOpt.isPresent()) {
            return aiService.getApprovalPrediction(workflowOpt.get());
        }
        throw new RuntimeException("Workflow not found: " + workflowId);
    }
}
