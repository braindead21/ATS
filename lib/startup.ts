/**
 * Startup Script
 * Tests MongoDB connection on server start
 */

import { connectDB } from "./db/mongo";

export async function testConnection() {
  console.log("\n🚀 Starting ATS System...");
  console.log("📡 Testing MongoDB connection...\n");
  
  try {
    await connectDB();
    console.log("✅ Database: Connected to MongoDB Atlas");
    console.log("🎯 Server: Ready to accept requests\n");
  } catch (error: any) {
    console.error("❌ Database: Connection failed");
    console.error("📝 Error:", error.message);
    console.error("\n⚠️  Server will start but database operations will fail");
    console.error("💡 Solution: Use mobile hotspot or VPN to bypass network restrictions\n");
  }
}
