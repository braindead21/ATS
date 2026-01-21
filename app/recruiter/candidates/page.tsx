"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { Candidate, JobOrder } from "@/types";
import { candidateService } from "@/features/candidates/services";
import { jobOrderService } from "@/features/job-orders/services";
import { CandidateTable } from "@/features/candidates/components";

export default function RecruiterCandidatesPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCandidates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) return null;

  const loadCandidates = async () => {
    setIsLoading(true);
    try {
      // Get assigned job orders
      const assignedJobs = await jobOrderService.getByRecruiter(user.id);
      const jobOrderIds = assignedJobs.map((jo) => jo.id);
      
      console.log('🔍 Loading candidates for recruiter:', user.id);
      console.log('📋 Assigned job orders:', assignedJobs.length);
      console.log('📋 Job order IDs:', jobOrderIds);

      // Get all candidates
      const allCandidates = await candidateService.getAll();
      console.log('📋 All candidates:', allCandidates.length);
      console.log('📋 First candidate jobOrderId:', allCandidates[0]?.jobOrderId);

      // Filter candidates for assigned jobs only
      const myCandidates = allCandidates.filter((c) => {
        const isMatch = jobOrderIds.includes(c.jobOrderId);
        if (isMatch) {
          console.log('✅ Match found for candidate:', c.firstName, c.lastName);
        }
        return isMatch;
      });
      
      console.log('✅ Filtered candidates:', myCandidates.length);

      setCandidates(myCandidates);
    } catch (error) {
      console.error("Failed to load candidates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Candidates</h1>
        <p className="text-muted-foreground">
          Candidates from your assigned job orders ({candidates.length} total)
        </p>
      </div>

      <CandidateTable candidates={candidates} basePath="/recruiter" showActions={true} />
    </div>
  );
}
