export interface ResumeData {
  documentType: "resume" | "cv";
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  address: string;
  summary: string;
  education: EducationEntry[];
  skills: string;
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  certifications: string;
  achievements: string;
  languages: string;
  publications?: string;
  additionalDetails?: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export type TemplateType = "modern" | "professional" | "minimal";

export interface ATSResult {
  totalScore: number;
  sections: {
    contactInfo: SectionScore;
    education: SectionScore;
    skills: SectionScore;
    experience: SectionScore;
    projects: SectionScore;
    resumeLength: SectionScore;
  };
  suggestions: string[];
}

export interface SectionScore {
  score: number;
  maxScore: number;
  label: string;
  status: "good" | "warning" | "poor";
  feedback: string;
}

export interface AdvancedAnalysisResult {
  strengthScore: number;
  atsScore: number;
  completionPercentage: number;
  strengths: string[];
  weaknesses: string[];
  missingSections: string[];
  recommendations: string[];
  sectionBreakdown: {
    contactInfo: SectionScore;
    summary: SectionScore;
    education: SectionScore;
    skills: SectionScore;
    experience: SectionScore;
    projects: SectionScore;
    certifications: SectionScore;
    achievements: SectionScore;
    formatting: SectionScore;
  };
}
