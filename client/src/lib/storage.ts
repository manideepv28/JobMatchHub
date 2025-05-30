import { UserProfile, Job, JobApplication } from "@shared/schema";

const STORAGE_KEYS = {
  USER_PROFILE: 'jobboard_user_profile',
  APPLICATIONS: 'jobboard_applications',
  SAVED_JOBS: 'jobboard_saved_jobs',
};

// Mock job data
export const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Technology",
    salary: 120000,
    salaryRange: "100000-150000",
    postedDate: "2024-01-15",
    description: "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for creating engaging user interfaces and ensuring excellent user experience across our web applications.",
    requirements: [
      "5+ years of experience with React, Vue, or Angular",
      "Strong knowledge of HTML5, CSS3, and JavaScript",
      "Experience with responsive design and cross-browser compatibility",
      "Familiarity with modern build tools and version control",
      "Bachelor's degree in Computer Science or related field"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "Flexible work arrangements",
      "Professional development opportunities",
      "401(k) retirement plan"
    ],
    featured: true,
  },
  {
    id: 2,
    title: "Digital Marketing Manager",
    company: "Growth Solutions",
    location: "New York, NY",
    type: "Full-time",
    category: "Marketing",
    salary: 85000,
    salaryRange: "80000-100000",
    postedDate: "2024-01-12",
    description: "Join our marketing team to lead digital campaigns and drive customer acquisition. You'll manage multi-channel marketing strategies and optimize conversion rates.",
    requirements: [
      "3+ years of digital marketing experience",
      "Proficiency in Google Analytics, AdWords, and social media platforms",
      "Experience with email marketing and automation tools",
      "Strong analytical and project management skills",
      "Bachelor's degree in Marketing or related field"
    ],
    benefits: [
      "Performance-based bonuses",
      "Comprehensive health benefits",
      "Remote work options",
      "Marketing conference attendance",
      "Career advancement opportunities"
    ],
    featured: false,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Design Studio Pro",
    location: "Los Angeles, CA",
    type: "Contract",
    category: "Design",
    salary: 95000,
    salaryRange: "80000-100000",
    postedDate: "2024-01-10",
    description: "Create intuitive and beautiful user experiences for our clients' digital products. Work closely with product teams to research, design, and prototype solutions.",
    requirements: [
      "4+ years of UX/UI design experience",
      "Proficiency in Figma, Sketch, or Adobe Creative Suite",
      "Strong portfolio demonstrating design thinking",
      "Experience with user research and usability testing",
      "Knowledge of design systems and accessibility standards"
    ],
    benefits: [
      "Flexible contract terms",
      "Access to latest design tools",
      "Collaborative team environment",
      "Portfolio development opportunities",
      "Potential for full-time conversion"
    ],
    featured: true,
  },
  {
    id: 4,
    title: "Sales Representative",
    company: "SalesForce Pro",
    location: "Chicago, IL",
    type: "Full-time",
    category: "Sales",
    salary: 70000,
    salaryRange: "60000-80000",
    postedDate: "2024-01-08",
    description: "Drive revenue growth by identifying and closing new business opportunities. Build relationships with prospects and existing clients while exceeding sales targets.",
    requirements: [
      "2+ years of B2B sales experience",
      "Strong communication and negotiation skills",
      "Experience with CRM software (Salesforce preferred)",
      "Proven track record of meeting sales quotas",
      "Bachelor's degree preferred"
    ],
    benefits: [
      "Base salary plus commission",
      "Health and wellness benefits",
      "Sales incentive trips",
      "Professional sales training",
      "Career growth opportunities"
    ],
    featured: false,
  },
  {
    id: 5,
    title: "Financial Analyst",
    company: "Investment Partners",
    location: "Austin, TX",
    type: "Full-time",
    category: "Finance",
    salary: 75000,
    salaryRange: "60000-80000",
    postedDate: "2024-01-05",
    description: "Analyze financial data, create models, and provide insights to support strategic business decisions. Work with cross-functional teams to drive financial performance.",
    requirements: [
      "Bachelor's degree in Finance, Economics, or related field",
      "2+ years of financial analysis experience",
      "Advanced Excel and financial modeling skills",
      "Knowledge of SQL and data analysis tools",
      "Strong attention to detail and analytical thinking"
    ],
    benefits: [
      "Competitive salary and annual bonus",
      "Comprehensive benefits package",
      "Professional certification support",
      "Flexible work arrangements",
      "Retirement planning assistance"
    ],
    featured: false,
  },
  {
    id: 6,
    title: "Registered Nurse",
    company: "Healthcare Plus",
    location: "Seattle, WA",
    type: "Full-time",
    category: "Healthcare",
    salary: 80000,
    salaryRange: "60000-80000",
    postedDate: "2024-01-03",
    description: "Provide compassionate patient care in our state-of-the-art medical facility. Work with interdisciplinary teams to ensure optimal patient outcomes.",
    requirements: [
      "RN license in good standing",
      "BSN degree preferred",
      "1+ years of acute care experience",
      "BLS and ACLS certification",
      "Excellent communication and teamwork skills"
    ],
    benefits: [
      "Competitive nursing salary",
      "Comprehensive health benefits",
      "Tuition reimbursement",
      "Flexible scheduling",
      "Professional development opportunities"
    ],
    featured: false,
  },
  {
    id: 7,
    title: "Elementary School Teacher",
    company: "Bright Future Schools",
    location: "Austin, TX",
    type: "Full-time",
    category: "Education",
    salary: 55000,
    salaryRange: "40000-60000",
    postedDate: "2024-01-01",
    description: "Inspire young minds and create engaging learning experiences for elementary students. Develop curriculum and foster a positive classroom environment.",
    requirements: [
      "Bachelor's degree in Education or subject area",
      "Valid teaching license/certification",
      "Experience working with children",
      "Strong classroom management skills",
      "Passion for education and student success"
    ],
    benefits: [
      "Teacher salary schedule",
      "Health and retirement benefits",
      "Summer break",
      "Professional development opportunities",
      "Supportive school community"
    ],
    featured: false,
  },
  {
    id: 8,
    title: "Full Stack Developer",
    company: "StartupTech",
    location: "Remote",
    type: "Remote",
    category: "Technology",
    salary: 110000,
    salaryRange: "100000-150000",
    postedDate: "2023-12-28",
    description: "Build and maintain web applications using modern technologies. Work on both frontend and backend development in a fast-paced startup environment.",
    requirements: [
      "3+ years of full stack development experience",
      "Proficiency in JavaScript, Node.js, and React",
      "Experience with databases (PostgreSQL, MongoDB)",
      "Knowledge of cloud platforms (AWS, Azure)",
      "Agile development experience"
    ],
    benefits: [
      "Competitive salary and equity",
      "100% remote work",
      "Health and wellness stipend",
      "Learning and development budget",
      "Flexible time off policy"
    ],
    featured: true,
  },
];

export class LocalStorageService {
  // User Profile Management
  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  static getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }

  static clearUserProfile(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  }

  // Job Applications Management
  static saveApplication(application: JobApplication): void {
    const applications = this.getApplications();
    applications.push(application);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }

  static getApplications(): JobApplication[] {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : [];
  }

  static getApplicationById(id: string): JobApplication | null {
    const applications = this.getApplications();
    return applications.find(app => app.id === id) || null;
  }

  static updateApplicationStatus(id: string, status: JobApplication['status']): void {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index].status = status;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    }
  }

  static removeApplication(id: string): void {
    const applications = this.getApplications();
    const filtered = applications.filter(app => app.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(filtered));
  }

  // Saved Jobs Management
  static saveJob(jobId: number): void {
    const savedJobs = this.getSavedJobs();
    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedJobs));
    }
  }

  static unsaveJob(jobId: number): void {
    const savedJobs = this.getSavedJobs();
    const filtered = savedJobs.filter(id => id !== jobId);
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(filtered));
  }

  static getSavedJobs(): number[] {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    return data ? JSON.parse(data) : [];
  }

  static isJobSaved(jobId: number): boolean {
    return this.getSavedJobs().includes(jobId);
  }

  // Jobs Data
  static getJobs(): Job[] {
    return MOCK_JOBS;
  }

  static getJobById(id: number): Job | null {
    return MOCK_JOBS.find(job => job.id === id) || null;
  }

  static getRecommendedJobs(userProfile: UserProfile): Job[] {
    if (!userProfile.preferences) return [];

    const { categories, jobTypes, salaryRange, locations } = userProfile.preferences;
    
    return MOCK_JOBS.filter(job => {
      let score = 0;
      
      // Category match
      if (categories.includes(job.category)) score += 3;
      
      // Job type match
      if (jobTypes.includes(job.type)) score += 2;
      
      // Location preference
      if (locations.some(loc => job.location.includes(loc))) score += 1;
      
      // Salary range match (basic implementation)
      if (salaryRange) {
        const [min, max] = salaryRange.split('-').map(Number);
        if (job.salary >= min && (!max || job.salary <= max)) score += 1;
      }
      
      return score > 0;
    }).sort((a, b) => {
      // Simple scoring logic - in real app would be more sophisticated
      let scoreA = 0, scoreB = 0;
      if (categories.includes(a.category)) scoreA += 3;
      if (categories.includes(b.category)) scoreB += 3;
      return scoreB - scoreA;
    });
  }
}
