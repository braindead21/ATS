"use client";

import { useState, useEffect } from "react";
import { JobOrder, Company, User } from "@/types";
import { JobOrderStatus } from "@/lib/constants/enums";
import { Button, Input, Label, Textarea, Select, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { jobOrderService } from "@/features/job-orders/services";
import { companyService } from "@/features/companies/services";
import { userService } from "@/services/user.service";
import { UserRole } from "@/lib/constants/enums";

interface AddJobOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobOrderAdded: (jobOrder: JobOrder) => void;
  createdBy: string;
}

export function AddJobOrderDialog({ open, onOpenChange, onJobOrderAdded, createdBy }: AddJobOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recruiters, setRecruiters] = useState<User[]>([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    companyId: "",
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryRange: "",
    positions: 1,
  });

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [companiesData, recruitersData] = await Promise.all([
        companyService.getAll(),
        userService.getByRole(UserRole.RECRUITER),
      ]);
      setCompanies(companiesData);
      setRecruiters(recruitersData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleRecruiterToggle = (recruiterId: string) => {
    setSelectedRecruiters((prev) =>
      prev.includes(recruiterId)
        ? prev.filter((id) => id !== recruiterId)
        : [...prev, recruiterId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newJobOrder = await jobOrderService.create({
        ...formData,
        positions: Number(formData.positions),
        status: JobOrderStatus.OPEN,
        createdBy,
        assignedRecruiters: selectedRecruiters,
      });

      onJobOrderAdded(newJobOrder);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        companyId: "",
        title: "",
        description: "",
        requirements: "",
        location: "",
        salaryRange: "",
        positions: 1,
      });
      setSelectedRecruiters([]);
    } catch (error) {
      console.error("Failed to create job order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyId">Company *</Label>
            <Select
              id="companyId"
              required
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Senior Full Stack Developer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Job description..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="e.g., 5+ years experience, React, Node.js..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input
                id="salaryRange"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                placeholder="e.g., $120k - $160k"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="positions">Number of Positions *</Label>
            <Input
              id="positions"
              type="number"
              min="1"
              required
              value={formData.positions}
              onChange={(e) => setFormData({ ...formData, positions: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Assign Recruiters</Label>
            <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
              {recruiters.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recruiters available</p>
              ) : (
                recruiters.map((recruiter) => (
                  <label key={recruiter.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRecruiters.includes(recruiter.id)}
                      onChange={() => handleRecruiterToggle(recruiter.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{recruiter.name}</span>
                  </label>
                ))
              )}
            </div>
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
              {isLoading ? "Creating..." : "Create Job Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
