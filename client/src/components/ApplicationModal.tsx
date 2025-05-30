import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  DollarSign, 
  FileText,
  CheckCircle
} from 'lucide-react';
import { Job, UserProfile, JobApplication } from '@shared/schema';
import { LocalStorageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const applicationSchema = z.object({
  applicantName: z.string().min(1, "Name is required"),
  applicantEmail: z.string().email("Valid email is required"),
  coverLetter: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  userProfile: UserProfile | null;
  onApplicationSubmit: (application: JobApplication) => void;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  job,
  userProfile,
  onApplicationSubmit
}: ApplicationModalProps) {
  const { toast } = useToast();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicantName: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '',
      applicantEmail: userProfile?.email || '',
      coverLetter: '',
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    if (!job || !userProfile) return;

    const application: JobApplication = {
      id: crypto.randomUUID(),
      jobId: job.id,
      userId: userProfile.id,
      jobTitle: job.title,
      company: job.company,
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      coverLetter: data.coverLetter,
      appliedDate: new Date().toISOString(),
      status: 'Applied',
    };

    LocalStorageService.saveApplication(application);
    onApplicationSubmit(application);
    
    toast({
      title: "Application Submitted!",
      description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
    });

    form.reset();
    onClose();
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for Position</DialogTitle>
        </DialogHeader>

        {/* Job Details */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-primary font-medium">{job.company}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {formatSalary(job.salary)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{job.type}</Badge>
                <Badge variant="outline">{job.category}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Status */}
        {userProfile?.resumeData && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-700">Resume Ready</p>
                  <p className="text-sm text-gray-600">{userProfile.resumeData.name}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
              </div>
            </CardContent>
          </Card>
        )}

        {!userProfile?.resumeData && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-orange-700">No Resume Uploaded</p>
                  <p className="text-sm text-gray-600">Consider uploading a resume to your profile for better applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="applicantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicantEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
