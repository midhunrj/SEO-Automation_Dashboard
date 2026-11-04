import Link from 'next/link';
import { Search, ExternalLink, FileText } from 'lucide-react';

const AuditHistoryTable=({ audits, searchTerm, setSearchTerm })=> {
  const filteredAudits = audits.filter(
    (a) =>
      a.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.businessType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                    <a
                      href={`/api/audit/${item.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 font-medium transition"
                    >
                      <FileText className="w-3 h-3" />
                      <span>PDF</span>
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditHistoryTable