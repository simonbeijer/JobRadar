# Subagent Coordination Guide

> **📋 Overview:** This document outlines the specialized subagents available for JobRadar development and how to coordinate them effectively for different phases of the project.

---

## Available Subagents

### TypeScript Conversion
> **Subagent:** `api-backend-developer`  
> **Task:** Convert all backend files to TypeScript and ensure they compile correctly  
> **Usage:** Use when converting API routes, middleware, auth files, and database utilities from JavaScript to TypeScript

### UI Components
> **Subagent:** `frontend-ui-developer`  
> **Task:** Create the JobCard component with Applied button and simple styling  
> **Usage:** Use for building React components, UI layouts, and frontend interactions

### Email Functionality  
> **Subagent:** `email-system-engineer`  
> **Task:** Build the complete email system with Resend integration  
> **Usage:** Use for implementing email templates, SMTP configuration, and automated email sending

### Deploy Everything
> **Subagent:** `deployment-automation-specialist`  
> **Task:** Set up Vercel cron jobs and deployment configuration  
> **Usage:** Use for production deployment setup, environment configuration, and automated task scheduling

---

## Coordination Strategies

### Parallel Development
> **Strategy:** Use `api-backend-developer` and `frontend-ui-developer` together to build the job filtering system  
> **Benefit:** Simultaneous backend API development and frontend UI implementation for faster delivery

### Full Coordination
> **Strategy:** Coordinate all subagents to implement the complete job application tracking feature  
> **Benefit:** Comprehensive feature development with proper integration between all system components

---

## Usage Examples

```bash
# Single subagent for specific task
/use api-backend-developer "Convert the auth middleware to TypeScript"

# Parallel development
/use api-backend-developer "Create jobs API endpoints" && /use frontend-ui-developer "Build job listing components"

# Full coordination for complex features
/coordinate-all "Implement complete job application tracking with database, UI, and email notifications"
```

---

## Development Phases

1. **Phase 1: Foundation** → `api-backend-developer` (TypeScript conversion)
2. **Phase 2: Core Features** → `api-backend-developer` + `frontend-ui-developer` (parallel)  
3. **Phase 3: Automation** → `email-system-engineer` (email system)
4. **Phase 4: Production** → `deployment-automation-specialist` (deployment)

---

**Note:** This guide helps coordinate multiple specialized AI agents to efficiently build the JobRadar application according to the PRD specifications.