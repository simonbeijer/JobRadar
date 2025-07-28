import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sendJobAlertEmail } from '../../../lib/emailService';
import { ApiResponse } from '../../../types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('Starting email send process...');

    // Get all users (in a real app, you might want to paginate this)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    if (users.length === 0) {
      console.log('No users found');
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'No users found'
      }, { status: 404 });
    }

    // Get all jobs that haven't been emailed yet
    const unEmailedJobs = await prisma.job.findMany({
      where: {
        emailed: false
      },
      orderBy: {
        postedAt: 'desc'
      }
    });

    console.log(`Found ${unEmailedJobs.length} unemailed jobs`);

    if (unEmailedJobs.length === 0) {
      console.log('No new jobs to email');
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          message: 'No new jobs to email',
          jobCount: 0,
          userCount: users.length
        }
      });
    }

    const emailResults = [];
    let successCount = 0;
    let errorCount = 0;

    // Send email to each user
    for (const user of users) {
      console.log(`Sending email to ${user.email}...`);
      
      const emailResult = await sendJobAlertEmail({
        jobs: unEmailedJobs,
        userEmail: user.email,
        userName: user.name
      });

      emailResults.push({
        user: user.email,
        success: emailResult.success,
        error: emailResult.error
      });

      if (emailResult.success) {
        successCount++;
        console.log(`✓ Email sent successfully to ${user.email}`);
      } else {
        errorCount++;
        console.error(`✗ Failed to send email to ${user.email}:`, emailResult.error);
      }
    }

    // If at least one email was sent successfully, mark jobs as emailed
    if (successCount > 0) {
      const jobIds = unEmailedJobs.map(job => job.id);
      
      await prisma.job.updateMany({
        where: {
          id: {
            in: jobIds
          }
        },
        data: {
          emailed: true
        }
      });

      console.log(`✓ Marked ${jobIds.length} jobs as emailed`);
    }

    const response: ApiResponse = {
      success: true,
      data: {
        message: `Email process completed`,
        jobCount: unEmailedJobs.length,
        userCount: users.length,
        successfulEmails: successCount,
        failedEmails: errorCount,
        results: emailResults
      }
    };

    console.log('Email send process completed successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in send-email API:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// GET method for manual testing/status check
export async function GET(): Promise<NextResponse> {
  try {
    const unEmailedJobsCount = await prisma.job.count({
      where: {
        emailed: false
      }
    });

    const usersCount = await prisma.user.count();

    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Email status check',
        unEmailedJobs: unEmailedJobsCount,
        totalUsers: usersCount,
        readyToSend: unEmailedJobsCount > 0 && usersCount > 0
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking email status:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}