"use client";

import { useState } from "react";
import { Offer } from "@/types";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Textarea } from "@/components/ui";

interface CreateOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOffer: (offer: Omit<Offer, "id" | "createdAt" | "updatedAt" | "status">) => void;
  candidateId: string;
  jobOrderId: string;
  jobTitle: string;
  createdBy: string;
}

export function CreateOfferDialog({
  open,
  onOpenChange,
  onCreateOffer,
  candidateId,
  jobOrderId,
  jobTitle,
  createdBy,
}: CreateOfferDialogProps) {
  const [formData, setFormData] = useState({
    offeredRole: jobTitle,
    offeredSalary: "",
    expectedJoiningDate: "",
    joiningBonus: "",
    benefits: "",
    offerNotes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onCreateOffer({
        candidateId,
        jobOrderId,
        offeredRole: formData.offeredRole,
        offeredSalary: formData.offeredSalary,
        expectedJoiningDate: new Date(formData.expectedJoiningDate),
        joiningBonus: formData.joiningBonus ? Number(formData.joiningBonus) : undefined,
        benefits: formData.benefits || undefined,
        offerNotes: formData.offerNotes || undefined,
        offeredAt: new Date(),
        createdBy,
      });

      // Reset form
      setFormData({
        offeredRole: jobTitle,
        offeredSalary: "",
        expectedJoiningDate: "",
        joiningBonus: "",
        benefits: "",
        offerNotes: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create offer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create & Release Offer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offeredRole">Offered Role</Label>
            <Input
              id="offeredRole"
              value={formData.offeredRole}
              onChange={(e) => setFormData({ ...formData, offeredRole: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offeredSalary">Offered Salary</Label>
            <Input
              id="offeredSalary"
              value={formData.offeredSalary}
              onChange={(e) => setFormData({ ...formData, offeredSalary: e.target.value })}
              placeholder="e.g., $120,000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedJoiningDate">Expected Joining Date</Label>
            <Input
              id="expectedJoiningDate"
              type="date"
              value={formData.expectedJoiningDate}
              onChange={(e) => setFormData({ ...formData, expectedJoiningDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="joiningBonus">Joining Bonus (Optional)</Label>
            <Input
              id="joiningBonus"
              type="number"
              value={formData.joiningBonus}
              onChange={(e) => setFormData({ ...formData, joiningBonus: e.target.value })}
              placeholder="e.g., 10000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits Package (Optional)</Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="Health insurance, 401k matching, stock options, etc."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerNotes">Offer Notes (Optional)</Label>
            <Textarea
              id="offerNotes"
              value={formData.offerNotes}
              onChange={(e) => setFormData({ ...formData, offerNotes: e.target.value })}
              placeholder="Additional details, benefits, etc."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Release Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
