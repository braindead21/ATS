"use client";

import { useState } from "react";
import { Candidate, CandidateStatus } from "@/types";
import { Button, Input, Label, Textarea, Select, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
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
    middleName: "",
    lastName: "",
    email: "",
    secondaryEmail: "",
    webSite: "",
    homePhone: "",
    cellPhone: "",
    workPhone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    bestTimeToCall: "",
    phone: "", // keeping for compatibility
    resumeUrl: "",
    linkedinUrl: "",
    canRelocate: false,
    dateAvailable: "",
    currentEmployer: "",
    currentPay: "",
    desiredPay: "",
    source: "",
    keySkills: "",
    miscNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newCandidate = await candidateService.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.cellPhone || formData.homePhone || formData.workPhone,
        resumeUrl: formData.resumeUrl,
        linkedinUrl: formData.linkedinUrl,
        jobOrderId,
        addedBy,
        status: CandidateStatus.NO_CONTACT,
      });

      onCandidateAdded(newCandidate);
      onOpenChange(false);

      // Reset form
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        secondaryEmail: "",
        webSite: "",
        homePhone: "",
        cellPhone: "",
        workPhone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        bestTimeToCall: "",
        phone: "",
        resumeUrl: "",
        linkedinUrl: "",
        canRelocate: false,
        dateAvailable: "",
        currentEmployer: "",
        currentPay: "",
        desiredPay: "",
        source: "",
        keySkills: "",
        miscNotes: "",
      });
    } catch (error) {
      console.error("Failed to create candidate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Candidate to This Job Order Pipeline</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryEmail">2nd E-Mail</Label>
                <Input
                  id="secondaryEmail"
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webSite">Web Site</Label>
                <Input
                  id="webSite"
                  type="url"
                  value={formData.webSite}
                  onChange={(e) => setFormData({ ...formData, webSite: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homePhone">Home Phone</Label>
                <Input
                  id="homePhone"
                  value={formData.homePhone}
                  onChange={(e) => setFormData({ ...formData, homePhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cellPhone">Cell Phone</Label>
                <Input
                  id="cellPhone"
                  value={formData.cellPhone}
                  onChange={(e) => setFormData({ ...formData, cellPhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workPhone">Work Phone</Label>
                <Input
                  id="workPhone"
                  value={formData.workPhone}
                  onChange={(e) => setFormData({ ...formData, workPhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bestTimeToCall">Best Time to Call</Label>
                <Input
                  id="bestTimeToCall"
                  value={formData.bestTimeToCall}
                  onChange={(e) => setFormData({ ...formData, bestTimeToCall: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Resume */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Resume</h3>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Other */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Other</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="canRelocate" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="canRelocate"
                    checked={formData.canRelocate}
                    onChange={(e) => setFormData({ ...formData, canRelocate: e.target.checked })}
                    className="rounded"
                  />
                  Can Relocate
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateAvailable">Date Available</Label>
                <Select
                  id="dateAvailable"
                  value={formData.dateAvailable}
                  onChange={(e) => setFormData({ ...formData, dateAvailable: e.target.value })}
                >
                  <option value="">None</option>
                  <option value="Immediately">Immediately</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="1 month">1 Month</option>
                  <option value="2 months">2 Months</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentEmployer">Current Employer</Label>
                <Input
                  id="currentEmployer"
                  value={formData.currentEmployer}
                  onChange={(e) => setFormData({ ...formData, currentEmployer: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPay">Current Pay</Label>
                <Input
                  id="currentPay"
                  value={formData.currentPay}
                  onChange={(e) => setFormData({ ...formData, currentPay: e.target.value })}
                  placeholder="$"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desiredPay">Desired Pay</Label>
                <Input
                  id="desiredPay"
                  value={formData.desiredPay}
                  onChange={(e) => setFormData({ ...formData, desiredPay: e.target.value })}
                  placeholder="$"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="">(None)</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Referral">Referral</option>
                  <option value="Job Board">Job Board</option>
                  <option value="Company Website">Company Website</option>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="keySkills">Key Skills</Label>
                <Textarea
                  id="keySkills"
                  value={formData.keySkills}
                  onChange={(e) => setFormData({ ...formData, keySkills: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="miscNotes">Misc. Notes</Label>
                <Textarea
                  id="miscNotes"
                  value={formData.miscNotes}
                  onChange={(e) => setFormData({ ...formData, miscNotes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Back to Search
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
