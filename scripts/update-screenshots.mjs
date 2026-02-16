import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const imageUpdates = [
  { title: 'CAD Studio', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/zftzsPcqNeuvCVLr.png' },
  { title: 'GentlyPure', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/QhGBmlanZzfZdDVb.png' },
  { title: 'Mini Arcade Games', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/jeNcaBgToERkmgJl.png' },
  { title: 'Resume Forge', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/KnNKMVjROyNjIHmz.png' },
  { title: 'Skintilla Beauty', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/xlvUbUYNLydodTyi.png' },
  { title: 'Multi-Gyn PH', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/aSCXXHBKMtNVasOq.png' },
  { title: 'SkyPulse Weather', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/SZDpcETFoWXGyWGl.png' },
  { title: 'Portfolio 2024', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/zojURhiNikySzogo.png' },
  { title: 'OrderTaker', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/apJWvgLshoyVcRTQ.png' },
  { title: 'Make It Happen Productions', image_url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/lEUgzxoVzUDffhgE.png' },
];

async function main() {
  console.log('Updating project screenshots...');
  
  for (const update of imageUpdates) {
    const { error } = await supabase
      .from('projects')
      .update({ image_url: update.image_url })
      .eq('title', update.title);
    
    if (error) {
      console.log(`  ✗ ${update.title}: ${error.message}`);
    } else {
      console.log(`  ✓ ${update.title} screenshot updated`);
    }
  }

  // Verify all projects have images
  console.log('\nProject image status:');
  const { data } = await supabase
    .from('projects')
    .select('title, image_url')
    .order('sort_order');
  
  data?.forEach(p => {
    const hasImage = p.image_url ? '✓' : '✗';
    console.log(`  ${hasImage} ${p.title}`);
  });

  console.log('\nDone!');
}

main();
