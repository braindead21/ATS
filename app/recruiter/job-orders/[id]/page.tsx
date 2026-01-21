"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { JobOrder, Company, User, Candidate } from "@/types";
import { Button, UnassignedWarning, StatusBadge } from "@/components/ui";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Briefcase,
  Hash,
  Clock,
  Edit,
  Paperclip
} from "lucide-react";
import { jobOrderService } from "@/features/job-orders/services";
import { companyService } from "@/features/companies/services";
import { userService } from "@/services/user.service";
import { candidateService } from "@/features/candidates/services";
import { CandidateTable, AddCandidateDialog } from "@/features/candidates/components";
import { format, differenceInDays } from "date-fns";

export default function RecruiterJobOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobOrderId = params.id as string;

  const [jobOrder, setJobOrder] = useState<JobOrder | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [assignedRecruiters, setAssignedRecruiters] = useState<User[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [creator, setCreator] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobOrderId]);

  if (!user) return null;

  const isAssignedToMe = jobOrder && jobOrder.assignedRecruiters.includes(user.id);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const jobOrderData = await jobOrderService.getById(jobOrderId);
      if (!jobOrderData) {
        router.push("/recruiter/job-orders");
        return;
      }

      // Check if assigned to this recruiter
      if (!jobOrderData.assignedRecruiters.includes(user.id)) {
        router.push("/recruiter/job-orders");
        return;
      }

      const [companyData, allUsers, candidatesData] = await Promise.all([
        companyService.getById(jobOrderData.companyId),
        userService.getAll(),
        candidateService.getByJobOrder(jobOrderId),
      ]);
      
      const recruiters = allUsers.filter((u) => jobOrderData.assignedRecruiters.includes(u.id));
      const creatorUser = allUsers.find((u) => u.id === jobOrderData.createdBy);

      setJobOrder(jobOrderData);
      setCompany(companyData);
      setAssignedRecruiters(recruiters);
      setCandidates(candidatesData);
      setCreator(creatorUser || null);
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

  const daysOld = differenceInDays(new Date(), new Date(jobOrder.createdAt));
  const pipelineCounts = {
    contacted: candidates.filter(c => c.status === 'CONTACTED').length,
    qualified: candidates.filter(c => c.status === 'QUALIFIED').length,
    submitted: candidates.filter(c => c.status === 'OFFERED').length,
    interviewing: candidates.filter(c => c.status === 'NEXT_INTERVIEW').length,
    offered: candidates.filter(c => c.status === 'OFFER_ACCEPTED').length,
    hired: candidates.filter(c => c.status === 'HIRED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Job Order Details</h1>
            <p className="text-sm text-muted-foreground">{jobOrder.title}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Job Order Details Card */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4 bg-muted/50">
          <h2 className="font-semibold">Job Order Details</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Title</p>
              <p className="font-medium">{jobOrder.title}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Company Name</p>
              <p className="font-medium">{company?.name || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Department</p>
              <p className="font-medium">{company?.departments || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">ATS Job ID</p>
              <p className="font-medium text-xs">{jobOrder.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Company Job ID</p>
              <p className="font-medium">—</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Contact Name</p>
              <p className="font-medium">{company?.contactEmail?.split('@')[0] || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Contact Phone</p>
              <p className="font-medium">{company?.contactPhone || company?.primaryPhone || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Contact Email</p>
              <p className="font-medium text-sm">{company?.contactEmail || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <p className="font-medium">{jobOrder.location || company?.city || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Max Rate</p>
              <p className="font-medium">—</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Salary</p>
              <p className="font-medium">{jobOrder.salaryRange || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Start Date</p>
              <p className="font-medium">—</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Attachments</p>
              <Button variant="link" size="sm" className="h-auto p-0">
                <Paperclip className="h-4 w-4 mr-1" />
                Add Attachment
              </Button>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <div className="border rounded p-3 max-h-40 overflow-y-auto bg-muted/30">
                <p className="text-sm whitespace-pre-wrap">{jobOrder.description || "No description provided"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Internal Notes</p>
              <div className="border rounded p-3 max-h-32 overflow-y-auto bg-muted/30">
                <p className="text-sm text-muted-foreground">No internal notes</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="font-medium">—</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Openings</p>
              <p className="font-medium">{jobOrder.positions}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <p className="font-medium">(Unknown)</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <StatusBadge status={jobOrder.status} />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Pipeline</p>
              <p className="font-medium">{pipelineCounts.contacted}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Submitted</p>
              <p className="font-medium">{pipelineCounts.submitted}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Days Old</p>
              <p className="font-medium">{daysOld}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Created</p>
              <p className="font-medium text-sm">
                {format(new Date(jobOrder.createdAt), "MM-dd-yy (hh:mm a)")}
                {creator && ` (${creator.name})`}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Recruiter</p>
              <p className="font-medium">{assignedRecruiters.map(r => r.name).join(", ") || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Owner</p>
              <p className="font-medium">{creator?.name || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Order Pipeline */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4 bg-muted/50">
          <h2 className="font-semibold text-center">Job Order Pipeline</h2>
        </div>
        
        <div className="p-8">
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-border" style={{ left: '8.33%', right: '8.33%' }} />
            
            {/* Pipeline Stages */}
            <div className="grid grid-cols-6 gap-4">
              {/* Total Pipeline */}
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-3 relative z-10">
                  {pipelineCounts.contacted}
                </div>
                <p className="text-sm font-medium text-center mb-1">Total Pipeline</p>
                <p className="text-xs text-muted-foreground text-center">Contacted</p>
              </div>
              
              {/* Card Replied */}
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold mb-3 relative z-10">
                  {pipelineCounts.qualified}
                </div>
                <p className="text-sm font-medium text-center mb-1">Cand Replied</p>
                <p className="text-xs text-muted-foreground text-center">Qualifying</p>
              </div>
              
              {/* Submitted */}
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-xl font-bold mb-3 relative z-10">
                  {pipelineCounts.submitted}
                </div>
                <p className="text-sm font-medium text-center mb-1">Submitted</p>
                <p className="text-xs text-muted-foreground text-center">Interviewing</p>
              </div>
              
              {/* Offered */}
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold mb-3 relative z-10">
                  {pipelineCounts.interviewing}
                </div>
                <p className="text-sm font-medium text-center mb-1">Offered</p>
                <p className="text-xs text-muted-foreground text-center">Declined</p>
              </div>
              
              {/* Placed */}
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold mb-3 relative z-10">
                  {pipelineCounts.offered}
                </div>
                <p className="text-sm font-medium text-center mb-1">Placed</p>
                <p className="text-xs text-muted-foreground text-center">Declined</p>
              </div>
              
              {/* Hired */}
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold mb-3 relative z-10">
                  {pipelineCounts.hired}
                </div>
                <p className="text-sm font-medium text-center mb-1">Hired</p>
                <p className="text-xs text-muted-foreground text-center">—</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Pipeline */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4 bg-muted/50 flex items-center justify-between">
          <h2 className="font-semibold">Candidate Pipeline</h2>
          {isAssignedToMe && (
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Candidate to This Job Order Pipeline
            </Button>
          )}
        </div>
        
        <div className="p-6">
          {candidates.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No candidates added yet
            </p>
          ) : (
            <CandidateTable candidates={candidates} basePath="/recruiter" showActions={true} />
          )}
        </div>
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
