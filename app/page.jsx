'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import KpiCards from './components/kpiCards';
import AuditForm from './components/AuditForm';
import PipelineTracker from './components/pipelineTracker';
import AuditHistoryTable from './components/auditHistoryTable';


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
      if (data.success) setAudits(data.audits);
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
            clearInterval(pollInterval);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <KpiCards audits={audits} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <AuditForm
            url={url} setUrl={setUrl}
            businessType={businessType} setBusinessType={setBusinessType}
            city={city} setCity={setCity}
            state={state} setState={setState}
            loading={loading}
            onSubmit={handleTriggerAudit}
          />

          <PipelineTracker
            activeAudit={activeAudit}
            loading={loading}
          />
        </div>

        <AuditHistoryTable
          audits={audits}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </main>
    </div>
  );
}