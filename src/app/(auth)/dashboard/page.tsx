"use client";

import { useState, useEffect, useMemo } from "react";
import { useUserContext } from "@/app/context/userContext";
import { Job, JobFilters, JobsResponse } from "@/types";
import JobList from "@/app/components/jobList";
import SearchInput from "@/app/components/searchInput";
import DateRangePicker from "@/app/components/dateRangePicker";

export default function Dashboard() {
  const { user } = useUserContext();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    // Default to today's jobs as per PRD
    dateFrom: new Date(),
    dateTo: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isFetchingJobs, setIsFetchingJobs] = useState(false);

  // Fetch jobs from external API (JobTech)
  const fetchJobsFromAPI = async () => {
    try {
      setIsFetchingJobs(true);
      const response = await fetch('/api/fetch-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch jobs from API');
      }

      const result = await response.json();
      console.log('Jobs fetched successfully:', result);
      
      // Refresh the job list
      await fetchJobs();
      
      alert(`Successfully fetched ${result.result?.saved || 0} new jobs from JobTech API!`);
    } catch (err) {
      console.error('Error fetching jobs from API:', err);
      setError('Failed to fetch jobs from JobTech API. Please try again.');
    } finally {
      setIsFetchingJobs(false);
    }
  };

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString());
      if (filters.appliedOnly) params.append('appliedOnly', 'true');
      
      const response = await fetch(`/api/jobs?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch jobs`);
      }

      const data: JobsResponse = await response.json();
      setJobs(data.jobs.map(job => ({
        ...job,
        postedAt: new Date(job.postedAt),
        createdAt: new Date(job.createdAt)
      })));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load jobs. Please try again.';
      setError(errorMessage);
      console.error('Error fetching jobs:', err);
      
      // If this is a database/schema error, provide helpful guidance
      if (errorMessage.includes('relation') || errorMessage.includes('table') || errorMessage.includes('Job')) {
        setError('Database not ready. Please run: npx prisma migrate dev && npx prisma generate');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  // Update applied status
  const updateAppliedStatus = async (jobId: string, applied: boolean) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/applied`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applied }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job status');
      }

      // Update local state
      setJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, applied } : job
        )
      );
    } catch (err) {
      console.error('Error updating job status:', err);
      setError('Failed to update job status. Please try again.');
    }
  };

  // Handle search input change (debounced via useEffect)
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  // Handle date range change
  const handleDateChange = (dateFrom?: Date, dateTo?: Date) => {
    setFilters(prev => ({ ...prev, dateFrom, dateTo }));
  };

  // Handle applied toggle
  const handleAppliedToggle = (jobId: string, applied: boolean) => {
    updateAppliedStatus(jobId, applied);
  };

  // Handle applied filter toggle
  const handleAppliedFilterToggle = () => {
    setFilters(prev => ({ ...prev, appliedOnly: !prev.appliedOnly }));
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-background">
      <div className="w-full max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-grey">
            Find your next opportunity from today&apos;s job listings.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-background rounded-lg shadow-sm border border-grey/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Filter Jobs</h2>
          
          {/* Search Input */}
          <div className="mb-6">
            <SearchInput onSearch={handleSearch} />
          </div>

          {/* Date Range Picker */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Posted Date</h3>
            <DateRangePicker onDateChange={handleDateChange} defaultToToday={true} />
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAppliedFilterToggle}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background ${
                filters.appliedOnly
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-grey/20 text-foreground hover:bg-grey/30'
              }`}
            >
              {filters.appliedOnly ? 'Show All Jobs' : 'Applied Jobs Only'}
            </button>
          </div>
        </div>

        {/* Results Summary and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-foreground">
            <span className="font-semibold">{jobs.length}</span> job{jobs.length !== 1 ? 's' : ''} found
            {filters.searchTerm && (
              <span className="text-grey"> for &quot;{filters.searchTerm}&quot;</span>
            )}
          </div>
          <button
            onClick={fetchJobsFromAPI}
            disabled={isFetchingJobs}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background ${
              isFetchingJobs
                ? 'bg-grey/20 text-grey cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {isFetchingJobs ? 'Fetching Jobs...' : 'Fetch New Jobs'}
          </button>
        </div>

        {/* Job Listings */}
        <JobList 
          jobs={jobs}
          onAppliedToggle={handleAppliedToggle}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
