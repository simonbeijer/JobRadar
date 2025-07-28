# JobRadar - Product Requirements Document

## Product Overview
**Name:** JobRadar  
**Purpose:** Simple job aggregation website for personal use (behind login)  
**Goal:** Find developer jobs in Göteborg/Mölndal area automatically

## What It Does

- Shows a list of developer jobs from multiple job sites (login required)
- Lets me filter jobs by title and date range
- Mark jobs as "have applied" with a button
- Emails me daily with new job opportunities
- Updates job listings automatically every day

## Technical Foundation
**Base:** basic-next-template → Convert to TypeScript first  
**Stack:** Next.js + TypeScript + Prisma + PostgreSQL + Tailwind + Docker  
**Auth:** Existing login system (update credentials in seed.js)  
**Deployment:** Vercel (free tier)  
**Database:** PostgreSQL  
**Email:** Resend API (free tier)

## Features

### Authentication
- Use existing login system from template
- Update user credentials in seed.js file
- All job pages require authentication
- Simple login/logout functionality

### Job Display
- Clean list of jobs on homepage (behind login)
- Each job shows: title, company, posted date, location
- "View Job" button opens original posting in new tab
- "Applied" button to mark job as applied (toggles state)
- Simple white background, black text design
- Responsive design (works on mobile)

### Filtering
- Search bar to filter by job title/company
- Date range picker: single date OR from/to date range
- Default filter: only today's jobs
- **Developer-focused keywords automatically filtered:** front-end, fullstack, react, vue, javascript, typescript, php, UI, UX, next
- Primary focus on developer and frontend positions

### Daily Email Alerts
- Automatic email at 8:00 AM with new jobs from yesterday
- Only sends email if there are new jobs
- Clean HTML format with job details and links
- Sent to user's email address

### Automated Job Fetching
- Runs daily to get new jobs from APIs
- **Locations:** Göteborg and Mölndal only
- **Developer-focused keywords:** front-end, fullstack, react, vue, javascript, typescript, php, UI, UX, next
- Optimized for finding developer positions in target locations
- Removes duplicate jobs automatically

## Data Structure

```prisma
model Job {
  id        String   @id @default(cuid())
  title     String
  company   String
  location  String
  postedAt  DateTime
  url       String   @unique
  source    String   // "jobtech" (future: support multiple sources)
  applied   Boolean  @default(false)
  createdAt DateTime @default(now())
  emailed   Boolean  @default(false)
}

// Update existing User model email in seed.js
```

## Job Sources
- **JobTech Dev API:** Swedish job search API (https://jobsearch.api.jobtechdev.se/)
  - Focuses on Swedish job market
  - No API key required for basic usage
  - Excellent for developer positions in Göteborg/Mölndal area

*Note: Adding additional job APIs will be implemented as a future feature to expand job coverage.*

## API Routes
- `/api/fetch-jobs` - Fetch new jobs from external APIs and save to database
- `/api/send-email` - Send daily email with new jobs
- `/api/jobs` - Get jobs for frontend (with filtering, requires auth)
- `/api/jobs/[id]/applied` - Toggle applied status for job

## Pages
- `/` (Homepage) - Job listings with search and filters (auth required)
- `/login` - Login page (existing from template)
- Admin routes for manual triggers (optional)

## Styling
- **Simple CSS approach:** White background, black text
- **Minimal design:** Clean, professional look
- **Tailwind:** Basic utilities only, no fancy components
- **Mobile-first:** Works well on all devices

## Cron Jobs
- **Daily at 6:00 AM:** Fetch new jobs (`/api/fetch-jobs`)
- **Daily at 8:00 AM:** Send email if new jobs exist (`/api/send-email`)

## Environment Variables
```env
DATABASE_URL="postgresql://simon:S1m0n@postgres:5432/basicdb"
RESEND_API_KEY="your_resend_key"
JOBTECH_API_URL="https://jobsearch.api.jobtechdev.se/"
```

## Success Criteria
- ✅ TypeScript conversion completed and working
- ✅ Login system working with updated credentials
- ✅ Homepage displays current developer jobs (auth required)
- ✅ Can search/filter jobs by title and date range
- ✅ Can mark jobs as "applied" with button toggle
- ✅ Receives daily email with only new jobs
- ✅ Jobs automatically refresh daily without manual intervention
- ✅ Simple white/black design that's mobile-friendly
- ✅ Deployed and accessible via public URL

## Design Principles
- **Simple:** White background, black text, minimal interface
- **Fast:** Quick loading, instant filtering
- **Secure:** All job data behind authentication
- **Reliable:** Works every day without maintenance
- **Mobile-first:** Clean on phone and desktop
- **Professional:** TypeScript codebase showcasing development skills

---

*This is a personal portfolio project demonstrating full-stack TypeScript development skills while solving a real-world problem.*