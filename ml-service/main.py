from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import numpy as np
from datetime import datetime, timedelta
import random

app = FastAPI(title="Workflow AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkflowPredictionRequest(BaseModel):
    title: str
    description: str
    type: str
    amount: float = None
    department: str

class PredictionResponse(BaseModel):
    approvalProbability: float
    suggestion: str
    confidence: float

class AnalyticsResponse(BaseModel):
    summary: Dict[str, Any]
    charts: Dict[str, Any]
    trends: Dict[str, Any]

class MockMLModel:
    def __init__(self):
        self.type_weights = {
            "LEAVE": 0.8,
            "PURCHASE": 0.6,
            "BUDGET": 0.4,
            "PROJECT": 0.7
        }
        self.dept_weights = {
            "Engineering": 0.8,
            "Finance": 0.6,
            "HR": 0.9,
            "IT": 0.7,
            "Operations": 0.5
        }
    
    def predict(self, workflow_data: Dict) -> Dict[str, Any]:
        workflow_type = workflow_data.get('type', 'PROJECT')
        department = workflow_data.get('department', 'Engineering')
        amount = workflow_data.get('amount', 0) or 0
        
        base_prob = self.type_weights.get(workflow_type, 0.5)
        
        dept_factor = self.dept_weights.get(department, 0.5)
        base_prob = (base_prob + dept_factor) / 2
        
        if amount > 0:
            if amount < 1000:
                base_prob += 0.2
            elif amount > 5000:
                base_prob -= 0.3
            elif amount > 10000:
                base_prob -= 0.5
        
        probability = max(0.1, min(0.95, base_prob))
        
        if probability > 0.7:
            suggestion = "APPROVE"
        elif probability > 0.4:
            suggestion = "REVIEW"
        else:
            suggestion = "REJECT"
        
        return {
            "approvalProbability": round(probability, 2),
            "suggestion": suggestion,
            "confidence": round(0.85 + (probability * 0.1), 2)
        }

class AnalyticsService:
    def __init__(self):
        self.departments = ["Engineering", "Finance", "HR", "IT", "Operations", "Marketing", "Sales"]
        self.workflow_types = ["LEAVE", "PURCHASE", "BUDGET", "PROJECT", "TRAVEL", "EXPENSE"]
        self.statuses = ["PENDING", "APPROVED", "REJECTED", "REVIEW"]
    
    def generate_analytics_data(self) -> Dict[str, Any]:
        summary = {
            "totalWorkflows": 156,
            "pendingWorkflows": 23,
            "approvedWorkflows": 98,
            "rejectedWorkflows": 35,
            "approvalRate": 63,
            "avgProcessingTime": "2.3 days",
            "totalAmountProcessed": 452800
        }
        
        charts = {
            "statusDistribution": self._generate_status_chart(),
            "departmentWorkflows": self._generate_department_chart(),
            "typeDistribution": self._generate_type_chart(),
            "monthlyTrends": self._generate_trend_chart(),
            "approvalByDepartment": self._generate_approval_by_dept(),
            "amountDistribution": self._generate_amount_chart()
        }
        
        trends = {
            "weeklyComparison": self._generate_weekly_comparison(),
            "topPerformers": self._generate_top_performers(),
            "efficiencyMetrics": self._generate_efficiency_metrics()
        }
        
        return {
            "summary": summary,
            "charts": charts,
            "trends": trends
        }
    
    def _generate_status_chart(self):
        return {
            "labels": ["Approved", "Pending", "Rejected", "Under Review"],
            "datasets": [
                {
                    "data": [98, 23, 35, 12],
                    "backgroundColor": ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"],
                    "borderWidth": 2,
                    "borderColor": "#ffffff"
                }
            ]
        }
    
    def _generate_department_chart(self):
        departments = self.departments
        workflow_counts = [45, 32, 28, 25, 18, 15, 13]
        
        return {
            "labels": departments,
            "datasets": [
                {
                    "label": "Workflows by Department",
                    "data": workflow_counts,
                    "backgroundColor": [
                        "#3b82f6", "#ef4444", "#10b981", "#f59e0b", 
                        "#8b5cf6", "#06b6d4", "#f97316"
                    ],
                    "borderWidth": 1
                }
            ]
        }
    
    def _generate_type_chart(self):
        types = self.workflow_types
        type_data = [42, 38, 35, 25, 12, 4]
        
        return {
            "labels": types,
            "datasets": [
                {
                    "label": "Workflows by Type",
                    "data": type_data,
                    "backgroundColor": "#3b82f6",
                    "borderColor": "#1d4ed8",
                    "borderWidth": 2
                }
            ]
        }
    
    def _generate_trend_chart(self):
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        approvals = [45, 52, 48, 61, 55, 58, 62, 65, 59, 63, 67, 71]
        rejections = [12, 15, 18, 14, 16, 13, 11, 9, 12, 10, 8, 6]
        
        return {
            "labels": months,
            "datasets": [
                {
                    "label": "Approved",
                    "data": approvals,
                    "borderColor": "#10b981",
                    "backgroundColor": "rgba(16, 185, 129, 0.1)",
                    "fill": True,
                    "tension": 0.4
                },
                {
                    "label": "Rejected",
                    "data": rejections,
                    "borderColor": "#ef4444",
                    "backgroundColor": "rgba(239, 68, 68, 0.1)",
                    "fill": True,
                    "tension": 0.4
                }
            ]
        }
    
    def _generate_approval_by_dept(self):
        departments = self.departments[:5]
        approval_rates = [78, 65, 82, 71, 60]
        
        return {
            "labels": departments,
            "datasets": [
                {
                    "label": "Approval Rate (%)",
                    "data": approval_rates,
                    "backgroundColor": [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(245, 158, 11, 0.8)",
                        "rgba(139, 92, 246, 0.8)",
                        "rgba(6, 182, 212, 0.8)"
                    ],
                    "borderWidth": 1
                }
            ]
        }
    
    def _generate_amount_chart(self):
        ranges = ["$0-500", "$501-2000", "$2001-5000", "$5001-10000", "$10001+"]
        counts = [45, 38, 42, 25, 6]
        
        return {
            "labels": ranges,
            "datasets": [
                {
                    "label": "Workflows by Amount",
                    "data": counts,
                    "backgroundColor": "rgba(59, 130, 246, 0.7)",
                    "borderColor": "#1d4ed8",
                    "borderWidth": 2
                }
            ]
        }
    
    def _generate_weekly_comparison(self):
        return {
            "currentWeek": 45,
            "previousWeek": 38,
            "change": "+18%",
            "isPositive": True
        }
    
    def _generate_top_performers(self):
        return [
            {"department": "HR", "approvalRate": 82, "processingTime": "1.2 days"},
            {"department": "Engineering", "approvalRate": 78, "processingTime": "1.8 days"},
            {"department": "IT", "approvalRate": 71, "processingTime": "2.1 days"}
        ]
    
    def _generate_efficiency_metrics(self):
        return {
            "avgResponseTime": "6.2 hours",
            "slaCompliance": 94,
            "automationRate": 67,
            "userSatisfaction": 4.2
        }

ml_model = MockMLModel()  # This should work now
analytics_service = AnalyticsService()

@app.get("/")
async def root():
    return {"message": "Workflow AI Service is running"}

@app.get("/api/analytics")
async def get_analytics():
    try:
        analytics_data = analytics_service.generate_analytics_data()
        return analytics_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics error: {str(e)}")

@app.post("/api/predict-approval", response_model=PredictionResponse)
async def predict_approval(request: WorkflowPredictionRequest):
    try:
        workflow_data = request.dict()
        prediction = ml_model.predict(workflow_data)
        return PredictionResponse(**prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "workflow-ai"}

@app.post("/api/summarize")
async def summarize_workflow(request: WorkflowPredictionRequest):
    summary = f"""
    Workflow Analysis:
    - Title: {request.title}
    - Type: {request.type}
    - Department: {request.department}
    - Amount: ${request.amount or 0:,.2f}
    
    Key Insights:
    • This is a {request.type.lower()} request from {request.department} department
    • {'High' if (request.amount or 0) > 5000 else 'Normal'} priority based on amount
    • Typical approval rate for similar workflows: 75%
    • Recommended action: {'Approve' if (request.amount or 0) < 2000 else 'Review carefully'}
    """
    
    return {"summary": summary.strip()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
