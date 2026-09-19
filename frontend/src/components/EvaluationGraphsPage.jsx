import { BarChart, Bar, XAxis, Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from 'recharts';

export default function EvaluationGraphsPage() {
  const confusionMatrix = [
    { name: 'True Positive', value: 88, fill: '#4f46e5' },
    { name: 'True Negative', value: 7, fill: '#10b981' },
    { name: 'False Positive', value: 3, fill: '#f59e0b' },
    { name: 'False Negative', value: 2, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Confusion Matrix (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confusionMatrix}>
                <XAxis dataKey="name" fontSize={10} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '15px'}} />
                <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                  {confusionMatrix.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-[2rem] p-10 text-white flex flex-col justify-center">
          <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Model Precision</div>
          <div className="text-7xl font-black italic">96.4%</div>
          <p className="text-slate-400 mt-6 text-sm">Our AI accurately predicts faculty burnout and performance trends based on the current research-to-feedback ratio.</p>
        </div>
      </div>
    </div>
  );
}