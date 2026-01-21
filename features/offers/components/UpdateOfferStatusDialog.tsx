"use client";

import { useState } from "react";
import { Dialog, Button, Label, Textarea } from "@/components/ui";
import { OfferStatus } from "@/lib/constants/enums";

interface UpdateOfferStatusDialogProps {
  offerId: string;
  currentStatus: string;
  candidateName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateOfferStatusDialog({
  offerId,
  currentStatus,
  candidateName,
  onClose,
  onSuccess,
}: UpdateOfferStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/offers/${offerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          offerNotes: notes,
        }),
      });

      if (!response.ok) throw new Error("Failed to update offer status");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating offer:", error);
      alert("Failed to update offer status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            Update Offer Status
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Update offer status for <strong>{candidateName}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>Select New Status *</Label>
              
              <button
                type="button"
                onClick={() => setNewStatus(OfferStatus.ACCEPTED)}
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  newStatus === OfferStatus.ACCEPTED
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="font-semibold text-green-700">✓ Accepted</div>
                <div className="text-sm text-gray-600">
                  Candidate accepted the offer → Status: Joined
                </div>
              </button>

              <button
                type="button"
                onClick={() => setNewStatus(OfferStatus.DECLINED)}
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  newStatus === OfferStatus.DECLINED
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="font-semibold text-red-700">✗ Declined</div>
                <div className="text-sm text-gray-600">
                  Candidate declined the offer → Status: Offer Declined
                </div>
              </button>

              <button
                type="button"
                onClick={() => setNewStatus(OfferStatus.WITHDRAWN)}
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  newStatus === OfferStatus.WITHDRAWN
                    ? "border-gray-500 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-700">⊘ Withdrawn</div>
                <div className="text-sm text-gray-600">
                  Company withdrew the offer → Status: Rejected
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!newStatus || isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
