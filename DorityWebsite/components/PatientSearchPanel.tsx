"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, User, Calendar, Hash } from "lucide-react";
import { useWorkflow, type Patient } from "./WorkflowContext";

// Mock patient data - TODO: Replace with Medplum Patient search
const MOCK_PATIENTS: Patient[] = [
  {
    id: "patient-001",
    name: "John Smith",
    mrn: "MRN-10234",
    dob: "1965-03-15",
    keyInfo: "T2DM, HTN. Current meds: Metformin 500mg BID, Lisinopril 10mg daily",
    email: "john.smith@email.com",
  },
  {
    id: "patient-002",
    name: "Sarah Johnson",
    mrn: "MRN-10567",
    dob: "1978-07-22",
    keyInfo: "Asthma, GERD. Current meds: Albuterol PRN, Omeprazole 20mg daily",
    email: "sarah.j@email.com",
  },
  {
    id: "patient-003",
    name: "Michael Chen",
    mrn: "MRN-10891",
    dob: "1952-11-08",
    keyInfo: "CHF, CKD Stage 3. Current meds: Furosemide 40mg daily, Carvedilol 12.5mg BID",
    email: "m.chen@email.com",
  },
  {
    id: "patient-004",
    name: "Emily Rodriguez",
    mrn: "MRN-11024",
    dob: "1990-02-14",
    keyInfo: "Hypothyroidism, migraines. Current meds: Levothyroxine 75mcg daily, Sumatriptan PRN",
    email: "emily.r90@email.com",
  },
];

export default function PatientSearchPanel() {
  const { selectedPatient, setSelectedPatient, setCurrentStep } = useWorkflow();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      // TODO: Replace with real Medplum Patient search
      // Example: medplum.searchResources('Patient', { name: searchQuery })
      
      const query = searchQuery.toLowerCase();
      const results = MOCK_PATIENTS.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.mrn.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query)
      );

      setSearchResults(results);
      setIsSearching(false);
      setHasSearched(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentStep(2); // Move to transcript step
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
          Patient Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient by name, MRN, or ID…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto mb-4">
        {isSearching && (
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Searching patients…</span>
          </div>
        )}

        {!isSearching && hasSearched && searchResults.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No patients found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map((patient) => {
              const isSelected = selectedPatient?.id === patient.id;
              return (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-blue-50 border-blue-300 ring-2 ring-blue-100"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <User className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {patient.name}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 ml-6">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {patient.mrn}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {patient.dob}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!hasSearched && !searchQuery && (
          <div className="text-center py-12 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Start typing to search for patients</p>
          </div>
        )}
      </div>

      {/* Selected Patient Summary */}
      {selectedPatient && (
        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
            Selected Patient
          </h3>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-900">{selectedPatient.name}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
                  <div>
                    <span className="font-medium">MRN:</span> {selectedPatient.mrn}
                  </div>
                  <div>
                    <span className="font-medium">DOB:</span> {selectedPatient.dob}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/60 rounded p-2 border border-blue-200/50">
              <p className="text-xs font-medium text-slate-700 mb-1">Key Information:</p>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedPatient.keyInfo}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
