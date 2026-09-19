import { useState, useEffect } from 'react';
import { Search, Users, TrendingUp, Calendar, ArrowRight, MousePointer2, ExternalLink } from 'lucide-react';

export default function HomePage({ onSelectRecord }) { // Added prop
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, avgScore: 0 });

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then(res => res.json())
      .then(d => {
        const history = d.data || [];
        setData(history);
        const total = history.length;
        const avg = total > 0 ? (history.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / total) : 0;
        setStats({ total, avgScore: avg.toFixed(1) });
      });
  }, []);

  const searchResults = query.trim() === "" ? [] : data.filter(item => 
    item.faculty_id.toLowerCase().includes(query.toLowerCase()) ||
    item.faculty_name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="space-y-8 p-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Dashboard</h1>
        <p className="text-slate-500">Monitor faculty performance and system metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Faculty" value={stats.total} icon={<Users />} color="bg-blue-600" />
        <StatCard title="System Average" value={`${stats.avgScore}%`} icon={<TrendingUp />} color="bg-indigo-600" />
        <StatCard title="System Logs" value={data.length > 0 ? "Active" : "None"} icon={<Calendar />} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <MousePointer2 className="mr-2 w-5 h-5 text-indigo-600" /> How to Use
          </h3>
          <ul className="space-y-6">
            <Step number="1" title="Input Data" desc="Go to Evaluate Faculty and enter the performance metrics." />
            <Step number="2" title="Analyze" desc="View real-time AI classification and scoring results." />
            <Step number="3" title="Review History" desc="Click any name in the history or dashboard to see full details." />
          </ul>
        </div>

        {/* QUICK LOOKUP (Clickable Results) */}
        <div className="bg-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 flex flex-col relative">
          <h3 className="text-xl font-bold mb-4">Quick Lookup</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-indigo-300 w-5 h-5" />
            <input 
              className="w-full bg-indigo-600/50 border border-indigo-400/50 rounded-xl py-2.5 pl-10 pr-4 outline-none placeholder:text-indigo-200 focus:bg-white focus:text-slate-900 transition-all"
              placeholder="Search by ID or Name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {query && (
            <div className="bg-white rounded-xl shadow-lg mt-2 overflow-hidden text-slate-800 z-50">
              {searchResults.length > 0 ? (
                searchResults.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => onSelectRecord(item)} // Bridge to Result Card
                    className="p-3 border-b border-slate-50 last:border-0 hover:bg-indigo-50 cursor-pointer flex justify-between items-center group"
                  >
                    <div>
                      <p className="font-bold text-sm text-slate-800">{item.faculty_name}</p>
                      <p className="text-[10px] text-slate-400">{item.faculty_id} • Score: {item.score}</p>
                    </div>
                    <ArrowRight size={14} className="text-indigo-500 opacity-0 group-hover:opacity-100" />
                  </div>
                ))
              ) : (
                <p className="p-3 text-xs text-slate-400 text-center">No matches found</p>
              )}
            </div>
          )}
          <div className="mt-auto pt-6 border-t border-indigo-400/30">
            <p className="text-indigo-200 text-xs italic font-medium">Click on a name to open their detailed Performance Card.</p>
          </div>
        </div>

        {/* RECENT ACTIVITY (Clickable Rows) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm">Recent Activity</h3>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </div>
          <div className="p-2">
            {[...data].reverse().slice(0, 4).map((item, i) => (
              <div 
                key={i} 
                onClick={() => onSelectRecord(item)} // Bridge to Result Card
                className="flex justify-between items-center p-3 hover:bg-indigo-50/50 cursor-pointer rounded-2xl transition-all group"
              >
                <div>
                  <p className="text-sm font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{item.faculty_name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{item.date}</p>
                </div>
                <div className="text-indigo-600 font-black text-sm">{item.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components remain the same...
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-4">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg shadow-blue-100`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <li className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-slate-700 text-sm leading-none mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}