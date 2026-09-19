import { Award, ArrowLeft, TrendingUp, TrendingDown, Minus, Target, CheckCircle2, ListChecks, Star, Lightbulb } from "lucide-react";

export default function ResultPage({ result, goBack }) {
  const { 
    faculty_id, 
    score, 
    faculty_name, 
    is_new, 
    comparison, 
    improvement_note, 
    comparison_list,
    performance_class 
  } = result;

  const isPositive = comparison > 0;
  const isNeutral = comparison === 0;

  // Function to determine color based on performance_class
  const getStatusColor = () => {
    switch(performance_class) {
      case 'Excellent': return 'bg-amber-500';
      case 'Very Good': return 'bg-emerald-500';
      case 'Good': return 'bg-blue-500';
      case 'Average': return 'bg-slate-500';
      case 'Poor': return 'bg-rose-600';
      default: return 'bg-indigo-600'; // Default color
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in zoom-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* 1. Header Section */}
        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                ID: {faculty_id}
              </span>
              {/* FIXED: performance_class display with icon */}
              <span className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-black/20`}>
                <Star size={10} fill="currentColor" /> {performance_class || "Processing"}
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tight">{faculty_name}</h2>
            <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest italic tracking-widest">Faculty Performance Report</p>
          </div>
          
          <div className="bg-white/10 p-4 px-8 rounded-3xl border border-white/10 text-center min-w-[140px] backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest">Final Score</p>
            <p className="text-6xl font-black italic">{score}</p>
          </div>
        </div>

        <div className="p-8">
          {/* 2. Growth Analysis Card */}
          <div className={`mb-8 p-5 rounded-3xl flex items-center gap-5 border transition-all ${
            is_new ? "bg-slate-50 border-slate-100 text-slate-500" : 
            isPositive ? "bg-emerald-50 border-emerald-100 text-emerald-700" : 
            isNeutral ? "bg-blue-50 border-blue-100 text-blue-700" :
            "bg-rose-50 border-rose-100 text-rose-700"
          }`}>
            <div className={`p-3 rounded-xl bg-white shadow-sm ${isPositive ? 'text-emerald-500' : isNeutral ? 'text-blue-500' : 'text-rose-500'}`}>
              {is_new ? <Target size={20} /> : isPositive ? <TrendingUp size={20} /> : isNeutral ? <Minus size={20} /> : <TrendingDown size={20} />}
            </div>
            <div>
              <p className="font-black uppercase text-[9px] tracking-widest opacity-60">Status Update</p>
              <p className="text-lg font-black leading-tight">{improvement_note || "Data analyzed successfully."}</p>
            </div>
          </div>

          {/* 3. Metric Progress Grid */}
          {!is_new && comparison_list && (
            <div className="mb-8">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 px-1 mb-3 uppercase tracking-wider">
                <ListChecks className="text-indigo-600" size={16} /> Metric-Level Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {comparison_list.map((note, index) => (
                  <div key={index} className={`p-3 px-4 rounded-xl font-bold text-[11px] flex items-center gap-3 border ${note.includes('↑') ? 'bg-emerald-50/30 border-emerald-100 text-emerald-700' : 'bg-rose-50/30 border-rose-100 text-rose-700'}`}>
                    <span className="text-base">{note.includes('↑') ? '📈' : '📉'}</span>
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Insights Grid */}
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wider">
                <Award className="text-indigo-600" size={16} /> AI Strategic Summary
              </h3>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 grow shadow-inner">
                 <p className="text-slate-800 font-black text-sm mb-2">
                   {performance_class || "Faculty"} Level Achievement
                 </p>
                 <p className="text-slate-500 font-medium text-xs leading-relaxed">
                   {/* DYNAMIC SCORING LOGIC RETAINED */}
                   {score >= 85 ? "Exceptional performance. You are in the top tier of faculty benchmarks." :
                    score >= 70 ? "Very Good. Strong academic delivery with high potential for elite classification." :
                    score >= 55 ? "Good. Consistent performance. Focus on research output to elevate your score." :
                    score >= 40 ? "Average. Performance meets baseline but requires targeted improvement in engagement." :
                    "Poor. Immediate attention required to address performance metrics and student feedback."}
                 </p>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wider">
                <Lightbulb className="text-indigo-600" size={16} /> Key Recommendations
              </h3>
              <div className="space-y-2 grow">
                <SuggestionBox text="Publish in high-impact Q1/Q2 journals." />
                <SuggestionBox text="Integrate interactive LMS tools for feedback." />
                <SuggestionBox text="Audit monthly attendance for consistency." />
              </div>
            </div>
          </div>

          {/* 5. Primary Action Button */}
          <button 
            onClick={goBack} 
            className="w-full mt-10 bg-indigo-600 text-white py-4 rounded-2xl font-black text-md flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100"
          >
            <ArrowLeft size={18} /> New Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}

function SuggestionBox({ text }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-50 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors">
      <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
      <span className="text-[11px] font-bold text-slate-600">{text}</span>
    </div>
  );
}