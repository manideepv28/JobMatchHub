import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { JobFilters as JobFiltersType } from '@/types';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  onClear: () => void;
}

const CATEGORIES = [
  'Technology',
  'Marketing', 
  'Design',
  'Sales',
  'Finance',
  'Healthcare',
  'Education'
];

const LOCATIONS = [
  'New York, NY',
  'San Francisco, CA',
  'Los Angeles, CA',
  'Chicago, IL',
  'Austin, TX',
  'Seattle, WA',
  'Remote'
];

const SALARY_RANGES = [
  { value: '40000-60000', label: '$40k - $60k' },
  { value: '60000-80000', label: '$60k - $80k' },
  { value: '80000-100000', label: '$80k - $100k' },
  { value: '100000-150000', label: '$100k - $150k' },
  { value: '150000+', label: '$150k+' }
];

const JOB_TYPES = [
  'Full-time',
  'Part-time', 
  'Contract',
  'Remote'
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Date Posted' },
  { value: 'salary-high', label: 'Salary (High to Low)' },
  { value: 'salary-low', label: 'Salary (Low to High)' },
  { value: 'company', label: 'Company Name' }
];

export default function JobFiltersComponent({ filters, onFiltersChange, onClear }: JobFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof JobFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const updateJobTypes = (jobType: string, checked: boolean) => {
    const newJobTypes = checked
      ? [...filters.jobTypes, jobType]
      : filters.jobTypes.filter(type => type !== jobType);
    
    updateFilter('jobTypes', newJobTypes);
  };

  const hasActiveFilters = 
    filters.search ||
    (filters.category && filters.category !== 'all') ||
    (filters.location && filters.location !== 'all') ||
    (filters.salary && filters.salary !== 'all') ||
    filters.jobTypes.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Job title, company, or keywords..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Select
              value={filters.location}
              onValueChange={(value) => updateFilter('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range Filter */}
          <div>
            <Label htmlFor="salary" className="text-sm font-medium">
              Salary Range
            </Label>
            <Select
              value={filters.salary}
              onValueChange={(value) => updateFilter('salary', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Salary</SelectItem>
                {SALARY_RANGES.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Type Filter */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Job Type
            </Label>
            <div className="space-y-2">
              {JOB_TYPES.map(jobType => (
                <div key={jobType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`jobtype-${jobType}`}
                    checked={filters.jobTypes.includes(jobType)}
                    onCheckedChange={(checked) => 
                      updateJobTypes(jobType, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`jobtype-${jobType}`}
                    className="text-sm font-normal"
                  >
                    {jobType}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <Label htmlFor="sort" className="text-sm font-medium">
              Sort By
            </Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
