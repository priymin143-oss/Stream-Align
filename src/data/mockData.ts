import { BrowsingLog, StudentProfile } from "../types";

export const COMMON_HOBBIES = [
  "Game development",
  "Astrophotography",
  "Playing chess",
  "Creative writing",
  "Digital sketching",
  "Gardening",
  "Stock market simulation",
  "Volunteering at animal shelters",
  "Hiking & Map Reading",
  "Debating",
  "Playing acoustic guitar",
  "Rubik's cube solving",
  "Model rocketry",
  "Photography & Video Editing",
  "Culinary arts",
  "Podcasting"
];

export const MOCK_CAMPUS_LOGS: BrowsingLog[] = [
  {
    id: "log-1",
    url: "https://github.com/trending/javascript",
    title: "GitHub Trending Projects - Open Source JavaScript Engines",
    category: "Technology & Coding",
    visitsCount: 12,
    timeSpentMinutes: 85,
    timestamp: "2026-06-25T14:30:00Z"
  },
  {
    id: "log-2",
    url: "https://arxiv.org/abs/astro-ph",
    title: "arXiv.org - Astrophysics Research on Exoplanetary Atmosphere Spectral Signals",
    category: "Science & Space",
    visitsCount: 8,
    timeSpentMinutes: 110,
    timestamp: "2026-06-26T09:15:00Z"
  },
  {
    id: "log-3",
    url: "https://www.investopedia.com/terms/e/equity.asp",
    title: "Investopedia - Understanding Equities, Portfolio Management, and Stocks",
    category: "Business & Finance",
    visitsCount: 15,
    timeSpentMinutes: 95,
    timestamp: "2026-06-24T11:45:00Z"
  },
  {
    id: "log-4",
    url: "https://www.behance.net/galleries/ui-ux",
    title: "Behance - Cutting-Edge UI/UX and Mobile Interactive Layout Showcases",
    category: "Arts & Design",
    visitsCount: 14,
    timeSpentMinutes: 120,
    timestamp: "2026-06-26T16:20:00Z"
  },
  {
    id: "log-5",
    url: "https://plato.stanford.edu/entries/ethics-ai/",
    title: "Stanford Encyclopedia of Philosophy - Ethics of Artificial Intelligence & Modern Society",
    category: "Humanities & Writing",
    visitsCount: 6,
    timeSpentMinutes: 75,
    timestamp: "2026-06-25T10:00:00Z"
  },
  {
    id: "log-6",
    url: "https://www.nature.com/articles/bio-tech",
    title: "Nature Biotechnology - Gene Editing Advances and CRISPR Therapeutics",
    category: "Science & Space",
    visitsCount: 10,
    timeSpentMinutes: 130,
    timestamp: "2026-06-23T15:10:00Z"
  },
  {
    id: "log-7",
    url: "https://medium.com/literature/world-mythology",
    title: "Medium: Narrative Architecture and the Power of World-Building in Fiction",
    category: "Humanities & Writing",
    visitsCount: 9,
    timeSpentMinutes: 60,
    timestamp: "2026-06-26T13:40:00Z"
  },
  {
    id: "log-8",
    url: "https://www.bloomberg.com/markets",
    title: "Bloomberg Markets - Global Currencies, Bond Yields, and Central Bank Interest Rates",
    category: "Business & Finance",
    visitsCount: 11,
    timeSpentMinutes: 80,
    timestamp: "2026-06-25T08:30:00Z"
  },
  {
    id: "log-9",
    url: "https://leetcode.com/problemset/algorithms",
    title: "LeetCode Algorithms - Binary Search Trees and Dynamic Programming Problems",
    category: "Technology & Coding",
    visitsCount: 18,
    timeSpentMinutes: 140,
    timestamp: "2026-06-26T19:00:00Z"
  },
  {
    id: "log-10",
    url: "https://www.dribbble.com/shots/popular",
    title: "Dribbble - Modern Minimalism & Brutalist Vector Art Illustrations",
    category: "Arts & Design",
    visitsCount: 7,
    timeSpentMinutes: 45,
    timestamp: "2026-06-24T17:15:00Z"
  }
];

export interface StudentPersona {
  name: string;
  avatar: string;
  description: string;
  hobbies: string[];
  logs: BrowsingLog[];
}

export const PRESET_PERSONAS: StudentPersona[] = [
  {
    name: "Aarav Sharma",
    avatar: "🔭",
    description: "Fascinated by high-performance computing, exoplanets, and puzzle-solving.",
    hobbies: ["Game development", "Astrophotography", "Rubik's cube solving", "Model rocketry"],
    logs: [
      MOCK_CAMPUS_LOGS[0], // GitHub
      MOCK_CAMPUS_LOGS[1], // arXiv Astrophysics
      MOCK_CAMPUS_LOGS[8]  // LeetCode
    ]
  },
  {
    name: "Ananya Iyer",
    avatar: "🎨",
    description: "Creative storyteller who designs mock application screens and writes speculative fiction.",
    hobbies: ["Digital sketching", "Creative writing", "Photography & Video Editing", "Playing acoustic guitar"],
    logs: [
      MOCK_CAMPUS_LOGS[3], // Behance
      MOCK_CAMPUS_LOGS[6], // Narrative world-building
      MOCK_CAMPUS_LOGS[9]  // Dribbble
    ]
  },
  {
    name: "Vikram Malhotra",
    avatar: "📈",
    description: "Enthusiastic about finance, macroeconomics, stock indicators, and complex strategy games.",
    hobbies: ["Playing chess", "Stock market simulation", "Debating"],
    logs: [
      MOCK_CAMPUS_LOGS[2], // Investopedia
      MOCK_CAMPUS_LOGS[4], // AI Ethics philosophy
      MOCK_CAMPUS_LOGS[7]  // Bloomberg
    ]
  },
  {
    name: "Meera Fernandez",
    avatar: "🌱",
    description: "Passionate about environment systems, plant genetics, organic chemistry, and animal wellness.",
    hobbies: ["Gardening", "Volunteering at animal shelters", "Hiking & Map Reading"],
    logs: [
      MOCK_CAMPUS_LOGS[1], // arXiv
      MOCK_CAMPUS_LOGS[5], // Nature Biotech CRISPR
      MOCK_CAMPUS_LOGS[4]  // Ethics philosophy
    ]
  }
];
