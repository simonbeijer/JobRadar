# MANUAL TASKS - Human Only

> **⚠️ IMPORTANT:** This file contains tasks that must be completed manually by the developer. These are actions that Claude Code or any AI agent should NOT and CANNOT perform. This includes creating accounts, obtaining API keys, testing user interfaces, and deployment tasks that require human verification.

---

## TODO (Setup & Testing)

### API Keys & Accounts

- [ ] **JobTech Dev API** - No account needed - Use https://jobsearch.api.jobtechdev.se/ (free, no key required)
- [ ] **Resend Email** - Go to https://resend.com/ → RESEND_API_KEY is available in .env

### Environment Setup

- [ ] Create `.env` file with Resend API key, JobTech API URL, and database URL
- [ ] Update user credentials in `prisma/seed.js` (email + password)
- [ ] Verify Docker PostgreSQL is running locally
- [ ] Test database connection works

### Testing & Deployment

- [ ] Test TypeScript conversion works (run dev server)
- [ ] Test login with new credentials
- [ ] Test job fetching works (manually trigger `/api/fetch-jobs`)
- [ ] Test email sending works (manually trigger `/api/send-email`)
- [ ] Verify homepage shows jobs correctly (after login)
- [ ] Test filtering, search, and date range functionality
- [ ] Test "Applied" button toggle on jobs
- [ ] Check mobile responsiveness
- [ ] Push final code to GitHub
- [ ] Deploy to Vercel and add environment variables
- [ ] Verify production deployment works end-to-end
- [ ] Test cron jobs are running automatically

---

**Note:** Check off items as you complete them. This serves as your personal development checklist for the JobRadar project.