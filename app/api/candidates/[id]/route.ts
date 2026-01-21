import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Candidate from "@/lib/models/Candidate";

/**
 * GET /api/candidates/[id]
 * Get a single candidate by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const candidate = await Candidate.findById(id)
      .populate("jobOrderId", "title")
      .populate("addedBy", "name email");

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    const candidateResponse = {
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
    };

    return NextResponse.json(candidateResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get candidate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/candidates/[id]
 * Update a candidate
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate("jobOrderId", "title")
      .populate("addedBy", "name email");

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    const candidateResponse = {
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
    };

    return NextResponse.json(candidateResponse, { status: 200 });
  } catch (error: any) {
    console.error("Update candidate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update candidate" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/candidates/[id]
 * Delete a candidate
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const candidate = await Candidate.findByIdAndDelete(id);

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Candidate deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete candidate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete candidate" },
      { status: 500 }
    );
  }
}
