import { useState, useEffect } from 'react';
import { Search, ExternalLink, Star } from 'lucide-react';

export default function HistoryPage({ onSelectRecord }) { // Added prop
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then(res => res.json())
      .then(res => setData(res.data || []));
  }, []);

  const filtered = data.filter(item => 
    item.faculty_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.faculty_id?.toString().includes(searchTerm.toUpperCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-black text-slate-900">Historical Records</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
            placeholder="Search Faculty..." 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Faculty</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Subject</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Classification</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Score</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...filtered].reverse().map((item, i) => (
              <tr 
                key={i} 
                onClick={() => onSelectRecord(item)} // Bridge to Result Card
                className="hover:bg-indigo-50/50 transition-all cursor-pointer group"
              >
                <td className="p-6">
                  <div className="font-bold text-slate-800 group-hover:text-indigo-600">{item.faculty_name}</div>
                  <div className="text-[10px] font-black text-indigo-500 uppercase">{item.faculty_id}</div>
                </td>
                <td className="p-6">
                  <div className="text-sm font-bold text-slate-600">{item.subject}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{item.department}</div>
                </td>
                <td className="p-6 text-center">
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center justify-center gap-1 w-fit mx-auto border border-amber-200">
                    <Star size={10} fill="currentColor" /> {item.performance_class || "Good"}
                  </span>
                </td>
                <td className="p-6">
                  <span className="bg-slate-900 text-white px-3 py-1 rounded-lg font-black text-sm">{item.score}</span>
                </td>
                <td className="p-6">
                   <div className="flex items-center text-indigo-500 font-bold text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                     View <ExternalLink size={12} className="ml-1" />
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}