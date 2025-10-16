import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerDashboard = () => {
  const [pendingWorkflows, setPendingWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const managerDepartment = user?.department;
  const managerUsername = user?.username;

  useEffect(() => {
    if (!managerDepartment) {
      setError("Manager department not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchPendingWorkflows = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/workflows/pending/${managerDepartment}`
        );
        setPendingWorkflows(response.data);
      } catch (err) {
        console.error("Error fetching workflows:", err);
        setError("Failed to fetch pending workflows.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingWorkflows();
  }, [managerDepartment]);

  const updateStatus = async (workflowId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/workflows/${workflowId}/status`,
        { status, managerUsername }
      );
      // Update the local state after approval/rejection
      setPendingWorkflows((prev) =>
        prev.filter((w) => w.id !== workflowId)
      );
      alert(`Workflow ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update workflow status.");
    }
  };

  if (loading) return <p>Loading pending workflows...</p>;
  if (error) return <p>{error}</p>;
  if (pendingWorkflows.length === 0)
    return <p>No pending workflows in your department.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Manager Dashboard</h2>
      <p>Welcome, {user?.username}! Manage workflows below.</p>

      <h3>Pending Workflows</h3>
      <ul>
        {pendingWorkflows.map((workflow) => (
          <li key={workflow.id} style={{ marginBottom: "1rem" }}>
            <strong>{workflow.title}</strong> - {workflow.status}
            <p>{workflow.description}</p>
            {workflow.amount && <p>Amount: ${workflow.amount}</p>}
            <p>Submitted by: {workflow.submittedBy.username}</p>
            <button
              onClick={() => updateStatus(workflow.id, "APPROVED")}
              style={{ marginRight: "1rem" }}
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus(workflow.id, "REJECTED")}
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerDashboard;
