import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const resumeUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/xuLHHKNesgcMqTAw.pdf';

// Update existing project live URLs
const existingProjectUpdates = [
  { title: 'OrderTaker', liveUrl: 'https://ordertaker.vercel.app' },
  { title: 'CakePortfolio', liveUrl: 'https://pbla.vercel.app' },
  { title: 'Tondo Supply', liveUrl: 'https://tondosupply.vercel.app' },
  { title: 'MIH Production', liveUrl: 'https://makeithappenprod.vercel.app' },
  { title: 'Mirai Asian Trading', liveUrl: 'https://miraiasiantrading.vercel.app' },
];

// New projects to add
const newProjects = [
  {
    title: 'CAD Studio',
    description: 'A web-based CAD application with selection window highlight and entity grip editing capabilities. Built as a browser-based alternative to desktop CAD software.',
    tags: ['TypeScript', 'React', 'Canvas API', 'WebGL'],
    live_url: 'https://cadclone.vercel.app',
    github_url: 'https://github.com/mltpascual/CADStudio',
    featured: true,
    sort_order: 1,
  },
  {
    title: 'GentlyPure',
    description: 'A clean, modern e-commerce website for a skincare and beauty brand. Features product catalog, responsive design, and elegant UI.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    live_url: 'https://gentlypure.vercel.app',
    github_url: 'https://github.com/mltpascual/GentlyPure',
    featured: false,
    sort_order: 11,
  },
  {
    title: 'Mini Arcade Games',
    description: 'A collection of classic arcade games built for the web. Features multiple game modes and retro-styled graphics.',
    tags: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Game Development'],
    live_url: 'https://arcgames.vercel.app',
    github_url: 'https://github.com/mltpascual/MiniArcadeGames',
    featured: false,
    sort_order: 12,
  },
  {
    title: 'Resume Forge',
    description: 'An AI-powered resume builder that helps users create professional resumes with customizable templates and smart content suggestions.',
    tags: ['React', 'TypeScript', 'AI/LLM', 'PDF Generation'],
    live_url: 'https://resumeforgee.vercel.app',
    github_url: 'https://github.com/mltpascual/ResumeForge',
    featured: true,
    sort_order: 2,
  },
  {
    title: 'Skintilla Beauty',
    description: 'A premium beauty and skincare e-commerce platform with elegant product showcases and seamless shopping experience.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'E-commerce'],
    live_url: 'https://skintilla.vercel.app',
    github_url: 'https://github.com/mltpascual/SkintillaBeauty',
    featured: false,
    sort_order: 13,
  },
  {
    title: 'Multi-Gyn PH',
    description: 'A healthcare product website for Multi-Gyn Philippines. Features product information, professional medical content, and responsive design.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Healthcare'],
    live_url: 'https://multigynph.vercel.app',
    github_url: 'https://github.com/mltpascual/MultiGynPH',
    featured: false,
    sort_order: 14,
  },
  {
    title: 'SkyPulse Weather',
    description: 'A beautiful weather application with real-time forecasts, interactive maps, and detailed weather data visualization.',
    tags: ['React', 'TypeScript', 'Weather API', 'Data Visualization'],
    live_url: 'https://skypulseweather.vercel.app',
    github_url: 'https://github.com/mltpascual/SkyPulseWeather',
    featured: false,
    sort_order: 15,
  },
  {
    title: 'Portfolio 2024',
    description: 'Previous iteration of my personal portfolio website. Features project showcases, career timeline, and skills overview with light/dark mode.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    live_url: 'https://mltpascual.vercel.app',
    github_url: 'https://github.com/mltpascual/Portfolio2024',
    featured: false,
    sort_order: 16,
  },
];

async function main() {
  // 1. Add resume_url to profile
  console.log('Updating profile with resume URL...');
  const { error: profileError } = await supabase
    .from('profile')
    .update({ resume_url: resumeUrl })
    .eq('id', 1);
  
  if (profileError) {
    console.log('  Note: resume_url column may not exist yet, will add via SQL:', profileError.message);
  } else {
    console.log('  ✓ Profile resume URL updated');
  }

  // 2. Update existing project live URLs
  console.log('\nUpdating existing project URLs...');
  for (const proj of existingProjectUpdates) {
    const { error } = await supabase
      .from('projects')
      .update({ live_url: proj.liveUrl })
      .eq('title', proj.title);
    
    if (error) {
      console.log(`  ✗ ${proj.title}: ${error.message}`);
    } else {
      console.log(`  ✓ ${proj.title} URL updated`);
    }
  }

  // 3. Add new projects
  console.log('\nAdding new projects...');
  for (const proj of newProjects) {
    // Check if project already exists
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('title', proj.title)
      .maybeSingle();
    
    if (existing) {
      console.log(`  ⊘ ${proj.title} already exists, updating...`);
      const { error } = await supabase
        .from('projects')
        .update(proj)
        .eq('title', proj.title);
      if (error) console.log(`    ✗ Error: ${error.message}`);
      else console.log(`    ✓ Updated`);
    } else {
      const { error } = await supabase
        .from('projects')
        .insert(proj);
      if (error) {
        console.log(`  ✗ ${proj.title}: ${error.message}`);
      } else {
        console.log(`  ✓ ${proj.title} added`);
      }
    }
  }

  // 4. List all projects to verify
  console.log('\nAll projects:');
  const { data: allProjects } = await supabase
    .from('projects')
    .select('id, title, live_url, featured, sort_order')
    .order('sort_order');
  
  allProjects?.forEach(p => {
    console.log(`  [${p.sort_order}] ${p.title} (${p.featured ? 'FEATURED' : 'regular'}) - ${p.live_url || 'no URL'}`);
  });

  console.log('\nDone!');
}

main();
