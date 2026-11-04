import { Sparkles, ShieldCheck } from 'lucide-react';

const AuditScorecard=({ overallScore, breakdown, executiveSummary })=> {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-sky-50/40 rounded-2xl border border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Overall SEO Health Score
          </span>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="58" stroke="#e2e8f0" strokeWidth="10" fill="transparent" />
              <circle
                cx="72"
                cy="72"
                r="58"
                stroke={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-slate-900">{overallScore}</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">out of 100</span>
            </div>
          </div>
          <div className="mt-3 text-xs font-medium text-slate-600 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified by Claude AI & PageSpeed</span>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-5">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive AI Summary</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              Local Search Audit & Conversion Roadmap
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {executiveSummary || 'Comprehensive audit completed. High ranking potential with immediate quick wins in mobile Core Web Vitals and localized LocalBusiness schema.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-500 font-medium">Technical</div>
              <div className="text-lg font-bold text-slate-800">{breakdown.technical}%</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-500 font-medium">On-Page</div>
              <div className="text-lg font-bold text-slate-800">{breakdown.on_page}%</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-500 font-medium">Content</div>
              <div className="text-lg font-bold text-slate-800">{breakdown.content}%</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-500 font-medium">Web Vitals</div>
              <div className="text-lg font-bold text-slate-800">{breakdown.core_web_vitals}%</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-500 font-medium">Schema.org</div>
              <div className="text-lg font-bold text-slate-800">{breakdown.schema}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default  AuditScorecard