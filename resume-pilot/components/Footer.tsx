export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="9" height="11" rx="1.5" fill="white" fillOpacity="0.9"/>
                  <path d="M4 4.5h5M4 6.5h5M4 8.5h3" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-bold text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Resume<span className="text-blue-600">Pilot</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Build Better Resumes. Get ATS Insights.</p>
          </div>

          {/* Creator info */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm font-semibold text-slate-800">Shruti Suryakant Gijbile</p>
            <a
              href="mailto:shrutigijbile19@gmail.com"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              shrutigijbile19@gmail.com
            </a>
          </div>

          {/* CTA */}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 2l2 4 4.5 1-3.3 3 .8 4.5L8 12.5 4 14.5l.8-4.5L1.5 7 6 6z"/>
            </svg>
            Built for Digital Heroes
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ResumePilot. All rights reserved.</p>
          <p>Built with Next.js &amp; Tailwind CSS — Ready for Vercel deployment</p>
        </div>
      </div>
    </footer>
  );
}
