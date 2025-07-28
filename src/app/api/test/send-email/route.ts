import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { sendJobAlertEmail, createJobEmailTemplate } from '../../../../lib/emailService';
import { ApiResponse, Job } from '../../../../types';

/**
 * Test endpoint for email functionality during development
 * This endpoint provides various testing modes for the email system:
 * - Preview HTML template without sending
 * - Send test email with sample data
 * - Send real email with actual job data
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { mode = 'preview', testEmail, sendReal = false } = body;

    console.log(`🧪 Running email test in mode: ${mode}`);

    // Generate sample job data for testing
    const sampleJobs: Job[] = [
      {
        id: 'test-1',
        title: 'Senior Frontend Developer',
        company: 'Tech Innovators AB',
        location: 'Göteborg',
        postedAt: new Date(),
        url: 'https://example.com/job/1',
        source: 'jobtech',
        applied: false,
        createdAt: new Date(),
        emailed: false
      },
      {
        id: 'test-2',
        title: 'Full Stack Developer (React/Node.js)',
        company: 'Digital Solutions Inc',
        location: 'Mölndal',
        postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        url: 'https://example.com/job/2',
        source: 'jobtech',
        applied: false,
        createdAt: new Date(),
        emailed: false
      },
      {
        id: 'test-3',
        title: 'TypeScript Developer',
        company: 'Modern Web Corp',
        location: 'Göteborg',
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        url: 'https://example.com/job/3',
        source: 'jobtech',
        applied: false,
        createdAt: new Date(),
        emailed: false
      }
    ];

    switch (mode) {
      case 'preview':
        // Return HTML template for preview
        const htmlPreview = createJobEmailTemplate(sampleJobs, 'Test User');
        return NextResponse.json<ApiResponse>({
          success: true,
          data: {
            message: 'Email template preview generated',
            html: htmlPreview,
            sampleJobCount: sampleJobs.length
          }
        });

      case 'test-send':
        // Send test email with sample data
        if (!testEmail) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'testEmail is required for test-send mode'
          }, { status: 400 });
        }

        console.log(`📧 Sending test email to: ${testEmail}`);
        
        const testResult = await sendJobAlertEmail({
          jobs: sampleJobs,
          userEmail: testEmail,
          userName: 'Test User'
        });

        return NextResponse.json<ApiResponse>({
          success: testResult.success,
          data: {
            message: testResult.success ? 'Test email sent successfully' : 'Test email failed',
            testEmail,
            sampleJobCount: sampleJobs.length,
            error: testResult.error
          }
        });

      case 'real-data':
        // Send email with real job data from database
        if (!testEmail) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'testEmail is required for real-data mode'
          }, { status: 400 });
        }

        // Get actual unemailed jobs from database
        const realJobs = await prisma.job.findMany({
          where: {
            emailed: false
          },
          orderBy: {
            postedAt: 'desc'
          },
          take: 10 // Limit to 10 for testing
        });

        if (realJobs.length === 0) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'No unemailed jobs found in database for testing'
          }, { status: 404 });
        }

        console.log(`📧 Sending test email with ${realJobs.length} real jobs to: ${testEmail}`);

        const realResult = await sendJobAlertEmail({
          jobs: realJobs,
          userEmail: testEmail,
          userName: 'Test User'
        });

        // Optionally mark jobs as emailed if sendReal is true
        if (sendReal && realResult.success) {
          await prisma.job.updateMany({
            where: {
              id: {
                in: realJobs.map(job => job.id)
              }
            },
            data: {
              emailed: true
            }
          });
          console.log(`✅ Marked ${realJobs.length} jobs as emailed`);
        }

        return NextResponse.json<ApiResponse>({
          success: realResult.success,
          data: {
            message: realResult.success ? 'Real data email sent successfully' : 'Real data email failed',
            testEmail,
            realJobCount: realJobs.length,
            markedAsEmailed: sendReal && realResult.success,
            error: realResult.error
          }
        });

      case 'status':
        // Check system status for testing
        const users = await prisma.user.findMany({
          select: { email: true, name: true }
        });
        
        const unEmailedJobs = await prisma.job.findMany({
          where: { emailed: false },
          select: { id: true, title: true, company: true, postedAt: true }
        });

        return NextResponse.json<ApiResponse>({
          success: true,
          data: {
            message: 'Email system status',
            users: users,
            unEmailedJobs: unEmailedJobs.slice(0, 5), // Show first 5
            totalUnEmailedJobs: unEmailedJobs.length,
            systemReady: users.length > 0 && unEmailedJobs.length > 0
          }
        });

      default:
        return NextResponse.json<ApiResponse>({
          success: false,
          error: `Unknown test mode: ${mode}. Available modes: preview, test-send, real-data, status`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('🚨 Error in email test endpoint:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred in test endpoint'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// GET method for test endpoint documentation
export async function GET(): Promise<NextResponse> {
  const documentation = {
    endpoint: '/api/test/send-email',
    description: 'Test endpoint for email functionality during development',
    methods: {
      POST: {
        description: 'Run email tests with different modes',
        body: {
          mode: {
            type: 'string',
            required: true,
            options: ['preview', 'test-send', 'real-data', 'status'],
            description: 'Test mode to run'
          },
          testEmail: {
            type: 'string',
            required: 'for test-send and real-data modes',
            description: 'Email address to send test emails to'
          },
          sendReal: {
            type: 'boolean',
            default: false,
            description: 'Whether to mark jobs as emailed when using real-data mode'
          }
        },
        examples: [
          {
            name: 'Preview HTML template',
            body: { mode: 'preview' }
          },
          {
            name: 'Send test email',
            body: { mode: 'test-send', testEmail: 'test@example.com' }
          },
          {
            name: 'Send with real data',
            body: { mode: 'real-data', testEmail: 'test@example.com', sendReal: false }
          },
          {
            name: 'Check system status',
            body: { mode: 'status' }
          }
        ]
      },
      GET: {
        description: 'View this documentation'
      }
    },
    usage: 'This endpoint is for development and testing only. Do not use in production.'
  };

  return NextResponse.json(documentation);
}