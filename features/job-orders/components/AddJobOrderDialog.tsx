"use client";

import { useState, useEffect } from "react";
import { JobOrder, Company, User } from "@/types";
import { JobOrderStatus } from "@/lib/constants/enums";
import { Button, Input, Label, Textarea, Select, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { jobOrderService } from "@/features/job-orders/services";
import { companyService } from "@/features/companies/services";
import { userService } from "@/services/user.service";
import { UserRole } from "@/lib/constants/enums";
import { X, ChevronDown } from "lucide-react";

interface AddJobOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobOrderAdded: (jobOrder: JobOrder) => void;
  createdBy: string;
  preselectedCompanyId?: string;
}

export function AddJobOrderDialog({ open, onOpenChange, onJobOrderAdded, createdBy, preselectedCompanyId }: AddJobOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recruiters, setRecruiters] = useState<User[]>([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState<string[]>([]);
  const [recruiterSearch, setRecruiterSearch] = useState("");
  const [showRecruiterDropdown, setShowRecruiterDropdown] = useState(false);
  
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

  useEffect(() => {
    if (preselectedCompanyId && companies.length > 0) {
      setFormData(prev => ({ ...prev, companyId: preselectedCompanyId }));
    }
  }, [preselectedCompanyId, companies]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.recruiter-dropdown-container')) {
        setShowRecruiterDropdown(false);
      }
    };

    if (showRecruiterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRecruiterDropdown]);

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

  const handleAddRecruiter = (recruiterId: string) => {
    if (!selectedRecruiters.includes(recruiterId)) {
      setSelectedRecruiters([...selectedRecruiters, recruiterId]);
    }
    setRecruiterSearch("");
    setShowRecruiterDropdown(false);
  };

  const handleRemoveRecruiter = (recruiterId: string) => {
    setSelectedRecruiters(selectedRecruiters.filter((id) => id !== recruiterId));
  };

  const getRecruiterById = (id: string) => {
    return recruiters.find((r) => r.id === id);
  };

  const filteredRecruiters = recruiters.filter(
    (recruiter) =>
      !selectedRecruiters.includes(recruiter.id) &&
      recruiter.name.toLowerCase().includes(recruiterSearch.toLowerCase())
  );

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
            <div className="space-y-2">
              {/* Dropdown Button */}
              <div className="recruiter-dropdown-container">
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setShowRecruiterDropdown(!showRecruiterDropdown)}
                >
                  <span className="text-muted-foreground">
                    {selectedRecruiters.length === 0 
                      ? "Select recruiters..." 
                      : `${selectedRecruiters.length} recruiter(s) selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                
                {/* Dropdown Menu - Using relative positioning to push content below */}
                {showRecruiterDropdown && (
                  <div className="w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b">
                      <Input
                        placeholder="Search recruiters..."
                        value={recruiterSearch}
                        onChange={(e) => setRecruiterSearch(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                    </div>
                    
                    {/* Recruiter List */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredRecruiters.length === 0 ? (
                        <div className="p-3 text-center">
                          <p className="text-sm text-muted-foreground">
                            {recruiterSearch ? `No recruiters found matching "${recruiterSearch}"` : "No recruiters available"}
                          </p>
                        </div>
                      ) : (
                        filteredRecruiters.map((recruiter) => (
                          <button
                            key={recruiter.id}
                            type="button"
                            className="w-full px-3 py-2 hover:bg-accent cursor-pointer flex items-center justify-between text-left transition-colors"
                            onClick={() => handleAddRecruiter(recruiter.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {recruiter.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{recruiter.name}</p>
                                <p className="text-xs text-muted-foreground">{recruiter.email}</p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    
                    {/* Show all recruiters option */}
                    {recruiters.length > 0 && (
                      <div className="p-2 border-t">
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setRecruiterSearch("")}
                        >
                          {filteredRecruiters.length} of {recruiters.length} recruiters shown
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Recruiters Tags */}
              {selectedRecruiters.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-accent/30">
                  {selectedRecruiters.map((recruiterId) => {
                    const recruiter = getRecruiterById(recruiterId);
                    return recruiter ? (
                      <div
                        key={recruiterId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                      >
                        <span>{recruiter.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecruiter(recruiterId)}
                          className="hover:bg-primary/80 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
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
