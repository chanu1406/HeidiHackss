"use client";

import { Activity, Zap } from "lucide-react";

export default function TopNav() {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">
              Clinical Action Layer
            </h1>
            <p className="text-xs text-slate-500">
              Sidecar for Medplum • Listening to consult…
            </p>
          </div>
        </div>

        {/* Right: Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <div className="relative">
            <Zap className="w-3.5 h-3.5 text-green-600" />
            <div className="absolute inset-0 animate-ping">
              <Zap className="w-3.5 h-3.5 text-green-400 opacity-75" />
            </div>
          </div>
          <span className="text-xs font-medium text-green-700">
            Realtime AI
          </span>
        </div>
      </div>
    </header>
  );
}
