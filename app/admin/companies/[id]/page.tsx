"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Company, JobOrder } from "@/types";
import { useAuth } from "@/hooks";
import { companyService } from "@/features/companies/services";
import { jobOrderService } from "@/features/job-orders/services";
import { EditCompanyDialog } from "@/features/companies/components";
import { AddJobOrderDialog } from "@/features/job-orders/components";
import { Button, StatusBadge } from "@/components/ui";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  User,
  Globe,
  FileText,
  Hash,
  PhoneCall,
  Flame,
  Edit
} from "lucide-react";
import { format } from "date-fns";

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddJobOrderDialog, setShowAddJobOrderDialog] = useState(false);

  useEffect(() => {
    loadCompany();
    loadJobOrders();
  }, [companyId]);

  const loadCompany = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await companyService.getById(companyId);
      console.log("Fetched company data:", data);
      setCompany(data);
    } catch (error) {
      console.error("Failed to load company:", error);
      setError("Failed to load company details");
    } finally {
      setIsLoading(false);
    }
  };

  const loadJobOrders = async () => {
    try {
      const allJobOrders = await jobOrderService.getAll();
      const companyJobOrders = allJobOrders.filter(
        (job) => job.companyId === companyId
      );
      setJobOrders(companyJobOrders);
    } catch (error) {
      console.error("Failed to load job orders:", error);
    }
  };

  const handleCompanyUpdated = (updatedCompany: Company) => {
    setCompany(updatedCompany);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading company details...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
          <p className="text-destructive">{error || "Company not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              {company.isHotCompany && (
                <span title="Hot Company - Priority Client">
                  <Flame className="h-6 w-6 text-orange-500" />
                </span>
              )}
            </div>
            <p className="text-muted-foreground">Company Details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
            company.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {company.status}
          </span>
          <Button onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Company Information Card */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{company.name}</p>
              </div>
            </div>

            {/* Industry */}
            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{company.industry || "—"}</p>
              </div>
            </div>

            {/* Primary Phone */}
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Primary Phone</p>
                <p className="font-medium">
                  {company.primaryPhone ? (
                    <a 
                      href={`tel:${company.primaryPhone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {company.primaryPhone}
                    </a>
                  ) : "—"}
                </p>
              </div>
            </div>

            {/* Secondary Phone */}
            <div className="flex items-start gap-3">
              <PhoneCall className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Secondary Phone</p>
                <p className="font-medium">
                  {company.secondaryPhone ? (
                    <a 
                      href={`tel:${company.secondaryPhone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {company.secondaryPhone}
                    </a>
                  ) : "—"}
                </p>
              </div>
            </div>

            {/* Fax Number */}
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Fax Number</p>
                <p className="font-medium">{company.faxNumber || "—"}</p>
              </div>
            </div>

            {/* Contact Email */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Contact Email</p>
                <p className="font-medium">
                  {company.contactEmail ? (
                    <a 
                      href={`mailto:${company.contactEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {company.contactEmail}
                    </a>
                  ) : "—"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium whitespace-pre-line">{company.address || "—"}</p>
              </div>
            </div>

            {/* City */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{company.city || "—"}</p>
              </div>
            </div>

            {/* State */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">State</p>
                <p className="font-medium">{company.state || "—"}</p>
              </div>
            </div>

            {/* Postal Code */}
            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Postal Code</p>
                <p className="font-medium">{company.postalCode || "—"}</p>
              </div>
            </div>

            {/* Web Site */}
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Web Site</p>
                <p className="font-medium">
                  {company.webSite ? (
                    <a 
                      href={company.webSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.webSite}
                    </a>
                  ) : "—"}
                </p>
              </div>
            </div>

            {/* Departments */}
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="font-medium">{company.departments || "—"}</p>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {company.createdAt 
                    ? `${format(new Date(company.createdAt), "MM-dd-yy (hh:mm a)")}${
                        typeof company.createdBy === 'object' && company.createdBy?.name 
                          ? ` (${company.createdBy.name})` 
                          : ''
                      }`
                    : "—"}
                </p>
              </div>
            </div>

            {/* Owner */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium">
                  {typeof company.createdBy === 'object' && company.createdBy?.name 
                    ? company.createdBy.name 
                    : "—"}
                </p>
              </div>
            </div>

            {/* Key Technologies */}
            {company.keyTechnologies && (
              <div className="flex items-start gap-3 md:col-span-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Key Technologies</p>
                  <p className="font-medium whitespace-pre-line">{company.keyTechnologies}</p>
                </div>
              </div>
            )}

            {/* Misc Notes */}
            {company.miscNotes && (
              <div className="flex items-start gap-3 md:col-span-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Misc. Notes</p>
                  <p className="font-medium whitespace-pre-line">{company.miscNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Attachments</h2>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Add Attachment
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          No attachments yet. Click "Add Attachment" to upload files.
        </p>
      </div>

      {/* Job Orders Section */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Job Orders</h2>
          <Button 
            onClick={() => setShowAddJobOrderDialog(true)}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Add Job Order
          </Button>
        </div>
        {jobOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No job orders yet. Click "Add Job Order" to create one.
          </p>
        ) : (
          <div className="space-y-3">
            {jobOrders.map((jobOrder) => (
              <div
                key={jobOrder.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                onClick={() => router.push(`/admin/job-orders/${jobOrder.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{jobOrder.title}</h3>
                    <StatusBadge status={jobOrder.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {jobOrder.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {jobOrder.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {jobOrder.positions} position{jobOrder.positions > 1 ? 's' : ''}
                    </div>
                    {jobOrder.salaryRange && (
                      <span>{jobOrder.salaryRange}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Company Dialog */}
      {company && (
        <EditCompanyDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onCompanyUpdated={handleCompanyUpdated}
          company={company}
        />
      )}

      {/* Add Job Order Dialog */}
      {user && company && (
        <AddJobOrderDialog
          open={showAddJobOrderDialog}
          onOpenChange={setShowAddJobOrderDialog}
          onJobOrderAdded={() => {
            setShowAddJobOrderDialog(false);
            loadJobOrders();
          }}
          createdBy={user.id}
          preselectedCompanyId={company.id}
        />
      )}
    </div>
  );
}
