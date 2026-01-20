"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { Candidate } from "@/types";
import { candidateService } from "@/features/candidates/services";
import { CandidateTable } from "@/features/candidates/components";

export default function LeaderCandidatesPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    setIsLoading(true);
    try {
      const data = await candidateService.getAll();
      setCandidates(data);
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
        <h1 className="text-3xl font-bold">All Candidates</h1>
        <p className="text-muted-foreground">
          View all candidates across all job orders ({candidates.length} total)
        </p>
      </div>

      <CandidateTable candidates={candidates} basePath="/leader" showActions={true} />
    </div>
  );
}
