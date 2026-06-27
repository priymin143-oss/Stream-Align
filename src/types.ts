export interface BrowsingLog {
  id: string;
  url: string;
  title: string;
  category: "Technology & Coding" | "Science & Space" | "Business & Finance" | "Arts & Design" | "Humanities & Writing" | "Sports & Health";
  visitsCount: number;
  timeSpentMinutes: number;
  timestamp: string;
}

export interface StudentProfile {
  name: string;
  hobbies: string[];
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

export interface CareerMilestone {
  stage: string; // e.g., "Class 11 & 12", "Undergraduation", "Postgrad/Specialization", "Early Career", "Long-term Professional"
  title: string;
  timeline: string; // e.g., "Ages 16-18", "Ages 18-22", etc.
  description: string;
  skillsToAcquire: string[];
  isCompleted?: boolean;
}

export interface CareerOption {
  careerTitle: string;
  description: string;
  industryGrowthTrend: string; // real-time trend text
  startingSalaryEstimate: string;
  skillsRequired: string[];
  milestones: CareerMilestone[];
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
