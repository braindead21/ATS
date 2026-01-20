"use client";

import { useState } from "react";
import { CandidateStatus } from "@/types";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Label } from "@/components/ui";
import { CheckCircle, XCircle, Ban } from "lucide-react";

interface PostJoiningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOutcome: (outcome: CandidateStatus, notes?: string) => void;
}

export function PostJoiningDialog({
  open,
  onOpenChange,
  onOutcome,
}: PostJoiningDialogProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<CandidateStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const outcomes = [
    {
      value: CandidateStatus.SUCCESSFUL_HIRE,
      label: "Successful Hire",
      icon: CheckCircle,
      color: "border-green-200 hover:border-green-400 hover:bg-green-50",
      selectedColor: "border-green-500 bg-green-50",
      description: "Candidate performing well - no issues",
    },
    {
      value: CandidateStatus.BAD_DELIVERY,
      label: "Bad Delivery",
      icon: XCircle,
      color: "border-orange-200 hover:border-orange-400 hover:bg-orange-50",
      selectedColor: "border-orange-500 bg-orange-50",
      description: "Performance issues or not meeting expectations",
    },
    {
      value: CandidateStatus.TERMINATED,
      label: "Terminated",
      icon: Ban,
      color: "border-red-200 hover:border-red-400 hover:bg-red-50",
      selectedColor: "border-red-500 bg-red-50",
      description: "Employment terminated",
    },
  ];

  const handleSubmit = async () => {
    if (!selectedOutcome) return;
    
    setIsLoading(true);
    try {
      await onOutcome(selectedOutcome, notes || undefined);
      setSelectedOutcome(null);
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save post-joining outcome:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && !isLoading) {
        setSelectedOutcome(null);
        setNotes("");
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Post-Joining Outcome</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Record the final outcome after the candidate has joined.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;
              const isSelected = selectedOutcome === outcome.value;
              
              return (
                <button
                  key={outcome.value}
                  onClick={() => setSelectedOutcome(outcome.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected ? outcome.selectedColor : outcome.color
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{outcome.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {outcome.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Outcome Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details about the outcome..."
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
              disabled={!selectedOutcome || isLoading}
            >
              {isLoading ? "Saving..." : "Confirm Outcome"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
