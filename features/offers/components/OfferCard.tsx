"use client";

import { Offer } from "@/types";
import { format } from "date-fns";
import { Briefcase, DollarSign, Calendar, FileText } from "lucide-react";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OFFERED":
        return "bg-blue-100 text-blue-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "DECLINED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">Offer Details</h3>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
            offer.status
          )}`}
        >
          {offer.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Role</p>
            <p className="text-sm text-muted-foreground">{offer.offeredRole}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Salary</p>
            <p className="text-sm text-muted-foreground">{offer.offeredSalary}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Expected Joining Date</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(offer.expectedJoiningDate), "PPP")}
            </p>
          </div>
        </div>

        {offer.offerNotes && (
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{offer.offerNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
