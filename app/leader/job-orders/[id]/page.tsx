"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { JobOrder, Company, User, Candidate } from "@/types";
import { Button, UnassignedWarning } from "@/components/ui";
import { ArrowLeft, Building2, MapPin, DollarSign, Users, Plus } from "lucide-react";
import { jobOrderService } from "@/features/job-orders/services";
import { companyService } from "@/features/companies/services";
import { userService } from "@/services/user.service";
import { candidateService } from "@/features/candidates/services";
import { CandidateTable, AddCandidateDialog } from "@/features/candidates/components";
import { useAuth } from "@/hooks";

export default function JobOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobOrderId = params.id as string;

  const [jobOrder, setJobOrder] = useState<JobOrder | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [assignedRecruiters, setAssignedRecruiters] = useState<User[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobOrderId]);

  if (!user) return null;

  const isUnassigned = jobOrder && jobOrder.assignedRecruiters.length === 0;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const jobOrderData = await jobOrderService.getById(jobOrderId);
      if (!jobOrderData) {
        router.push("/leader/job-orders");
        return;
      }

      const [companyData, allUsers, candidatesData] = await Promise.all([
        companyService.getById(jobOrderData.companyId),
        userService.getAll(),
        candidateService.getByJobOrder(jobOrderId),
      ]);
      
      const recruiters = allUsers.filter((u) => jobOrderData.assignedRecruiters.includes(u.id));

      setJobOrder(jobOrderData);
      setCompany(companyData);
      setAssignedRecruiters(recruiters);
      setCandidates(candidatesData);
    } catch (error) {
      console.error("Failed to load job order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateAdded = (newCandidate: Candidate) => {
    setCandidates([...candidates, newCandidate]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading job order details...</p>
      </div>
    );
  }

  if (!jobOrder) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Job order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{jobOrder.title}</h1>
          <p className="text-muted-foreground">{company?.name}</p>
        </div>
      </div>

      {isUnassigned && (
        <UnassignedWarning message="No recruiters assigned to this job order. Assign a recruiter to start adding candidates." />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Details */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{company?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{jobOrder.location || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Salary Range</p>
                  <p className="text-sm text-muted-foreground">{jobOrder.salaryRange || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Positions</p>
                  <p className="text-sm text-muted-foreground">{jobOrder.positions}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                  {jobOrder.status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Assigned Recruiters</h2>
            {assignedRecruiters.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recruiters assigned yet</p>
            ) : (
              <div className="space-y-2">
                {assignedRecruiters.map((recruiter) => (
                  <div key={recruiter.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {recruiter.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{recruiter.name}</p>
                      <p className="text-xs text-muted-foreground">{recruiter.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {jobOrder.description || "No description provided"}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Requirements</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {jobOrder.requirements || "No requirements specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Candidates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Candidates ({candidates.length})</h2>
        </div>
        
        <CandidateTable candidates={candidates} basePath="/leader" showActions={true} />
      </div>

      <AddCandidateDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCandidateAdded={handleCandidateAdded}
        jobOrderId={jobOrderId}
        addedBy={user.id}
      />
    </div>
  );
}
