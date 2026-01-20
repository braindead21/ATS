"use client";

import { useState } from "react";
import { CandidateStatus } from "@/types";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Label } from "@/components/ui";
import { XCircle, CheckCircle, Pause, ArrowRight } from "lucide-react";

interface DecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDecision: (decision: CandidateStatus, notes?: string) => void;
  interviewLevel: string;
}

export function DecisionModal({
  open,
  onOpenChange,
  onDecision,
  interviewLevel,
}: DecisionModalProps) {
  const [selectedDecision, setSelectedDecision] = useState<CandidateStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const decisions = [
    {
      value: CandidateStatus.REJECTED,
      label: "Reject Candidate",
      icon: XCircle,
      color: "border-red-200 hover:border-red-400 hover:bg-red-50",
      selectedColor: "border-red-500 bg-red-50",
      description: "Candidate is not suitable for this position",
    },
    {
      value: CandidateStatus.HIRED,
      label: "Hire Candidate",
      icon: CheckCircle,
      color: "border-green-200 hover:border-green-400 hover:bg-green-50",
      selectedColor: "border-green-500 bg-green-50",
      description: "Candidate passed all requirements - extend offer",
    },
    {
      value: CandidateStatus.ON_HOLD,
      label: "Put on Hold",
      icon: Pause,
      color: "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50",
      selectedColor: "border-yellow-500 bg-yellow-50",
      description: "Pause process - will revisit later",
    },
    {
      value: CandidateStatus.NEXT_INTERVIEW,
      label: "Move to Next Interview",
      icon: ArrowRight,
      color: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
      selectedColor: "border-blue-500 bg-blue-50",
      description: "Candidate performed well - schedule next round",
    },
  ];

  const handleSubmit = async () => {
    if (!selectedDecision) return;
    
    setIsLoading(true);
    try {
      await onDecision(selectedDecision, notes || undefined);
      setSelectedDecision(null);
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save decision:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && !isLoading) {
        setSelectedDecision(null);
        setNotes("");
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Interview {interviewLevel} Completed - Make Decision</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose the next step for this candidate. This decision cannot be undone.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {decisions.map((decision) => {
              const Icon = decision.icon;
              const isSelected = selectedDecision === decision.value;
              
              return (
                <button
                  key={decision.value}
                  onClick={() => setSelectedDecision(decision.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected ? decision.selectedColor : decision.color
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{decision.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {decision.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Decision Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this decision..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedDecision || isLoading}
            >
              {isLoading ? "Saving..." : "Confirm Decision"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
