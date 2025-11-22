"use client";

import { ClipboardList, FileText } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col">
      {/* Session Info */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Current Session
        </h2>
        <p className="text-sm font-medium text-slate-900 mb-1">
          Today&apos;s Consult
        </p>
        <p className="text-xs text-slate-600">
          Patient: <span className="text-slate-900">(selected in EMR)</span>
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {/* Draft Orders - Active */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            <ClipboardList className="w-4 h-4" />
            Draft Orders
          </button>

          {/* Notes - Coming Soon */}
          <button
            disabled
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 rounded-lg cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            Notes
            <span className="ml-auto text-xs text-slate-400">(soon)</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Clinical Action Layer v0.1
        </p>
      </div>
    </aside>
  );
}
