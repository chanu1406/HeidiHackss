"use client";

import { useState } from "react";
import { X, Save, CheckCircle } from "lucide-react";
import type { ClinicalAction } from "./ActionList";
import { useWorkflow } from "./WorkflowContext";

interface ActionDetailsModalProps {
  action: ClinicalAction;
  onClose: () => void;
}

export default function ActionDetailsModal({ action, onClose }: ActionDetailsModalProps) {
  const { updateAction } = useWorkflow();

  // Local state for editing
  const [editedAction, setEditedAction] = useState<ClinicalAction>({ ...action });

  const handleSave = () => {
    // TODO: In production, validate and sync changes to backend/Medplum before saving
    updateAction(action.id, editedAction);
    onClose();
  };

  const handleApprove = () => {
    // TODO: In production, this would call Medplum's createResource
    // Example: medplum.createResource(editedAction.type === 'medication' ? 'MedicationRequest' : 'ServiceRequest', fhirResource)
    updateAction(action.id, { ...editedAction, approved: true });
    onClose();
  };

  const isMedication = editedAction.type === "medication";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Draft Order</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isMedication ? "MedicationRequest" : "ServiceRequest"} • {editedAction.patient.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Label/Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isMedication ? "Medication Name" : "Service/Procedure Name"}
            </label>
            <input
              type="text"
              value={editedAction.label}
              onChange={(e) => setEditedAction({ ...editedAction, label: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Medication-specific fields */}
          {isMedication && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dose</label>
                <input
                  type="text"
                  value={editedAction.details.dose || ""}
                  onChange={(e) =>
                    setEditedAction({
                      ...editedAction,
                      details: { ...editedAction.details, dose: e.target.value },
                    })
                  }
                  placeholder="e.g., 500mg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={editedAction.details.instruction || ""}
                  onChange={(e) =>
                    setEditedAction({
                      ...editedAction,
                      details: { ...editedAction.details, instruction: e.target.value },
                    })
                  }
                  placeholder="e.g., Take 1 tablet twice daily with meals"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Intent</label>
                <select
                  value={editedAction.details.intent || "order"}
                  onChange={(e) =>
                    setEditedAction({
                      ...editedAction,
                      details: { ...editedAction.details, intent: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="order">Order</option>
                  <option value="plan">Plan</option>
                  <option value="proposal">Proposal</option>
                </select>
              </div>
            </>
          )}

          {/* Service-specific fields */}
          {!isMedication && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Code</label>
                <input
                  type="text"
                  value={editedAction.details.code || ""}
                  onChange={(e) =>
                    setEditedAction({
                      ...editedAction,
                      details: { ...editedAction.details, code: e.target.value },
                    })
                  }
                  placeholder="e.g., CBC Lab Panel"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reason</label>
                <textarea
                  value={editedAction.details.reason || ""}
                  onChange={(e) =>
                    setEditedAction({
                      ...editedAction,
                      details: { ...editedAction.details, reason: e.target.value },
                    })
                  }
                  placeholder="e.g., Routine monitoring for diabetes management"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
            </>
          )}

          {/* Confidence Score (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              AI Confidence Score
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
              {Math.round(editedAction.confidence * 100)}%
            </div>
          </div>

          {/* Transcript Reference (read-only) */}
          {editedAction.transcriptId && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Source Transcript
              </label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono">
                {editedAction.transcriptId}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Approve & Sign
          </button>
        </div>
      </div>
    </div>
  );
}
