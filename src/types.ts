export interface BrowsingLog {
  id: string;
  url: string;
  title: string;
  category: "Technology & Coding" | "Science & Space" | "Business & Finance" | "Arts & Design" | "Humanities & Writing" | "Sports & Health";
  visitsCount: number;
  timeSpentMinutes: number;
  timestamp: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  duration: string; // e.g., "3 months", "2025 - 2026"
}

export interface EducationQualification {
  degree: string;
  institution: string;
  graduationDate: string; // e.g., "May 2024"
}

export interface StudentProfile {
  name: string;
  hobbies: string[];
  marks: string; // Academic grades/marks (e.g. "Class 10: 92% in Science, 95% in Math")
  technicalSkills: string[];
  softSkills: string[];
  workExperience: WorkExperience[];
  educationQualifications: EducationQualification[];
  browsingLogs: BrowsingLog[];
}

export interface StreamRecommendation {
  streamName: string;
  matchPercentage: number;
  transparentRationale: string;
  hobbyConnection: string; // Explains why hobby matches stream
  browsingConnection: string; // Explains how browsing logs match stream
  coreSubjects: string[];
  difficultyLevel: "Medium" | "High" | "Balanced";
}

export interface AlternativeMilestone {
  title: string;
  description: string;
  salaryRange?: string;
  skillsToAcquire: string[];
}

export interface CareerMilestone {
  stage: string; // e.g., "Class 11 & 12", "Undergraduation", "Postgrad/Specialization", "Early Career", "Long-term Professional"
  title: string;
  timeline: string; // e.g., "Ages 16-18", "Ages 18-22", etc.
  description: string;
  skillsToAcquire: string[];
  salaryRange?: string; // Optional salary for this role/stage
  alternatives?: AlternativeMilestone[]; // Alternative branches at this point
  isCompleted?: boolean;
}

export interface CourseSuggestion {
  skillName: string;
  courseTitle: string;
  provider: string; // e.g. "Coursera", "Udemy", "Google Certification", "edX"
  type: "Online Course" | "Certification" | "Workshop";
  duration: string;
}

export interface UniversityRecommendation {
  universityName: string;
  location: string;
  programName: string; // e.g. "B.Tech in Artificial Intelligence", "B.Sc. in Genetics"
  programType: "Degree" | "Diploma" | "Integrated";
  duration: string; // e.g. "4 Years", "3 Years"
  academicPrerequisites: string[]; // e.g. ["Class 12 PCM > 85%", "JEE Main score"]
  potentialCareerOutcomes: string[]; // e.g. ["Machine Learning Engineer", "System Architect"]
  tuitionFeeRange: string; // e.g. "₹2.5L - ₹4L per annum"
  globalRanking?: string; // e.g. "QS Rank #50" or "National Rank #5"
}

export interface CareerOption {
  careerTitle: string;
  description: string;
  industryGrowthTrend: string; // real-time trend text
  startingSalaryEstimate: string;
  skillsRequired: string[];
  milestones: CareerMilestone[];
  courseSuggestions?: CourseSuggestion[];
  universityRecommendations?: UniversityRecommendation[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface AnalysisReport {
  studentName: string;
  recommendedStreams: StreamRecommendation[];
  longTermCareers: CareerOption[];
  generalAdvice: string;
  marketInsights: string; // Real-time industry trend overview
  groundingSources: GroundingSource[];
  isFallback?: boolean;
  fallbackReason?: "quota_exhausted" | "no_key" | "error";
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  sources?: GroundingSource[];
}
