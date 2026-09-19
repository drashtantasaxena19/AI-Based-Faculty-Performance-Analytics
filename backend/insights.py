def generate_insights(
    pass_percentage,
    student_feedback,
    research_score,
    attendance_percentage
):
    strengths = []
    weaknesses = []
    suggestions = []

    if pass_percentage >= 75:
        strengths.append("Strong student pass percentage")
    else:
        weaknesses.append("Low student pass percentage")
        suggestions.append("Improve teaching methods and exam preparation")

    if student_feedback >= 4.0:
        strengths.append("Very positive student feedback")
    else:
        weaknesses.append("Student feedback needs improvement")
        suggestions.append("Increase student engagement")

    if research_score >= 3:
        strengths.append("Good research contribution")
    else:
        weaknesses.append("Low research activity")
        suggestions.append("Increase research publications")

    if attendance_percentage >= 80:
        strengths.append("Consistent class attendance")
    else:
        weaknesses.append("Irregular attendance")
        suggestions.append("Maintain punctual lectures")

    if not suggestions:
        suggestions.append("Faculty is performing well. Maintain consistency.")

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions
    }
