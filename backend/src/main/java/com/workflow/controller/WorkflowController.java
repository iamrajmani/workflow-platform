package com.workflow.controller;

import com.workflow.model.User;
import com.workflow.model.Workflow;
import com.workflow.service.UserService;
import com.workflow.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/workflows")
@CrossOrigin(origins = "*")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Workflow> getAllWorkflows() {
        return workflowService.getAllWorkflows();
    }

    @GetMapping("/user/{username}")
    public List<Workflow> getUserWorkflows(@PathVariable String username) {
        return workflowService.getUserWorkflows(username);
    }

    @GetMapping("/department/{department}")
    public List<Workflow> getDepartmentWorkflows(@PathVariable String department) {
        return workflowService.getDepartmentWorkflows(department);
    }

    @GetMapping("/pending/{department}")
    public List<Workflow> getPendingWorkflows(@PathVariable String department) {
        return workflowService.getPendingWorkflows(department);
    }

    @PostMapping("/{username}")
    public ResponseEntity<?> createWorkflow(@PathVariable String username, @RequestBody Workflow workflow) {
        try {
            Optional<User> userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found: " + username));
            }
            Workflow created = workflowService.createWorkflow(workflow, username);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{workflowId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String workflowId, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        String managerUsername = request.get("managerUsername");

        if (status == null || managerUsername == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing status or managerUsername"));
        }

        try {
            Optional<Workflow> updatedWorkflow = workflowService.updateWorkflowStatus(workflowId, status, managerUsername);
            return updatedWorkflow.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/analytics")
    public Object getAnalytics() {
        return workflowService.getAnalytics();
    }


    @GetMapping("/{workflowId}/ai-prediction")
    public Object getAIPrediction(@PathVariable String workflowId) {
        return workflowService.getAIPrediction(workflowId);
    }
}
