"use client";

import { useState, useEffect } from "react";
import { Loader2, Inbox } from "lucide-react";
import ActionCard from "./ActionCard";
import ActionDetailsModal from "./ActionDetailsModal";
import { useWorkflow } from "./WorkflowContext";

// Type definitions for clinical actions
export interface ClinicalAction {
  id: string;
  type: "medication" | "service";
  patient: {
    name: string;
  };
  label: string;
  details: {
    dose?: string;
    instruction?: string;
    intent?: string;
    code?: string;
    reason?: string;
  };
  confidence: number;
  transcriptId?: string;
  approved?: boolean;
}

export default function ActionList() {
  const { actions, isGenerating, allApproved, setCurrentStep } = useWorkflow();
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  // Auto-advance to step 4 when all actions are approved
  useEffect(() => {
    if (allApproved && actions.length > 0) {
      setCurrentStep(4);
    }
  }, [allApproved, actions.length, setCurrentStep]);

  const selectedAction = actions.find((a) => a.id === selectedActionId);

  // Loading state (while generating)
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm font-medium">Generating draft orders from transcript…</p>
      </div>
    );
  }

  // Empty state
  if (actions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Inbox className="w-12 h-12 mb-3" />
        <p className="text-sm font-medium">No draft actions generated yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Paste a transcript above and click &quot;Generate Actions&quot;
        </p>
      </div>
    );
  }

  // Success state with data
  return (
    <>
      <div className="space-y-4">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            onViewDetails={() => setSelectedActionId(action.id)}
          />
        ))}
      </div>

      {/* Action Details Modal */}
      {selectedAction && (
        <ActionDetailsModal
          action={selectedAction}
          onClose={() => setSelectedActionId(null)}
        />
      )}
    </>
  );
}
