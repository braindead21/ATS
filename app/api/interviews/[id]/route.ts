import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Interview from "@/lib/models/Interview";

/**
 * GET /api/interviews/[id]
 * Get a single interview by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const interview = await Interview.findById(params.id)
      .populate("candidateId", "firstName lastName")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const interviewResponse = {
      id: interview._id.toString(),
      candidateId: interview.candidateId,
      jobOrderId: interview.jobOrderId,
      level: interview.level,
      scheduledAt: interview.scheduledAt,
      status: interview.status,
      feedback: interview.feedback,
      interviewerName: interview.interviewerName,
      createdBy: interview.createdBy,
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
    };

    return NextResponse.json(interviewResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get interview error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch interview" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/interviews/[id]
 * Update an interview
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const interview = await Interview.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate("candidateId", "firstName lastName")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const interviewResponse = {
      id: interview._id.toString(),
      candidateId: interview.candidateId,
      jobOrderId: interview.jobOrderId,
      level: interview.level,
      scheduledAt: interview.scheduledAt,
      status: interview.status,
      feedback: interview.feedback,
      interviewerName: interview.interviewerName,
      createdBy: interview.createdBy,
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
    };

    return NextResponse.json(interviewResponse, { status: 200 });
  } catch (error: any) {
    console.error("Update interview error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update interview" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/interviews/[id]
 * Delete an interview
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const interview = await Interview.findByIdAndDelete(params.id);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Interview deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete interview error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete interview" },
      { status: 500 }
    );
  }
}
