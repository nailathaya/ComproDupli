

export interface User {
  id: number;
  name: string;
  email: string;
  location: string;
  phoneNumber?: string;
  profileViews?: number;
  onlineStatus: 'online' | 'offline';
  role: 'candidate' | 'hrd';
  avatarUrl?: string;
}

export interface WorkExperience {
  id:number;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface RecruitmentStage {
  name: 'Screening' | 'Psikotest' | 'Interview HR' | 'Interview User' | 'Penawaran';
  status: 'Lolos' | 'Tidak Lolos' | 'Belum';
}

export interface ApplicationHistory {
  id: number;
  job_id: number;
  applied_at: string;
  stages: RecruitmentStage[];
}


// Candidate type extends Profile
// export interface Candidate extends Profile {
//     id: string;
//     positionApplied: string;
//     documents: Document[];
//     activity: Activity[];
//     applicationHistory: ApplicationHistory[];
// }

export interface Candidate {
  id: number;
  positionApplied: string | null;
  user: User;
  applicationHistory: ApplicationHistory[];

  aiScreening?: AIScreeningRecommendation;
}

export interface CandidateDetail extends Candidate {
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  salaryExpectation: {
    min: number;
    max: number;
  };
  documents?: Document[];
  activity?: Activity[];
}


export interface Document {
    id: string;
    type: 'resume' | 'certificate';
    name: string;
    url: string;
    uploadedAt: string;
    fileSize?: number; // in bytes
}

export interface Activity {
    time: string;
    event: string;
}


export interface Profile {
  user: User;
  salaryExpectation: {
    min: number;
    max: number;
  };
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  applicationHistory?: ApplicationHistory[];
  resumeUrl?: string;
  documents?: Document[];
  // location: User['location'];
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  employmentType: 'Full Time' | 'Part Time' | 'Freelance' | 'Contractual' | 'Internship';
  jobLevel: 'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director';
  jobFunction: string;
  education: string;
  salary: {
    min: number;
    max: number;
  };
  postedDate: string;
  logoUrl: string;
  status?: 'published' | 'closed';
}


export interface JobListItem {
  id: number;
  title: string;
  company: string;
  location: string;
  jobLevel: 'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director';
  employmentType: 'Full Time' | 'Part Time' | 'Freelance' | 'Contractual' | 'Internship';
  jobFunction: string;
  education: string;
  salary: {
    min: number;
    max: number;
  };
  postedDate: string;
  logoUrl: string;
  status?: 'Aktif' | 'Published';
}

export interface JobDetail {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: string;

  description: string;

  requirements: {
    education: string;
    experience_years: number;
    skills: string[];
    certifications: string[];
  };

  salary?: {
    min: number;
    max: number;
  };

  closingDate?: string;
  openPositions: number;
  status: 'Draft' | 'Published' | 'Closed';
  createdAt: string;
}


export interface JobRequirements {
    education: string;
    experience_years: number;
    certifications: string[];
    skills: string[];
}

export interface JobPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  salary: {
        min: number;
        max: number;
    };
  min_education: string;
  min_experience_years: number;

  required_candidates: number;
  closing_date?: string;

  skills: string[];
  certifications: string[];

  status: 'Draft' | 'Published' | 'Closed';
}

export interface FilterOptions {
    jobLevel: string[];
    employmentType: string[];
    jobFunction: string[];
    education: string[];
    company: string[];
}

export interface SelectedFilters {
    jobLevel: string[];
    employmentType: string[];
    jobFunction: string[];
    education: string[];
    company: string[];
}

// HRD Dashboard Types
export type AIScreeningStatus = 'PASS' | 'REVIEW' | 'REJECT';

export interface AIScreeningRecommendation {
  status: AIScreeningStatus;
  confidence: number; // 0.0 – 1.0
  reason: string;     // "Lolos / Pertimbangkan / Tidak Lolos"
}

export interface MatchResult {
  candidate: {
    id: number;
    user: {
      name: string;
      email: string;
      avatarUrl?: string;
    };
  };
  fitScore: number;
  summary: string;
  screeningRecommendation: AIScreeningRecommendation;
}

export interface GapAnalysisReport {
    candidate: Candidate;
    gapScore: number;
    missingCompetencies: string[];
    trainingRecommendations: string[];
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    status: 'read' | 'unread';
    target_page: string;
    category: string;
    target_params?: { [key: string]: any };
    type?: 'info' | 'success' | 'warning';
    target_type?: "document" | "application_history" | "profile_info";
    target_candidate_id?: string;
}

export interface CandidateWithApplications extends Candidate {
  applicationHistory: ApplicationHistory[];
}