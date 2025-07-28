import { NextRequest, NextResponse } from "next/server";
import { fetchJobsFromJobTech, getJobStats } from "@/lib/jobService";

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security (recommended for production)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log(`[${new Date().toISOString()}] Starting automated job fetch...`);

    // Fetch jobs from JobTech API
    const result = await fetchJobsFromJobTech();
    
    // Get updated stats
    const stats = await getJobStats();

    console.log(`[${new Date().toISOString()}] Job fetch completed:`, {
      fetched: result.fetched,
      saved: result.saved,
      duplicates: result.duplicates,
      totalJobs: stats.total
    });

    return NextResponse.json({
      message: "Job fetch completed successfully",
      result,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Job fetch failed:`, error);

    return NextResponse.json(
      { 
        message: "Job fetch failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing
export async function GET(request: NextRequest) {
  return POST(request);
}