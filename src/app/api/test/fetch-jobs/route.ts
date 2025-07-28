import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { fetchJobsFromJobTech, getJobStats } from "@/lib/jobService";

/**
 * Manual test endpoint for job fetching
 * This endpoint allows manual triggering of job fetching for testing purposes
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication (admin only for manual operations)
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    await verifyAuth(token);

    console.log(`[${new Date().toISOString()}] Manual job fetch test started...`);

    // Fetch jobs from JobTech API
    const result = await fetchJobsFromJobTech();
    
    // Get updated stats
    const stats = await getJobStats();

    console.log(`[${new Date().toISOString()}] Manual job fetch completed:`, {
      fetched: result.fetched,
      saved: result.saved,
      duplicates: result.duplicates,
      totalJobs: stats.total
    });

    return NextResponse.json({
      message: "Manual job fetch completed successfully",
      result: {
        fetched: result.fetched,
        saved: result.saved,
        duplicates: result.duplicates
      },
      stats: {
        total: stats.total,
        applied: stats.applied,
        emailed: stats.emailed,
        recent: stats.recent
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Manual job fetch failed:`, error);
    
    if (error instanceof Error && error.message === "Invalid or expired token") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "Manual job fetch failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Allow GET for easy browser testing
export async function GET(request: NextRequest) {
  return POST(request);
}