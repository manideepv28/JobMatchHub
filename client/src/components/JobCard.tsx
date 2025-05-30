import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Bookmark, 
  BookmarkCheck,
  Building2 
} from 'lucide-react';
import { Job } from '@shared/schema';
import { LocalStorageService } from '@/lib/storage';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  isApplied?: boolean;
}

export default function JobCard({ job, onApply, isApplied = false }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(LocalStorageService.isJobSaved(job.id));

  const handleSaveToggle = () => {
    if (isSaved) {
      LocalStorageService.unsaveJob(job.id);
    } else {
      LocalStorageService.saveJob(job.id);
    }
    setIsSaved(!isSaved);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Job Details */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary cursor-pointer">
                  {job.title}
                </h3>
                <p className="text-primary font-medium">{job.company}</p>
              </div>
            </div>

            {/* Job Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatSalary(job.salary)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(job.postedDate)}
              </div>
            </div>

            {/* Job Type and Category Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {job.type}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {job.category}
              </Badge>
              {job.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  Featured
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 line-clamp-2">
              {job.description}
            </p>

            {/* Requirements Preview */}
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-col gap-2 sm:min-w-[120px]">
            <Button 
              onClick={() => onApply(job)}
              disabled={isApplied}
              className="w-full"
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveToggle}
              className="w-full"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 mr-1" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
