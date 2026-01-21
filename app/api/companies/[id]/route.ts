import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Company from "@/lib/models/Company";

/**
 * GET /api/companies/[id]
 * Get a single company by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const company = await Company.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const companyResponse = {
      id: company._id.toString(),
      name: company.name,
      primaryPhone: company.primaryPhone,
      secondaryPhone: company.secondaryPhone,
      faxNumber: company.faxNumber,
      address: company.address,
      city: company.city,
      state: company.state,
      postalCode: company.postalCode,
      webSite: company.webSite,
      departments: company.departments,
      keyTechnologies: company.keyTechnologies,
      miscNotes: company.miscNotes,
      isHotCompany: company.isHotCompany,
      industry: company.industry,
      location: company.location,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      status: company.status,
      createdBy: company.createdBy,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };

    return NextResponse.json(companyResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get company error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch company" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/companies/[id]
 * Update a company
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const body = await request.json();
    const { 
      name, 
      primaryPhone,
      secondaryPhone,
      faxNumber,
      address,
      city,
      state,
      postalCode,
      webSite,
      departments,
      keyTechnologies,
      miscNotes,
      isHotCompany,
      industry, 
      location, 
      contactEmail, 
      contactPhone, 
      status 
    } = body;

    const company = await Company.findByIdAndUpdate(
      id,
      {
        name,
        primaryPhone,
        secondaryPhone,
        faxNumber,
        address,
        city,
        state,
        postalCode,
        webSite,
        departments,
        keyTechnologies,
        miscNotes,
        isHotCompany,
        industry,
        location,
        contactEmail,
        contactPhone,
        status,
      },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const companyResponse = {
      id: company._id.toString(),
      name: company.name,
      primaryPhone: company.primaryPhone,
      secondaryPhone: company.secondaryPhone,
      faxNumber: company.faxNumber,
      address: company.address,
      city: company.city,
      state: company.state,
      postalCode: company.postalCode,
      webSite: company.webSite,
      departments: company.departments,
      keyTechnologies: company.keyTechnologies,
      miscNotes: company.miscNotes,
      isHotCompany: company.isHotCompany,
      industry: company.industry,
      location: company.location,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      status: company.status,
      createdBy: company.createdBy,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };

    return NextResponse.json(companyResponse, { status: 200 });
  } catch (error: any) {
    console.error("Update company error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update company" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/companies/[id]
 * Delete a company
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Company deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete company error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete company" },
      { status: 500 }
    );
  }
}
