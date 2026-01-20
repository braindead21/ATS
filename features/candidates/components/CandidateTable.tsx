"use client";

import Link from "next/link";
import { Candidate } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, StatusBadge } from "@/components/ui";
import { UserCircle, Eye } from "lucide-react";

interface CandidateTableProps {
  candidates: Candidate[];
  basePath: string;
  showActions?: boolean;
}

export function CandidateTable({ candidates, basePath, showActions = true }: CandidateTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No candidates yet</h3>
        <p className="text-sm text-muted-foreground">
          Add candidates to start the recruitment process.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">
                {candidate.firstName} {candidate.lastName}
              </TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.phone || "—"}</TableCell>
              <TableCell>
                <StatusBadge status={candidate.status} />
              </TableCell>
              {showActions && (
                <TableCell>
                  <Link href={`${basePath}/candidates/${candidate.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
