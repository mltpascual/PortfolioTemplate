import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProfile() {
  const { data: existing } = await supabase.from("profile").select("id").limit(1);
  
  const profileData = {
    full_name: "Miguel Pascual",
    title: "Full Stack Web Developer",
    email: "miguelpascual.life@gmail.com",
    bio: "I'm a full stack web developer with experience at Meta and ING Bank, passionate about building scalable web applications and leveraging AI to create impactful solutions. With a background in PEGA engineering, data analysis, and web development, I bridge the gap between technical excellence and real-world business outcomes.\n\nMy approach combines clean architecture with thoughtful UX. From automating 200+ regression tests at ING Bank to enhancing LLaMA AI performance at Meta, I care deeply about quality, performance, and writing code that makes a difference.",
    hero_tagline: "Building digital solutions that drive results.",
    hero_subtitle: "Full stack web developer with experience at Meta and ING Bank. Specializing in scalable web applications, AI-powered solutions, and automation that makes a difference.",
    github_url: "https://github.com/mltpascual",
    linkedin_url: "https://www.linkedin.com/in/mltpascual",
    twitter_url: null,
    phone: null,
    location: "Canada",
    available_for_work: 1,
    years_experience: "6+",
    projects_delivered: "15+",
    open_source_contributions: "5+",
    client_satisfaction: "100%",
    avatar_url: null,
  };

  if (existing && existing.length > 0) {
    const { error } = await supabase.from("profile").update(profileData).eq("id", existing[0].id);
    if (error) console.error("Profile update error:", error);
    else console.log("Profile updated successfully");
  } else {
    const { error } = await supabase.from("profile").insert(profileData);
    if (error) console.error("Profile insert error:", error);
    else console.log("Profile inserted successfully");
  }
}

async function updateExperiences() {
  await supabase.from("experiences").delete().neq("id", 0);

  const experiences = [
    {
      company: "Meta",
      role: "Data Analyst (Contract via Tundra)",
      period: "Sept 2025 — Present",
      description: "Led end-to-end labeling and audit workstreams that improved annotation accuracy by ~15%. Enhanced LLaMA and Business Messaging AI performance by designing evaluation rubrics and validating datasets. Resolved cross-team operational blockers, reducing turnaround times by ~30%.",
      tags: "AI/ML,Data Analysis,LLaMA,Quality Operations",
      sort_order: 1,
    },
    {
      company: "ING Bank",
      role: "PEGA Engineer",
      period: "Oct 2021 — Nov 2023",
      description: "Designed and implemented a custom PEGA DX API application, reducing response time by 90%. Automated 200+ regression tests using Playwright and Selenium, reducing production defects by 35%. Managed deployments across dev, staging, and production using Microsoft Azure.",
      tags: "PEGA,Playwright,Selenium,Azure,API Development",
      sort_order: 2,
    },
    {
      company: "Freelance",
      role: "Web Developer",
      period: "Sept 2018 — Nov 2023",
      description: "Developed 15+ custom websites using WordPress and Shopify, driving an average 30% boost in customer engagement. Implemented SEO strategies and integrated C# .NET backends with SQL Server, resulting in 25% increase in online sales for e-commerce clients.",
      tags: "WordPress,Shopify,SEO,C#,.NET,SQL Server",
      sort_order: 3,
    },
    {
      company: "Foods On The Go Corporation",
      role: "Operations Manager (Consultant)",
      period: "Aug 2020 — May 2021",
      description: "Negotiated supplier deals, improving raw material acquisition and lowering costs. Streamlined day-to-day operations and improved team coordination for more efficiency.",
      tags: "Operations,Management,Consulting",
      sort_order: 4,
    },
    {
      company: "Make It Happen Multimedia Production",
      role: "Web Developer (Intern)",
      period: "Nov 2019 — Aug 2020",
      description: "Designed a booking inquiry website that boosted client engagement by 30%. Enhanced social media presence, increasing engagement by around 30%.",
      tags: "WordPress,Web Development,Social Media",
      sort_order: 5,
    },
    {
      company: "Life Enrichment Inc.",
      role: "IT Consultant",
      period: "Nov 2018 — Nov 2019",
      description: "Developed a client booking website, resulting in 25% more appointments. Migrated records to a digital system, automating data management.",
      tags: "Web Development,IT Consulting,Data Migration",
      sort_order: 6,
    },
  ];

  const { error } = await supabase.from("experiences").insert(experiences);
  if (error) console.error("Experiences insert error:", error);
  else console.log(`${experiences.length} experiences inserted successfully`);
}

async function updateProjects() {
  await supabase.from("projects").delete().neq("id", 0);

  const projects = [
    {
      title: "OrderTaker",
      description: "A comprehensive iOS application designed for bakery businesses to manage orders, track inventory, and analyze sales. Built with SwiftUI and Firebase for a seamless order processing experience.",
      tags: "SwiftUI,Firebase,iOS",
      github_url: "https://github.com/mltpascual/OrderTaker-IOS",
      live_url: null,
      image_url: null,
      featured: 1,
      sort_order: 1,
    },
    {
      title: "CakePortfolio",
      description: "A modern, responsive portfolio website showcasing custom cakes, desserts, and confections. Built with Next.js 16, React 19, and Tailwind CSS.",
      tags: "Next.js,React,Tailwind CSS",
      github_url: "https://github.com/mltpascual/CakePortfolio",
      live_url: null,
      image_url: null,
      featured: 1,
      sort_order: 2,
    },
    {
      title: "Bowling 300 PH",
      description: "Bowling 300 offers top-notch bowling experiences, equipment, and services in the Philippines. Elevate your game with the best in bowling.",
      tags: "WordPress,SEO",
      github_url: null,
      live_url: "https://bowling300.ph/",
      image_url: null,
      featured: 0,
      sort_order: 3,
    },
    {
      title: "GPD Advisors",
      description: "Expert guidance in insurance and financial planning, helping clients achieve their goals with tailored solutions and personalized service.",
      tags: "WordPress,SEO,Calendly",
      github_url: null,
      live_url: "https://gpdadvisors.com/",
      image_url: null,
      featured: 0,
      sort_order: 4,
    },
    {
      title: "Vectron Trade Corporation",
      description: "Innovative trading solutions and services, empowering clients to succeed in the global market.",
      tags: "WordPress,SEO",
      github_url: null,
      live_url: "https://www.vectrontrade.com/",
      image_url: null,
      featured: 0,
      sort_order: 5,
    },
    {
      title: "Tondo Supply",
      description: "High-quality, sustainable clothing and accessories. Eco-friendly fashion that combines style and responsibility.",
      tags: "Shopify,SEO",
      github_url: null,
      live_url: "https://tondosupply.com/",
      image_url: null,
      featured: 0,
      sort_order: 6,
    },
    {
      title: "Project Re-Earth",
      description: "A 2D world-building simulation game focused on environmental restoration. Players rebuild and manage a polluted planet, balancing growth with sustainability.",
      tags: "Unity3D,C#,Google Weather API",
      github_url: null,
      live_url: "https://apkpure.com/project-re-earth/com.ProjectReEarth.ProjectReEarth",
      image_url: null,
      featured: 1,
      sort_order: 7,
    },
    {
      title: "Make It Happen Productions",
      description: "A multimedia company delivering creative services in video production, branding, social media content, and TV commercials.",
      tags: "WordPress,SEO",
      github_url: null,
      live_url: "https://mihproduction.com/",
      image_url: null,
      featured: 0,
      sort_order: 8,
    },
    {
      title: "Mirai Asian Trading",
      description: "A reliable gold trading company specializing in the purchase and sale of gold bars, coins, and jewelry.",
      tags: "WordPress,SEO",
      github_url: null,
      live_url: "https://miraiasiantrading.com/",
      image_url: null,
      featured: 0,
      sort_order: 9,
    },
    {
      title: "Simply Foods Corporation",
      description: "Simply Foods offers a popular line of vinegar products, highlighting Filipino tradition and quality.",
      tags: "WordPress,SEO",
      github_url: null,
      live_url: "https://simplyfoodscorporation.com/",
      image_url: null,
      featured: 0,
      sort_order: 10,
    },
  ];

  const { error } = await supabase.from("projects").insert(projects);
  if (error) console.error("Projects insert error:", error);
  else console.log(`${projects.length} projects inserted successfully`);
}

async function updateSkills() {
  await supabase.from("skill_categories").delete().neq("id", 0);

  const skills = [
    {
      title: "Platform & App Development",
      icon: "Layers",
      skills: "PEGA,API Development,Postman,Swagger",
      sort_order: 1,
    },
    {
      title: "Programming Languages",
      icon: "Code2",
      skills: "C#,C++,Java,Python,TypeScript",
      sort_order: 2,
    },
    {
      title: "Web & Game Development",
      icon: "Globe",
      skills: "Node.js,JavaScript,WordPress,SEO,Shopify,Unity3D",
      sort_order: 3,
    },
    {
      title: "Automation & Testing",
      icon: "Zap",
      skills: "Playwright,Selenium,Regression Testing",
      sort_order: 4,
    },
    {
      title: "Data & Visualization",
      icon: "Database",
      skills: "MySQL,Oracle,Kibana,Grafana,Elastic Search",
      sort_order: 5,
    },
    {
      title: "Project Management & DevOps",
      icon: "Terminal",
      skills: "Jira,Microsoft Project,ServiceNow,Git,Subversion",
      sort_order: 6,
    },
  ];

  const { error } = await supabase.from("skill_categories").insert(skills);
  if (error) console.error("Skills insert error:", error);
  else console.log(`${skills.length} skill categories inserted successfully`);
}

async function main() {
  console.log("Updating portfolio data in Supabase...\n");
  await updateProfile();
  await updateExperiences();
  await updateProjects();
  await updateSkills();
  console.log("\nDone!");
}

main().catch(console.error);
