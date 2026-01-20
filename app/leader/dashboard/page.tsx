"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui";
import { Building2, Briefcase, Users, TrendingUp } from "lucide-react";
import { companyService } from "@/features/companies/services";
import { jobOrderService } from "@/features/job-orders/services";

export default function LeaderDashboard() {
  const [stats, setStats] = useState({ companies: 0, jobOrders: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [companies, jobOrders] = await Promise.all([
      companyService.getAll(),
      jobOrderService.getAll(),
    ]);
    setStats({ companies: companies.length, jobOrders: jobOrders.length });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leader Dashboard</h1>
        <p className="text-muted-foreground">
          Manage companies, job orders, and team performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Companies"
          value={stats.companies}
          icon={Building2}
          description="Total active"
        />
        <StatCard
          title="Job Orders"
          value={stats.jobOrders}
          icon={Briefcase}
          description="Active positions"
        />
        <StatCard
          title="Candidates"
          value={0}
          icon={Users}
          description="Coming in Phase 3"
        />
        <StatCard
          title="Success Rate"
          value="—"
          icon={TrendingUp}
          description="Coming soon"
        />
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Active Job Orders</h2>
          <p className="text-muted-foreground text-sm">
            Your job orders will be listed here with status and candidate counts.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
          <p className="text-muted-foreground text-sm">
            Recruiter assignments and performance metrics will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}
