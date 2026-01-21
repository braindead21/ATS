import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import { Company, JobOrder, Candidate, Offer } from "@/lib/models";

/**
 * GET /api/analytics/stats
 * Returns dashboard statistics
 */
export async function GET() {
  try {
    await connectDB();

    // Fetch all stats in parallel for better performance
    const [
      totalCompanies,
      activeCompanies,
      totalJobOrders,
      activeJobOrders,
      totalCandidates,
      candidatesInPipeline,
      placementsThisMonth,
      totalPlacements,
    ] = await Promise.all([
      Company.countDocuments(),
      Company.countDocuments({ status: "ACTIVE" }),
      JobOrder.countDocuments(),
      JobOrder.countDocuments({ status: "OPEN" }),
      Candidate.countDocuments(),
      Candidate.countDocuments({ 
        status: { $in: ["SCREENING", "SUBMITTED", "INTERVIEWING"] } 
      }),
      Offer.countDocuments({
        status: "ACCEPTED",
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
      Offer.countDocuments({ status: "ACCEPTED" }),
    ]);

    // Calculate trends (comparing with last period - simplified for now)
    const stats = {
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        trend: 12, // TODO: Calculate actual trend
      },
      jobOrders: {
        total: totalJobOrders,
        active: activeJobOrders,
        trend: 8, // TODO: Calculate actual trend
      },
      candidates: {
        total: totalCandidates,
        inPipeline: candidatesInPipeline,
        trend: 15, // TODO: Calculate actual trend
      },
      placements: {
        thisMonth: placementsThisMonth,
        total: totalPlacements,
        trend: -5, // TODO: Calculate actual trend
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics stats" },
      { status: 500 }
    );
  }
}
