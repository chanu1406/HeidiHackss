"use client";

import { useState } from "react";
import { Mail, Eye, Send, Loader2, CheckCircle } from "lucide-react";
import { useWorkflow } from "./WorkflowContext";

export default function AftercarePanel() {
  const { selectedPatient, actions } = useWorkflow();
  const [email, setEmail] = useState(selectedPatient?.email || "");
  const [summary, setSummary] = useState(() => generateSummary());
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  function generateSummary(): string {
    if (!selectedPatient || actions.length === 0) return "";

    const approvedActions = actions.filter((a) => a.approved);
    
    let summaryText = `Dear ${selectedPatient.name.split(" ")[0]},\n\n`;
    summaryText += `Thank you for your visit today. Here's a summary of our consultation:\n\n`;

    const medications = approvedActions.filter((a) => a.type === "medication");
    const services = approvedActions.filter((a) => a.type === "service");

    if (medications.length > 0) {
      summaryText += `MEDICATIONS:\n`;
      medications.forEach((med) => {
        summaryText += `• ${med.label}`;
        if (med.details.instruction) {
          summaryText += ` - ${med.details.instruction}`;
        }
        summaryText += `\n`;
      });
      summaryText += `\n`;
    }

    if (services.length > 0) {
      summaryText += `TESTS & PROCEDURES:\n`;
      services.forEach((svc) => {
        summaryText += `• ${svc.label}`;
        if (svc.details.reason) {
          summaryText += ` - ${svc.details.reason}`;
        }
        summaryText += `\n`;
      });
      summaryText += `\n`;
    }

    summaryText += `NEXT STEPS:\n`;
    summaryText += `• Please follow the medication instructions as prescribed\n`;
    if (services.length > 0) {
      summaryText += `• Complete the recommended tests at your earliest convenience\n`;
    }
    summaryText += `• Schedule a follow-up appointment in 4-6 weeks\n`;
    summaryText += `• Contact us if you have any questions or concerns\n\n`;
    summaryText += `If you experience any side effects or have questions about your treatment, please don't hesitate to reach out to our office.\n\n`;
    summaryText += `Best regards,\nYour Healthcare Team`;

    return summaryText;
  }

  const handleSendEmail = async () => {
    if (!email.trim()) {
      alert("Please enter an email address");
      return;
    }

    setIsSending(true);
    setSendSuccess(false);

    try {
      // TODO: Replace with real backend API call
      // Example: POST /api/aftercare-email with { patientId, email, summary, actions }
      // This will format and send the email via SendGrid, AWS SES, or similar

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSendSuccess(true);
    } catch (error) {
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">After-Care Summary & Email</h2>
        <p className="text-sm text-slate-600">
          Review and send a patient-friendly summary of today&apos;s visit and approved orders.
        </p>
      </div>

      {/* Email Address */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Patient Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="patient@email.com"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Summary Text */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Summary Message
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={12}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono resize-none"
        />
        <p className="text-xs text-slate-500 mt-1">
          Edit the message above before sending. It will be formatted as HTML in the email.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {showPreview ? "Hide Preview" : "Preview Email"}
        </button>

        <button
          onClick={handleSendEmail}
          disabled={isSending || sendSuccess || !email.trim()}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : sendSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Sent!
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send After-Care Email
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {sendSuccess && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-900">
              After-care email sent successfully!
            </p>
            <p className="text-sm text-green-700 mt-1">
              Email sent to <strong>{email}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Email Preview */}
      {showPreview && (
        <div className="mt-6 border border-slate-300 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
            <p className="text-xs font-semibold text-slate-700">Email Preview</p>
          </div>
          <div className="bg-white p-6">
            <div className="mb-4 text-sm text-slate-600">
              <p>
                <strong>To:</strong> {email || "(no email provided)"}
              </p>
              <p>
                <strong>From:</strong> noreply@clinicalactionlayer.com
              </p>
              <p>
                <strong>Subject:</strong> After-Care Summary from Your Recent Visit
              </p>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <div className="whitespace-pre-wrap text-sm text-slate-800 font-sans leading-relaxed">
                {summary}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
