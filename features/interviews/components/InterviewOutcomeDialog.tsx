"use client";

import { useState } from "react";
import { Dialog, Button, Label, Textarea, Select } from "@/components/ui";
import { InterviewOutcome } from "@/lib/constants/enums";

interface InterviewOutcomeDialogProps {
  interviewId: string;
  currentLevel: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function InterviewOutcomeDialog({
  interviewId,
  currentLevel,
  onClose,
  onSuccess,
}: InterviewOutcomeDialogProps) {
  const [outcome, setOutcome] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          outcome,
          feedback,
        }),
      });

      if (!response.ok) throw new Error("Failed to update interview");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating interview:", error);
      alert("Failed to update interview outcome");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            Interview {currentLevel} Outcome
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome *</Label>
              <select
                id="outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Select outcome...</option>
                <option value={InterviewOutcome.HIRED}>
                  Hired - Proceed to offer
                </option>
                <option value={InterviewOutcome.NEXT_INTERVIEW}>
                  Move to Next Interview Round
                </option>
                <option value={InterviewOutcome.ON_HOLD}>
                  On Hold - Keep for future
                </option>
                <option value={InterviewOutcome.REJECTED}>
                  Rejected - Not suitable
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback / Notes</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add interview feedback, strengths, weaknesses, etc."
                rows={5}
              />
            </div>

            {outcome === InterviewOutcome.HIRED && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">
                  ✓ Candidate will be marked as HIRED. You can then create an offer for this candidate.
                </p>
              </div>
            )}

            {outcome === InterviewOutcome.NEXT_INTERVIEW && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  → Candidate will be marked for NEXT INTERVIEW. Schedule the next round (L2, L3, L4).
                </p>
              </div>
            )}

            {outcome === InterviewOutcome.REJECTED && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  ✗ Candidate will be marked as REJECTED. No further interviews can be scheduled.
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!outcome || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Outcome"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
