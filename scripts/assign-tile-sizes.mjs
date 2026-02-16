import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Tile size assignments for a visually dynamic grid:
// - large (2x2): Hero featured projects that deserve maximum attention
// - wide (2x1): Featured projects with strong visual presence
// - medium (1x1 stacked): Standard cards with image + text
// - small (1x1 overlay): Compact cards with text overlay on image

const assignments = [
  // Featured projects - give them prominence
  { id: 1,  title: 'OrderTaker',              tile_size: 'large' },   // Hero featured - iOS app
  { id: 11, title: 'CAD Studio',              tile_size: 'wide' },    // Featured - impressive web CAD
  { id: 2,  title: 'CakePortfolio',           tile_size: 'wide' },    // Featured - bakery portfolio
  { id: 14, title: 'Resume Forge',            tile_size: 'large' },   // Featured - AI resume builder
  { id: 7,  title: 'Project Re-Earth',        tile_size: 'wide' },    // Featured - game project

  // Non-featured - mix of small and medium for variety
  { id: 3,  title: 'Bowling 300 PH',          tile_size: 'medium' },
  { id: 4,  title: 'GPD Advisors',            tile_size: 'small' },
  { id: 5,  title: 'Vectron Trade Corporation', tile_size: 'medium' },
  { id: 6,  title: 'Tondo Supply',            tile_size: 'small' },
  { id: 8,  title: 'Make It Happen Productions', tile_size: 'small' },
  { id: 9,  title: 'Mirai Asian Trading',     tile_size: 'medium' },
  { id: 10, title: 'Simply Foods Corporation', tile_size: 'small' },
  { id: 12, title: 'GentlyPure',              tile_size: 'medium' },
  { id: 13, title: 'Mini Arcade Games',       tile_size: 'small' },
  { id: 15, title: 'Skintilla Beauty',        tile_size: 'medium' },
  { id: 16, title: 'Multi-Gyn PH',            tile_size: 'small' },
  { id: 17, title: 'SkyPulse Weather',        tile_size: 'medium' },
  { id: 18, title: 'Portfolio 2024',           tile_size: 'small' },
];

console.log('Assigning tile sizes...\n');

for (const a of assignments) {
  const { error } = await sb
    .from('projects')
    .update({ tile_size: a.tile_size })
    .eq('id', a.id);

  if (error) {
    console.log(`  ❌ ${a.title}: ${error.message}`);
  } else {
    const sizeLabel = {
      large: '⬛ LARGE (2x2)',
      wide: '▬ WIDE (2x1)',
      medium: '◼ MEDIUM (1x1)',
      small: '◻ SMALL (1x1)',
    };
    console.log(`  ✅ ${a.title}: ${sizeLabel[a.tile_size]}`);
  }
}

// Verify
console.log('\n--- Final Layout ---\n');
const { data } = await sb
  .from('projects')
  .select('id, title, tile_size, featured')
  .order('sort_order', { ascending: true });

for (const p of data) {
  const badge = p.featured ? '⭐' : '  ';
  console.log(`${badge} [${p.tile_size.padEnd(6)}] ${p.title}`);
}

console.log('\nDone!');
