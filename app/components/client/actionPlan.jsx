import { Filter, ShieldCheck } from 'lucide-react';

const ActionPlan =({
  recommendations = [],
  priorityFilter,
  setPriorityFilter
})=> {
  const filteredRecs = recommendations.filter((r) => {
    return priorityFilter === 'ALL' || r.priority === priorityFilter;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Prioritized Recommendations & Fixes</h3>
            <p className="text-xs text-slate-500">
              Every fix includes effort estimation, business impact, and falsifiability verification test
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  priorityFilter === p
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {filteredRecs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No recommendations match the filter criteria.</div>
        ) : (
          filteredRecs.map((rec, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50/70 transition space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                      rec.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : rec.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : rec.priority === 'MEDIUM'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {rec.category}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span>Impact: <b className="text-slate-800">{rec.estimated_impact}</b></span>
                  <span>Effort: <b className="text-slate-800">{rec.effort}</b></span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{rec.finding}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <span className="font-semibold text-sky-800">Actionable Fix:</span> {rec.fix}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Falsifiability Check (Verification Test):</span>{' '}
                  <span className="text-slate-600">{rec.falsifiability_check}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActionPlan