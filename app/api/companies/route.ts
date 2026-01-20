import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Company from "@/lib/models/Company";

/**
 * GET /api/companies
 * Get all companies
 */
export async function GET() {
  try {
    await connectDB();

    const companies = await Company.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const companiesResponse = companies.map((company) => ({
      id: company._id.toString(),
      name: company.name,
      industry: company.industry,
      location: company.location,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      status: company.status,
      createdBy: company.createdBy,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));

    return NextResponse.json(companiesResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get companies error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/companies
 * Create a new company
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, industry, location, contactEmail, contactPhone, status, createdBy } = body;

    // Validate required fields
    if (!name || !createdBy) {
      return NextResponse.json(
        { error: "Name and createdBy are required" },
        { status: 400 }
      );
    }

    // Create new company
    const company = await Company.create({
      name,
      industry,
      location,
      contactEmail,
      contactPhone,
      status: status || "ACTIVE",
      createdBy,
    });

    const populatedCompany = await Company.findById(company._id).populate(
      "createdBy",
      "name email"
    );

    const companyResponse = {
      id: populatedCompany!._id.toString(),
      name: populatedCompany!.name,
      industry: populatedCompany!.industry,
      location: populatedCompany!.location,
      contactEmail: populatedCompany!.contactEmail,
      contactPhone: populatedCompany!.contactPhone,
      status: populatedCompany!.status,
      createdBy: populatedCompany!.createdBy,
      createdAt: populatedCompany!.createdAt,
      updatedAt: populatedCompany!.updatedAt,
    };

    return NextResponse.json(companyResponse, { status: 201 });
  } catch (error: any) {
    console.error("Create company error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create company" },
      { status: 500 }
    );
  }
}
