export interface Project {
  id: string;
  title: string;
  category: 'Systems & Networks' | 'Civic Technology' | 'Data Engines';
  year: string;
  oneLiner: string;
  keyMetric: string;
  stack: string[];
  description: string;
  architectureDetails: string[];
  benchmarks: { label: string; value: string }[];
  repoUrl?: string;
  liveUrl?: string;
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface Course {
  code: string;
  title: string;
  term: string;
  grade: string;
  focus: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  status: string;
  year: string;
  venue: string;
  abstract: string;
  pdfAvailable: boolean;
}

export interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  content: string[];
}
