import pandas as pd
import os

DATASET_PATH = "faculty_performance_dataset.csv"

def get_performance_details(score):
    if score >= 85: return {"label": "Elite", "color": "#4f46e5", "grade": "A+"}
    if score >= 70: return {"label": "Professional", "color": "#10b981", "grade": "A"}
    if score >= 55: return {"label": "Competent", "color": "#f59e0b", "grade": "B"}
    return {"label": "Underperforming", "color": "#ef4444", "grade": "D"}

def calculate_metrics(p, f, r, a):
    # Weights: Pass(40%), Feedback(25%), Research(20%), Attendance(15%)
    score = (p * 0.4) + ((f / 5) * 100 * 0.25) + ((r / 5) * 100 * 0.2) + (a * 0.15)
    return round(score, 2)

def compare_growth(faculty_id, current_data):
    if not os.path.exists(DATASET_PATH): return {"is_new": True}
    df = pd.read_csv(DATASET_PATH)
    history = df[df["faculty_id"] == faculty_id]
    
    if len(history) < 1: return {"is_new": True}
    
    prev = history.iloc[-1]
    analysis = {}
    params = ["pass_percentage", "student_feedback", "research_score", "attendance_percentage"]
    
    for param in params:
        c_val, p_val = float(current_data[param]), float(prev[param])
        diff = round(c_val - p_val, 2)
        pct = round((diff / p_val * 100), 1) if p_val != 0 else 0
        analysis[param] = {"change": diff, "pct": pct, "trend": "up" if diff > 0 else "down"}
        
    return {"is_new": False, "stats": analysis}