import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import JobOrder from "@/lib/models/JobOrder";

/**
 * GET /api/job-orders/[id]
 * Get a single job order by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const jobOrder = await JobOrder.findById(params.id)
      .populate("companyId", "name")
      .populate("createdBy", "name email")
      .populate("assignedRecruiters", "name email");

    if (!jobOrder) {
      return NextResponse.json(
        { error: "Job order not found" },
        { status: 404 }
      );
    }

    const jobOrderResponse = {
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
    };

    return NextResponse.json(jobOrderResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get job order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch job order" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/job-orders/[id]
 * Update a job order
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const jobOrder = await JobOrder.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate("companyId", "name")
      .populate("createdBy", "name email")
      .populate("assignedRecruiters", "name email");

    if (!jobOrder) {
      return NextResponse.json(
        { error: "Job order not found" },
        { status: 404 }
      );
    }

    const jobOrderResponse = {
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
    };

    return NextResponse.json(jobOrderResponse, { status: 200 });
  } catch (error: any) {
    console.error("Update job order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update job order" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/job-orders/[id]
 * Delete a job order
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const jobOrder = await JobOrder.findByIdAndDelete(params.id);

    if (!jobOrder) {
      return NextResponse.json(
        { error: "Job order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Job order deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete job order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete job order" },
      { status: 500 }
    );
  }
}
