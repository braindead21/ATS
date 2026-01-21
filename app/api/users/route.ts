import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import User from "@/lib/models/User";

/**
 * GET /api/users
 * Get all users (without passwords)
 * Query params: ?role=RECRUITER to filter by role
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = {};
    if (role) {
      query = { role };
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    const usersResponse = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json(usersResponse, { status: 200 });
  } catch (error: any) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
