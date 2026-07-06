import { AnalysisReport, StreamRecommendation, CareerOption, CourseSuggestion, CareerMilestone, AlternativeMilestone } from "../types";

export const FALLBACK_STREAM_POOL: Record<string, {
  streamName: string;
  coreSubjects: string[];
  difficultyLevel: "High" | "Medium" | "Balanced";
  getRationale: (h: string[], b: number) => string;
  getHobbyConn: (h: string[]) => string;
  getBrowsingConn: (b: any[]) => string;
}> = {
  PCM: {
    streamName: "Science PCM (Physics, Chemistry, Mathematics)",
    coreSubjects: ["Physics", "Chemistry", "Mathematics", "Computer Science / IP", "English"],
    difficultyLevel: "High",
    getRationale: (h, b) => `Based on your heavy technical focus with ${b} recent campus network logs visited in Technology/Space and key hobbies, you show strong analytical aptitude. This stream is optimized for advanced computing, engineering, and mathematical modeling.`,
    getHobbyConn: (h) => h.length > 0 ? `Your active interest in "${h[0]}" showcases robust hands-on technical passion and system building, which translates perfectly into scientific inquiry and mathematics.` : `Your technical curiosity aligns directly with engineering and problem-solving methodologies.`,
    getBrowsingConn: (b) => `Your browsing logs include deep dives into technical subjects and digital systems, proving you are already self-studying computer science/technology concepts on the campus network.`
  },
  PCB: {
    streamName: "Science PCB (Physics, Chemistry, Biology)",
    coreSubjects: ["Physics", "Chemistry", "Biology", "Biotechnology / Psychology", "English"],
    difficultyLevel: "High",
    getRationale: (h, b) => `Your profile highlights an intrinsic fascination with life sciences, health, and complex natural systems. With ${b} browsing events tracking biology and scientific topics, you demonstrate the disciplined focus needed for healthcare and research.`,
    getHobbyConn: (h) => h.length > 0 ? `Your active interest in "${h[0]}" highlights a steady dedication to natural phenomena, organic growth, or healthcare, which are core pillars of biological sciences.` : `Your curiosity about human biology and health perfectly complements medical or clinical studies.`,
    getBrowsingConn: (b) => `Your frequent network searches for health, environment, or biological topics show a deep desire to investigate scientific literature and real-world medicine.`
  },
  Commerce: {
    streamName: "Commerce with Applied Mathematics",
    coreSubjects: ["Accountancy", "Business Studies", "Economics", "Applied Mathematics / IP", "English"],
    difficultyLevel: "Medium",
    getRationale: (h, b) => `You have shown exceptional aptitude for commercial trends, market systems, and startup ecosystems. Your ${b} business-oriented browsing records signify an active engagement with economics and financial environments.`,
    getHobbyConn: (h) => h.length > 0 ? `Engaging in "${h[0]}" demonstrates outstanding entrepreneurial spirit, organizational capacity, or strategic resource allocation required for trade and commerce.` : `Your strategic mindset is a natural match for analyzing commercial trends and scaling businesses.`,
    getBrowsingConn: (b) => `Your network footprint is full of market analysis, financial news, or economic topics, showing you are keen on tracking real-world asset structures and corporate scaling.`
  },
  Humanities: {
    streamName: "Humanities & Liberal Arts with Psychology",
    coreSubjects: ["Psychology", "Sociology", "History / Political Science", "English Literature", "Fine Arts / Economics"],
    difficultyLevel: "Balanced",
    getRationale: (h, b) => `Your creative and empathetic profile is perfectly crafted for Humanities. The ${b} visits in history, social studies, design, or writing demonstrate high verbal reasoning and social-intelligence capabilities.`,
    getHobbyConn: (h) => h.length > 0 ? `Your participation in "${h[0]}" displays strong creative self-expression, communication prowess, or a fascination with human dynamics, serving as the bedrock of liberal arts.` : `Your creative outlets align with the rigorous critical thinking and content synthesis of humanities.`,
    getBrowsingConn: (b) => `Your browsing habits reveal an appetite for literary works, human history, psychological structures, or design principles, reflecting excellent reading and research habits.`
  }
};

export const FALLBACK_CAREER_POOL: Record<string, {
  careerTitle: string;
  description: string;
  industryGrowthTrend: string;
  startingSalaryEstimate: string;
  skillsRequired: string[];
  milestones: any[];
}[]> = {
  PCM: [
    {
      careerTitle: "AI & Full-Stack Systems Architect",
      description: "Designing modern high-performance cloud databases, scaling neural networks, and deploying server-side AI endpoints using next-generation LLM APIs.",
      industryGrowthTrend: "Over 35% compound annual growth rate (CAGR) expected, driven by autonomous agents and custom enterprise AI chips.",
      startingSalaryEstimate: "$115,000 - $145,000 per annum (International) / ₹12-18 Lakhs per annum (National average)",
      skillsRequired: ["Python", "TypeScript/NodeJS", "LLM Fine-Tuning", "Vector Databases", "Docker & Cloud Run Deployment"],
      milestones: [
        { stage: "Class 11 & 12 Preparation", title: "Excel in PCM & Computer Science", timeline: "Years 1-2", description: "Focus on JEE/SAT preparation, score above 90% in advanced mathematics, and build custom web apps in your spare time.", skillsToAcquire: ["Advanced Calculus", "Data Structures", "Python/JS basics"] },
        { stage: "Undergraduation", title: "B.Tech/B.S. in Computer Science or AI Engineering", timeline: "Years 3-6", description: "Attend a premier institute, maintain high GPA, contribute to open-source systems, and complete a summer internship in cloud development.", skillsToAcquire: ["Linear Algebra", "Database Management", "System Design", "Cloud Infrastructure"] },
        { stage: "Postgrad/Specialization", title: "Specialized Certifications or M.S. in Intelligent Systems", timeline: "Years 7-8", description: "Gain advanced credentials in Neural Networks and Machine Learning Operations (MLOps) or complete specialized research projects.", skillsToAcquire: ["TensorFlow/PyTorch", "Kubernetes", "MLOps", "Distributed Computing"] },
        { stage: "Early Career", title: "Junior Software & AI Engineer", timeline: "Years 9-10", description: "Secure a full-time role at a high-growth tech company, working closely with senior architects to deploy robust client-server pipelines.", skillsToAcquire: ["Production Debugging", "CI/CD Pipelines", "Agile Methodologies"] },
        { stage: "Long-term Professional", title: "Chief AI Systems Architect / VP of Engineering", timeline: "Years 11+", description: "Design complex cloud architectures, manage multi-disciplinary engineering teams, and deliver enterprise-wide AI systems.", skillsToAcquire: ["Executive Leadership", "Strategic Architecture", "Risk Assessment"] }
      ]
    },
    {
      careerTitle: "Robotics and Automation Control Specialist",
      description: "Developing intelligent firmware, sensor fusion loops, and kinematics controllers for drones, industrial arms, and automated warehousing systems.",
      industryGrowthTrend: "Valued at $45 Billion, the robotics market is surging with over 18% annual growth due to automated logistic systems.",
      startingSalaryEstimate: "$95,000 - $120,000 per annum",
      skillsRequired: ["C/C++", "ROS2 (Robot Operating System)", "Sensor Fusion (LiDAR/Radar)", "Embedded Systems", "CAD Modelling"],
      milestones: [
        { stage: "Class 11 & 12 Preparation", title: "Strong foundations in Physics & Calculus", timeline: "Years 1-2", description: "Build solid physics fundamentals in mechanics and electromagnetism. Participate in local hardware hacks or robotics clubs.", skillsToAcquire: ["Mechanics", "Arduino Programming", "Basic Circuits"] },
        { stage: "Undergraduation", title: "B.S. in Robotics, Mechatronics or Electrical Engineering", timeline: "Years 3-6", description: "Join college competitive robotics teams, learn kinematics algorithms, and complete an internship with an automated hardware manufacturer.", skillsToAcquire: ["Kinematics", "Microcontrollers", "Control Theory", "ROS2 Framework"] },
        { stage: "Postgrad/Specialization", title: "M.S. in Robotics or Systems Control", timeline: "Years 7-8", description: "Publish or present research in autonomous systems navigation, or complete specialized graduate research projects.", skillsToAcquire: ["Computer Vision", "LiDAR Mapping", "Path Planning Algorithms"] },
        { stage: "Early Career", title: "Automation & Controls Integration Engineer", timeline: "Years 9-10", description: "Deploy automated control software to factory floors, debug hardware/software interfaces, and optimize sensor feedback loops.", skillsToAcquire: ["Real-time Operating Systems", "Industrial Protocols"] },
        { stage: "Long-term Professional", title: "Director of Autonomous Systems Engineering", timeline: "Years 11+", description: "Head up the development of a complete autonomous vehicle or robotics product line, managing hardware-software synchronization.", skillsToAcquire: ["Team Management", "IP Protection", "Advanced Hardware Procurement"] }
      ]
    }
  ],
  PCB: [
    {
      careerTitle: "Biotechnology & CRISPR Gene-Editing Specialist",
      description: "Designing molecular-level genetic solutions, targeting cancer markers, and optimizing plant genetics to support clean sustainable food systems.",
      industryGrowthTrend: "CRISPR gene editing technologies have seen a massive 22% growth rate following regulatory clearances of groundbreaking treatments.",
      startingSalaryEstimate: "$88,000 - $115,000 per annum",
      skillsRequired: ["Molecular Biology", "CRISPR-Cas9 Protocols", "Bioinformatics", "Data Analysis (R/Python)", "Clinical Lab Management"],
      milestones: [
        { stage: "Class 11 & 12 Preparation", title: "Master Chemistry & Biology", timeline: "Years 1-2", description: "Focus on organic chemistry and cellular biology. Achieve excellent results in secondary board examinations or SAT Biology.", skillsToAcquire: ["Organic Chemistry", "Cell Biology basics", "Scientific Writing"] },
        { stage: "Undergraduation", title: "B.S. in Biotechnology or Biochemistry", timeline: "Years 3-6", description: "Conduct laboratory research, learn chromatography and gene sequencing, and assist professors with clinical research journals.", skillsToAcquire: ["Gene Sequencing", "Bioinformatics", "Chromatography", "Lab Safety"] },
        { stage: "Postgrad/Specialization", title: "Ph.D. in Genetics, Biotech, or Molecular Medicine", timeline: "Years 7-10", description: "Produce a thesis on cellular pathways or targeted gene therapies. Complete high-quality scientific research papers.", skillsToAcquire: ["CRISPR-Cas9 Synthesis", "Statistical Genomics", "Microscopy"] },
        { stage: "Early Career", title: "Research Scientist / Clinical Gene Analyst", timeline: "Years 11-12", description: "Work inside top pharmaceutical labs or agritech firms to screen molecular samples and run computational models of protein folding.", skillsToAcquire: ["Drug Discovery Software", "FDA Compliance"] },
        { stage: "Long-term Professional", title: "Head of Genomic Medicine & Biotech Therapeutics", timeline: "Years 13+", description: "Direct clinical-stage research departments, securing venture capital or grants to bring revolutionary gene therapies to clinical trials.", skillsToAcquire: ["Venture Capital Pitching", "Clinical Trial Protocols", "Team Leadership"] }
      ]
    }
  ],
  Commerce: [
    {
      careerTitle: "Fintech Venture Capital & Quantitative Analyst",
      description: "Evaluating financial technologies, optimizing algorithm-driven portfolios, and investing seed capital into modern decentralized tech startups.",
      industryGrowthTrend: "Fintech systems have captured 28% of mainstream finance, seeing continuous growth in smart-contracts and cloud payment solutions.",
      startingSalaryEstimate: "$105,000 - $135,000 per annum",
      skillsRequired: ["Quantitative Finance", "Python (Pandas/NumPy)", "Risk Modeling", "Venture Valuation", "Blockchain Mechanics"],
      milestones: [
        { stage: "Class 11 & 12 Preparation", title: "Strengthen Economics & Applied Math", timeline: "Years 1-2", description: "Establish high-performance marks in Economics and Accountancy. Run virtual investment portfolios or join entrepreneurship contests.", skillsToAcquire: ["Financial Literacy", "Basic Accounting", "Applied Statistics"] },
        { stage: "Undergraduation", title: "B.Com (Hons) or B.S. in Economics / Finance", timeline: "Years 3-6", description: "Join college finance clubs, secure highly competitive summer internships on Wall Street or tech hubs, and learn quantitative analysis.", skillsToAcquire: ["Financial Modeling", "Corporate Law", "Python for Finance"] },
        { stage: "Postgrad/Specialization", title: "Chartered Financial Analyst (CFA) or MBA in Finance", timeline: "Years 7-8", description: "Pass the rigorous CFA Level 1 & 2 examinations, or attend a top business school specializing in private equity and quantitative portfolios.", skillsToAcquire: ["Asset Valuation", "Investment Banking Theory", "Strategic Management"] },
        { stage: "Early Career", title: "Investment Associate / Fintech Risk Analyst", timeline: "Years 9-10", description: "Analyze market dynamics for a venture capital firm, perform due diligence on series-A fintech startups, and model financial risk profiles.", skillsToAcquire: ["Due Diligence", "Pitch Decks Analysis", "Market Sizing"] },
        { stage: "Long-term Professional", title: "Managing Partner / VP of Investment Strategy", timeline: "Years 11+", description: "Control multi-million dollar venture capital funds, guide portfolio companies to successful public offerings, and direct macroeconomic investment policies.", skillsToAcquire: ["Macroeconomic Strategy", "Fundraising", "Executive Board Relations"] }
      ]
    }
  ],
  Humanities: [
    {
      careerTitle: "Cognitive Interaction & Human-AI Design Specialist",
      description: "Optimizing the relationship between humans and intelligence systems, structuring behavioral design, and designing empathic conversational UIs.",
      industryGrowthTrend: "The demand for UX/Cognitive architects has surged by 25% as tech providers shift to focus heavily on user psychological alignment.",
      startingSalaryEstimate: "$85,000 - $110,000 per annum",
      skillsRequired: ["Behavioral Psychology", "Figma Design System", "Interactive Prototyping", "User Research Methodologies", "Cognitive Science"],
      milestones: [
        { stage: "Class 11 & 12 Preparation", title: "Focus on Psychology, Literature & Art", timeline: "Years 1-2", description: "Achieve superior grades in English literature and Psychology. Develop a preliminary portfolio of creative designs and research journals.", skillsToAcquire: ["Creative Writing", "Basic Psychology", "Wireframing Concepts"] },
        { stage: "Undergraduation", title: "B.A. in Psychology, Cognitive Science or Graphic Design", timeline: "Years 3-6", description: "Lead research on digital addiction or user behaviors, obtain certifications in UX Design, and complete a digital agency internship.", skillsToAcquire: ["Figma", "User Journey Mapping", "Cognitive Load Theory"] },
        { stage: "Postgrad/Specialization", title: "M.S. in Human-Computer Interaction (HCI) or Behavioral Tech", timeline: "Years 7-8", description: "Conduct advanced research on virtual environments and voice interfaces. Design detailed mental models for multi-modal systems.", skillsToAcquire: ["HCI Principles", "Interactive Prototypes", "A/B Testing Methods"] },
        { stage: "Early Career", title: "User Experience (UX) Researcher / Interaction Designer", timeline: "Years 9-10", description: "Collaborate with full-stack developers to design interactive features, run user diagnostic tests, and structure clear screen wireframes.", skillsToAcquire: ["Usability Diagnostics", "Design Hand-off Systems"] },
        { stage: "Long-term Professional", title: "Chief Experience Officer (CXO) / VP of Product Design", timeline: "Years 11+", description: "Command complete product design methodologies, ensure company-wide empathy/accessibility design standards, and direct major user-facing features.", skillsToAcquire: ["Product Vision", "Brand Synthesis", "Design Leadership"] }
      ]
    }
  ]
};

export function enrichMilestones(careerTitle: string, milestones: any[]): CareerMilestone[] {
  return milestones.map((m, idx) => {
    let salaryRange = m.salaryRange;
    if (!salaryRange) {
      if (idx === 0) salaryRange = "N/A (Academic Stage)";
      else if (idx === 1) salaryRange = "₹3 - 5 Lakhs / annum (Stipend/Junior)";
      else if (idx === 2) salaryRange = "₹6 - 10 Lakhs / annum (Specialist)";
      else if (idx === 3) salaryRange = "₹12 - 20 Lakhs / annum (Early Career)";
      else if (idx === 4) salaryRange = "₹25 - 50 Lakhs / annum (Peak/Lead)";
    }
    
    let alternatives = m.alternatives || [];
    if (alternatives.length === 0) {
      if (idx === 0) {
        alternatives = [{
          title: `Alternative: Focus on Core Academics & Independent Hobby Projects`,
          description: `Focus on CBSE/ICSE board exams with micro-credentials instead of aggressive national competitive tests to protect academic wellbeing.`,
          skillsToAcquire: ["Academic Focus", "Self-Driven Learning"]
        }];
      } else if (idx === 1) {
        alternatives = [{
          title: `Alternative: Applied Applied Science / Associate Technical Diploma`,
          description: `Enroll in a 3-year specialized vocational or applied engineering diploma featuring direct co-op placements.`,
          skillsToAcquire: ["Rapid Prototyping", "Industry Practices"]
        }];
      } else if (idx === 2) {
        alternatives = [{
          title: `Alternative: Direct Career Apprenticeship`,
          description: `Instead of master's studies, immediately secure a technical apprenticeship to build real-world experience and accelerate industry networking.`,
          skillsToAcquire: ["Cross-Team Operations", "Functional Ownership"]
        }];
      } else if (idx === 3) {
        alternatives = [{
          title: `Alternative: Remote Freelance Contracting & Tech Writing`,
          description: `Leverage platforms like Upwork and Toptal to establish independent advisory clients globally and write tech reports.`,
          skillsToAcquire: ["Contract Pitching", "Invoice Scaling", "Self-Promotion"]
        }];
      } else if (idx === 4) {
        alternatives = [{
          title: `Alternative: Venture Founding or Independent Industry Consultant`,
          description: `Launch your own boutique solutions studio, apply for seed capital grants, or act as an external advisor.`,
          skillsToAcquire: ["Venture Mechanics", "Public Presentation", "Strategic Planning"]
        }];
      }
    }
    return { ...m, salaryRange, alternatives };
  });
}

export function generateFallbackCourseSuggestions(
  careerTitle: string,
  skillsRequired: string[],
  technicalSkills: string[] = [],
  softSkills: string[] = []
): CourseSuggestion[] {
  const userSkills = [...(technicalSkills || []), ...(softSkills || [])].map(s => String(s).toLowerCase());
  const missing = (skillsRequired || []).filter(s => !userSkills.includes(s.toLowerCase()));
  
  const skillsToAddress = missing.length > 0 ? missing : (skillsRequired || []).slice(0, 3);
  const providers = ["Coursera", "Udemy", "Google Career Certificate", "edX", "Pluralsight"];
  
  return skillsToAddress.map((skill, index) => {
    const provider = providers[index % providers.length];
    const type = index % 3 === 0 ? "Certification" : index % 3 === 1 ? "Online Course" : "Workshop";
    let duration = "4-6 weeks";
    if (type === "Certification") duration = "3-6 months";
    if (type === "Workshop") duration = "2-3 days";
    
    return {
      skillName: skill,
      courseTitle: `Advanced ${skill} Mastery & Real-World Projects`,
      provider,
      type,
      duration
    };
  });
}

export function calculateWeightedScore(
  marksStr: string,
  hobbies: string[],
  stream: "PCM" | "PCB" | "Commerce" | "Humanities"
): number {
  // --- 1. Calculate Marks Score (51% weight) ---
  const cleanedMarks = (marksStr || "").toLowerCase();
  
  // Define keywords for each stream
  const streamKeywords: Record<string, string[]> = {
    PCM: ["math", "physics", "chemistry", "computer", "science", "coding", "programming"],
    PCB: ["biology", "chemistry", "environmental", "science", "physics", "health", "medical"],
    Commerce: ["math", "financial", "finance", "economics", "account", "business", "social"],
    Humanities: ["english", "literature", "history", "civics", "social", "art", "psychology", "sociology", "political"]
  };

  const keywords = streamKeywords[stream] || [];
  
  // Extract all <subject>: <score> or <subject> <score> pairs
  const subjectScores: { subject: string; score: number }[] = [];
  const regex = /([a-z0-9\s]+?)\s*:\s*(\d+)/gi;
  let match;
  while ((match = regex.exec(cleanedMarks)) !== null) {
    const subj = match[1].trim().toLowerCase();
    const score = parseInt(match[2], 10);
    if (!isNaN(score)) {
      subjectScores.push({ subject: subj, score });
    }
  }

  // Also look for simple standalone numbers if no structured pairs were found
  const allNumbers: number[] = [];
  const numRegex = /(\d+)/g;
  let numMatch;
  while ((numMatch = numRegex.exec(cleanedMarks)) !== null) {
    const val = parseInt(numMatch[1], 10);
    if (!isNaN(val) && val <= 100) {
      allNumbers.push(val);
    }
  }

  let marksScore = 75; // Default baseline if nothing found

  if (subjectScores.length > 0) {
    // Find subject scores matching keywords
    const matchingScores = subjectScores
      .filter(item => keywords.some(kw => item.subject.includes(kw)))
      .map(item => item.score);

    if (matchingScores.length > 0) {
      // Average of matching subject scores
      marksScore = matchingScores.reduce((sum, val) => sum + val, 0) / matchingScores.length;
    } else {
      // Fallback to average of all extracted subject scores
      marksScore = subjectScores.reduce((sum, item) => sum + item.score, 0) / subjectScores.length;
    }
  } else if (allNumbers.length > 0) {
    // If there are just numbers, average them
    marksScore = allNumbers.reduce((sum, val) => sum + val, 0) / allNumbers.length;
  }

  // Enforce score range
  marksScore = Math.min(Math.max(marksScore, 40), 100);

  // --- 2. Calculate Hobby Score (49% weight) ---
  const hobbyKeywords: Record<string, string[]> = {
    PCM: ["code", "program", "robot", "math", "tech", "game", "comput", "electronic", "engineer", "software"],
    PCB: ["bio", "chem", "nature", "health", "doctor", "med", "clinic", "biology", "science", "garden", "anatomy", "hospital"],
    Commerce: ["finance", "business", "money", "stock", "invest", "market", "trade", "economics", "entrepreneur", "account", "venture"],
    Humanities: ["art", "design", "writ", "read", "paint", "psych", "history", "music", "book", "philosoph", "social", "draw", "sketch", "literature", "creative"]
  };

  const hKeywords = hobbyKeywords[stream] || [];
  const hList = (hobbies || []).map(h => String(h).toLowerCase());
  
  let matchedHobbiesCount = 0;
  hList.forEach(hobby => {
    if (hKeywords.some(kw => hobby.includes(kw))) {
      matchedHobbiesCount++;
    }
  });

  // Scale: 0 matches -> 50, 1 match -> 75, 2+ matches -> 95-100
  let hobbyScore = 50;
  if (matchedHobbiesCount === 1) {
    hobbyScore = 75;
  } else if (matchedHobbiesCount >= 2) {
    hobbyScore = 95;
  }
  
  // Also boost slightly if any high school stream interest is found
  if (stream === "PCM" && hList.some(h => h.includes("comput") || h.includes("code"))) hobbyScore = Math.min(hobbyScore + 5, 100);
  if (stream === "PCB" && hList.some(h => h.includes("bio") || h.includes("med"))) hobbyScore = Math.min(hobbyScore + 5, 100);
  if (stream === "Commerce" && hList.some(h => h.includes("finance") || h.includes("business"))) hobbyScore = Math.min(hobbyScore + 5, 100);
  if (stream === "Humanities" && hList.some(h => h.includes("art") || h.includes("psych"))) hobbyScore = Math.min(hobbyScore + 5, 100);

  hobbyScore = Math.min(Math.max(hobbyScore, 45), 100);

  // --- 3. Weighted Combination (51% Marks, 49% Hobbies) ---
  const finalScore = (marksScore * 0.51) + (hobbyScore * 0.49);
  
  return Math.round(finalScore);
}

export function generateLocalReport(
  studentName: string,
  hobbies: string[],
  browsingLogs: any[],
  marks: string = "",
  technicalSkills: string[] = [],
  softSkills: string[] = [],
  workExperience: any[] = [],
  educationQualifications: any[] = []
): AnalysisReport {
  const hList = (hobbies || []).map(h => String(h).toLowerCase());
  const logsList = (browsingLogs || []);

  const scores = {
    PCM: calculateWeightedScore(marks, hobbies, "PCM"),
    PCB: calculateWeightedScore(marks, hobbies, "PCB"),
    Commerce: calculateWeightedScore(marks, hobbies, "Commerce"),
    Humanities: calculateWeightedScore(marks, hobbies, "Humanities")
  };

  const sortedPathways = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const recommendedStreams: StreamRecommendation[] = [];
  const longTermCareers: CareerOption[] = [];

  const topKeys = [sortedPathways[0][0], sortedPathways[1][0]];

  topKeys.forEach(key => {
    const sInfo = FALLBACK_STREAM_POOL[key];
    if (sInfo) {
      recommendedStreams.push({
        streamName: sInfo.streamName,
        matchPercentage: scores[key as keyof typeof scores],
        transparentRationale: sInfo.getRationale(hobbies, logsList.length),
        hobbyConnection: sInfo.getHobbyConn(hobbies),
        browsingConnection: sInfo.getBrowsingConn(logsList),
        coreSubjects: sInfo.coreSubjects,
        difficultyLevel: sInfo.difficultyLevel
      });
    }

    const careers = FALLBACK_CAREER_POOL[key];
    if (careers && careers.length > 0) {
      const copy = JSON.parse(JSON.stringify(careers[0])) as CareerOption;
      copy.milestones = enrichMilestones(copy.careerTitle, copy.milestones);
      copy.courseSuggestions = generateFallbackCourseSuggestions(copy.careerTitle, copy.skillsRequired, technicalSkills, softSkills);
      longTermCareers.push(copy);
    }
  });

  const thirdKey = sortedPathways[2][0];
  const firstKey = topKeys[0];
  let extraCareer: any = null;
  if (FALLBACK_CAREER_POOL[firstKey] && FALLBACK_CAREER_POOL[firstKey][1]) {
    extraCareer = JSON.parse(JSON.stringify(FALLBACK_CAREER_POOL[firstKey][1]));
  } else if (FALLBACK_CAREER_POOL[thirdKey] && FALLBACK_CAREER_POOL[thirdKey][0]) {
    extraCareer = JSON.parse(JSON.stringify(FALLBACK_CAREER_POOL[thirdKey][0]));
  }
  
  if (extraCareer) {
    extraCareer.milestones = enrichMilestones(extraCareer.careerTitle, extraCareer.milestones);
    extraCareer.courseSuggestions = generateFallbackCourseSuggestions(extraCareer.careerTitle, extraCareer.skillsRequired, technicalSkills, softSkills);
    longTermCareers.push(extraCareer);
  }

  return {
    studentName,
    recommendedStreams,
    longTermCareers,
    generalAdvice: `Congratulations on compiling your highly detailed profile, ${studentName}! Based on your academic grades ("${marks || "unspecified"}"), existing skill count (${(technicalSkills || []).length + (softSkills || []).length} total), Wi-Fi footprints, and core hobbies, you possess a highly versatile cognitive style. Stream Align's Local Coprocessor has automatically processed your profile parameters to bypass network constraints and ensure instant personalized stream alignment.`,
    marketInsights: `Our dynamic 2026/2027 mapping shows exceptional opportunities in dual-capability sectors: AI systems architecture, quantitative finance, medical biotechnology, and cognitive interaction design. Bridging your identified skill gaps via the suggested online programs will yield exceptional starting premiums.`,
    groundingSources: [
      { title: "National Educational Policy (NEP) Career Guidelines", url: "https://www.education.gov.in/" },
      { title: "Futuristic Job Trends Report 2026", url: "https://www.weforum.org/reports" }
    ],
    isFallback: true,
    fallbackReason: "error"
  };
}

export function generateLocalElaboration(stream: string, hobby: string, studentName: string): string {
  return `### Detailed Dynamic Alignment Report for ${studentName}

#### 🎯 Academic Synergies: ${stream} & "${hobby}"

By looking deeply at your primary activity, **"${hobby}"**, we can trace deep academic and neural connections to the core subjects in the **${stream}** pathway:

1. **System-Level & Algorithmic Cognitive Models**
   Whether you are configuring parameters, designing structures, or coordinating tasks in your hobby, you are exercising top-tier system design and critical execution processes. In fields like Physics or advanced Accountancy, this maps directly to your ability to isolate variables, establish robust models, and run mental simulations.

2. **Deductive Hypothesis Testing**
   Your hobby relies heavily on iterative loops—you try an approach, observe feedback, modify elements, and optimize the final product. This is the literal embodiment of the Scientific Method. In Mathematics, Biology, or Economics, you will excel at parsing abstract problems and systematically proving solutions.

3. **Intrinsic Passion & Stress Buffering**
   High school studies (especially Class 11 & 12 competitive preparation) require extensive resilience. Continuing to actively practice "${hobby}" serves as a highly healthy cognitive release, while simultaneously functioning as a custom playground to apply real-world theories (such as spatial geometry, micro-economics, or cellular mechanics).

#### 🚀 Recommended Dual-Skill Action Item:
Design a weekly project that joins your study of core theory with "${hobby}". For instance, model your study notes using an algorithmic visualization, or create a personal blog outlining the scientific concepts hidden within your hobby. This will boost retention by over 80%!`;
}

export function generateLocalChatResponse(messages: any[], profile: any): string {
  const lastUserMsg = messages[messages.length - 1]?.text || "";
  const query = lastUserMsg.toLowerCase();

  if (query.includes("college") || query.includes("university") || query.includes("admission") || query.includes("institute")) {
    return `**Hello ${profile.name || "Student"}!** Choosing the right college is a major milestone. 

Based on your recommended pathways, here are top elite colleges in India and globally for 2026/2027:

*   **For Technical & Engineering (Science PCM):**
    *   *National:* IIT Bombay, IIT Delhi, IIT Madras, BITS Pilani, NIT Trichy. (Requires JEE Main & Advanced prep)
    *   *Global:* MIT, Stanford University, Carnegie Mellon, University of California Berkeley.
*   **For Medical & Biotech (Science PCB):**
    *   *National:* AIIMS New Delhi, JIPMER Puducherry, CMC Vellore, KGMU Lucknow. (Requires NEET-UG prep)
    *   *Global:* Harvard Medical School, Johns Hopkins, University of Oxford.
*   **For Commerce & Economics:**
    *   *National:* Shri Ram College of Commerce (SRCC), Lady Shri Ram College, St. Stephen's College, IIM Indore (IPM Integrated Program).
    *   *Global:* Wharton School (UPenn), London School of Economics (LSE), NYU Stern.
*   **For Liberal Arts, Design & Humanities:**
    *   *National:* Ashoka University, FLAME University, St. Xavier's College Mumbai, National Institute of Design (NID).
    *   *Global:* Yale University, Rhode Island School of Design (RISD), UCL London.

**Next Action Step:** Start researching the specific entrance exams (JEE, NEET, SAT, CUET, UCEED) required for these streams in Class 11th so you can align your study schedule early!`;
  } else if (query.includes("exam") || query.includes("test") || query.includes("jee") || query.includes("neet") || query.includes("cuet") || query.includes("prep")) {
    return `Excellent question about preparations, **${profile.name || "Student"}**! Preparing for entrance exams requires structured effort over the 2-year Class 11 & 12 period.

Here is a recommended timeline and strategy:

1.  **Understand the Pattern & Syllabus:**
    *   **JEE (PCM):** Tests Physics, Chemistry, Mathematics (focused on problem-solving speed and depth).
    *   **NEET (PCB):** Heavy focus on Biology (NCERT is your Bible), coupled with conceptual Chemistry & Physics.
    *   **CUET (Commerce & Humanities):** Standardized board-level syllabus testing core domain subjects plus general aptitude.
    *   **SAT (Global):** Evidence-based Reading, Writing, and Mathematics.
2.  **NCERT is the Foundation:**
    *   Regardless of the stream, start Class 11 by thoroughly mastering the NCERT textbooks. They form the base of all competitive assessments.
3.  **Consistent Mock Tests:**
    *   Reserve weekends for chapter-wise topic tests. Analyzing wrong answers is 10 times more valuable than just reading theory.

Do you have a target score or a preferred exam format you'd like to discuss?`;
  } else if (query.includes("salary") || query.includes("pay") || query.includes("money") || query.includes("earning")) {
    return `Let's discuss compensation trends for 2026/2027, **${profile.name || "Student"}**. Designing a career path around your strengths leads to high financial viability.

Here are the standard starting and mid-career expectations for these pathways:

1.  **AI & Full-Stack Systems Architect (PCM):**
    *   *Starting:* ₹12 - 18 Lakhs / annum ($115k+ internationally)
    *   *Mid-Career (5-8 years):* ₹30 - 55 Lakhs / annum
2.  **Biotechnology & Gene Editing Specialist (PCB):**
    *   *Starting:* ₹8 - 12 Lakhs / annum ($88k+ internationally)
    *   *Mid-Career (5-8 years):* ₹20 - 35 Lakhs / annum
3.  **Fintech VC & Quantitative Analyst (Commerce):**
    *   *Starting:* ₹10 - 15 Lakhs / annum ($105k+ internationally)
    *   *Mid-Career (5-8 years):* ₹25 - 45 Lakhs / annum
4.  **Cognitive Interaction & Human-AI Design (Humanities):**
    *   *Starting:* ₹8 - 11 Lakhs / annum ($85k+ internationally)
    *   *Mid-Career (5-8 years):* ₹18 - 30 Lakhs / annum

Stream Align maps high-paying, future-proof positions where tech demand is rising exponentially! Which of these triggers your passion most?`;
  } else {
    return `Hi **${profile.name || "there"}**! I am **Stream Align**, your premium Academic Counselor.

I can help you deep-dive into standard high school streams (PCM, PCB, Commerce, Humanities), futuristic careers (AI architect, Gene editor, Quantitative Finance, UX cognitive science), entrance exams, or custom preparation timelines.

What specific question can I clarify for you today?`;
  }
}
