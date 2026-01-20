"use client";

import { AlertTriangle } from "lucide-react";

interface UnassignedWarningProps {
  message?: string;
}

export function UnassignedWarning({ message = "No recruiters assigned. Assign a recruiter to start hiring." }: UnassignedWarningProps) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-yellow-800">Action Required</h3>
          <p className="text-sm text-yellow-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
