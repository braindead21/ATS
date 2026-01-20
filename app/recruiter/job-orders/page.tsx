"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { JobOrder, Company } from "@/types";
import { UserRole } from "@/lib/constants/enums";
import { jobOrderService } from "@/features/job-orders/services";
import { companyService } from "@/features/companies/services";
import { JobOrderTable } from "@/features/job-orders/components";

export default function RecruiterJobOrdersPage() {
  const { user } = useAuth();
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) return null;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [jobOrdersData, companiesData] = await Promise.all([
        jobOrderService.getByRecruiter(user.id),
        companyService.getAll(),
      ]);
      setJobOrders(jobOrdersData);
      setCompanies(companiesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading assigned jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assigned Job Orders</h1>
        <p className="text-muted-foreground">
          Job orders assigned to you ({jobOrders.length} total)
        </p>
      </div>

      <JobOrderTable jobOrders={jobOrders} companies={companies} basePath="/recruiter" />
    </div>
  );
}
