"use client";

import Link from "next/link";
import { JobOrder, Company } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@/components/ui";
import { Briefcase, Eye } from "lucide-react";

interface JobOrderTableProps {
  jobOrders: JobOrder[];
  companies: Company[];
  basePath: string;
}

export function JobOrderTable({ jobOrders, companies, basePath }: JobOrderTableProps) {
  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || "Unknown";
  };

  if (jobOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No job orders found</h3>
        <p className="text-sm text-muted-foreground">
          Create a job order to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Positions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobOrders.map((jobOrder) => (
            <TableRow key={jobOrder.id}>
              <TableCell className="font-medium">{jobOrder.title}</TableCell>
              <TableCell>{getCompanyName(jobOrder.companyId)}</TableCell>
              <TableCell>{jobOrder.location || "—"}</TableCell>
              <TableCell>{jobOrder.positions}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                  {jobOrder.status}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`${basePath}/job-orders/${jobOrder.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
