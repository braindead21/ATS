import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Offer from "@/lib/models/Offer";

/**
 * GET /api/offers
 * Get all offers or filter by candidateId
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId");
    const jobOrderId = searchParams.get("jobOrderId");

    let query: any = {};
    if (candidateId) query.candidateId = candidateId;
    if (jobOrderId) query.jobOrderId = jobOrderId;

    const offers = await Offer.find(query)
      .populate("candidateId", "firstName lastName email")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const offersResponse = offers.map((offer) => ({
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
    }));

    return NextResponse.json(offersResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get offers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/offers
 * Create a new offer
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      candidateId,
      jobOrderId,
      offeredRole,
      offeredSalary,
      expectedJoiningDate,
      joiningBonus,
      benefits,
      offerNotes,
      status,
      createdBy,
    } = body;

    // Validate required fields
    if (!candidateId || !jobOrderId || !offeredRole || !offeredSalary || !expectedJoiningDate || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new offer
    const offer = await Offer.create({
      candidateId,
      jobOrderId,
      offeredRole,
      offeredSalary,
      expectedJoiningDate,
      joiningBonus,
      benefits,
      offerNotes,
      status: status || "OFFERED",
      offeredAt: new Date(),
      createdBy,
    });

    // Update candidate status to OFFERED
    const Candidate = (await import("@/lib/models/Candidate")).default;
    await Candidate.findByIdAndUpdate(
      candidateId,
      { status: "OFFERED" },
      { new: true }
    );

    const populatedOffer = await Offer.findById(offer._id)
      .populate("candidateId", "firstName lastName email")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    const offerResponse = {
      id: populatedOffer!._id.toString(),
      candidateId: typeof populatedOffer!.candidateId === 'object' && populatedOffer!.candidateId?._id
        ? populatedOffer!.candidateId._id.toString()
        : populatedOffer!.candidateId.toString(),
      jobOrderId: typeof populatedOffer!.jobOrderId === 'object' && populatedOffer!.jobOrderId?._id
        ? populatedOffer!.jobOrderId._id.toString()
        : populatedOffer!.jobOrderId.toString(),
      offeredRole: populatedOffer!.offeredRole,
      offeredSalary: populatedOffer!.offeredSalary,
      expectedJoiningDate: populatedOffer!.expectedJoiningDate,
      joiningBonus: populatedOffer!.joiningBonus,
      benefits: populatedOffer!.benefits,
      offerNotes: populatedOffer!.offerNotes,
      status: populatedOffer!.status,
      offeredAt: populatedOffer!.offeredAt,
      respondedAt: populatedOffer!.respondedAt,
      createdBy: populatedOffer!.createdBy,
      createdAt: populatedOffer!.createdAt,
      updatedAt: populatedOffer!.updatedAt,
    };

    return NextResponse.json(offerResponse, { status: 201 });
  } catch (error: any) {
    console.error("Create offer error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create offer" },
      { status: 500 }
    );
  }
}
