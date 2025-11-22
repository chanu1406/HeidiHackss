"use client";

import { useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { useWorkflow } from "./WorkflowContext";
import type { ClinicalAction } from "./ActionList";

export default function TranscriptInputPanel() {
  const {
    selectedPatient,
    transcript,
    setTranscript,
    setActions,
    setCurrentStep,
    isGenerating,
    setIsGenerating,
  } = useWorkflow();

  const [error, setError] = useState<string | null>(null);

  const handleGenerateActions = async () => {
    setError(null);

    // Validation
    if (!selectedPatient) {
      setError("Please select a patient first");
      return;
    }

    if (!transcript.trim()) {
      setError("Please enter a transcript");
      return;
    }

    setIsGenerating(true);

    try {
      // TODO: Replace with real backend API call
      // Example: POST /api/actions with { patientId: selectedPatient.id, transcript }
      // This will:
      // 1. Fetch full transcript from Heidi API (if needed)
      // 2. Send to Claude for clinical intent extraction
      // 3. Map Claude's output to FHIR MedicationRequest/ServiceRequest resources
      // 4. Return draft actions

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock generated actions based on transcript keywords
      const mockActions: ClinicalAction[] = [];

      const transcriptLower = transcript.toLowerCase();

      if (transcriptLower.includes("metformin") || transcriptLower.includes("diabetes") || transcriptLower.includes("blood sugar")) {
        mockActions.push({
          id: `action-${Date.now()}-1`,
          type: "medication",
          patient: { name: selectedPatient.name },
          label: "Metformin 500mg",
          details: {
            dose: "500mg",
            instruction: "Take 1 tablet twice daily with meals",
            intent: "order",
          },
          confidence: 0.92,
          transcriptId: `transcript-${Date.now()}`,
          approved: false,
        });
      }

      if (transcriptLower.includes("cbc") || transcriptLower.includes("blood work") || transcriptLower.includes("lab")) {
        mockActions.push({
          id: `action-${Date.now()}-2`,
          type: "service",
          patient: { name: selectedPatient.name },
          label: "Complete Blood Count (CBC)",
          details: {
            code: "CBC Lab Panel",
            reason: "Routine monitoring",
          },
          confidence: 0.87,
          transcriptId: `transcript-${Date.now()}`,
          approved: false,
        });
      }

      if (transcriptLower.includes("lisinopril") || transcriptLower.includes("blood pressure") || transcriptLower.includes("hypertension")) {
        mockActions.push({
          id: `action-${Date.now()}-3`,
          type: "medication",
          patient: { name: selectedPatient.name },
          label: "Lisinopril 10mg",
          details: {
            dose: "10mg",
            instruction: "Take 1 tablet once daily in the morning",
            intent: "order",
          },
          confidence: 0.88,
          transcriptId: `transcript-${Date.now()}`,
          approved: false,
        });
      }

      if (transcriptLower.includes("a1c") || transcriptLower.includes("hemoglobin")) {
        mockActions.push({
          id: `action-${Date.now()}-4`,
          type: "service",
          patient: { name: selectedPatient.name },
          label: "Hemoglobin A1C Test",
          details: {
            code: "HbA1c",
            reason: "Diabetes management and monitoring",
          },
          confidence: 0.91,
          transcriptId: `transcript-${Date.now()}`,
          approved: false,
        });
      }

      // If no keywords matched, provide a default action
      if (mockActions.length === 0) {
        mockActions.push({
          id: `action-${Date.now()}-1`,
          type: "service",
          patient: { name: selectedPatient.name },
          label: "Follow-up Appointment",
          details: {
            code: "Office Visit - Follow-up",
            reason: "Routine follow-up based on consultation",
          },
          confidence: 0.75,
          transcriptId: `transcript-${Date.now()}`,
          approved: false,
        });
      }

      setActions(mockActions);
      setCurrentStep(3); // Move to actions review step
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate actions");
    } finally {
      setIsGenerating(false);
    }
  };

  const isDisabled = !selectedPatient;
  const charCount = transcript.length;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
        <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
          Session Transcript
        </label>
        <p className="text-xs text-slate-600 mb-3">
          Paste or type the consultation transcript for this patient. This will be sent to the AI to generate draft orders.
        </p>
      </div>

      {isDisabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start gap-2">
          <FileText className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-900">Select a patient to begin</p>
            <p className="text-xs text-amber-700 mt-1">
              Search and select a patient on the left before entering the transcript.
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <textarea
          disabled={isDisabled}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            isDisabled
              ? "Select a patient first…"
              : "Patient presents with complaints of increased thirst and frequent urination over the past 3 months. Reports checking blood sugars at home, ranging 180-240 mg/dL fasting. Currently on Metformin 500mg daily. Discussed increasing dose and ordering labs including CBC and HbA1c. Patient also mentions elevated blood pressure readings at home (150/95). Will start Lisinopril 10mg daily..."
          }
          className="flex-1 w-full p-4 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
        />

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-500">
            {charCount} character{charCount !== 1 ? "s" : ""}
          </span>

          <button
            onClick={handleGenerateActions}
            disabled={isDisabled || isGenerating || !transcript.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing transcript…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Actions from Transcript
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <div className="text-sm text-red-900">{error}</div>
          </div>
        )}

        {isGenerating && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <p className="text-sm text-blue-900">
              Analyzing transcript and generating draft orders…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
