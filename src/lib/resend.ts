import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: 'JobRadar <noreply@jobsearch.example.com>', // Update this with your verified domain
  fromName: 'JobRadar',
  subject: 'Daily Job Alert - New Opportunities Available',
} as const;