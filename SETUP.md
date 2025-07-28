# JobRadar Setup Guide

## Quick Start

1. **Database Setup:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migration
   npx prisma migrate dev --name add_job_model
   
   # Seed with sample data
   npm run seed
   ```

2. **Environment Variables:**
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://simon:S1m0n@postgres:5432/jobradardb"
   RESEND_API_KEY="your_resend_api_key_here"
   CRON_SECRET="your_secure_token_here"
   ```

3. **Start Development:**
   ```bash
   npm run dev
   ```

4. **Login Credentials:**
   - Email: `user@example.com`
   - Password: `password123`

## Features

- ✅ Job listings with search and date filtering
- ✅ "Applied" status tracking
- ✅ Manual job fetching from JobTech Dev API
- ✅ Email alerts system (requires Resend API key)
- ✅ Automated cron jobs for daily fetching and emails

## API Endpoints

- `GET /api/jobs` - List jobs with filtering
- `PUT /api/jobs/[id]/applied` - Toggle applied status
- `POST /api/fetch-jobs` - Fetch jobs from JobTech API
- `POST /api/send-email` - Send job alert emails
- `POST /api/cron/fetch-jobs` - Daily job fetching (6 AM)
- `POST /api/cron/send-emails` - Daily email alerts (8 AM)

## Troubleshooting

**"Failed to fetch jobs" error:**
1. Make sure PostgreSQL is running: `docker compose up postgres`
2. Run database setup commands above
3. Check that you're logged in

**No jobs showing:**
1. Click "Fetch New Jobs" button to get real jobs from JobTech API
2. Or check that sample data was seeded properly

**Email not working:**
1. Get a free API key from [resend.com](https://resend.com)
2. Add it to your `.env` file as `RESEND_API_KEY`