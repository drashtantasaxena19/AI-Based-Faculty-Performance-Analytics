import pandas as pd
import os
from scoring import calculate_faculty_score

DATASET_PATH = "faculty_performance_dataset.csv"

PARAMETERS = [
    "pass_percentage",
    "student_feedback",
    "research_score",
    "attendance_percentage"
]


def compare_last_two_evaluations(faculty_id):
    if not os.path.exists(DATASET_PATH):
        return None

    df = pd.read_csv(DATASET_PATH)
    faculty_records = df[df["faculty_id"] == faculty_id]

    if len(faculty_records) < 2:
        return {"message": "No previous evaluation found."}

    faculty_records = faculty_records.sort_values(by="test_date")

    prev = faculty_records.iloc[-2]
    curr = faculty_records.iloc[-1]

    prev_score = calculate_faculty_score(
        prev["pass_percentage"],
        prev["student_feedback"],
        prev["research_score"],
        prev["attendance_percentage"]
    )

    curr_score = calculate_faculty_score(
        curr["pass_percentage"],
        curr["student_feedback"],
        curr["research_score"],
        curr["attendance_percentage"]
    )

    parameter_analysis = {}

    for param in PARAMETERS:
        diff = round(curr[param] - prev[param], 2)
        parameter_analysis[param] = {
            "previous": prev[param],
            "current": curr[param],
            "change": diff,
            "status": "Improved" if diff > 0 else "Declined" if diff < 0 else "No Change"
        }

    return {
        "previous_score": prev_score,
        "current_score": curr_score,
        "score_change": round(curr_score - prev_score, 2),
        "parameter_wise_analysis": parameter_analysis
    }
# from data_generation import get_history

# def compare_last_two_evaluations(fid):
#     hist = get_history(fid)
#     if len(hist) < 2:
#         return None

#     prev, curr = hist[-2], hist[-1]
#     diff = curr["pass_percentage"] - prev["pass_percentage"]

#     return {
#         "difference": diff,
#         "message": "Improved" if diff > 0 else "Declined"
#     }
