"use client";

import { useState } from "react";
import { CandidateStatus } from "@/types";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Label } from "@/components/ui";
import { CheckCircle, XCircle } from "lucide-react";

interface OfferDecisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDecision: (accepted: boolean, notes?: string) => void;
}

export function OfferDecisionDialog({
  open,
  onOpenChange,
  onDecision,
}: OfferDecisionDialogProps) {
  const [selectedDecision, setSelectedDecision] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedDecision === null) return;
    
    setIsLoading(true);
    try {
      await onDecision(selectedDecision, notes || undefined);
      setSelectedDecision(null);
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save offer decision:", error);
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Offer Decision</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Record the candidate's response to the offer.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedDecision(true)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedDecision === true
                  ? "border-green-500 bg-green-50"
                  : "border-green-200 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Accept Offer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Candidate accepted the offer
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDecision(false)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedDecision === false
                  ? "border-red-500 bg-red-50"
                  : "border-red-200 hover:border-red-400 hover:bg-red-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 mt-0.5 text-red-600" />
                <div>
                  <p className="font-semibold text-sm">Decline Offer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Candidate declined the offer
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes..."
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
              disabled={selectedDecision === null || isLoading}
            >
              {isLoading ? "Saving..." : "Confirm Decision"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
