"use client";

import { useState, useEffect } from "react";
import { Company } from "@/types";
import { CompanyStatus } from "@/lib/constants/enums";
import { Button, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/components/ui";
import { companyService } from "@/features/companies/services";

interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyUpdated: (company: Company) => void;
  company: Company;
}

export function EditCompanyDialog({ open, onOpenChange, onCompanyUpdated, company }: EditCompanyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    primaryPhone: "",
    secondaryPhone: "",
    faxNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    webSite: "",
    departments: "",
    keyTechnologies: "",
    miscNotes: "",
    isHotCompany: false,
    industry: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Populate form when company data changes
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        primaryPhone: company.primaryPhone || "",
        secondaryPhone: company.secondaryPhone || "",
        faxNumber: company.faxNumber || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        postalCode: company.postalCode || "",
        webSite: company.webSite || "",
        departments: company.departments || "",
        keyTechnologies: company.keyTechnologies || "",
        miscNotes: company.miscNotes || "",
        isHotCompany: company.isHotCompany || false,
        industry: company.industry || "",
        location: company.location || "",
        contactEmail: company.contactEmail || "",
        contactPhone: company.contactPhone || "",
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedCompany = await companyService.update(company.id, {
        ...formData,
        status: company.status,
        createdBy: company.createdBy,
      });

      if (updatedCompany) {
        onCompanyUpdated(updatedCompany);
        onOpenChange(false);
      } else {
        alert("Failed to update company. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update company:", error);
      alert("Failed to update company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryPhone">Primary Phone</Label>
                <Input
                  id="primaryPhone"
                  value={formData.primaryPhone}
                  onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                  placeholder="e.g., +1-555-0100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                <Input
                  id="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                  placeholder="e.g., +1-555-0101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faxNumber">Fax Number</Label>
                <Input
                  id="faxNumber"
                  value={formData.faxNumber}
                  onChange={(e) => setFormData({ ...formData, faxNumber: e.target.value })}
                  placeholder="e.g., +1-555-0102"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="e.g., contact@company.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter company address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g., San Francisco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g., CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="e.g., 94102"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webSite">Web Site</Label>
                <Input
                  id="webSite"
                  type="url"
                  value={formData.webSite}
                  onChange={(e) => setFormData({ ...formData, webSite: e.target.value })}
                  placeholder="e.g., https://company.com"
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
                <Label htmlFor="departments">Departments</Label>
                <Input
                  id="departments"
                  value={formData.departments}
                  onChange={(e) => setFormData({ ...formData, departments: e.target.value })}
                  placeholder="e.g., Engineering, Sales, HR"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <input
                    id="isHotCompany"
                    type="checkbox"
                    checked={formData.isHotCompany}
                    onChange={(e) => setFormData({ ...formData, isHotCompany: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isHotCompany" className="cursor-pointer">
                    Hot Company (Priority client)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Other Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Other Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="keyTechnologies">Key Technologies</Label>
              <Textarea
                id="keyTechnologies"
                value={formData.keyTechnologies}
                onChange={(e) => setFormData({ ...formData, keyTechnologies: e.target.value })}
                placeholder="List key technologies used by the company"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="miscNotes">Misc. Notes</Label>
              <Textarea
                id="miscNotes"
                value={formData.miscNotes}
                onChange={(e) => setFormData({ ...formData, miscNotes: e.target.value })}
                placeholder="Additional notes about the company"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
