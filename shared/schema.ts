import { z } from "zod";

// User Profile Schema
export const userProfileSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
  resumeData: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    dataUrl: z.string(),
  }).optional(),
  preferences: z.object({
    categories: z.array(z.string()),
    jobTypes: z.array(z.string()),
    salaryRange: z.string().optional(),
    locations: z.array(z.string()),
  }).optional(),
  createdAt: z.string(),
});

// Job Schema
export const jobSchema = z.object({
  id: z.number(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  type: z.enum(["Full-time", "Part-time", "Contract", "Remote"]),
  category: z.enum(["Technology", "Marketing", "Design", "Sales", "Finance", "Healthcare", "Education"]),
  salary: z.number(),
  salaryRange: z.string(),
  postedDate: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()),
  featured: z.boolean().default(false),
});

// Job Application Schema
export const jobApplicationSchema = z.object({
  id: z.string(),
  jobId: z.number(),
  userId: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  applicantName: z.string(),
  applicantEmail: z.string(),
  coverLetter: z.string().optional(),
  appliedDate: z.string(),
  status: z.enum(["Applied", "Under Review", "Interview", "Rejected", "Offered"]).default("Applied"),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type Job = z.infer<typeof jobSchema>;
export type JobApplication = z.infer<typeof jobApplicationSchema>;
