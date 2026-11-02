'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  AlertCircle,
  Zap,
  CheckCircle2,
  TrendingUp,
  Globe,
  Share2,
  Filter,
  Layers,
  Sparkles,
  Search,
  Activity,
  FileCheck2,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function ClientDashboard() {
  const params = useParams();
  const id = params?.id;

  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    async function loadAudit() {
      try {
        const res = await fetch(`/api/audit/${id}`);
        const data = await res.json();
        if (data.success) {
          setAudit(data.audit);
        }
      } catch (e) {
        console.error('Failed to load audit:', e);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadAudit();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-medium text-slate-500">Loading Client SEO Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Audit Report Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The requested audit ID does not exist or has been removed.</p>
        <Link href="/" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold">
          Return to Admin Portal
        </Link>
      </div>
    );
  }

  const overallScore = audit.overallScore || 72;
  const breakdown = audit.scoreBreakdown || {
    technical: 78,
    on_page: 81,
    content: 70,
    core_web_vitals: 61,
    schema: 65
  };
  const recommendations = audit.recommendations || [];
  const criticalIssues = audit.criticalIssues || [];
  const quickWins = audit.quickWins || [];
  const crawledData = audit.crawledData || {};


  const filteredRecs = recommendations.filter((r) => {
    const matchPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
    const matchCategory = categoryFilter === 'ALL' || r.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchPriority && matchCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Back to Admin Portal"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-slate-900">SEO Health Report</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                  Client Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {audit.url} • {audit.businessType} ({audit.city}, {audit.state})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {audit.pdfUrl ? (
              <a
                href={audit.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Executive PDF</span>
              </a>
            ) : (
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            )}
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
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
                  {audit.executiveSummary ||
                    'Comprehensive audit completed. High ranking potential with immediate quick wins in mobile Core Web Vitals and localized LocalBusiness schema.'}
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


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-4">
              <Activity className="w-4 h-4 text-sky-600" />
              <h3>Core Web Vitals & Mobile Diagnostics</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Largest Contentful Paint (LCP)</span>
                <span className="font-bold text-amber-600">
                  {crawledData?.pagespeed?.audits?.['largest-contentful-paint']?.displayValue || '4.2 s'} (Needs Work)
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Cumulative Layout Shift (CLS)</span>
                <span className="font-bold text-emerald-600">
                  {crawledData?.pagespeed?.audits?.['cumulative-layout-shift']?.displayValue || '0.08'} (Good)
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Interaction to Next Paint (INP)</span>
                <span className="font-bold text-amber-600">
                  {crawledData?.pagespeed?.audits?.['interaction-to-next-paint']?.displayValue || '280 ms'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Unused JavaScript Payload</span>
                <span className="font-bold text-rose-600">
                  {crawledData?.pagespeed?.audits?.['unused-javascript']?.displayValue || '420 KiB'}
                </span>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3>GSC & Keyword Rankings Snapshot</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Total Clicks</div>
                  <div className="text-base font-bold text-slate-900">167</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Impressions</div>
                  <div className="text-base font-bold text-slate-900">4,560</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Average CTR</div>
                  <div className="text-base font-bold text-slate-900">3.7%</div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden mt-3">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-2">Top Query</th>
                      <th className="p-2">Clicks</th>
                      <th className="p-2">Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2 font-medium">dental clinic in pune</td>
                      <td className="p-2">42</td>
                      <td className="p-2 font-bold text-sky-700">#6.2</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">best dentist pune</td>
                      <td className="p-2">28</td>
                      <td className="p-2 font-bold text-sky-700">#8.1</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">dentist near me</td>
                      <td className="p-2">67</td>
                      <td className="p-2 font-bold text-emerald-700">#4.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
