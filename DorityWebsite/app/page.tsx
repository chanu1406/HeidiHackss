"use client";

import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import WorkflowStepper from "@/components/WorkflowStepper";
import PatientSearchPanel from "@/components/PatientSearchPanel";
import TranscriptInputPanel from "@/components/TranscriptInputPanel";
import ActionList from "@/components/ActionList";
import AftercarePanel from "@/components/AftercarePanel";
import { WorkflowProvider, useWorkflow } from "@/components/WorkflowContext";

function HomeContent() {
  const { allApproved, actions } = useWorkflow();

  return (
    <>
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNav />

        {/* Workflow Stepper */}
        <WorkflowStepper />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Upper Section: Patient Search + Transcript */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Patient Search */}
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col min-h-[500px]">
                <PatientSearchPanel />
              </div>

              {/* Right: Transcript Input */}
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col min-h-[500px]">
                <TranscriptInputPanel />
              </div>
            </div>

            {/* Lower Section: Draft Clinical Actions */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Draft Clinical Actions
                </h1>
                <p className="text-sm text-slate-600">
                  AI-generated draft orders from the current consultation. Review and approve to send to Medplum EMR.
                </p>
              </div>

              <ActionList />
            </div>

            {/* After-Care Section (shown when all actions approved) */}
            {allApproved && actions.length > 0 && (
              <div>
                <AftercarePanel />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <WorkflowProvider>
      <HomeContent />
    </WorkflowProvider>
  );
}
