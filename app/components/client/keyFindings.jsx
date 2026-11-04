import { AlertCircle, Zap, CheckCircle2 } from 'lucide-react';

const KeyFindings=({ criticalIssues = [], quickWins = [] })=> {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm mb-4">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <h3>Critical Issues ({criticalIssues.length})</h3>
        </div>
        <div className="space-y-3">
          {criticalIssues.length === 0 ? (
            <p className="text-xs text-slate-400">No critical issues detected.</p>
          ) : (
            criticalIssues.map((issue, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-rose-50/50 border border-rose-100 rounded-xl text-xs text-rose-900">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{issue}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-4">
          <Zap className="w-4 h-4 text-emerald-600 fill-current" />
          <h3>Quick Wins &lt; 2 Hours Effort ({quickWins.length})</h3>
        </div>
        <div className="space-y-3">
          {quickWins.length === 0 ? (
            <p className="text-xs text-slate-400">No immediate quick wins generated.</p>
          ) : (
            quickWins.map((win, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{win}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default KeyFindings