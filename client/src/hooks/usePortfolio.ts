import { trpc } from "@/lib/trpc";

export type PortfolioData = {
  profile: {
    fullName: string;
    title: string;
    bio: string | null;
    heroTagline: string;
    heroSubtitle: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    yearsExperience: string | null;
    projectsDelivered: string | null;
    openSourceContributions: string | null;
    clientSatisfaction: string | null;
    availableForWork: number;
  } | null;
  projects: Array<{
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    liveUrl: string | null;
    githubUrl: string | null;
    tags: string | null;
    featured: number;
    sortOrder: number;
  }>;
  experiences: Array<{
    id: number;
    role: string;
    company: string;
    period: string;
    description: string | null;
    tags: string | null;
    sortOrder: number;
  }>;
  skills: Array<{
    id: number;
    title: string;
    icon: string;
    skills: string | null;
    sortOrder: number;
  }>;
};

// Default fallback data when the database is empty
const defaultProfile = {
  fullName: "Alex Chen",
  title: "Full-stack Software Engineer",
  bio: "I'm a software engineer who believes great code should be invisible — users should only notice the seamless experience it creates. With a background in computer science and a passion for design, I bridge the gap between technical excellence and beautiful interfaces.\n\nMy approach combines clean architecture with thoughtful UX. I've worked across startups and established companies, building everything from real-time data platforms to consumer-facing mobile apps. I care deeply about performance, accessibility, and writing code that other developers enjoy reading.",
  heroTagline: "Crafting digital experiences with purpose.",
  heroSubtitle:
    "Full-stack software engineer with 5+ years building scalable web applications, design systems, and developer tools that make a difference.",
  avatarUrl: null,
  resumeUrl: null,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  yearsExperience: "5+",
  projectsDelivered: "30+",
  openSourceContributions: "15+",
  clientSatisfaction: "99%",
  availableForWork: 1,
};

const defaultProjects = [
  {
    id: 1,
    title: "Analytics Dashboard",
    description:
      "A real-time analytics platform with interactive charts, custom reporting, and team collaboration features. Built for scale with server-side rendering and optimistic UI updates.",
    imageUrl: null,
    liveUrl: "#",
    githubUrl: "#",
    tags: "React, TypeScript, Node.js, PostgreSQL, D3.js",
    featured: 1,
    sortOrder: 1,
  },
  {
    id: 2,
    title: "Curenature Mobile App",
    description:
      "A lifestyle curation app with personalized content feeds, social sharing, and AI-powered recommendations. Designed with a focus on clean typography and intuitive navigation.",
    imageUrl: null,
    liveUrl: "#",
    githubUrl: "#",
    tags: "React Native, Expo, Firebase, TensorFlow Lite",
    featured: 1,
    sortOrder: 2,
  },
  {
    id: 3,
    title: "CodeFlow Engine",
    description:
      "An open-source code visualization tool that transforms complex codebases into interactive flow diagrams. Helps teams understand architecture at a glance.",
    imageUrl: null,
    liveUrl: "#",
    githubUrl: "#",
    tags: "Go, WebAssembly, Canvas API, WebSocket",
    featured: 0,
    sortOrder: 3,
  },
];

const defaultExperiences = [
  {
    id: 1,
    role: "Senior Software Engineer",
    company: "TechVenture Inc.",
    period: "2023 — Present",
    description:
      "Leading the frontend architecture team, building a next-gen design system serving 12 product teams. Reduced bundle size by 40% and improved Core Web Vitals across all products.",
    tags: "React, TypeScript, Design Systems, Performance",
    sortOrder: 1,
  },
  {
    id: 2,
    role: "Full-Stack Developer",
    company: "DataStream Labs",
    period: "2021 — 2023",
    description:
      "Built real-time data visualization tools processing 10M+ events daily. Designed and implemented a microservices architecture that improved system reliability to 99.9% uptime.",
    tags: "Node.js, Go, PostgreSQL, Kubernetes",
    sortOrder: 2,
  },
  {
    id: 3,
    role: "Frontend Engineer",
    company: "CreativeFlow Studio",
    period: "2020 — 2021",
    description:
      "Developed interactive web experiences for major brand campaigns. Pioneered the adoption of modern CSS techniques and animation frameworks within the team.",
    tags: "React, GSAP, Three.js, Figma",
    sortOrder: 3,
  },
  {
    id: 4,
    role: "Junior Developer",
    company: "StartupHub",
    period: "2019 — 2020",
    description:
      "First engineering hire at an early-stage startup. Wore many hats — from building the MVP to setting up CI/CD pipelines and mentoring interns.",
    tags: "Python, Django, React, AWS",
    sortOrder: 4,
  },
];

const defaultSkills = [
  { id: 1, title: "Frontend", icon: "Code2", skills: "React, TypeScript, Next.js, Vue.js, Tailwind CSS", sortOrder: 1 },
  { id: 2, title: "Backend", icon: "Server", skills: "Node.js, Python, Go, REST APIs, GraphQL", sortOrder: 2 },
  { id: 3, title: "Databases", icon: "Database", skills: "PostgreSQL, MongoDB, Redis, Prisma, Drizzle", sortOrder: 3 },
  { id: 4, title: "Cloud & DevOps", icon: "Globe", skills: "AWS, Docker, Kubernetes, CI/CD, Terraform", sortOrder: 4 },
  { id: 5, title: "Mobile", icon: "Smartphone", skills: "React Native, Flutter, iOS, Android, PWA", sortOrder: 5 },
  { id: 6, title: "Design", icon: "Palette", skills: "Figma, Design Systems, Prototyping, UI/UX, A11y", sortOrder: 6 },
  { id: 7, title: "Tools", icon: "Terminal", skills: "Git, Linux, Vim, Webpack, Vite", sortOrder: 7 },
  { id: 8, title: "Architecture", icon: "Layers", skills: "Microservices, Event-Driven, DDD, TDD, Clean Code", sortOrder: 8 },
];

export function usePortfolio() {
  const { data, isLoading, error } = trpc.portfolio.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Use database data if available, otherwise fall back to defaults
  const portfolio: PortfolioData = {
    profile: data?.profile ?? defaultProfile,
    projects: data?.projects && data.projects.length > 0 ? data.projects : defaultProjects,
    experiences: data?.experiences && data.experiences.length > 0 ? data.experiences : defaultExperiences,
    skills: data?.skills && data.skills.length > 0 ? data.skills : defaultSkills,
  };

  return { portfolio, isLoading, error };
}

// Helper to parse comma-separated tags string into array
export function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
