"use client";

import { useState } from "react";
import { Candidate } from "@/types";
import { CandidateStatus } from "@/lib/constants/enums";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Label } from "@/components/ui";
import { candidateService } from "@/features/candidates/services";
import { Phone, PhoneOff, CheckCircle, XCircle } from "lucide-react";

interface CandidateActionsProps {
  candidate: Candidate;
  onCandidateUpdated: (candidate: Candidate) => void;
  canEdit: boolean;
}

export function CandidateActions({ candidate, onCandidateUpdated, canEdit }: CandidateActionsProps) {
  const [isContactedDialogOpen, setIsContactedDialogOpen] = useState(false);
  const [contactNotes, setContactNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRejected = candidate.status === CandidateStatus.REJECTED;
  const canContact = candidate.status === CandidateStatus.NO_CONTACT;
  const canScreen = candidate.status === CandidateStatus.CONTACTED;

  const handleMarkContacted = async () => {
    setIsLoading(true);
    try {
      const updated = await candidateService.updateStatus(candidate.id, CandidateStatus.CONTACTED);
      if (updated) {
        onCandidateUpdated(updated);
        setIsContactedDialogOpen(false);
        setContactNotes("");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualify = async () => {
    setIsLoading(true);
    try {
      const updated = await candidateService.updateStatus(candidate.id, CandidateStatus.QUALIFIED);
      if (updated) {
        onCandidateUpdated(updated);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const updated = await candidateService.updateStatus(candidate.id, CandidateStatus.REJECTED);
      if (updated) {
        onCandidateUpdated(updated);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canEdit || isRejected) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Contact Actions */}
      {canContact && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Initial Contact</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsContactedDialogOpen(true)}
              disabled={isLoading}
              size="sm"
            >
              <Phone className="h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>
      )}

      {/* Screening Actions */}
      {canScreen && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Screening Decision</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleQualify}
              disabled={isLoading}
              size="sm"
            >
              <CheckCircle className="h-4 w-4" />
              Qualify
            </Button>
            <Button
              onClick={handleReject}
              disabled={isLoading}
              variant="destructive"
              size="sm"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      )}

      {/* Contact Notes Dialog */}
      <Dialog open={isContactedDialogOpen} onOpenChange={setIsContactedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Contacted</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Call Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={contactNotes}
                onChange={(e) => setContactNotes(e.target.value)}
                placeholder="Add notes about the conversation..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactedDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleMarkContacted} disabled={isLoading}>
                {isLoading ? "Updating..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
