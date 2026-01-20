import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import Interview from "@/lib/models/Interview";

/**
 * GET /api/interviews
 * Get all interviews or filter by candidateId
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId");

    const query = candidateId ? { candidateId } : {};

    const interviews = await Interview.find(query)
      .populate("candidateId", "firstName lastName")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email")
      .sort({ scheduledAt: -1 });

    const interviewsResponse = interviews.map((interview) => ({
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
    }));

    return NextResponse.json(interviewsResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get interviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/interviews
 * Create a new interview
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      candidateId,
      jobOrderId,
      level,
      scheduledAt,
      status,
      feedback,
      interviewerName,
      createdBy,
    } = body;

    // Validate required fields
    if (!candidateId || !jobOrderId || !level || !scheduledAt || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new interview
    const interview = await Interview.create({
      candidateId,
      jobOrderId,
      level,
      scheduledAt,
      status: status || "SCHEDULED",
      feedback,
      interviewerName,
      createdBy,
    });

    const populatedInterview = await Interview.findById(interview._id)
      .populate("candidateId", "firstName lastName")
      .populate("jobOrderId", "title")
      .populate("createdBy", "name email");

    const interviewResponse = {
      id: populatedInterview!._id.toString(),
      candidateId: populatedInterview!.candidateId,
      jobOrderId: populatedInterview!.jobOrderId,
      level: populatedInterview!.level,
      scheduledAt: populatedInterview!.scheduledAt,
      status: populatedInterview!.status,
      feedback: populatedInterview!.feedback,
      interviewerName: populatedInterview!.interviewerName,
      createdBy: populatedInterview!.createdBy,
      createdAt: populatedInterview!.createdAt,
      updatedAt: populatedInterview!.updatedAt,
    };

    return NextResponse.json(interviewResponse, { status: 201 });
  } catch (error: any) {
    console.error("Create interview error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create interview" },
      { status: 500 }
    );
  }
}
