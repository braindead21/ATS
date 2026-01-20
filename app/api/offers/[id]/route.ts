import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Offer from "@/lib/models/Offer";

/**
 * GET /api/offers/[id]
 * Get a single offer by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const offer = await Offer.findById(params.id)
      .populate("candidateId", "firstName lastName")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    const offerResponse = {
      id: offer._id.toString(),
      candidateId: offer.candidateId,
      jobOrderId: offer.jobOrderId,
      offeredRole: offer.offeredRole,
      offeredSalary: offer.offeredSalary,
      expectedJoiningDate: offer.expectedJoiningDate,
      offerNotes: offer.offerNotes,
      status: offer.status,
      createdBy: offer.createdBy,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };

    return NextResponse.json(offerResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get offer error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch offer" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/offers/[id]
 * Update an offer
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const offer = await Offer.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate("candidateId", "firstName lastName")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    const offerResponse = {
      id: offer._id.toString(),
      candidateId: offer.candidateId,
      jobOrderId: offer.jobOrderId,
      offeredRole: offer.offeredRole,
      offeredSalary: offer.offeredSalary,
      expectedJoiningDate: offer.expectedJoiningDate,
      offerNotes: offer.offerNotes,
      status: offer.status,
      createdBy: offer.createdBy,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };

    return NextResponse.json(offerResponse, { status: 200 });
  } catch (error: any) {
    console.error("Update offer error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update offer" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/offers/[id]
 * Delete an offer
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const offer = await Offer.findByIdAndDelete(params.id);

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Offer deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete offer error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete offer" },
      { status: 500 }
    );
  }
}
