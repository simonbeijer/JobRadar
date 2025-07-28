"use client";

import { Job } from "@/types";
import JobCard from "./jobCard";

interface JobListProps {
  jobs: Job[];
  onAppliedToggle?: (jobId: string, applied: boolean) => void;
  isLoading?: boolean;
  error?: string;
}

export default function JobList({ jobs, onAppliedToggle, isLoading, error }: JobListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-background border border-grey/20 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-grey/20 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-grey/20 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-grey/20 rounded w-1/3 mb-4"></div>
            <div className="flex gap-3">
              <div className="h-10 bg-grey/20 rounded flex-1"></div>
              <div className="h-10 bg-grey/20 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Jobs</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-grey/10 border border-grey/20 rounded-lg p-12 text-center">
        <svg className="w-16 h-16 text-grey mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
        </svg>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Jobs Found</h3>
        <p className="text-grey">Try adjusting your search criteria or check back later for new opportunities.</p>
      </div>
    );
  }

  // Jobs list
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onAppliedToggle={onAppliedToggle}
        />
      ))}
    </div>
  );
}