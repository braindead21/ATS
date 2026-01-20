"use client";

import { Company } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { Building2 } from "lucide-react";

interface CompanyTableProps {
  companies: Company[];
}

export function CompanyTable({ companies }: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No companies found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by adding your first company.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>{company.industry || "—"}</TableCell>
              <TableCell>{company.location || "—"}</TableCell>
              <TableCell>{company.contactEmail || "—"}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                  {company.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
