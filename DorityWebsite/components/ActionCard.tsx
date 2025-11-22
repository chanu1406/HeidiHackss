"use client";

import { Pill, Stethoscope, CheckCircle2, AlertTriangle, Check } from "lucide-react";
import type { ClinicalAction } from "./ActionList";
import { useWorkflow } from "./WorkflowContext";

interface ActionCardProps {
  action: ClinicalAction;
  onViewDetails: () => void;
}

export default function ActionCard({ action, onViewDetails }: ActionCardProps) {
  const { updateAction } = useWorkflow();

  const handleApprove = () => {
    // TODO: In production, this would call an API endpoint to create the FHIR resource in Medplum
    // Example: POST /api/approveAction with the action data
    // or medplum.createResource('MedicationRequest' | 'ServiceRequest', fhirResource)
    console.log(`[Action approved] Would send to Medplum:`, action);
    updateAction(action.id, { approved: true });
  };

  const isLowConfidence = action.confidence < 0.7;
  const Icon = action.type === "medication" ? Pill : Stethoscope;
  const resourceType = action.type === "medication" ? "MedicationRequest" : "ServiceRequest";
  const isApproved = action.approved === true;

  return (
    <div
      className={`bg-white border rounded-lg shadow-sm transition-all ${
        isApproved
          ? "border-green-300 bg-green-50/30"
          : "border-slate-200 hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-start justify-between">
          {/* Left: Icon + Title */}
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isApproved
                  ? "bg-green-100 text-green-600"
                  : action.type === "medication"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-slate-900 mb-0.5">
                {action.label}
                {isApproved && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    <Check className="w-3 h-3" />
                    Approved
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {resourceType} • {action.patient.name}
              </p>
            </div>
          </div>

          {/* Right: Confidence Indicator */}
          {!isApproved && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 ml-3 ${
                isLowConfidence
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              {isLowConfidence ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              )}
              <span
                className={`text-xs font-semibold ${
                  isLowConfidence ? "text-amber-700" : "text-green-700"
                }`}
              >
                {Math.round(action.confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className={`p-4 ${isApproved ? "bg-green-50/50" : "bg-slate-50"}`}>
        <div className="space-y-2 text-sm">
          {action.type === "medication" && (
            <>
              {action.details.dose && (
                <div className="flex gap-2">
                  <span className="text-slate-500 font-medium w-24 flex-shrink-0">Dose:</span>
                  <span className="text-slate-900">{action.details.dose}</span>
                </div>
              )}
              {action.details.instruction && (
                <div className="flex gap-2">
                  <span className="text-slate-500 font-medium w-24 flex-shrink-0">
                    Instructions:
                  </span>
                  <span className="text-slate-900">{action.details.instruction}</span>
                </div>
              )}
              {action.details.intent && (
                <div className="flex gap-2">
                  <span className="text-slate-500 font-medium w-24 flex-shrink-0">Intent:</span>
                  <span className="text-slate-900 capitalize">{action.details.intent}</span>
                </div>
              )}
            </>
          )}

          {action.type === "service" && (
            <>
              {action.details.code && (
                <div className="flex gap-2">
                  <span className="text-slate-500 font-medium w-24 flex-shrink-0">Code:</span>
                  <span className="text-slate-900">{action.details.code}</span>
                </div>
              )}
              {action.details.reason && (
                <div className="flex gap-2">
                  <span className="text-slate-500 font-medium w-24 flex-shrink-0">Reason:</span>
                  <span className="text-slate-900">{action.details.reason}</span>
                </div>
              )}
            </>
          )}

          {action.transcriptId && (
            <div className="flex gap-2 pt-2 border-t border-slate-200 mt-2">
              <span className="text-xs text-slate-400">
                Derived from transcript{" "}
                <code className="text-slate-600 font-mono">{action.transcriptId}</code>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex items-center justify-end gap-3">
        <button
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onViewDetails}
          disabled={isApproved}
        >
          View Details
        </button>
        <button
          onClick={handleApprove}
          disabled={isApproved}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm hover:shadow transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {isApproved ? "Approved" : "Approve & Sign"}
        </button>
      </div>
    </div>
  );
}
