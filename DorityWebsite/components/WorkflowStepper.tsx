"use client";

import React from "react";
import { User, FileText, CheckCircle, Mail } from "lucide-react";
import { useWorkflow } from "./WorkflowContext";

const steps = [
  { number: 1, label: "Select Patient", icon: User },
  { number: 2, label: "Transcript", icon: FileText },
  { number: 3, label: "Actions", icon: CheckCircle },
  { number: 4, label: "After-care", icon: Mail },
];

export default function WorkflowStepper() {
  const { currentStep } = useWorkflow();

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isUpcoming = currentStep < step.number;

            return (
              <React.Fragment key={step.number}>
                {/* Step */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      isActive
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${
                        isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      Step {step.number}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        isActive ? "text-slate-900" : isUpcoming ? "text-slate-400" : "text-slate-700"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-1 rounded-full transition-all ${
                        currentStep > step.number ? "bg-green-500" : "bg-slate-200"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
