import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import './Analytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = ({ user, onLogout }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data in case API is not available
  const fallbackData = {
    summary: {
      totalWorkflows: 156,
      pendingWorkflows: 23,
      approvedWorkflows: 98,
      rejectedWorkflows: 35,
      approvalRate: 63,
      avgProcessingTime: "2.3 days",
      totalAmountProcessed: 452800
    },
    charts: {
      statusDistribution: {
        labels: ["Approved", "Pending", "Rejected", "Under Review"],
        datasets: [
          {
            data: [98, 23, 35, 12],
            backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"],
            borderWidth: 2,
            borderColor: "#ffffff"
          }
        ]
      },
      departmentWorkflows: {
        labels: ["Engineering", "Finance", "HR", "IT", "Operations", "Marketing", "Sales"],
        datasets: [
          {
            label: "Workflows by Department",
            data: [45, 32, 28, 25, 18, 15, 13],
            backgroundColor: [
              "#3b82f6", "#ef4444", "#10b981", "#f59e0b", 
              "#8b5cf6", "#06b6d4", "#f97316"
            ],
            borderWidth: 1
          }
        ]
      },
      monthlyTrends: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Approved",
            data: [45, 52, 48, 61, 55, 58, 62, 65, 59, 63, 67, 71],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4
          },
          {
            label: "Rejected",
            data: [12, 15, 18, 14, 16, 13, 11, 9, 12, 10, 8, 6],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4
          }
        ]
      },
      approvalByDepartment: {
        labels: ["Engineering", "Finance", "HR", "IT", "Operations"],
        datasets: [
          {
            label: "Approval Rate (%)",
            data: [78, 65, 82, 71, 60],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(6, 182, 212, 0.8)"
            ],
            borderWidth: 1
          }
        ]
      },
      amountDistribution: {
        labels: ["$0-500", "$501-2000", "$2001-5000", "$5001-10000", "$10001+"],
        datasets: [
          {
            label: "Workflows by Amount",
            data: [45, 38, 42, 25, 6],
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "#1d4ed8",
            borderWidth: 2
          }
        ]
      },
      typeDistribution: {
        labels: ["LEAVE", "PURCHASE", "BUDGET", "PROJECT", "TRAVEL", "EXPENSE"],
        datasets: [
          {
            label: "Workflows by Type",
            data: [42, 38, 35, 25, 12, 4],
            backgroundColor: "#3b82f6",
            borderColor: "#1d4ed8",
            borderWidth: 2
          }
        ]
      }
    },
    trends: {
      weeklyComparison: {
        currentWeek: 45,
        previousWeek: 38,
        change: "+18%",
        isPositive: true
      },
      topPerformers: [
        { department: "HR", approvalRate: 82, processingTime: "1.2 days" },
        { department: "Engineering", approvalRate: 78, processingTime: "1.8 days" },
        { department: "IT", approvalRate: 71, processingTime: "2.1 days" }
      ],
      efficiencyMetrics: {
        avgResponseTime: "6.2 hours",
        slaCompliance: 94,
        automationRate: 67,
        userSatisfaction: 4.2
      }
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching analytics from Spring Boot backend...');
      
      // Call Spring Boot backend - this is the correct endpoint
      const response = await axios.get('http://localhost:8080/api/workflows/analytics', {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Analytics data received from Spring Boot:', response.data);
      setAnalyticsData(response.data);
      
    } catch (err) {
      console.error('❌ Spring Boot analytics error:', err);
      
      // If Spring Boot fails, try FastAPI directly as fallback
      try {
        console.log('🔄 Trying FastAPI direct connection as fallback...');
        const fastApiResponse = await axios.get('http://localhost:8000/api/analytics', {
          timeout: 5000
        });
        setAnalyticsData(fastApiResponse.data);
        setError('Connected to AI service directly (Spring Boot unavailable)');
      } catch (fastApiErr) {
        console.error('❌ FastAPI analytics error:', fastApiErr);
        setError('Both backend services unavailable. Using demo data.');
        setAnalyticsData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="analytics-container">
        <div className="error-state">
          <h3>No Data Available</h3>
          <p>Unable to load analytics data. Please try again later.</p>
          <button onClick={fetchAnalytics} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, charts, trends } = analyticsData;

  // Chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="analytics-container">
      {/* Header */}
      <header className="analytics-header">
        <div className="header-content">
          <h1>Analytics Dashboard</h1>
          <div className="header-actions">
            <span className="user-role">{user.role}</span>
            <button onClick={onLogout} className="logout-button">Sign Out</button>
          </div>
        </div>
      </header>

      {error && (
        <div className="warning-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <section className="summary-section">
        <div className="summary-grid">
          <div className="summary-card primary">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Total Workflows</h3>
              <div className="card-value">{summary.totalWorkflows}</div>
            </div>
          </div>
          
          <div className="summary-card success">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h3>Approval Rate</h3>
              <div className="card-value">{summary.approvalRate}%</div>
            </div>
          </div>
          
          <div className="summary-card warning">
            <div className="card-icon">⏱️</div>
            <div className="card-content">
              <h3>Avg Processing Time</h3>
              <div className="card-value">{summary.avgProcessingTime}</div>
            </div>
          </div>
          
          <div className="summary-card info">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Amount</h3>
              <div className="card-value">${(summary.totalAmountProcessed / 1000).toFixed(0)}K</div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="charts-grid">
          {/* Status Distribution Pie Chart */}
          <div className="chart-card">
            <h3>Workflow Status Distribution</h3>
            <div className="chart-container">
              <Doughnut data={charts.statusDistribution} options={pieOptions} />
            </div>
          </div>

          {/* Department Workflows Bar Chart */}
          <div className="chart-card">
            <h3>Workflows by Department</h3>
            <div className="chart-container">
              <Bar data={charts.departmentWorkflows} options={barOptions} />
            </div>
          </div>

          {/* Monthly Trends Line Chart */}
          <div className="chart-card full-width">
            <h3>Monthly Approval Trends</h3>
            <div className="chart-container">
              <Line data={charts.monthlyTrends} options={lineOptions} />
            </div>
          </div>

          {/* Approval by Department */}
          <div className="chart-card">
            <h3>Approval Rate by Department</h3>
            <div className="chart-container">
              <Bar data={charts.approvalByDepartment} options={barOptions} />
            </div>
          </div>

          {/* Amount Distribution */}
          <div className="chart-card">
            <h3>Workflows by Amount Range</h3>
            <div className="chart-container">
              <Bar data={charts.amountDistribution} options={barOptions} />
            </div>
          </div>

          {/* Type Distribution */}
          <div className="chart-card">
            <h3>Workflows by Type</h3>
            <div className="chart-container">
              <Pie data={charts.typeDistribution} options={pieOptions} />
            </div>
          </div>
        </div>
      </section>

      {/* Trends and Metrics */}
      <section className="trends-section">
        <div className="trends-grid">
          {/* Weekly Comparison */}
          <div className="trend-card">
            <h3>Weekly Performance</h3>
            <div className="trend-content">
              <div className="trend-item">
                <span className="trend-label">Current Week</span>
                <span className="trend-value">{trends.weeklyComparison.currentWeek}</span>
              </div>
              <div className="trend-item">
                <span className="trend-label">Previous Week</span>
                <span className="trend-value">{trends.weeklyComparison.previousWeek}</span>
              </div>
              <div className={`trend-change ${trends.weeklyComparison.isPositive ? 'positive' : 'negative'}`}>
                {trends.weeklyComparison.change}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="trend-card">
            <h3>Top Performing Departments</h3>
            <div className="trend-content">
              {trends.topPerformers.map((dept, index) => (
                <div key={index} className="performer-item">
                  <span className="performer-name">{dept.department}</span>
                  <div className="performer-stats">
                    <span className="approval-rate">{dept.approvalRate}%</span>
                    <span className="processing-time">{dept.processingTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Metrics */}
          <div className="trend-card">
            <h3>Efficiency Metrics</h3>
            <div className="trend-content">
              <div className="metric-item">
                <span className="metric-label">Avg Response Time</span>
                <span className="metric-value">{trends.efficiencyMetrics.avgResponseTime}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">SLA Compliance</span>
                <span className="metric-value">{trends.efficiencyMetrics.slaCompliance}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Automation Rate</span>
                <span className="metric-value">{trends.efficiencyMetrics.automationRate}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">User Satisfaction</span>
                <span className="metric-value">{trends.efficiencyMetrics.userSatisfaction}/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;