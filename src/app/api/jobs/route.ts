import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Job, JobsResponse, JobSearchParams } from "@/types";

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

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const search = searchParams.get('search')?.toLowerCase();
    const location = searchParams.get('location');
    const applied = searchParams.get('applied');
    const emailed = searchParams.get('emailed');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const appliedOnly = searchParams.get('appliedOnly') === 'true';

    // Build Prisma where clause
    const where: any = {};
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Location filter
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    
    // Applied filter
    if (applied !== null) {
      where.applied = applied === 'true';
    }
    
    if (appliedOnly) {
      where.applied = true;
    }
    
    // Emailed filter
    if (emailed !== null) {
      where.emailed = emailed === 'true';
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      where.postedAt = {};
      if (dateFrom) {
        where.postedAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        where.postedAt.lt = endDate;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Query jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: [
          { postedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: JobsResponse = {
      jobs,
      total,
      page,
      totalPages
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching jobs:", error);
    
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

// POST - Admin only: Create new job manually
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

    const body = await request.json();
    const { title, company, location, url, source = "manual" } = body;

    // Validate required fields
    if (!title || !company || !location || !url) {
      return NextResponse.json(
        { message: "Missing required fields: title, company, location, url" },
        { status: 400 }
      );
    }

    // Check for duplicate URL
    const existingJob = await prisma.job.findUnique({
      where: { url }
    });

    if (existingJob) {
      return NextResponse.json(
        { message: "Job with this URL already exists" },
        { status: 409 }
      );
    }

    // Create new job
    const newJob = await prisma.job.create({
      data: {
        title,
        company,
        location,
        url,
        source,
        postedAt: new Date()
      }
    });

    return NextResponse.json(
      { 
        message: "Job created successfully",
        job: newJob
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating job:", error);
    
    if (error instanceof Error && error.message === "Invalid or expired token") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "Failed to create job",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}