"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { Company } from "@/types";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { companyService } from "@/features/companies/services";
import { CompanyTable, AddCompanyDialog } from "@/features/companies/components";

export default function CompaniesPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error("Failed to load companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyAdded = (newCompany: Company) => {
    setCompanies([...companies, newCompany]);
  };

  if (!user) {
    return null; // RouteGuard will handle redirect
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">Manage client companies</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <CompanyTable companies={companies} />

      <AddCompanyDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCompanyAdded={handleCompanyAdded}
        createdBy={user.id}
      />
    </div>
  );
}
