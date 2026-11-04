'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';

import AuditScorecard from '../../components/client/auditScorecard';
import KeyFindings from '../../components/client/keyFindings';
import ActionPlan from '../../components/client/actionPlan';
import TechnicalMetrics from '../../components/client/technicalMetrics';

export default function ClientDashboard() {
  const params = useParams();
  const id = params?.id;

  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    async function loadAudit() {
      try {
        const res = await fetch(`/api/audit/${id}`);
        const data = await res.json();
        if (data.success) setAudit(data.audit);
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
        <Link href="/" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold">
          Return to Admin Portal
        </Link>
      </div>
    );
  }

  const overallScore = audit.overallScore || 72;
  const breakdown = audit.scoreBreakdown || { technical: 78, on_page: 81, content: 70, core_web_vitals: 61, schema: 65 };

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
            <a
              href={`/api/audit/${id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Executive PDF</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AuditScorecard
          overallScore={overallScore}
          breakdown={breakdown}
          executiveSummary={audit.executiveSummary}
        />

        <KeyFindings
          criticalIssues={audit.criticalIssues}
          quickWins={audit.quickWins}
        />

        <ActionPlan
          recommendations={audit.recommendations}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        <TechnicalMetrics
          crawledData={audit.crawledData}
        />
      </main>
    </div>
  );
}