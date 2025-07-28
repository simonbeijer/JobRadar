import axios from 'axios';
import { prisma } from './prisma';

// JobTech Dev API interfaces
interface JobTechJob {
  id: string;
  headline: string;
  employer: {
    name: string;
  };
  workplace_address: {
    municipality: string;
  };
  publication_date: string;
  application_details: {
    url?: string;
  };
  webpage_url?: string;
}

interface JobTechResponse {
  hits: JobTechJob[];
  total: {
    value: number;
  };
}

// Developer keywords to filter jobs
const DEVELOPER_KEYWORDS = [
  'frontend',
  'fullstack', 
  'react',
  'vue',
  'javascript',
  'typescript',
  'php',
  'UI',
  'UX',
  'next'
];

// Target locations
const TARGET_LOCATIONS = ['Göteborg', 'Mölndal'];

/**
 * Fetches developer jobs from JobTech Dev API for Göteborg/Mölndal area
 */
export async function fetchJobsFromJobTech(): Promise<{ 
  fetched: number; 
  saved: number; 
  duplicates: number; 
}> {
  try {
    const response = await axios.get<JobTechResponse>(
      'https://jobsearch.api.jobtechdev.se/search',
      {
        params: {
          q: DEVELOPER_KEYWORDS.join(' OR '),
          region: 'Västra Götalands län',
          limit: 100,
          offset: 0
        },
        timeout: 10000
      }
    );

    const jobs = response.data.hits;
    const filteredJobs = jobs.filter(job => 
      TARGET_LOCATIONS.some(location => 
        job.workplace_address?.municipality?.includes(location)
      )
    );

    let savedCount = 0;
    let duplicateCount = 0;

    for (const job of filteredJobs) {
      try {
        // Use application URL if available, otherwise webpage URL
        const jobUrl = job.application_details?.url || job.webpage_url;
        
        if (!jobUrl) {
          continue; // Skip jobs without URLs
        }

        // Check if job already exists by URL
        const existingJob = await prisma.job.findUnique({
          where: { url: jobUrl }
        });

        if (existingJob) {
          duplicateCount++;
          continue;
        }

        // Create new job record
        await prisma.job.create({
          data: {
            title: job.headline,
            company: job.employer?.name || 'Unknown Company',
            location: job.workplace_address?.municipality || 'Unknown Location',
            postedAt: new Date(job.publication_date),
            url: jobUrl,
            source: 'jobtech',
            applied: false,
            emailed: false
          }
        });

        savedCount++;
      } catch (error) {
        console.error(`Error saving job ${job.id}:`, error);
        // Continue with next job instead of failing entire operation
      }
    }

    return {
      fetched: filteredJobs.length,
      saved: savedCount,
      duplicates: duplicateCount
    };

  } catch (error) {
    console.error('Error fetching jobs from JobTech API:', error);
    throw new Error('Failed to fetch jobs from JobTech API');
  }
}

/**
 * Gets job statistics from database
 */
export async function getJobStats() {
  try {
    const totalJobs = await prisma.job.count();
    const appliedJobs = await prisma.job.count({
      where: { applied: true }
    });
    const emailedJobs = await prisma.job.count({
      where: { emailed: true }
    });
    const recentJobs = await prisma.job.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    return {
      total: totalJobs,
      applied: appliedJobs,
      emailed: emailedJobs,
      recent: recentJobs
    };
  } catch (error) {
    console.error('Error getting job stats:', error);
    throw new Error('Failed to get job statistics');
  }
}