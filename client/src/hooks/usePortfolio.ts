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
    tileSize?: string;
    displayMode?: string;
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

// Default fallback data — only used when the API has responded but the database is empty.
// These are NOT shown during loading to prevent flash-of-default-content.
const defaultProfile = {
  fullName: "Your Name",
  title: "Your Title",
  bio: "Update your profile in the admin dashboard to replace this placeholder text.",
  heroTagline: "Welcome to my portfolio.",
  heroSubtitle: "Update your profile in the admin dashboard to add your own tagline.",
  avatarUrl: null,
  resumeUrl: null,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: null,
  email: "your@email.com",
  phone: null,
  location: "Your Location",
  yearsExperience: "0+",
  projectsDelivered: "0+",
  openSourceContributions: "0+",
  clientSatisfaction: "100%",
  availableForWork: 1,
};

const defaultProjects = [
  {
    id: 1,
    title: "Sample Project",
    description: "Add your projects through the admin dashboard.",
    imageUrl: null,
    liveUrl: "#",
    githubUrl: "#",
    tags: "Add, Your, Technologies",
    featured: 1,
    sortOrder: 1,
  },
];

const defaultExperiences = [
  {
    id: 1,
    role: "Your Role",
    company: "Your Company",
    period: "20XX — Present",
    description: "Add your work experience through the admin dashboard.",
    tags: "Add, Your, Skills",
    sortOrder: 1,
  },
];

const defaultSkills = [
  { id: 1, title: "Your Skills", icon: "Code2", skills: "Add your skills in the admin dashboard", sortOrder: 1 },
];

export function usePortfolio() {
  const { data, isLoading, error } = trpc.portfolio.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // While loading, return null portfolio to signal loading state.
  // This prevents showing "Alex Chen" defaults before real data arrives.
  if (isLoading) {
    return { portfolio: null, isLoading: true, error };
  }

  // After loading, use database data if available, otherwise fall back to generic defaults
  const portfolio: PortfolioData = {
    profile: data?.profile ?? defaultProfile,
    projects: data?.projects && data.projects.length > 0 ? data.projects : defaultProjects,
    experiences: data?.experiences && data.experiences.length > 0 ? data.experiences : defaultExperiences,
    skills: data?.skills && data.skills.length > 0 ? data.skills : defaultSkills,
  };

  return { portfolio, isLoading: false, error };
}

// Helper to parse comma-separated tags string into array
export function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
