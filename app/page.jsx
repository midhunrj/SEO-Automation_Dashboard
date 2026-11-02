'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
  Database,
  Send,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

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

export default function AdminPortal() {
  const [url, setUrl] = useState('https://example-dental-clinic.com');
  const [businessType, setBusinessType] = useState('Dental Clinic');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [loading, setLoading] = useState(false);
  const [activeAuditId, setActiveAuditId] = useState(null);
  const [activeAudit, setActiveAudit] = useState(null);
  const [audits, setAudits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAudits = async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success) {
        setAudits(data.audits);
      }
    } catch (err) {
      console.error('Failed to fetch audits:', err);
    }
  };

  useEffect(() => {
    fetchAudits();
    const interval = setInterval(fetchAudits, 5000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (!activeAuditId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/audit/${activeAuditId}`);
        const data = await res.json();
        if (data.success && data.audit) {
          setActiveAudit(data.audit);
          if (data.audit.status === 'COMPLETED' || data.audit.status === 'FAILED') {
            setLoading(false);
            fetchAudits();
            if (data.audit.status === 'COMPLETED') {
              clearInterval(pollInterval);
            }
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 1500);

    return () => clearInterval(pollInterval);
  }, [activeAuditId]);


  const handleTriggerAudit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setActiveAudit(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, businessType, city, state })
      });

      const data = await res.json();
      if (data.success) {
        setActiveAuditId(data.auditId);
        fetchAudits();
      } else {
        alert(`Error: ${data.error}`);
        setLoading(false);
      }
    } catch (err) {
      alert(`Submission error: ${err.message}`);
      setLoading(false);
    }
  };

  const filteredAudits = audits.filter(
    (a) =>
      a.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.businessType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EdgeLink SEO</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-sky-100 text-sky-800">
                  Automation Admin
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous Crawl, AI Analysis & Multi-Channel Delivery</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>BullMQ Queue: Active</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>USE_MOCKS: Enabled</span>
            </div>
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
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
              {audits.filter((a) => a.overallScore).length > 0
                ? Math.round(
                    audits.reduce((acc, a) => acc + (a.overallScore || 0), 0) /
                      audits.filter((a) => a.overallScore).length
                  )
                : 74}
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


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-slate-900 font-semibold text-lg mb-1">
                <Play className="w-5 h-5 text-sky-600" />
                <h2>Trigger SEO Audit</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Enqueues a background job into BullMQ to crawl, query APIs, generate AI recommendations, and build PDF reports.
              </p>

              <form onSubmit={handleTriggerAudit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Website URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    placeholder="https://example-dental-clinic.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Business Type
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                    >
                      <option value="Dental Clinic">Dental Clinic</option>
                      <option value="Healthcare Clinic">Healthcare Clinic</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Local Business">Local Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Pune"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-[0.99] transition shadow-md shadow-sky-600/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Running Audit Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Queue SEO Audit in BullMQ</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Upstash Redis + PostgreSQL</span>
              <span>100% Mock Safe Mode</span>
            </div>
          </div>

          {/* Live Pipeline Stepper View */}
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

              {/* Progress Bar */}
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

              {/* 10-Step Sequential Flow */}
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

            {/* Quick action button when completed */}
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
        </div>

        {/* Section: All Audits Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Audit History & Generated Reports</h3>
              <p className="text-xs text-slate-500">Live list of stored audits synced with Supabase / Neon</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by URL, business, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Target Website</th>
                  <th className="py-3 px-4">Business / Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">SEO Score</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAudits.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No audits found. Trigger your first audit above!
                    </td>
                  </tr>
                ) : (
                  filteredAudits.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <span className="truncate max-w-[200px]">{item.url}</span>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-600">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.businessType} • {item.city}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'FAILED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.overallScore ? (
                          <span
                            className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                              item.overallScore >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.overallScore >= 60
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.overallScore}/100
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/client/${item.id}`}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition"
                        >
                          Client Portal
                        </Link>
                        {item.pdfUrl && (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 font-medium transition"
                          >
                            <FileText className="w-3 h-3" />
                            <span>PDF</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
