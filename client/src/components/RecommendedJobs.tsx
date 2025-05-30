import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign } from 'lucide-react';
import { Job, UserProfile } from '@shared/schema';
import { LocalStorageService } from '@/lib/storage';

interface RecommendedJobsProps {
  userProfile: UserProfile | null;
  onJobSelect: (job: Job) => void;
}

export default function RecommendedJobs({ userProfile, onJobSelect }: RecommendedJobsProps) {
  if (!userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 text-center py-4">
            Complete your profile to see personalized job recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const recommendedJobs = LocalStorageService.getRecommendedJobs(userProfile).slice(0, 3);

  if (recommendedJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 text-center py-4">
            No recommendations available. Try updating your preferences.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendedJobs.map(job => (
          <div
            key={job.id}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onJobSelect(job)}
          >
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">{job.title}</h4>
              <p className="text-sm text-primary">{job.company}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <DollarSign className="w-3 h-3" />
                <span>{formatSalary(job.salary)}</span>
              </div>

              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">
                  {job.category}
                </Badge>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <p className="text-xs text-gray-500 text-center">
            Based on your preferences and skills
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
