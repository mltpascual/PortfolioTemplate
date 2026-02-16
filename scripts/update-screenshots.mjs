import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Map of project IDs to their new screenshot CDN URLs and correct live URLs
const updates = [
  {
    id: 11, // CAD Studio
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/TVbhfqiEHFVrCuVb.webp',
    live_url: 'https://cadclone.vercel.app',
  },
  {
    id: 12, // GentlyPure
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/jiyfDEmooYOQhfUv.jpeg',
    live_url: 'https://gentlypure.vercel.app',
  },
  {
    id: 13, // Mini Arcade Games
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/rgRssjzqEBsdTXRV.png',
    live_url: 'https://arcgames.vercel.app',
  },
  {
    id: 14, // Resume Forge
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/ZdflRFKhlwrZNDtK.webp',
    live_url: 'https://resumeforgee.vercel.app',
  },
  {
    id: 15, // Skintilla Beauty
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/DKiBwwkPEEsrtSPK.png',
    live_url: 'https://skintilla.vercel.app',
  },
  {
    id: 9, // Mirai Asian Trading
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/VuDKEpfXDPDGroea.webp',
    live_url: 'https://miraiasiantrading.vercel.app',
  },
  {
    id: 16, // Multi-Gyn PH
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/puxjIlMvrQjKneQd.png',
    live_url: 'https://multigynph.vercel.app',
  },
  {
    id: 8, // Make It Happen Productions
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/iLSTNhEvyvkLHxJe.png',
    live_url: 'https://makeithappenprod.vercel.app',
  },
  {
    id: 18, // Portfolio 2024
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/LSiyRvuhinFnlhLQ.webp',
    live_url: 'https://mltpascual.vercel.app',
  },
  {
    id: 17, // SkyPulse Weather
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/IeIcOCdzvPkhCbfC.jpeg',
    live_url: 'https://skypulseweather.vercel.app',
  },
  {
    id: 2, // CakePortfolio
    image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/GdSXmCcMriqTUbKj.webp',
    live_url: 'https://pbla.vercel.app',
  },
];

async function main() {
  console.log('Updating project screenshots and URLs...');
  let success = 0;
  let failed = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from('projects')
      .update({ image_url: update.image_url, live_url: update.live_url })
      .eq('id', update.id);

    if (error) {
      console.log(`  ✗ Project ${update.id}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓ Project ${update.id} updated`);
      success++;
    }
  }

  // Verify all projects
  console.log('\nProject status after update:');
  const { data } = await supabase
    .from('projects')
    .select('id, title, live_url, image_url')
    .order('sort_order');

  data?.forEach(p => {
    const hasImage = p.image_url ? '✓' : '✗';
    console.log(`  ${hasImage} ${p.title} → ${p.live_url}`);
  });

  console.log(`\nDone: ${success} updated, ${failed} failed`);
}

main();
