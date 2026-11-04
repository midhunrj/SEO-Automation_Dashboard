import { Activity, CheckCircle2, Sparkles, Send } from 'lucide-react';

const KpiCards=({ audits })=> {
  const completedAudits = audits.filter((a) => a.overallScore);
  const avgScore = completedAudits.length > 0
    ? Math.round(completedAudits.reduce((acc, a) => acc + (a.overallScore || 0), 0) / completedAudits.length)
    : 74;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Total Audits</span>
          <Activity className="w-4 h-4 text-sky-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900">{audits.length}</div>
        <div className="text-xs text-emerald-600 font-medium mt-1">Autonomous pipeline ready</div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Avg SEO Score</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900">
          {avgScore}
          <span className="text-sm font-normal text-slate-400"> / 100</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">Indian Local Businesses</div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">AI Engine</span>
          <Sparkles className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900">Claude Sonnet</div>
        <div className="text-xs text-purple-600 font-medium mt-1">Falsifiable Action Plans</div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Delivery Channels</span>
          <Send className="w-4 h-4 text-sky-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900">PDF & WhatsApp</div>
        <div className="text-xs text-sky-600 font-medium mt-1">Automated Multi-Channel</div>
      </div>
    </div>
  );
}

export default KpiCards