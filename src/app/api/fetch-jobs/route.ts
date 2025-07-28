import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { fetchJobsFromJobTech, getJobStats } from "@/lib/jobService";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    await verifyAuth(token);

    // Fetch jobs from JobTech API
    const result = await fetchJobsFromJobTech();
    
    // Get updated stats
    const stats = await getJobStats();

    return NextResponse.json({
      message: "Jobs fetching completed",
      result: {
        fetched: result.fetched,
        saved: result.saved,
        duplicates: result.duplicates
      },
      stats
    }, { status: 200 });

  } catch (error) {
    console.error("Error in fetch-jobs API:", error);
    
    if (error instanceof Error && error.message === "Invalid or expired token") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "Failed to fetch jobs",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    await verifyAuth(token);

    // Get current job statistics
    const stats = await getJobStats();

    return NextResponse.json({
      message: "Job statistics retrieved",
      stats
    }, { status: 200 });

  } catch (error) {
    console.error("Error getting job stats:", error);
    
    if (error instanceof Error && error.message === "Invalid or expired token") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "Failed to get job statistics",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}