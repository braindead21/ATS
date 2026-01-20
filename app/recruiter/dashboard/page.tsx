"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { StatCard } from "@/components/ui";
import { Briefcase, Users, Calendar, CheckCircle } from "lucide-react";
import { jobOrderService } from "@/features/job-orders/services";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [assignedJobsCount, setAssignedJobsCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadStats = async () => {
    const jobs = await jobOrderService.getByRecruiter(user.id);
    setAssignedJobsCount(jobs.length);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <p className="text-muted-foreground">
          Your assigned jobs and candidate pipeline
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Assigned Jobs"
          value={assignedJobsCount}
          icon={Briefcase}
          description="Active assignments"
        />
        <StatCard
          title="My Candidates"
          value={0}
          icon={Users}
          description="Coming in Phase 3"
        />
        <StatCard
          title="Interviews"
          value={0}
          icon={Calendar}
          description="Coming in Phase 3"
        />
        <StatCard
          title="Submissions"
          value={0}
          icon={CheckCircle}
          description="Coming soon"
        />
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Job Orders</h2>
          <p className="text-muted-foreground text-sm">
            Jobs assigned to you by leaders will appear here with details and requirements.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
          <p className="text-muted-foreground text-sm">
            Your scheduled interviews and candidate meetings will be listed here.
          </p>
        </div>
      </div>
    </div>
  );
}
