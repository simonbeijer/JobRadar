"use client";

import { Job } from "@/types";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  onAppliedToggle?: (jobId: string, applied: boolean) => void;
}

export default function JobCard({ job, onAppliedToggle }: JobCardProps) {
  const [isApplied, setIsApplied] = useState(job.applied || false);

  const handleAppliedToggle = () => {
    const newAppliedState = !isApplied;
    setIsApplied(newAppliedState);
    onAppliedToggle?.(job.id, newAppliedState);
  };

  const formatPostedDate = (date: Date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleViewJob = () => {
    window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-background border border-grey/20 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with title and company */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 text-grey">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium">{job.company}</span>
          </div>
          <span className="text-sm text-grey">{formatPostedDate(job.postedAt)}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4 text-grey">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{job.location}</span>
      </div>

      {/* Source info */}
      <div className="flex items-center gap-2 mb-4 text-grey">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="capitalize">{job.source}</span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleViewJob}
          className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
        >
          View Job
        </button>
        <button
          onClick={handleAppliedToggle}
          className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background ${
            isApplied
              ? 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
              : 'bg-grey/20 text-foreground hover:bg-grey/30 focus:ring-grey'
          }`}
        >
          {isApplied ? (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Applied
            </div>
          ) : (
            'Mark Applied'
          )}
        </button>
      </div>
    </div>
  );
}