import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { sendJobAlertEmail } from '../../../../lib/emailService';
import { ApiResponse } from '../../../../types';

/**
 * Cron endpoint for automated daily email sending
 * This endpoint is designed to be called by a cron service (like Vercel Cron, GitHub Actions, or external cron)
 * 
 * Expected usage:
 * - Call this endpoint daily at 8:00 AM
 * - Only sends emails if there are new jobs (emailed: false)
 * - Marks jobs as emailed after successful send
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🕐 Starting automated daily email cron job...');

    // Optional: Add basic authentication for cron endpoint security
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      console.log('❌ Unauthorized cron request');
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Get all active users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    console.log(`📧 Found ${users.length} users to notify`);

    if (users.length === 0) {
      console.log('⚠️ No users found for email notification');
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          message: 'No users found for notification',
          jobCount: 0,
          userCount: 0,
          emailsSent: 0
        }
      });
    }

    // Get all jobs that haven't been emailed yet, ordered by most recent first
    const unEmailedJobs = await prisma.job.findMany({
      where: {
        emailed: false
      },
      orderBy: {
        postedAt: 'desc'
      }
    });

    console.log(`📋 Found ${unEmailedJobs.length} new jobs to email`);

    if (unEmailedJobs.length === 0) {
      console.log('✅ No new jobs to email today');
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          message: 'No new jobs to email today',
          jobCount: 0,
          userCount: users.length,
          emailsSent: 0
        }
      });
    }

    const emailResults = [];
    let successCount = 0;
    let errorCount = 0;

    // Send emails to all users
    for (const user of users) {
      console.log(`📤 Sending daily job alert to ${user.email}...`);
      
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
        console.log(`✅ Email sent successfully to ${user.email}`);
      } else {
        errorCount++;
        console.error(`❌ Failed to send email to ${user.email}:`, emailResult.error);
      }

      // Add small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Mark jobs as emailed if at least one email was sent successfully
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

      console.log(`✅ Marked ${jobIds.length} jobs as emailed`);
    }

    const summary = {
      message: 'Daily email cron job completed',
      timestamp: new Date().toISOString(),
      jobCount: unEmailedJobs.length,
      userCount: users.length,
      emailsSent: successCount,
      emailsFailed: errorCount,
      results: emailResults
    };

    console.log('🎉 Daily email cron job completed successfully:', {
      jobs: unEmailedJobs.length,
      users: users.length,
      sent: successCount,
      failed: errorCount
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('💥 Error in daily email cron job:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred in cron job',
      data: {
        timestamp: new Date().toISOString(),
        cronJob: 'send-emails'
      }
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// GET method for cron job status/health check
export async function GET(): Promise<NextResponse> {
  try {
    const unEmailedJobsCount = await prisma.job.count({
      where: {
        emailed: false
      }
    });

    const usersCount = await prisma.user.count();
    const totalJobsCount = await prisma.job.count();

    const lastJob = await prisma.job.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        createdAt: true,
        postedAt: true
      }
    });

    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Cron job status check',
        timestamp: new Date().toISOString(),
        status: {
          unEmailedJobs: unEmailedJobsCount,
          totalUsers: usersCount,
          totalJobs: totalJobsCount,
          readyToSend: unEmailedJobsCount > 0 && usersCount > 0,
          lastJobAdded: lastJob?.createdAt || null,
          lastJobPosted: lastJob?.postedAt || null
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking cron job status:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}