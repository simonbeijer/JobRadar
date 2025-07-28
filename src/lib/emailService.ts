import { resend, EMAIL_CONFIG } from './resend';
import { Job, User } from '../types';

export interface EmailJobData {
  jobs: Job[];
  userEmail: string;
  userName: string;
}

/**
 * Creates HTML email template for job listings
 */
export function createJobEmailTemplate(jobs: Job[], userName: string): string {
  const jobsHtml = jobs.map(job => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 16px 0;">
        <div style="margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">
            ${escapeHtml(job.title)}
          </h3>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
            ${escapeHtml(job.company)} • ${escapeHtml(job.location)}
          </p>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="font-size: 12px; color: #9ca3af;">
            Posted: ${formatDate(job.postedAt)}
          </span>
        </div>
        <div>
          <a href="${escapeHtml(job.url)}" 
             target="_blank" 
             rel="noopener noreferrer"
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
            View Job
          </a>
        </div>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JobRadar - Daily Job Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              
              <!-- Header -->
              <div style="background-color: #1f2937; padding: 24px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                  📡 JobRadar
                </h1>
                <p style="margin: 8px 0 0 0; color: #d1d5db; font-size: 16px;">
                  Daily Job Alert
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 32px 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">
                  Hello ${escapeHtml(userName)}! 👋
                </h2>
                
                <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151;">
                  We found <strong>${jobs.length}</strong> new developer ${jobs.length === 1 ? 'position' : 'positions'} for you today:
                </p>

                <!-- Jobs Table -->
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                  <tbody>
                    ${jobsHtml}
                  </tbody>
                </table>

                <div style="text-align: center; margin-top: 32px;">
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    Visit your dashboard to mark jobs as applied and manage your job search.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                  This email was sent by JobRadar. If you no longer wish to receive these alerts, please contact support.
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">
                  © ${new Date().getFullYear()} JobRadar. All rights reserved.
                </p>
              </div>

            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Sends job alert email to user
 */
export async function sendJobAlertEmail(emailData: EmailJobData): Promise<{ success: boolean; error?: string }> {
  try {
    if (emailData.jobs.length === 0) {
      return { success: false, error: 'No jobs to send' };
    }

    const htmlContent = createJobEmailTemplate(emailData.jobs, emailData.userName);
    
    const subject = emailData.jobs.length === 1
      ? 'JobRadar Alert: 1 New Developer Position'
      : `JobRadar Alert: ${emailData.jobs.length} New Developer Positions`;

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [emailData.userEmail],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true };
  } catch (error) {
    console.error('Error sending job alert email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Utility functions
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}