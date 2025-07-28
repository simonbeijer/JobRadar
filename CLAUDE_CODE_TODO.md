# Claude Code's TODO (Development with Subagents)

> **🚨 ROLE DIVISION:**
> - **Claude Code:** Write all code, create files, install packages, document environment variables
> - **Simon:** Environment setup, database migrations, testing, deployment, API keys, .env configuration

---

## Phase 1: TypeScript Conversion & Setup

### api-backend-developer:
- [ ] Install TypeScript dependencies: `npm install @types/node @types/react`
- [ ] Convert all .js files to .ts/.tsx
- [ ] Add TypeScript config and dependencies
- [ ] Type all API routes properly
- [ ] Type database models and operations
- [ ] Fix any TypeScript compilation errors
- [ ] Verify all backend functionality still works

### frontend-ui-developer:
- [ ] Convert React components to TypeScript
- [ ] Add proper TypeScript props and interfaces
- [ ] Update imports and exports for TypeScript
- [ ] Verify all frontend functionality still works

## Phase 2: Template Cleanup & Branding

### frontend-ui-developer:
- [ ] Replace all "basic-next-template" with "JobRadar"
- [ ] Update package.json name, description, URLs
- [ ] Update site title, meta tags, favicon
- [ ] Clean out template example components
- [ ] Update README.md with JobRadar content
- [ ] Find and replace template names in all files

### api-backend-developer:
- [ ] Update API route comments and descriptions
- [ ] Clean out template API examples
- [ ] Update database connection names if needed

## Phase 3: Authentication & User Setup

### api-backend-developer:
- [ ] Verify existing auth system works
- [ ] Add auth middleware for job routes
- [ ] Test login/logout functionality
- [ ] Document required user credentials format in README.md for Simon

## Phase 4: Database & Models

### api-backend-developer:
- [ ] Add Job model to Prisma schema
- [ ] Add applied field to Job model
- [ ] Create migration file only - Simon will run migrations
- [ ] Update seed script with sample job data
- [ ] Create database helper functions for jobs
- [ ] Create helper for toggle applied status

## Phase 5: Job Fetching System

### api-backend-developer:
- [ ] Research and install job API packages: `npm install axios` (or adzuna-api, careerjet-api if available)
- [ ] Install and configure Adzuna API client
- [ ] Install and configure Careerjet API client
- [ ] Create job fetching service for Adzuna
- [ ] Create job fetching service for Careerjet
- [ ] Add location filtering (Göteborg + Mölndal)
- [ ] Add keyword filtering (front-end, fullstack, react, vue, js, ts, php, UI, UX, next)
- [ ] Create deduplication logic (URL + title+company)
- [ ] Build /api/fetch-jobs orchestration route
- [ ] Add proper error handling and logging
- [ ] Add TypeScript interfaces for job data
- [ ] Document required API keys in README.md for Simon

## Phase 6: Job API Routes

### api-backend-developer:
- [ ] Create /api/jobs GET route with auth middleware
- [ ] Add search query parameter handling
- [ ] Add date range filtering logic
- [ ] Add pagination if needed
- [ ] Create /api/jobs/[id]/applied PUT route
- [ ] Add proper TypeScript types for all routes
- [ ] Add validation for all route parameters

## Phase 7: Frontend Job Display

### frontend-ui-developer:
- [ ] Create JobCard component with TypeScript props
- [ ] Add "View Job" button (opens in new tab)
- [ ] Add "Applied" toggle button with state management
- [ ] Style JobCard with simple white/black design
- [ ] Create job list layout component
- [ ] Add loading states for job operations
- [ ] Make design mobile responsive

## Phase 8: Search & Filtering UI

### frontend-ui-developer:
- [ ] Create search input component
- [ ] Create date range picker component
- [ ] Set default filter to "today only"
- [ ] Add single date OR date range selection
- [ ] Implement real-time search filtering
- [ ] Add filter reset functionality
- [ ] Style filters with simple white/black design

## Phase 9: Homepage Integration

### frontend-ui-developer:
- [ ] Replace template homepage with job listings
- [ ] Add auth protection to homepage
- [ ] Integrate search and filter components
- [ ] Add job fetching from /api/jobs
- [ ] Handle loading and error states
- [ ] Ensure responsive design
- [ ] Apply simple CSS styling (white bg, black text)

## Phase 10: Email System

### email-system-engineer:
- [ ] Install Resend package: `npm install resend`
- [ ] Install and configure Resend SDK
- [ ] Create HTML email template for job listings
- [ ] Build /api/send-email route
- [ ] Add logic to query unemailed jobs
- [ ] Add email sending with error handling
- [ ] Mark jobs as emailed after successful send
- [ ] Add TypeScript types for email operations
- [ ] Test email template rendering
- [ ] Document required Resend API key in README.md for Simon

## Phase 11: Cron Function Files

### api-backend-developer:
- [ ] Create `/api/cron/fetch-jobs.ts` endpoint for automated job fetching
- [ ] Create `/api/cron/send-emails.ts` endpoint for automated email sending
- [ ] Add proper TypeScript types for cron endpoints
- [ ] Add logging and error handling to cron functions
- [ ] Create manual trigger endpoints for testing: `/api/test/fetch-jobs` and `/api/test/send-emails`
- [ ] Document cron setup requirements in README.md for Simon's Vercel deployment

## Phase 12: Final Polish & Code Completion

### frontend-ui-developer:
- [ ] Final styling pass (white background, black text)
- [ ] Add any missing loading indicators
- [ ] Ensure all buttons have proper hover states
- [ ] Add proper error messages for user actions

### api-backend-developer:
- [ ] Add comprehensive error handling
- [ ] Verify all TypeScript types are correct
- [ ] Add input validation where needed
- [ ] Clean up any unused dependencies
- [ ] Add API documentation comments
- [ ] Create comprehensive README.md with all environment variables and setup instructions

### Final Handoff:
- [ ] **Code is ready for Simon's testing and deployment phase**
- [ ] All environment variables documented in README.md
- [ ] All manual tasks clearly separated in MANUAL_TASKS.md
- [ ] TypeScript compilation successful with no errors