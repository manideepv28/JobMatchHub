import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import RecommendedJobs from '@/components/RecommendedJobs';
import ApplicationModal from '@/components/ApplicationModal';
import { Job, UserProfile, JobApplication } from '@shared/schema';
import { JobFilters as JobFiltersType } from '@/types';
import { LocalStorageService } from '@/lib/storage';

interface HomeProps {
  userProfile: UserProfile | null;
}

const JOBS_PER_PAGE = 10;

export default function Home({ userProfile }: HomeProps) {
  const [jobs] = useState<Job[]>(LocalStorageService.getJobs());
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState<JobFiltersType>({
    search: '',
    category: 'all',
    location: 'all',
    salary: 'all',
    jobTypes: [],
    sortBy: 'relevance'
  });

  // Hero search state
  const [heroSearch, setHeroSearch] = useState('');
  const [heroLocation, setHeroLocation] = useState('');

  useEffect(() => {
    setApplications(LocalStorageService.getApplications());
  }, []);

  const handleHeroSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: heroSearch,
      location: heroLocation || 'all'
    }));
    setCurrentPage(1);
  };

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.requirements.some(req => req.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(job => job.category === filters.category);
    }

    if (filters.location && filters.location !== 'all') {
      result = result.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.salary && filters.salary !== 'all') {
      result = result.filter(job => {
        if (filters.salary === '150000+') {
          return job.salary >= 150000;
        } else {
          const [min, max] = filters.salary.split('-').map(Number);
          return job.salary >= min && job.salary <= max;
        }
      });
    }

    if (filters.jobTypes.length > 0) {
      result = result.filter(job => filters.jobTypes.includes(job.type));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'date':
        result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'salary-high':
        result.sort((a, b) => b.salary - a.salary);
        break;
      case 'salary-low':
        result.sort((a, b) => a.salary - b.salary);
        break;
      case 'company':
        result.sort((a, b) => a.company.localeCompare(b.company));
        break;
      default: // relevance
        // Featured jobs first, then by posted date
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        });
    }

    return result;
  }, [jobs, filters]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  const handleApplyForJob = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = (application: JobApplication) => {
    setApplications(prev => [...prev, application]);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      location: 'all',
      salary: 'all',
      jobTypes: [],
      sortBy: 'relevance'
    });
    setCurrentPage(1);
  };

  const isJobApplied = (jobId: number) => {
    return applications.some(app => app.jobId === jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-xl mb-8 text-blue-100">Thousands of opportunities waiting for you</p>
            
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Job title, company, or keywords..."
                        value={heroSearch}
                        onChange={(e) => setHeroSearch(e.target.value)}
                        className="text-gray-900"
                      />
                    </div>
                    <div className="md:w-64">
                      <Select value={heroLocation} onValueChange={setHeroLocation}>
                        <SelectTrigger className="text-gray-900">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="New York, NY">New York, NY</SelectItem>
                          <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                          <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                          <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                          <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                          <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleHeroSearch} className="bg-white text-primary hover:bg-gray-100">
                      <Search className="w-4 h-4 mr-2" />
                      Search Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-6">
            <JobFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClear={clearFilters}
            />
            
            <RecommendedJobs
              userProfile={userProfile}
              onJobSelect={handleApplyForJob}
            />
          </aside>

          {/* Job Listings */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Job Listings</h2>
                <p className="text-gray-600 mt-1">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </p>
              </div>
            </div>

            {/* Job Cards */}
            {paginatedJobs.length > 0 ? (
              <div className="space-y-4">
                {paginatedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={handleApplyForJob}
                    isApplied={isJobApplied(job.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        job={selectedJob}
        userProfile={userProfile}
        onApplicationSubmit={handleApplicationSubmit}
      />
    </div>
  );
}
