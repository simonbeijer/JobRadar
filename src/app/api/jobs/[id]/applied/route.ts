import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Validate job ID format
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { message: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    // Parse request body to get the applied status
    const body = await request.json().catch(() => ({}));
    let { applied } = body;

    // If applied is not provided in body, toggle the current status
    if (applied === undefined) {
      applied = !existingJob.applied;
    }

    // Ensure applied is a boolean
    if (typeof applied !== 'boolean') {
      return NextResponse.json(
        { message: "Applied status must be a boolean value" },
        { status: 400 }
      );
    }

    // Update the job's applied status
    const updatedJob = await prisma.job.update({
      where: { id },
      data: { applied }
    });

    return NextResponse.json({
      message: `Job marked as ${applied ? 'applied' : 'not applied'}`,
      job: updatedJob
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating job applied status:", error);
    
    if (error instanceof Error && error.message === "Invalid or expired token") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "Failed to update job applied status",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Optional: Add PATCH method for updating other job fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Validate job ID format
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { message: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const { applied, emailed } = await request.json();

    // Build update data object
    const updateData: any = {};
    
    if (applied !== undefined) {
      if (typeof applied !== 'boolean') {
        return NextResponse.json(
          { message: "Applied status must be a boolean value" },
          { status: 400 }
        );
      }
      updateData.applied = applied;
    }

    if (emailed !== undefined) {
      if (typeof emailed !== 'boolean') {
        return NextResponse.json(
          { message: "Emailed status must be a boolean value" },
          { status: 400 }
        );
      }
      updateData.emailed = emailed;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update the job
    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: "Job updated successfully",
      job: updatedJob
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating job:", error);
    
    if (error instanceof Error && error.message === "Invalid or expired token") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "Failed to update job",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}