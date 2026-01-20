"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Candidate, JobOrder, Interview, Offer, CandidateStatus, InterviewStatus, OfferStatus } from "@/types";
import { UserRole } from "@/lib/constants/enums";
import { Button, StatusBadge } from "@/components/ui";
import { ArrowLeft, Mail, Phone, FileText, Linkedin, Calendar, Briefcase } from "lucide-react";
import { candidateService } from "@/features/candidates/services";
import { jobOrderService } from "@/features/job-orders/services";
import { interviewService } from "@/features/interviews/services";
import { offerService } from "@/features/offers/services";
import { CandidateActions } from "@/features/candidates/components";
import { InterviewTimeline, ScheduleInterviewDialog, DecisionModal } from "@/features/interviews/components";
import { OfferCard, CreateOfferDialog, OfferDecisionDialog, JoiningDialog, PostJoiningDialog } from "@/features/offers/components";

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const candidateId = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobOrder, setJobOrder] = useState<JobOrder | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [completedInterviewId, setCompletedInterviewId] = useState<string | null>(null);
  const [showCreateOfferDialog, setShowCreateOfferDialog] = useState(false);
  const [showOfferDecisionDialog, setShowOfferDecisionDialog] = useState(false);
  const [showJoiningDialog, setShowJoiningDialog] = useState(false);
  const [showPostJoiningDialog, setShowPostJoiningDialog] = useState(false);

  if (!user) return null;

  const canEdit = user.role === UserRole.RECRUITER && !!jobOrder?.assignedRecruiters.includes(user.id);
  const isTerminalState = candidate?.status === CandidateStatus.REJECTED || 
    candidate?.status === CandidateStatus.OFFER_DECLINED || 
    candidate?.status === CandidateStatus.SUCCESSFUL_HIRE || 
    candidate?.status === CandidateStatus.BAD_DELIVERY || 
    candidate?.status === CandidateStatus.TERMINATED;
  const canCreateOffer = candidate?.status === CandidateStatus.HIRED;
  const canMarkJoined = candidate?.status === CandidateStatus.OFFER_ACCEPTED;
  const canPostJoining = candidate?.status === CandidateStatus.JOINED;

  useEffect(() => {
    loadData();
  }, [candidateId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const candidateData = await candidateService.getById(candidateId);
      if (!candidateData) {
        router.push(`/${user.role.toLowerCase()}/candidates`);
        return;
      }

      const [jobOrderData, interviewsData, offerData] = await Promise.all([
        jobOrderService.getById(candidateData.jobOrderId),
        interviewService.getByCandidate(candidateId),
        offerService.getByCandidate(candidateId),
      ]);

      setCandidate(candidateData);
      setJobOrder(jobOrderData);
      setInterviews(interviewsData);
      setOffer(offerData);
    } catch (error) {
      console.error("Failed to load candidate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateUpdated = (updatedCandidate: Candidate) => {
    setCandidate(updatedCandidate);
  };

  const handleScheduleInterview = async (interviewData: Omit<Interview, "id" | "createdAt" | "updatedAt" | "status">) => {
    const newInterview = await interviewService.create({
      ...interviewData,
      status: InterviewStatus.SCHEDULED,
    });
    setInterviews([...interviews, newInterview]);
  };

  const handleMarkCompleted = async (interviewId: string) => {
    setCompletedInterviewId(interviewId);
    setShowDecisionModal(true);
  };

  const handleDecision = async (decision: CandidateStatus, notes?: string) => {
    if (!completedInterviewId || !candidate) return;

    // Mark interview as completed with feedback
    await interviewService.markCompleted(completedInterviewId, notes);

    // Update candidate status based on decision
    const updatedCandidate = await candidateService.updateStatus(candidate.id, decision);
    if (updatedCandidate) {
      setCandidate(updatedCandidate);
    }

    // Reload interviews to show updated status
    const updatedInterviews = await interviewService.getByCandidate(candidateId);
    setInterviews(updatedInterviews);

    setCompletedInterviewId(null);
  };

  const handleCreateOffer = async (offerData: Omit<Offer, "id" | "createdAt" | "updatedAt" | "status">) => {
    const newOffer = await offerService.create({
      ...offerData,
      status: OfferStatus.OFFERED,
    });
    setOffer(newOffer);

    // Update candidate status to OFFERED
    const updatedCandidate = await candidateService.updateStatus(candidateId, CandidateStatus.OFFERED);
    if (updatedCandidate) {
      setCandidate(updatedCandidate);
    }
  };

  const handleOfferDecision = async (accepted: boolean, notes?: string) => {
    if (!offer) return;

    const newStatus = accepted ? OfferStatus.ACCEPTED : OfferStatus.DECLINED;
    await offerService.updateStatus(offer.id, newStatus);

    const candidateStatus = accepted ? CandidateStatus.OFFER_ACCEPTED : CandidateStatus.OFFER_DECLINED;
    const updatedCandidate = await candidateService.updateStatus(candidateId, candidateStatus);
    if (updatedCandidate) {
      setCandidate(updatedCandidate);
    }

    const updatedOffer = await offerService.getByCandidate(candidateId);
    setOffer(updatedOffer);
  };

  const handleJoined = async (joinDate: Date) => {
    const updatedCandidate = await candidateService.updateStatus(candidateId, CandidateStatus.JOINED);
    if (updatedCandidate) {
      setCandidate(updatedCandidate);
    }
  };

  const handlePostJoiningOutcome = async (outcome: CandidateStatus, notes?: string) => {
    const updatedCandidate = await candidateService.updateStatus(candidateId, outcome);
    if (updatedCandidate) {
      setCandidate(updatedCandidate);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading candidate details...</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Candidate not found</p>
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
          <h1 className="text-3xl font-bold">
            {candidate.firstName} {candidate.lastName}
          </h1>
          <p className="text-muted-foreground">Job: {jobOrder?.title}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Candidate Information</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <StatusBadge status={candidate.status} />
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href={`mailto:${candidate.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {candidate.email}
                  </a>
                </div>
              </div>

              {candidate.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a
                      href={`tel:${candidate.phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {candidate.phone}
                    </a>
                  </div>
                </div>
              )}

              {candidate.resumeUrl && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Resume</p>
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              )}

              {candidate.linkedinUrl && (
                <div className="flex items-start gap-3">
                  <Linkedin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">LinkedIn</p>
                    <a
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {!isTerminalState && (
            <CandidateActions
              candidate={candidate}
              onCandidateUpdated={handleCandidateUpdated}
              canEdit={canEdit}
            />
          )}
          
          {!canEdit && user.role === UserRole.RECRUITER && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-700">
                This candidate is assigned to another recruiter. View-only access.
              </p>
            </div>
          )}

          {isTerminalState && (
            <div className="rounded-lg border border-muted bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                This candidate is <strong>{candidate.status.toLowerCase().replace(/_/g, ' ')}</strong>. No further actions available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Interview History</h2>
          {canEdit && !isTerminalState && candidate.status !== CandidateStatus.HIRED && (
            <Button onClick={() => setShowScheduleDialog(true)} size="sm">
              <Calendar className="h-4 w-4" />
              Schedule Interview
            </Button>
          )}
        </div>
        
        <InterviewTimeline
          interviews={interviews}
          onMarkCompleted={canEdit && !isTerminalState ? handleMarkCompleted : undefined}
          canEdit={canEdit && !isTerminalState}
        />
      </div>

      {/* Offer Section */}
      {(offer || canCreateOffer) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Offer</h2>
            {canEdit && canCreateOffer && !offer && (
              <Button onClick={() => setShowCreateOfferDialog(true)} size="sm">
                <Briefcase className="h-4 w-4" />
                Create Offer
              </Button>
            )}
          </div>

          {offer ? (
            <div className="space-y-4">
              <OfferCard offer={offer} />
              
              {canEdit && offer.status === OfferStatus.OFFERED && (
                <Button onClick={() => setShowOfferDecisionDialog(true)} className="w-full">
                  Record Offer Decision
                </Button>
              )}

              {canEdit && canMarkJoined && (
                <Button onClick={() => setShowJoiningDialog(true)} className="w-full">
                  Mark as Joined
                </Button>
              )}

              {canEdit && canPostJoining && (
                <Button onClick={() => setShowPostJoiningDialog(true)} className="w-full">
                  Record Post-Joining Outcome
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No offer created yet</p>
            </div>
          )}
        </div>
      )}

      <ScheduleInterviewDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onSchedule={handleScheduleInterview}
        candidateId={candidateId}
        jobOrderId={candidate.jobOrderId}
        createdBy={user.id}
      />

      {completedInterviewId && (
        <DecisionModal
          open={showDecisionModal}
          onOpenChange={setShowDecisionModal}
          onDecision={handleDecision}
          interviewLevel={interviews.find(iv => iv.id === completedInterviewId)?.level || ""}
        />
      )}

      {jobOrder && (
        <CreateOfferDialog
          open={showCreateOfferDialog}
          onOpenChange={setShowCreateOfferDialog}
          onCreateOffer={handleCreateOffer}
          candidateId={candidateId}
          jobOrderId={jobOrder.id}
          jobTitle={jobOrder.title}
          createdBy={user.id}
        />
      )}

      <OfferDecisionDialog
        open={showOfferDecisionDialog}
        onOpenChange={setShowOfferDecisionDialog}
        onDecision={handleOfferDecision}
      />

      {offer && (
        <JoiningDialog
          open={showJoiningDialog}
          onOpenChange={setShowJoiningDialog}
          onJoined={handleJoined}
          expectedDate={offer.expectedJoiningDate}
        />
      )}

      <PostJoiningDialog
        open={showPostJoiningDialog}
        onOpenChange={setShowPostJoiningDialog}
        onOutcome={handlePostJoiningOutcome}
      />
    </div>
  );
}
