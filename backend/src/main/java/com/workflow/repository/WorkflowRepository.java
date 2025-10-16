package com.workflow.repository;

import com.workflow.model.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, String> {

    List<Workflow> findBySubmittedByUsername(String username);

    List<Workflow> findByDepartment(String department);

    List<Workflow> findByStatus(String status);

    @Query("SELECT w FROM Workflow w WHERE w.department = ?1 AND w.status = 'PENDING'")
    List<Workflow> findPendingByDepartment(String department);

    @Query("SELECT w.type, COUNT(w) FROM Workflow w GROUP BY w.type")
    List<Object[]> countByType();

    @Query("SELECT w.status, COUNT(w) FROM Workflow w GROUP BY w.status")
    List<Object[]> countByStatus();
}
