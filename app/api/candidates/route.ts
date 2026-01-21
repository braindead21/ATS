import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Candidate from "@/lib/models/Candidate";

/**
 * GET /api/candidates
 * Get all candidates or filter by jobOrderId
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const jobOrderId = searchParams.get("jobOrderId");

    const query = jobOrderId ? { jobOrderId } : {};

    const candidates = await Candidate.find(query)
      .populate("jobOrderId", "title")
      .populate("addedBy", "name email")
      .sort({ createdAt: -1 });

    const candidatesResponse = candidates.map((candidate) => ({
      id: candidate._id.toString(),
      jobOrderId: typeof candidate.jobOrderId === 'object' && candidate.jobOrderId?._id
        ? candidate.jobOrderId._id.toString()
        : candidate.jobOrderId.toString(),
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      resumeUrl: candidate.resumeUrl,
      linkedinUrl: candidate.linkedinUrl,
      status: candidate.status,
      currentLevel: candidate.currentLevel,
      addedBy: candidate.addedBy,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    }));

    return NextResponse.json(candidatesResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get candidates error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/candidates
 * Create a new candidate
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      jobOrderId,
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
      linkedinUrl,
      status,
      currentLevel,
      addedBy,
    } = body;

    // Validate required fields
    if (!jobOrderId || !firstName || !lastName || !email || !addedBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new candidate
    const candidate = await Candidate.create({
      jobOrderId,
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
      linkedinUrl,
      status: status || "NO_CONTACT",
      currentLevel,
      addedBy,
    });

    const populatedCandidate = await Candidate.findById(candidate._id)
      .populate("jobOrderId", "title")
      .populate("addedBy", "name email");

    const candidateResponse = {
      id: populatedCandidate!._id.toString(),
      jobOrderId: populatedCandidate!.jobOrderId,
      firstName: populatedCandidate!.firstName,
      lastName: populatedCandidate!.lastName,
      email: populatedCandidate!.email,
      phone: populatedCandidate!.phone,
      resumeUrl: populatedCandidate!.resumeUrl,
      linkedinUrl: populatedCandidate!.linkedinUrl,
      status: populatedCandidate!.status,
      currentLevel: populatedCandidate!.currentLevel,
      addedBy: populatedCandidate!.addedBy,
      createdAt: populatedCandidate!.createdAt,
      updatedAt: populatedCandidate!.updatedAt,
    };

    return NextResponse.json(candidateResponse, { status: 201 });
  } catch (error: any) {
    console.error("Create candidate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create candidate" },
      { status: 500 }
    );
  }
}
