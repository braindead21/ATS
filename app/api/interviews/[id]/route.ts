import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Interview from "@/lib/models/Interview";

/**
 * GET /api/interviews/[id]
 * Get a single interview by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const interview = await Interview.findById(id)
      .populate("candidateId", "firstName lastName email")
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
      candidateId: typeof interview.candidateId === 'object' && interview.candidateId?._id
        ? interview.candidateId._id.toString()
        : interview.candidateId.toString(),
      jobOrderId: typeof interview.jobOrderId === 'object' && interview.jobOrderId?._id
        ? interview.jobOrderId._id.toString()
        : interview.jobOrderId.toString(),
      level: interview.level,
      scheduledAt: interview.scheduledAt,
      status: interview.status,
      outcome: interview.outcome,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const interview = await Interview.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate("candidateId", "firstName lastName email")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Update candidate status based on interview outcome
    if (body.outcome) {
      const Candidate = (await import("@/lib/models/Candidate")).default;
      let candidateStatus = "";
      switch (body.outcome) {
        case "HIRED":
          candidateStatus = "HIRED";
          break;
        case "REJECTED":
          candidateStatus = "REJECTED";
          break;
        case "NEXT_INTERVIEW":
          candidateStatus = "NEXT_INTERVIEW";
          break;
        case "ON_HOLD":
          candidateStatus = "ON_HOLD";
          break;
      }

      if (candidateStatus) {
        await Candidate.findByIdAndUpdate(
          typeof interview.candidateId === 'object' && interview.candidateId?._id
            ? interview.candidateId._id
            : interview.candidateId,
          { status: candidateStatus },
          { new: true }
        );
      }
    }

    const interviewResponse = {
      id: interview._id.toString(),
      candidateId: typeof interview.candidateId === 'object' && interview.candidateId?._id
        ? interview.candidateId._id.toString()
        : interview.candidateId.toString(),
      jobOrderId: typeof interview.jobOrderId === 'object' && interview.jobOrderId?._id
        ? interview.jobOrderId._id.toString()
        : interview.jobOrderId.toString(),
      level: interview.level,
      scheduledAt: interview.scheduledAt,
      status: interview.status,
      outcome: interview.outcome,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const interview = await Interview.findByIdAndDelete(id);

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
