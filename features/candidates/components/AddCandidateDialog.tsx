"use client";

import { useState } from "react";
import { Candidate, CandidateStatus } from "@/types";
import { Button, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { candidateService } from "@/features/candidates/services";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidateAdded: (candidate: Candidate) => void;
  jobOrderId: string;
  addedBy: string;
}

export function AddCandidateDialog({
  open,
  onOpenChange,
  onCandidateAdded,
  jobOrderId,
  addedBy,
}: AddCandidateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    linkedinUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newCandidate = await candidateService.create({
        ...formData,
        jobOrderId,
        addedBy,
        status: CandidateStatus.NO_CONTACT,
      });

      onCandidateAdded(newCandidate);
      onOpenChange(false);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        resumeUrl: "",
        linkedinUrl: "",
      });
    } catch (error) {
      console.error("Failed to create candidate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.doe@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1-555-0100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              type="url"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Candidate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
