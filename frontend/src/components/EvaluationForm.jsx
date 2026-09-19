import { useState } from "react";
import { User, Book, Hash, BookOpen } from "lucide-react";

export default function EvaluationForm({ onResult }) {
  const [formData, setFormData] = useState({
    faculty_id: "", faculty_name: "", department: "", subject: "",
    pass_percentage: "", student_feedback: "", research_score: "", attendance_percentage: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      onResult(data);
    } catch (error) {
      alert("Error: Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto glass-card p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-3xl font-black text-slate-900 mb-8">Faculty Evaluation</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <InputField label="Faculty ID" icon={<Hash size={18} />} placeholder="e.g. FAC-101" onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value.toUpperCase() })} />
        <InputField label="Name" icon={<User size={18} />} placeholder="Full Name" onChange={(e) => setFormData({ ...formData, faculty_name: e.target.value })} />
        <InputField label="Department" icon={<Book size={18} />} placeholder="e.g. Science" onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
        <InputField label="Subject" icon={<BookOpen size={18} />} placeholder="e.g. Physics" onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />

        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-[2rem]">
          <InputField label="Pass %" type="number" onChange={(e) => setFormData({ ...formData, pass_percentage: e.target.value })} />
          <InputField label="Feedback" type="number" onChange={(e) => setFormData({ ...formData, student_feedback: e.target.value })} />
          <InputField label="Research" type="number" onChange={(e) => setFormData({ ...formData, research_score: e.target.value })} />
          <InputField label="Attendance" type="number" onChange={(e) => setFormData({ ...formData, attendance_percentage: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} className="md:col-span-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
          {loading ? "Calculating Improvement..." : "Analyze Performance"}
        </button>
      </form>
    </div>
  );
}

function InputField({ label, icon, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-3.5 text-slate-400">{icon}</div>}
        <input {...props} required className={`w-full border border-slate-200 rounded-xl py-3 ${icon ? 'pl-11' : 'px-4'} outline-none focus:ring-2 focus:ring-indigo-500`} />
      </div>
    </div>
  );
}