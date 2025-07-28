export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface AuthResponse {
  user: User | null;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Job-related interfaces
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt: Date;
  url: string;
  source: string;
  applied: boolean;
  createdAt: Date;
  emailed: boolean;
}

export interface JobSearchParams {
  search?: string;
  location?: string;
  applied?: boolean;
  emailed?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface JobStats {
  total: number;
  applied: number;
  emailed: number;
  recent: number;
}

export interface FetchJobsResult {
  fetched: number;
  saved: number;
  duplicates: number;
}

export interface FetchJobsResponse {
  message: string;
  result: FetchJobsResult;
  stats: JobStats;
}

// Frontend filtering interface
export interface JobFilters {
  searchTerm?: string;
  dateFrom?: Date;
  dateTo?: Date;
  appliedOnly?: boolean;
}