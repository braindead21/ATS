"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks";
import { JobOrder, Company } from "@/types";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { jobOrderService } from "@/features/job-orders/services";
import { companyService } from "@/features/companies/services";
import { JobOrderTable, AddJobOrderDialog } from "@/features/job-orders/components";

export default function AdminJobOrdersPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const companyId = searchParams.get('companyId');
  
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (companyId && companies.length > 0) {
      setShowAddDialog(true);
    }
  }, [companyId, companies]);

  if (!user) return null;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [jobOrdersData, companiesData] = await Promise.all([
        jobOrderService.getAll(),
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

  const handleJobOrderAdded = (newJobOrder: JobOrder) => {
    setJobOrders([...jobOrders, newJobOrder]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading job orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Orders</h1>
          <p className="text-muted-foreground">Manage job requirements and assignments</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Create Job Order
        </Button>
      </div>

      <JobOrderTable jobOrders={jobOrders} companies={companies} basePath="/admin" />

      <AddJobOrderDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onJobOrderAdded={handleJobOrderAdded}
        createdBy={user.id}
        preselectedCompanyId={companyId || undefined}
      />
    </div>
  );
}
