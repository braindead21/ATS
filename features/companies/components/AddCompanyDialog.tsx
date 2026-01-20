"use client";

import { useState } from "react";
import { Company } from "@/types";
import { CompanyStatus } from "@/lib/constants/enums";
import { Button, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { companyService } from "@/features/companies/services";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyAdded: (company: Company) => void;
  createdBy: string;
}

export function AddCompanyDialog({ open, onOpenChange, onCompanyAdded, createdBy }: AddCompanyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newCompany = await companyService.create({
        ...formData,
        status: CompanyStatus.ACTIVE,
        createdBy,
      });

      onCompanyAdded(newCompany);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        industry: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
      });
    } catch (error) {
      console.error("Failed to create company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Tech Corp"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g., Technology"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="e.g., hr@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              placeholder="e.g., +1-555-0100"
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
              {isLoading ? "Creating..." : "Create Company"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
