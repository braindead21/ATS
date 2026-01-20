/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { testConnection } = await import("./lib/startup");
    await testConnection();
  }
}
