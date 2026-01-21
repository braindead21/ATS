import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Offer from "@/lib/models/Offer";

/**
 * GET /api/offers/[id]
 * Get a single offer by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const offer = await Offer.findById(id)
      .populate("candidateId", "firstName lastName email")
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
      candidateId: typeof offer.candidateId === 'object' && offer.candidateId?._id
        ? offer.candidateId._id.toString()
        : offer.candidateId.toString(),
      jobOrderId: typeof offer.jobOrderId === 'object' && offer.jobOrderId?._id
        ? offer.jobOrderId._id.toString()
        : offer.jobOrderId.toString(),
      offeredRole: offer.offeredRole,
      offeredSalary: offer.offeredSalary,
      expectedJoiningDate: offer.expectedJoiningDate,
      joiningBonus: offer.joiningBonus,
      benefits: offer.benefits,
      offerNotes: offer.offerNotes,
      status: offer.status,
      offeredAt: offer.offeredAt,
      respondedAt: offer.respondedAt,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const offer = await Offer.findByIdAndUpdate(
      id,
      { 
        ...body, 
        ...(body.status && body.status !== "OFFERED" ? { respondedAt: new Date() } : {})
      },
      { new: true, runValidators: true }
    )
      .populate("candidateId", "firstName lastName email")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    // Update candidate status based on offer status
    if (body.status) {
      const Candidate = (await import("@/lib/models/Candidate")).default;
      let candidateStatus = "";
      switch (body.status) {
        case "ACCEPTED":
          candidateStatus = "JOINED";
          break;
        case "DECLINED":
          candidateStatus = "OFFER_DECLINED";
          break;
        case "WITHDRAWN":
          candidateStatus = "REJECTED";
          break;
      }

      if (candidateStatus) {
        await Candidate.findByIdAndUpdate(
          typeof offer.candidateId === 'object' && offer.candidateId?._id
            ? offer.candidateId._id
            : offer.candidateId,
          { status: candidateStatus },
          { new: true }
        );
      }
    }

    const offerResponse = {
      id: offer._id.toString(),
      candidateId: typeof offer.candidateId === 'object' && offer.candidateId?._id
        ? offer.candidateId._id.toString()
        : offer.candidateId.toString(),
      jobOrderId: typeof offer.jobOrderId === 'object' && offer.jobOrderId?._id
        ? offer.jobOrderId._id.toString()
        : offer.jobOrderId.toString(),
      offeredRole: offer.offeredRole,
      offeredSalary: offer.offeredSalary,
      expectedJoiningDate: offer.expectedJoiningDate,
      joiningBonus: offer.joiningBonus,
      benefits: offer.benefits,
      offerNotes: offer.offerNotes,
      status: offer.status,
      offeredAt: offer.offeredAt,
      respondedAt: offer.respondedAt,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const offer = await Offer.findByIdAndDelete(id);

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
