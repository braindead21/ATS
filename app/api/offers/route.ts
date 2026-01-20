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

    const query = candidateId ? { candidateId } : {};

    const offers = await Offer.find(query)
      .populate("candidateId", "firstName lastName")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const offersResponse = offers.map((offer) => ({
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
      offerNotes,
      status: status || "OFFERED",
      createdBy,
    });

    const populatedOffer = await Offer.findById(offer._id)
      .populate("candidateId", "firstName lastName")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    const offerResponse = {
      id: populatedOffer!._id.toString(),
      candidateId: populatedOffer!.candidateId,
      jobOrderId: populatedOffer!.jobOrderId,
      offeredRole: populatedOffer!.offeredRole,
      offeredSalary: populatedOffer!.offeredSalary,
      expectedJoiningDate: populatedOffer!.expectedJoiningDate,
      offerNotes: populatedOffer!.offerNotes,
      status: populatedOffer!.status,
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
