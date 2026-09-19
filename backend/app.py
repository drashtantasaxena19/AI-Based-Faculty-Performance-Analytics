from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
from data_generation import add_faculty_evaluation, DATASET_PATH, COLUMNS

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class Evaluation(BaseModel):
    faculty_id: str
    faculty_name: str
    department: str
    subject: str
    pass_percentage: float
    student_feedback: float
    research_score: float
    attendance_percentage: float

@app.post("/evaluate")
async def evaluate(data: Evaluation):
    try:
        # 1. READ EXISTING DATA FIRST (Crucial: Look for history before saving new entry)
        df = pd.read_csv(DATASET_PATH) if os.path.exists(DATASET_PATH) else pd.DataFrame(columns=COLUMNS)
        
        # 2. Search for this specific Faculty ID in history
        # We use .astype(str) and .str.upper() to ensure the search isn't case-sensitive
        previous_records = df[df["faculty_id"].astype(str).str.upper() == str(data.faculty_id).upper()]
        
        comparison_list = []
        comparison_value = 0
        is_new = True
        improvement_note = "First evaluation. Baseline established."

        # 3. If ID exists, calculate the metric-level progress
        if not previous_records.empty:
            is_new = False
            last_entry = previous_records.iloc[-1] # Get the most recent record
            
            # Compare specific metrics
            metrics = {
                "Pass %": (data.pass_percentage, last_entry["pass_percentage"]),
                "Research": (data.research_score, last_entry["research_score"]),
                "Feedback": (data.student_feedback, last_entry["student_feedback"]),
                "Attendance": (data.attendance_percentage, last_entry["attendance_percentage"])
            }

            for label, (curr, prev) in metrics.items():
                diff = round(float(curr) - float(prev), 2)
                if diff > 0:
                    comparison_list.append(f"↑ Improved {label} by {diff}")
                elif diff < 0:
                    comparison_list.append(f"↓ Declined {label} by {abs(diff)}")

        # 4. NOW save the new evaluation to the CSV
        current_score = add_faculty_evaluation(
            data.faculty_id, data.faculty_name, data.department,
            data.pass_percentage, data.student_feedback, 
            data.research_score, data.attendance_percentage, data.subject
        )

        # 5. Calculate overall score improvement if not new
        if not is_new:
            last_score = float(previous_records.iloc[-1]["score"])
            comparison_value = round(current_score - last_score, 2)
            if comparison_value > 0:
                improvement_note = f"Performance increased by {comparison_value} points."
            elif comparison_value < 0:
                improvement_note = f"Performance decreased by {abs(comparison_value)} points."
            else:
                improvement_note = "Performance remains stable."

        return {
            "faculty_id": data.faculty_id.upper(),
            "faculty_name": data.faculty_name,
            "score": current_score,
            "is_new": is_new,
            "comparison": comparison_value,
            "comparison_list": comparison_list,
            "improvement_note": improvement_note
        }
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history():
    try:
        if not os.path.exists(DATASET_PATH): return {"data": []}
        df = pd.read_csv(DATASET_PATH)
        return {"data": df.fillna("").to_dict(orient="records")}
    except Exception as e:
        return {"data": [], "error": str(e)}

@app.post("/evaluate")
async def evaluate(data: Evaluation):
    try:
        # 1. Read existing data to check for history
        df = pd.read_csv(DATASET_PATH) if os.path.exists(DATASET_PATH) else pd.DataFrame(columns=COLUMNS)
        
        # Search for previous records
        previous_records = df[df["faculty_id"].astype(str).str.upper() == str(data.faculty_id).upper()]
        
        comparison_list = []
        comparison_value = 0
        is_new = True
        improvement_note = "First evaluation. Baseline established."

        # 2. Metric-level comparison logic
        if not previous_records.empty:
            is_new = False
            last_entry = previous_records.iloc[-1]
            
            metrics = {
                "Pass %": (data.pass_percentage, last_entry["pass_percentage"]),
                "Research": (data.research_score, last_entry["research_score"]),
                "Feedback": (data.student_feedback, last_entry["student_feedback"]),
                "Attendance": (data.attendance_percentage, last_entry["attendance_percentage"])
            }

            for label, (curr, prev) in metrics.items():
                diff = round(float(curr) - float(prev), 2)
                if diff > 0:
                    comparison_list.append(f"↑ Improved {label} by {diff}")
                elif diff < 0:
                    comparison_list.append(f"↓ Declined {label} by {abs(diff)}")

        # 3. Save new entry and get the numeric score
        current_score = add_faculty_evaluation(
            data.faculty_id, data.faculty_name, data.department,
            data.pass_percentage, data.student_feedback, 
            data.research_score, data.attendance_percentage, data.subject
        )

        # 4. CLASSIFICATION LOGIC (Moved from scoring.py to here)
        if current_score >= 85:
            performance_label = "Excellent"
        elif 70 <= current_score < 85:
            performance_label = "Very Good"
        elif 55 <= current_score < 70:
            performance_label = "Good"
        elif 40 <= current_score < 55:
            performance_label = "Average"
        else:
            performance_label = "Poor"

        # 5. Calculate overall progress
        if not is_new:
            last_score = float(previous_records.iloc[-1]["score"])
            comparison_value = round(current_score - last_score, 2)
            if comparison_value > 0:
                improvement_note = f"Performance increased by {comparison_value} points."
            elif comparison_value < 0:
                improvement_note = f"Performance decreased by {abs(comparison_value)} points."
            else:
                improvement_note = "Performance remains stable."

        # 6. Final Return to Frontend
        return {
            "faculty_id": data.faculty_id.upper(),
            "faculty_name": data.faculty_name,
            "score": current_score,
            "performance_class": performance_label, # This is what React uses now
            "is_new": is_new,
            "comparison": comparison_value,
            "comparison_list": comparison_list,
            "improvement_note": improvement_note
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))