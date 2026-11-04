import { Sparkles, SlidersHorizontal } from 'lucide-react';

const Header = ()=> {
  return (
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
  );
}

export default Header