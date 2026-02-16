import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const avatarUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/dAqRedAXvhcjcpRP.png';

const projectImages = [
  { title: 'OrderTaker', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/uVGrlDXbYaoGJNdI.png' },
  { title: 'CakePortfolio', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/PhlulbzMXCaGxcOA.png' },
  { title: 'Bowling 300 PH', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/uZpEhbjkbIOkuhHV.png' },
  { title: 'GPD Advisors', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/TNuLqtlcebqjBmQd.png' },
  { title: 'Vectron Trade', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/gdiXkyZrNqhgypPN.png' },
  { title: 'Tondo Supply', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/dLAJsbCtcMSQBhLB.png' },
  { title: 'Project Re-Earth', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/cIWzwzMaDULHUadC.png' },
  { title: 'MIH Production', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/UeamxLEngLsMjrJN.png' },
  { title: 'Mirai Asian Trading', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/LlTtlhRUohtRbOvv.png' },
  { title: 'Simply Foods Corporation', imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663343684150/UQYJyvjnkDVQTQzu.png' },
];

async function main() {
  // Update profile avatar
  console.log('Updating profile avatar...');
  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .update({ avatar_url: avatarUrl })
    .eq('id', 1);
  
  if (profileError) {
    console.error('Profile update error:', profileError);
  } else {
    console.log('✓ Profile avatar updated');
  }

  // Update each project's image
  for (const project of projectImages) {
    console.log(`Updating ${project.title}...`);
    const { data, error } = await supabase
      .from('projects')
      .update({ image_url: project.imageUrl })
      .eq('title', project.title);
    
    if (error) {
      console.error(`  ✗ Error updating ${project.title}:`, error);
    } else {
      console.log(`  ✓ ${project.title} image updated`);
    }
  }

  console.log('\nDone!');
}

main();
