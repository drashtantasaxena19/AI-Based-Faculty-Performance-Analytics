def calculate_faculty_score(
    pass_percentage,
    student_feedback,
    research_score,
    attendance_percentage
):
    WEIGHTS = {
        "pass_percentage": 0.4,
        "student_feedback": 0.25,
        "research_score": 0.2,
        "attendance_percentage": 0.15
    }

    normalized_feedback = (student_feedback / 5) * 100
    normalized_research = (research_score / 5) * 100

    score = (
        pass_percentage * WEIGHTS["pass_percentage"]
        + normalized_feedback * WEIGHTS["student_feedback"]
        + normalized_research * WEIGHTS["research_score"]
        + attendance_percentage * WEIGHTS["attendance_percentage"]
    )

    return round(score, 2)


def classify_performance(score):
    if score >= 85:
        return "Excellent"
    elif 70 <= score < 85:
        return "Very Good"
    elif 55 <= score < 70:
        return "Good"
    elif 40 <= score < 55:
        return "Average"
    else:
        return "Poor"
