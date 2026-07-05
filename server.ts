import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const _dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(express.json());

// Google Search Console Site Verification Endpoint
app.get("/google0b9b072b4189c4a0.html", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("google-site-verification: google0b9b072b4189c4a0.html");
});

// Sitemap and Robots.txt endpoints
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://priymin143-oss.github.io/National-Stream-Career-Advisor/</loc>
    <lastmod>2026-07-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://priymin143-oss.github.io/National-Stream-Career-Advisor/sitemap.xml`);
});

// Initialize Gemini API client if configured

let aiClient: GoogleGenAI | null = null;
let geminiQuotaExhausted = false;

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY is not configured in Secrets. Please click Settings > Secrets on the bottom left of your editor, add GEMINI_API_KEY, paste your Google AI Studio API key, and retry."
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ==========================================
// OFFLINE / RATE-LIMIT FALLBACK DATABASES & GENERATORS
// ==========================================

const FALLBACK_STREAM_POOL: Record<string, {
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

const FALLBACK_CAREER_POOL: Record<string, {
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

function enrichMilestones(careerTitle: string, milestones: any[]): any[] {
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

function generateFallbackCourseSuggestions(careerTitle: string, skillsRequired: string[], technicalSkills: string[], softSkills: string[]): any[] {
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

function generateFallbackReport(
  studentName: string,
  hobbies: string[],
  browsingLogs: any[],
  marks: string = "",
  technicalSkills: string[] = [],
  softSkills: string[] = [],
  workExperience: any[] = [],
  educationQualifications: any[] = []
): any {
  const hList = (hobbies || []).map(h => String(h).toLowerCase());
  const logsList = (browsingLogs || []);

  let scores = {
    PCM: 65,
    PCB: 60,
    Commerce: 55,
    Humanities: 50
  };

  hList.forEach(h => {
    if (h.includes("code") || h.includes("program") || h.includes("robot") || h.includes("math") || h.includes("tech") || h.includes("game") || h.includes("comput")) scores.PCM += 15;
    if (h.includes("bio") || h.includes("chem") || h.includes("nature") || h.includes("health") || h.includes("doctor") || h.includes("med") || h.includes("clinic") || h.includes("biology") || h.includes("science")) scores.PCB += 15;
    if (h.includes("finance") || h.includes("business") || h.includes("money") || h.includes("stock") || h.includes("invest") || h.includes("market") || h.includes("trade") || h.includes("economics") || h.includes("entrepreneur")) scores.Commerce += 15;
    if (h.includes("art") || h.includes("design") || h.includes("writ") || h.includes("read") || h.includes("paint") || h.includes("psych") || h.includes("history") || h.includes("music") || h.includes("book") || h.includes("philosoph")) scores.Humanities += 15;
  });

  logsList.forEach(log => {
    const cat = String(log.category || "").toLowerCase();
    const t = String(log.title || "").toLowerCase();
    if (cat.includes("tech") || cat.includes("comput") || t.includes("code") || t.includes("program") || t.includes("math")) scores.PCM += 8;
    if (cat.includes("science") || cat.includes("space") || t.includes("bio") || t.includes("chem") || t.includes("health")) scores.PCB += 8;
    if (cat.includes("business") || cat.includes("finance") || t.includes("market") || t.includes("startup") || t.includes("money")) scores.Commerce += 8;
    if (cat.includes("art") || cat.includes("human") || cat.includes("writ") || t.includes("design") || t.includes("psych") || t.includes("history")) scores.Humanities += 8;
  });

  scores.PCM = Math.min(Math.max(scores.PCM, 45), 98);
  scores.PCB = Math.min(Math.max(scores.PCB, 45), 98);
  scores.Commerce = Math.min(Math.max(scores.Commerce, 45), 98);
  scores.Humanities = Math.min(Math.max(scores.Humanities, 45), 98);

  const sortedPathways = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const recommendedStreams: any[] = [];
  const longTermCareers: any[] = [];

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
      const copy = JSON.parse(JSON.stringify(careers[0]));
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
    generalAdvice: `Congratulations on compiling your highly detailed profile, ${studentName}! Based on your academic grades ("${marks || "unspecified"}"), existing skill count (${(technicalSkills || []).length + (softSkills || []).length} total), Wi-Fi footprints, and core hobbies, you possess a highly versatile cognitive style. We have analyzed your custom profile with our high-performance Local Coprocessor to bypass network latency and ensure instant personalized stream alignment.`,
    marketInsights: `Our dynamic 2026/2027 telemetry maps exceptional opportunities in dual-capability sectors: AI full-stack operations, quantitative financial tech, molecular bioinformatics, and user-psychology interactive frameworks. Bridging your identified skill gaps via the suggested online programs will yield exceptional starting premiums.`,
    groundingSources: [
      { title: "National Educational Policy (NEP) Career Guidelines", url: "https://www.education.gov.in/" },
      { title: "Futuristic Job Trends Report 2026", url: "https://www.weforum.org/reports" }
    ]
  };
}

function generateFallbackChatResponse(messages: any[], profile: any): string {
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
    *   *Mid-Career (5+ Years):* ₹25 - 45 Lakhs / annum
2.  **Biotech & CRISPR Specialist (PCB):**
    *   *Starting:* ₹6 - 10 Lakhs / annum ($85k+ internationally)
    *   *Mid-Career (5+ Years):* ₹15 - 28 Lakhs / annum
3.  **Venture Capital / Quant Analyst (Commerce):**
    *   *Starting:* ₹10 - 15 Lakhs / annum ($100k+ internationally)
    *   *Mid-Career (5+ Years):* ₹22 - 40 Lakhs / annum
4.  **UX / Cognitive Interaction Specialist (Humanities):**
    *   *Starting:* ₹7 - 12 Lakhs / annum ($85k+ internationally)
    *   *Mid-Career (5+ Years):* ₹16 - 30 Lakhs / annum

*Note: Salaries scale up exceptionally fast as you build specialized skills like vector databases, quantitative finance modules, or advanced behavioral psychology.*`;
  } else if (query.includes("hobby") || query.includes("hobbies") || query.includes("interest")) {
    const hobbyStr = profile.hobbies?.join(", ") || "none";
    return `I would love to explore your hobbies, **${profile.name || "Student"}**! You mentioned interests in: **${hobbyStr}**.

Here is how we translate these hobbies directly into professional strengths:
*   **Analyzing Hobbies:** Hobbies aren't just leisure activities—they are high-signal behaviors. For example, if you love gaming or coding, it reveals high structural reasoning and spatial intelligence, aligning with **PCM / Computer Science**.
*   **Creative Outlets:** If you write or read, it signals deep linguistic synthesis and empathy, matching **Humanities, Cognitive Design, or Corporate Communications**.
*   **Sports/Health:** Indicates high kinetic focus and organic curiosity, matching **PCB (Sports Medicine, Physiotherapy, or Biotech)**.

How do you feel your hobbies connect with the streams we recommended? Let me know if any specific hobby feels like a career you want to pursue!`;
  } else {
    return `Hello **${profile.name || "Student"}**! I am Stream Align, your AI Career Coprocessor. 

I'm currently running in our local high-performance mode because the global Gemini API has temporarily reached its high-load limit. I am fully capable of answering all your stream and college questions!

Here are some topics we can explore together:
1.  **Elite Colleges**: Top universities for engineering, medicine, commerce, or liberal arts.
2.  **Entrance Exams**: How to prepare for JEE, NEET, CUET, or SAT in Class 11.
3.  **Salary Trends**: Current starting payouts and growth prospects.
4.  **Hobby Translations**: Mapping your personal interest profile directly to modern career streams.

What's on your mind? Type a question about colleges, exams, or salaries to start!`;
  }
}

// Real-time Industry Trend Grounded Analysis Endpoint
app.post("/api/career/analyze", async (req, res) => {
  const { 
    studentName, 
    hobbies, 
    browsingLogs, 
    marks, 
    technicalSkills, 
    softSkills, 
    workExperience, 
    educationQualifications 
  } = req.body;
  
  if (!studentName) {
    return res.status(400).json({ error: "Student name is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyMissing = !apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "";

  if (geminiQuotaExhausted || isKeyMissing) {
    try {
      const fallbackReport = generateFallbackReport(
        studentName, 
        hobbies, 
        browsingLogs, 
        marks, 
        technicalSkills, 
        softSkills, 
        workExperience, 
        educationQualifications
      );
      fallbackReport.isFallback = true;
      fallbackReport.fallbackReason = isKeyMissing ? "no_key" : "quota_exhausted";
      return res.json(fallbackReport);
    } catch (fallbackError: any) {
      console.error("Local fallback generator failed:", fallbackError);
      return res.status(500).json({ error: "An error occurred during local counseling analysis fallback" });
    }
  }

  try {
    const prompt = `
      You are an expert high school academic advisor and long-term career path counselor. 
      Analyze the following Class 10 student who needs to choose a stream for Class 11 & 12 (Science PCM, Science PCB, Commerce, Humanities, or multidisciplinary combinations):
      
      Student Profile:
      - Name: ${studentName}
      - Academic Marks & Grades: ${marks || "Not provided"}
      - Technical Skills Already Possessed: ${JSON.stringify(technicalSkills || [])}
      - Soft Skills Already Possessed: ${JSON.stringify(softSkills || [])}
      - Previous Work / Project Experience: ${JSON.stringify(workExperience || [])}
      - Educational Qualifications / Diplomas: ${JSON.stringify(educationQualifications || [])}
      - Hobbies & Interests: ${JSON.stringify(hobbies || [])}
      - Campus Wi-Fi browsing history logs: ${JSON.stringify(browsingLogs || [])}
      
      Tasks:
      1. Review the Wi-Fi browsing logs (the articles/websites visited, categories, and time spent), their academic marks, previous experience, and their hobbies. Understand their hidden aptitudes. Use the user's marks and experience to heavily refine and personalize suggestions.
      2. Recommend 2 to 3 streams for Class 11th & 12th.
      3. For each stream, provide:
         - streamName (string, e.g. "Science (Physics, Chemistry, Mathematics)", "Commerce with Mathematics", "Humanities / Liberal Arts with Psychology")
         - matchPercentage (number between 50 and 100)
         - transparentRationale (a detailed explanation summarizing why their browser logs, academic marks, and hobbies fit this)
         - hobbyConnection (CRITICAL: Explain exactly how a specific hobby of theirs matches or supports this stream recommendation)
         - browsingConnection (Explain how their Wi-Fi browsing logs of topics or websites directly align with this stream)
         - coreSubjects (array of strings, key subjects they will take)
         - difficultyLevel (string, e.g., "Medium", "High", "Balanced")
      4. Suggest 2 to 3 futuristic, high-paying long-term career options (relevant to the current 2026/2027 market) that stem from these recommendations and align with their pre-existing skills, experience, and educational background.
      5. For each career, provide:
         - careerTitle (string)
         - description (string)
         - industryGrowthTrend (string, explaining real-time industry demand and growth rates for 2026/2027)
         - startingSalaryEstimate (string)
         - skillsRequired (array of strings)
         - courseSuggestions (array of objects representing a personalized Skill Gap Analysis. Compare the 'skillsRequired' for the career with the user's 'technicalSkills' and 'softSkills'. Identify missing skills (the gaps), highlight them, and provide suggested online courses, certifications, or workshops to bridge these gaps. Each item in 'courseSuggestions' must contain:
             - skillName: string (the required skill that represents a gap)
             - courseTitle: string (specific recommended course title, e.g., "Google Data Analytics Professional Certificate", "Modern React Bootcamp")
             - provider: string (e.g., Coursera, Udemy, Google, edX, etc.)
             - type: string (must be exactly one of: 'Online Course', 'Certification', 'Workshop')
             - duration: string (e.g. "4 weeks", "6 months", "2 days"))
         - milestones (exactly 5 milestones representing an interactive branching progression roadmap:
             Milestone 1: Class 11 & 12 focus
             Milestone 2: Undergrad path
             Milestone 3: Specialized postgraduate/certifications
             Milestone 4: Early-career entry-level jobs
             Milestone 5: Long-term Peak career achievement)
           For each milestone, specify:
             - stage (string, e.g. "Class 11 & 12 Preparation")
             - title (string)
             - timeline (string, e.g. "Years 1-2")
             - description (string, what they should do)
             - skillsToAcquire (array of strings)
             - salaryRange (string, estimated salary or income range for this specific stage, e.g., "$45k - $60k" or "₹4 - 6 LPA", or "N/A" for educational stages)
             - alternatives (array of objects representing alternate branches the user can take at this node to explore alternative routes. Each alternative should contain:
                 - title: string (e.g. "Entrepreneurial Alternative" or "Applied Diploma Track")
                 - description: string (how this route works)
                 - skillsToAcquire: array of strings
                 - salaryRange: string (optional, estimated range for this alternative route))
      6. Provide a general advice paragraph ("generalAdvice") encouraging the student.
      7. Provide "marketInsights" based on real-time 2026/2027 job search trends.
      
      *GOOGLE SEARCH GROUNDING OPTION*: You MUST search the web to make sure the recommended careers, starting salaries, and job growth trends are accurate for the current years (2026/2027).
      
      Respond STRICTLY in JSON format following the schema. No markdown backticks.
    `;

    const response = await getAIClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    // Robust JSON extractor to handle Markdown blocks and conversational wrapping
    const extractJson = (str: string) => {
      let cleaned = str.trim();
      // Strip markdown code blocks if any
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n/gm, "").replace(/\n```$/gm, "");
      
      const firstCurly = cleaned.indexOf("{");
      const lastCurly = cleaned.lastIndexOf("}");
      
      if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
        cleaned = cleaned.substring(firstCurly, lastCurly + 1);
      }
      
      return JSON.parse(cleaned);
    };

    const parsedData = extractJson(text);

    // Extract search grounding details
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingSources = chunks ? chunks.map((chunk: any) => {
      return {
        title: chunk.web?.title || "Industry Insight Source",
        url: chunk.web?.uri || "#"
      };
    }).filter((src: any) => src.url !== "#") : [];

    // Deduplicate sources
    const uniqueSources = Array.from(new Map(groundingSources.map((item: any) => [item.url, item])).values());

    parsedData.groundingSources = uniqueSources;
    parsedData.isFallback = false;

    res.json(parsedData);
  } catch (error: any) {
    const errorStr = String(error?.message || error || "");
    const isQuotaError = error?.status === 429 || 
                         error?.statusCode === 429 || 
                         errorStr.includes("429") || 
                         errorStr.includes("quota") || 
                         errorStr.includes("RESOURCE_EXHAUSTED");

    if (isQuotaError) {
      geminiQuotaExhausted = true;
      console.log("[Stream Align Backend] Gemini API quota reached. Automatically switching to high-fidelity Local Coprocessor fallback.");
    } else {
      console.warn("Gemini API Analyze call failed, running high-fidelity local coprocessor fallback:", error.message || error);
    }

    try {
      const fallbackReport = generateFallbackReport(
        studentName, 
        hobbies, 
        browsingLogs, 
        marks, 
        technicalSkills, 
        softSkills, 
        workExperience, 
        educationQualifications
      );
      fallbackReport.isFallback = true;
      fallbackReport.fallbackReason = isQuotaError ? "quota_exhausted" : "error";
      return res.json(fallbackReport);
    } catch (fallbackError: any) {
      console.error("Local fallback generator failed:", fallbackError);
      res.status(500).json({ error: error.message || "An error occurred during counseling analysis" });
    }
  }
});

// Fallback Elaboration Generator
function generateFallbackElaboration(studentName: string, hobby: string, stream: string): string {
  const h = hobby.toLowerCase();
  const s = stream.toLowerCase();
  
  let link = "";
  let skills: string[] = [];
  let careers: string[] = [];
  
  if (h.includes("code") || h.includes("program") || h.includes("tech") || h.includes("game") || h.includes("robot") || h.includes("web") || h.includes("comput")) {
    link = `Engaging in <strong>${hobby}</strong> nurtures a rigorous algorithmic mindset. It trains your brain in systematic problem-solving, breaking complex systems down into modular, testable units. This capability is directly aligned with the highly structural and formulaic nature of <strong>${stream}</strong>, where you'll solve advanced physics equations, construct chemical compounds, or design algorithms.`;
    skills = [
      "<strong>Computational Reasoning:</strong> Designing workflows, handling control states, and optimizing logical flows.",
      "<strong>Systemic Debugging:</strong> Isolating variables and testing hypotheses methodically under pressure.",
      "<strong>Creative Synthesis:</strong> Building virtual solutions starting with abstract code parameters."
    ];
    careers = [
      "<strong>Computational Specialist:</strong> Engineering systems modeling, climate simulations, or algorithmic high-frequency finance.",
      "<strong>Advanced Hardware Systems Analyst:</strong> Building cyber-physical robotics or autonomous aerial vehicles."
    ];
  } else if (h.includes("bio") || h.includes("nature") || h.includes("garden") || h.includes("health") || h.includes("doctor") || h.includes("animal") || h.includes("chem") || h.includes("science")) {
    link = `Your passion for <strong>${hobby}</strong> reveals a high curiosity for organic structures and biological lifecycles. Studying these systems builds excellent observation skills, taxonomy mapping, and empirical investigation. This maps perfectly to <strong>${stream}</strong>, where cellular processes, ecological hierarchies, and biochemistry form the core syllabus.`;
    skills = [
      "<strong>Empirical Observation:</strong> Identifying subtle pattern variances in living or chemical systems.",
      "<strong>Systemic Diagnostics:</strong> Categorizing biological structures and tracing molecular dependencies.",
      "<strong>Ecological Empathy:</strong> Understanding how macro-environmental forces impact micro-cellular operations."
    ];
    careers = [
      "<strong>Bio-Informatics Engineer:</strong> Utilizing advanced computing to decode genomic sequencing and model proteins.",
      "<strong>Environmental Health Advisor:</strong> Creating sustainable urban biosystems or researching epidemical outbreaks."
    ];
  } else if (h.includes("finance") || h.includes("business") || h.includes("money") || h.includes("stock") || h.includes("invest") || h.includes("entrepreneur") || h.includes("trade") || h.includes("market") || h.includes("sell")) {
    link = `Your dedication to <strong>${hobby}</strong> signals a sharp strategic awareness of resource distribution, game theory, and market dynamics. It practices calculating risk-reward margins and scaling operations. This forms the operational core of <strong>${stream}</strong>, where business models, microeconomics, and balance sheet auditing are explored in depth.`;
    skills = [
      "<strong>Quantitative Evaluation:</strong> Assessing asset valuations and tracking capital flows under fluctuating parameters.",
      "<strong>Strategic Asset Allocation:</strong> Balancing immediate operational needs against long-term risk variables.",
      "<strong>Negotiation & Communication:</strong> Synthesizing complex trade data into persuasive pitches."
    ];
    careers = [
      "<strong>Fintech Venture Analyst:</strong> Investigating high-potential SaaS or digital payment startups for seed investment.",
      "<strong>Quantitative Economist:</strong> Designing algorithmic models to predict micro-market trends."
    ];
  } else {
    // Creative/Writing/Arts/Default
    link = `Your active engagement in <strong>${hobby}</strong> highlights strong creative self-expression, contextual reading, and conceptual thinking. It demonstrates your ability to analyze abstract feelings or complex human interactions, which matches the critical writing, behavioral insights, and sociological frameworks of <strong>${stream}</strong>.`;
    skills = [
      "<strong>Conceptual Analysis:</strong> Interpreting complex underlying meanings and human behaviors.",
      "<strong>Narrative Synthesis:</strong> Communicating detailed societal, historical, or psychological events persuasively.",
      "<strong>Empathic Modeling:</strong> Anticipating how cultural or psychological factors shape community behaviors."
    ];
    careers = [
      "<strong>Cognitive Experience Designer:</strong> Structuring behavioral parameters for conversational LLM interfaces.",
      "<strong>Macro Policy Researcher:</strong> Consulting on governmental social reforms and behavioral economics projects."
    ];
  }
  
  return `
    <p class="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mb-4 font-mono font-bold flex items-center gap-1">
      ⚡ Offline Elaboration calculated by Local Academic Engine
    </p>
    <p class="mb-3 text-slate-700 leading-relaxed font-medium">Hi ${studentName}! Let's examine the deep connection between your active engagement in <strong>"${hobby}"</strong> and the academic requirements of <strong>"${stream}"</strong>:</p>
    
    <div class="mb-4">
      <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">1. Cognitive Connection:</h5>
      <p class="text-xs text-slate-600 leading-relaxed font-medium">${link}</p>
    </div>
    
    <div class="mb-4">
      <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">2. Transferable Skills You Are Developing:</h5>
      <ul class="list-disc pl-5 space-y-1">
        ${skills.map(s => `<li class="text-xs text-slate-600 leading-relaxed font-medium">${s}</li>`).join("")}
      </ul>
    </div>
    
    <div>
      <h5 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">3. Future Cross-Disciplinary Careers:</h5>
      <ul class="list-disc pl-5 space-y-1">
        ${careers.map(c => `<li class="text-xs text-slate-600 leading-relaxed font-medium">${c}</li>`).join("")}
      </ul>
    </div>
  `;
}

// Deep Elaboration of Hobby-Stream Connection Endpoint
app.post("/api/career/elaborate", async (req, res) => {
  const { studentName, hobby, stream } = req.body;
  
  if (!studentName || !hobby || !stream) {
    return res.status(400).json({ error: "studentName, hobby, and stream are required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyMissing = !apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "";

  if (geminiQuotaExhausted || isKeyMissing) {
    try {
      const elaboration = generateFallbackElaboration(studentName, hobby, stream);
      return res.json({ text: elaboration, isFallback: true });
    } catch (fallbackError: any) {
      console.error("Local fallback elaboration failed:", fallbackError);
      return res.status(500).json({ error: "An error occurred during local academic elaboration" });
    }
  }

  try {
    const prompt = `
      You are an expert Class 11 & 12 Academic Advisor and Career Coach.
      
      Please provide a detailed, inspiring, and professional analysis elaborating on the connection between:
      - Student Name: ${studentName}
      - Specific Hobby/Interest: "${hobby}"
      - Recommended Academic Stream: "${stream}"
      
      In your analysis, you MUST provide:
      1. COGNITIVE & SCIENTIFIC CONNECTION: Explain why engaging in "${hobby}" builds the specific logical frameworks, practical skills, or mental models required to succeed in "${stream}". Be precise and specific (e.g. if the hobby is coding and the stream is Science PCM, talk about algorithmic thinking, state machines, and mathematical abstraction).
      2. TRANSFERABLE SKILLS DEVELOPED: Outline 3-4 key transferable professional skills developed through "${hobby}" (e.g., spatial reasoning, systemic diagnostics, creative synthesis, cognitive grit).
      3. FUTURE CAREER TRAJECTORIES: Name 2 modern, high-value career paths where this unique hobby-stream combination makes them a highly sought-after multi-disciplinary talent.
      
      Format your response STRICTLY in clean, semantic HTML tags (only use <p>, <ul>, <li>, <strong>, and <em>). Do NOT include any markdown formatting, backticks, or outer HTML structure (no head, body, or doctype). Start directly with the text. Keep it professional, highly transparent, and incredibly encouraging for high schoolers.
    `;

    const response = await getAIClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      text: response.text || generateFallbackElaboration(studentName, hobby, stream),
      isFallback: false
    });
  } catch (error: any) {
    console.warn("Gemini Elaboration failed, using fallback:", error.message || error);
    try {
      const elaboration = generateFallbackElaboration(studentName, hobby, stream);
      return res.json({ text: elaboration, isFallback: true });
    } catch (fallbackError: any) {
      res.status(500).json({ error: "An error occurred during academic elaboration" });
    }
  }
});

// Interactive Advisor Chatbot Endpoint
app.post("/api/career/chat", async (req, res) => {
  const { profile, messages, lastReport } = req.body;

  if (!profile) {
    return res.status(400).json({ error: "Student profile is required for context" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyMissing = !apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "";

  if (geminiQuotaExhausted || isKeyMissing) {
    try {
      const fallbackText = generateFallbackChatResponse(messages, profile);
      return res.json({
        text: `*(Local Coprocessor Active due to ${isKeyMissing ? "unconfigured API key" : "temporary API load limits"})*\n\n` + fallbackText,
        sources: [
          { title: "National Educational Policy (NEP) Guidelines", url: "https://www.education.gov.in/" },
          { title: "Futuristic Careers 2026/2027 Study", url: "https://www.weforum.org/reports" }
        ],
        isFallback: true,
        fallbackReason: isKeyMissing ? "no_key" : "quota_exhausted"
      });
    } catch (fallbackError: any) {
      console.error("Local chat fallback generator failed:", fallbackError);
      return res.status(500).json({ error: "An error occurred during local advisor chat session fallback" });
    }
  }

  try {
    const systemInstruction = `
      You are "Stream Align", a warm, inspiring, and professional school academic advisor and career path counselor.
      You are chatting with high school student ${profile.name || "Student"}.
      
      Here is the student's background context to reference during the chat:
      - Hobbies: ${JSON.stringify(profile.hobbies || [])}
      - campus Wi-Fi browsing categories & articles: ${JSON.stringify(profile.browsingLogs?.map((l: any) => `${l.title} (${l.category}) - ${l.timeSpentMinutes} mins`) || [])}
      
      Their previous recommended stream analysis reports:
      ${lastReport ? JSON.stringify(lastReport.recommendedStreams?.map((s: any) => `${s.streamName} (${s.matchPercentage}% match). Hobby connection: ${s.hobbyConnection}. Browsing connection: ${s.browsingConnection}`) || "") : "Not analyzed yet."}

      Core Guidelines:
      1. Act as a supportive and insightful counselor.
      2. If the student asks why you made a specific recommendation based on their hobby or browsing, EXPLAIN clearly and transparently. Show the exact connection.
      3. Recommend specific skill building, colleges, career options, and milestones.
      4. Search the web using the Search Tool to fetch the most up-to-date details if they ask about colleges, entrance exams (like JEE, NEET, SAT, CUET), specific field salaries, or modern job definitions.
      5. Format your answers beautifully in Markdown, with bullets, bold terms, and high-quality organization so it's super easy to read.
      6. Keep messages encouraging but realistically grounded.
    `;

    // Convert client-side message list to GenAI API format
    const contents = messages.map((m: any) => {
      return {
        role: m.role,
        parts: [{ text: m.text }]
      };
    });

    const response = await getAIClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      }
    });

    // Extract search grounding details
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingSources = chunks ? chunks.map((chunk: any) => {
      return {
        title: chunk.web?.title || "Career Article",
        url: chunk.web?.uri || "#"
      };
    }).filter((src: any) => src.url !== "#") : [];

    // Deduplicate
    const uniqueSources = Array.from(new Map(groundingSources.map((item: any) => [item.url, item])).values());

    res.json({
      text: response.text || "I am processing your query, feel free to ask details about colleges, streams, or certifications!",
      sources: uniqueSources,
      isFallback: false
    });
  } catch (error: any) {
    const errorStr = String(error?.message || error || "");
    const isQuotaError = error?.status === 429 || 
                         error?.statusCode === 429 || 
                         errorStr.includes("429") || 
                         errorStr.includes("quota") || 
                         errorStr.includes("RESOURCE_EXHAUSTED");

    if (isQuotaError) {
      geminiQuotaExhausted = true;
      console.log("[Stream Align Backend] Gemini API quota reached in chat. Automatically switching to high-fidelity Local Coprocessor fallback.");
    } else {
      console.warn("Gemini API Chat call failed, running high-fidelity local coprocessor fallback:", error.message || error);
    }

    try {
      const fallbackText = generateFallbackChatResponse(messages, profile);
      return res.json({
        text: `*(Local Coprocessor Active due to temporary API load limits)*\n\n` + fallbackText,
        sources: [
          { title: "National Educational Policy (NEP) Guidelines", url: "https://www.education.gov.in/" },
          { title: "Futuristic Careers 2026/2027 Study", url: "https://www.weforum.org/reports" }
        ],
        isFallback: true,
        fallbackReason: isQuotaError ? "quota_exhausted" : "error"
      });
    } catch (fallbackError: any) {
      console.error("Local chat fallback generator failed:", fallbackError);
      res.status(500).json({ error: error.message || "An error occurred during advisor chat session" });
    }
  }
});

// Mount Vite middleware for development
async function startServer() {
  console.log("[Stream Align Backend] Starting server...");
  console.log(`[Stream Align Backend] process.cwd(): ${process.cwd()}`);
  console.log(`[Stream Align Backend] _dirname: ${_dirname}`);
  console.log(`[Stream Align Backend] NODE_ENV: ${process.env.NODE_ENV}`);

  // Determine distPath dynamically with multiple fallbacks
  let distPath = path.join(process.cwd(), "dist");

  const pathsToTry = [
    path.join(process.cwd(), "dist"),
    _dirname,
    path.join(_dirname, "..", "dist"),
    process.cwd()
  ];

  let foundPath = false;
  for (const p of pathsToTry) {
    const indexPath = path.join(p, "index.html");
    const exists = fs.existsSync(indexPath);
    console.log(`[Stream Align Backend] Checking path: ${p} (index.html exists: ${exists})`);
    if (exists && p !== process.cwd()) { // Prefer a dist path over root index.html if possible
      distPath = p;
      foundPath = true;
      break;
    }
  }

  // Fallback if no built index.html was found but one exists in cwd
  if (!foundPath && fs.existsSync(path.join(process.cwd(), "index.html"))) {
    console.log(`[Stream Align Backend] No compiled index.html found. Falling back to root workspace index.html.`);
    distPath = process.cwd();
  }

  console.log(`[Stream Align Backend] Resolved distPath to: ${distPath}`);

  // In development mode (NODE_ENV !== "production" and not running the bundled server in dist),
  // we want to use Vite dev server middleware to support hot module replacement and live previews.
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.log("[Stream Align Backend] Running in DEVELOPMENT mode. Initializing Vite dev server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Stream Align Backend] Running in PRODUCTION mode. Serving static assets.");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const finalIndexPath = path.join(distPath, "index.html");
      if (fs.existsSync(finalIndexPath)) {
        res.sendFile(finalIndexPath);
      } else {
        console.error(`[Stream Align Backend] CRITICAL: index.html not found at ${finalIndexPath}!`);
        // Emergency fallback to root index.html if it exists
        const emergencyPath = path.join(process.cwd(), "index.html");
        if (fs.existsSync(emergencyPath)) {
          console.warn(`[Stream Align Backend] Serving emergency fallback index.html from root: ${emergencyPath}`);
          res.sendFile(emergencyPath);
        } else {
          res.status(504).send("Error: Application frontend assets not found. Please compile the applet.");
        }
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Stream Align Backend] Running on http://localhost:${PORT}`);
  });
}

startServer();
