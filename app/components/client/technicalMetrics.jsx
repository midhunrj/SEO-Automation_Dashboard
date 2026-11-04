import { Activity, TrendingUp } from 'lucide-react';

const TechnicalMetrics=({ crawledData = {} })=> {
  return (
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
  );
}

export default TechnicalMetrics