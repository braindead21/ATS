"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Candidate, JobOrder, Interview, Offer } from "@/types";
import { Button, StatusBadge } from "@/components/ui";
import { ArrowLeft, Mail, Phone, FileText, Linkedin } from "lucide-react";
import { candidateService } from "@/features/candidates/services";
import { jobOrderService } from "@/features/job-orders/services";
import { interviewService } from "@/features/interviews/services";
import { offerService } from "@/features/offers/services";
import { InterviewTimeline } from "@/features/interviews/components";
import { OfferCard } from "@/features/offers/components";

export default function LeaderCandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobOrder, setJobOrder] = useState<JobOrder | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [candidateId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const candidateData = await candidateService.getById(candidateId);
      if (!candidateData) {
        router.push("/leader/candidates");
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

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>Leader View:</strong> Read-only access. Recruiters manage candidate status.
        </p>
      </div>

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

      {/* Interviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Interview History</h2>
        </div>
        
        <InterviewTimeline interviews={interviews} canEdit={false} />
      </div>

      {/* Offer Section */}
      {offer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Offer</h2>
          </div>
          
          <OfferCard offer={offer} />
        </div>
      )}
    </div>
  );
}
