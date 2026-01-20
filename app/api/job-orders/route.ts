import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import JobOrder from "@/lib/models/JobOrder";

/**
 * GET /api/job-orders
 * Get all job orders
 */
export async function GET() {
  try {
    await connectDB();

    const jobOrders = await JobOrder.find()
      .populate("companyId", "name")
      .populate("createdBy", "name email")
      .populate("assignedRecruiters", "name email")
      .sort({ createdAt: -1 });

    const jobOrdersResponse = jobOrders.map((jobOrder) => ({
      id: jobOrder._id.toString(),
      companyId: jobOrder.companyId,
      title: jobOrder.title,
      description: jobOrder.description,
      requirements: jobOrder.requirements,
      location: jobOrder.location,
      salaryRange: jobOrder.salaryRange,
      positions: jobOrder.positions,
      status: jobOrder.status,
      createdBy: jobOrder.createdBy,
      assignedRecruiters: jobOrder.assignedRecruiters,
      createdAt: jobOrder.createdAt,
      updatedAt: jobOrder.updatedAt,
    }));

    return NextResponse.json(jobOrdersResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get job orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch job orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/job-orders
 * Create a new job order
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      companyId,
      title,
      description,
      requirements,
      location,
      salaryRange,
      positions,
      status,
      createdBy,
      assignedRecruiters,
    } = body;

    // Validate required fields
    if (!companyId || !title || !description || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new job order
    const jobOrder = await JobOrder.create({
      companyId,
      title,
      description,
      requirements,
      location,
      salaryRange,
      positions: positions || 1,
      status: status || "OPEN",
      createdBy,
      assignedRecruiters: assignedRecruiters || [],
    });

    const populatedJobOrder = await JobOrder.findById(jobOrder._id)
      .populate("companyId", "name")
      .populate("createdBy", "name email")
      .populate("assignedRecruiters", "name email");

    const jobOrderResponse = {
      id: populatedJobOrder!._id.toString(),
      companyId: populatedJobOrder!.companyId,
      title: populatedJobOrder!.title,
      description: populatedJobOrder!.description,
      requirements: populatedJobOrder!.requirements,
      location: populatedJobOrder!.location,
      salaryRange: populatedJobOrder!.salaryRange,
      positions: populatedJobOrder!.positions,
      status: populatedJobOrder!.status,
      createdBy: populatedJobOrder!.createdBy,
      assignedRecruiters: populatedJobOrder!.assignedRecruiters,
      createdAt: populatedJobOrder!.createdAt,
      updatedAt: populatedJobOrder!.updatedAt,
    };

    return NextResponse.json(jobOrderResponse, { status: 201 });
  } catch (error: any) {
    console.error("Create job order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create job order" },
      { status: 500 }
    );
  }
}
