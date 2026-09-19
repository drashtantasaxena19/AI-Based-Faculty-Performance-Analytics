import pandas as pd
import os
from datetime import datetime
import csv

DATASET_PATH = "faculty_performance_dataset.csv"

COLUMNS = [
    "faculty_id", "faculty_name", "department", "subject", 
    "pass_percentage", "student_feedback", "research_score", 
    "attendance_percentage", "score", "date"
]

def initialize_dataset():
    if not os.path.exists(DATASET_PATH):
        df = pd.DataFrame(columns=COLUMNS)
        df.to_csv(DATASET_PATH, index=False)

def calculate_logic_score(p, f, r, a):
    return round((float(p) * 0.4) + (float(f) * 5) + (float(r) * 4) + (float(a) * 0.15), 2)

def add_faculty_evaluation(f_id, name, dept, pass_p, feed, res, att, subj="General"):
    initialize_dataset()
    score = calculate_logic_score(pass_p, feed, res, att)
    
    new_entry = [
        str(f_id).upper(), name, dept, subj, 
        pass_p, feed, res, att, score, 
        datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
    ]

    with open(DATASET_PATH, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(new_entry)
    
    return score