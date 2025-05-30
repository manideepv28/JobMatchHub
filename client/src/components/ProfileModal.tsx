import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload,
  FileText,
  X,
  CheckCircle
} from 'lucide-react';
import { userProfileSchema, UserProfile } from '@shared/schema';
import { LocalStorageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  existingProfile?: UserProfile | null;
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

const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Remote'
];

const EXPERIENCE_LEVELS = [
  '0-1',
  '2-5',
  '6-10',
  '10+'
];

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  onSave, 
  existingProfile 
}: ProfileModalProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(
    existingProfile?.resumeData?.name || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<Omit<UserProfile, 'id' | 'createdAt'>>({
    resolver: zodResolver(userProfileSchema.omit({ id: true, createdAt: true })),
    defaultValues: {
      firstName: existingProfile?.firstName || '',
      lastName: existingProfile?.lastName || '',
      email: existingProfile?.email || '',
      phone: existingProfile?.phone || '',
      location: existingProfile?.location || '',
      jobTitle: existingProfile?.jobTitle || '',
      experience: existingProfile?.experience || '',
      skills: existingProfile?.skills || '',
      bio: existingProfile?.bio || '',
      preferences: {
        categories: existingProfile?.preferences?.categories || [],
        jobTypes: existingProfile?.preferences?.jobTypes || [],
        salaryRange: existingProfile?.preferences?.salaryRange || '',
        locations: existingProfile?.preferences?.locations || [],
      },
    },
  });

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
    setResumePreview(file.name);
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: Omit<UserProfile, 'id' | 'createdAt'>) => {
    try {
      let resumeData = existingProfile?.resumeData;

      // Handle resume upload
      if (resumeFile) {
        resumeData = {
          name: resumeFile.name,
          size: resumeFile.size,
          type: resumeFile.type,
          dataUrl: await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(resumeFile);
          }),
        };
      }

      const profile: UserProfile = {
        ...data,
        id: existingProfile?.id || crypto.randomUUID(),
        resumeData,
        createdAt: existingProfile?.createdAt || new Date().toISOString(),
      };

      LocalStorageService.saveUserProfile(profile);
      onSave(profile);
      onClose();

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCategoriesChange = (category: string, checked: boolean) => {
    const currentCategories = form.getValues('preferences.categories') || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    form.setValue('preferences.categories', newCategories);
  };

  const handleJobTypesChange = (jobType: string, checked: boolean) => {
    const currentJobTypes = form.getValues('preferences.jobTypes') || [];
    const newJobTypes = checked
      ? [...currentJobTypes, jobType]
      : currentJobTypes.filter(t => t !== jobType);
    
    form.setValue('preferences.jobTypes', newJobTypes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingProfile ? 'Edit Profile' : 'Create Your Profile'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current/Desired Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>
                          {level} years
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="JavaScript, React, Node.js, Python..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Brief description of your professional background and career goals..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume Upload */}
            <div>
              <FormLabel>Resume Upload</FormLabel>
              <Card className="mt-2">
                <CardContent className="p-6">
                  {resumePreview ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-red-500" />
                        <div>
                          <p className="font-medium">{resumePreview}</p>
                          <p className="text-sm text-gray-500">
                            {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : 'Uploaded'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeResume}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload your resume</p>
                      <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX (Max 5MB)</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Job Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Job Preferences</h3>
              
              {/* Preferred Categories */}
              <div>
                <FormLabel>Preferred Categories</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {CATEGORIES.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={form.watch('preferences.categories')?.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoriesChange(category, checked as boolean)
                        }
                      />
                      <FormLabel 
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal"
                      >
                        {category}
                      </FormLabel>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Job Types */}
              <div>
                <FormLabel>Preferred Job Types</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {JOB_TYPES.map(jobType => (
                    <div key={jobType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`jobtype-${jobType}`}
                        checked={form.watch('preferences.jobTypes')?.includes(jobType)}
                        onCheckedChange={(checked) => 
                          handleJobTypesChange(jobType, checked as boolean)
                        }
                      />
                      <FormLabel 
                        htmlFor={`jobtype-${jobType}`}
                        className="text-sm font-normal"
                      >
                        {jobType}
                      </FormLabel>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <FormField
                control={form.control}
                name="preferences.salaryRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Salary Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select salary range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="40000-60000">$40k - $60k</SelectItem>
                        <SelectItem value="60000-80000">$60k - $80k</SelectItem>
                        <SelectItem value="80000-100000">$80k - $100k</SelectItem>
                        <SelectItem value="100000-150000">$100k - $150k</SelectItem>
                        <SelectItem value="150000+">$150k+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Profile
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
