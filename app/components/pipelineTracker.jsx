import Link from 'next/link';
import { Activity, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

const PIPELINE_STEPS = [
  { step: 1, name: 'Fetch & Cheerio DOM Crawl', desc: 'Crawls title, headings, meta tags & images' },
  { step: 2, name: 'PageSpeed Insights (Mock)', desc: 'Analyzes mobile Core Web Vitals & performance' },
  { step: 3, name: 'Google Search Console (Mock)', desc: 'Extracts queries, clicks, impressions & CTR' },
  { step: 4, name: 'Schema.org Validator', desc: 'Validates LocalBusiness JSON-LD structure' },
  { step: 5, name: 'Robots.txt & Sitemap Audit', desc: 'Checks crawlability, directives & indexing' },
  { step: 6, name: 'DataForSEO SERP Rankings (Mock)', desc: 'Retrieves localized keyword rank positions' },
  { step: 7, name: 'Anthropic Claude AI Engine', desc: 'Synthesizes signals into falsifiable fixes' },
  { step: 8, name: 'Supabase / Neon Postgres Save', desc: 'Persists audit snapshot via Prisma ORM' },
  { step: 9, name: 'Puppeteer / PDF Generation', desc: 'Compiles client-ready executive PDF report' },
  { step: 10, name: 'Twilio WhatsApp Delivery (Mock)', desc: 'Dispatches completion alert & report link' }
];

const PipelineTracker=({ activeAudit, loading })=> {
  return (
    <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-lg text-slate-900">Execution Pipeline Tracker</h2>
          </div>
          {activeAudit && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                activeAudit.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeAudit.status === 'FAILED'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800 animate-pulse'
              }`}
            >
              {activeAudit.status} ({activeAudit.progress}%)
            </span>
          )}
        </div>


        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
          <div
            className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full transition-all duration-500"
            style={{ width: `${activeAudit ? activeAudit.progress : loading ? 25 : 0}%` }}
          ></div>
        </div>

        {activeAudit?.currentStep && (
          <div className="mb-4 px-3.5 py-2.5 bg-sky-50 border border-sky-100 rounded-xl text-sky-900 text-xs flex items-center space-x-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600 flex-shrink-0" />
            <span className="font-medium">Active Step:</span>
            <span className="truncate">{activeAudit.currentStep}</span>
          </div>
        )}


        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {PIPELINE_STEPS.map((s, idx) => {
            const isCurrent =
              activeAudit &&
              activeAudit.status === 'PROCESSING' &&
              Math.ceil((activeAudit.progress / 100) * 10) === idx + 1;
            const isDone =
              activeAudit &&
              (activeAudit.status === 'COMPLETED' ||
                Math.ceil((activeAudit.progress / 100) * 10) > idx + 1);

            return (
              <div
                key={s.step}
                className={`flex items-start space-x-3 p-2.5 rounded-xl border text-xs transition ${
                  isCurrent
                    ? 'border-sky-300 bg-sky-50/60 shadow-sm'
                    : isDone
                    ? 'border-slate-200 bg-slate-50/50'
                    : 'border-slate-100 bg-white opacity-60'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 text-sky-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                      {s.step}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isCurrent ? 'text-sky-900' : 'text-slate-800'}`}>
                      {s.name}
                    </span>
                    {isDone && <span className="text-[10px] text-emerald-600 font-semibold">Done</span>}
                    {isCurrent && <span className="text-[10px] text-sky-600 font-semibold animate-pulse">Running</span>}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeAudit?.status === 'COMPLETED' && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">
            Audit finished! Score: <b className="text-slate-900">{activeAudit.overallScore}/100</b>
          </span>
          <Link
            href={`/client/${activeAudit.id}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
          >
            <span>Open Client Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default PipelineTracker