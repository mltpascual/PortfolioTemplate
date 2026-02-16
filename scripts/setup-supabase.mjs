/**
 * Create portfolio tables in Supabase using the REST API.
 * Since Supabase doesn't allow DDL via the client SDK,
 * we'll use a workaround: create a PostgreSQL function first,
 * then call it via RPC.
 * 
 * Actually, the simplest approach is to use the Supabase Management API
 * or connect directly via pg. Let's use pg.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We'll create tables by using individual insert operations
// First check if tables exist, if not we need to create them via SQL editor
// But we can try a different approach - use the Supabase SQL API

async function checkAndSeedTables() {
  console.log("Checking Supabase tables...\n");

  // Check each table
  const tables = [
    { name: "profile", exists: false },
    { name: "projects", exists: false },
    { name: "experiences", exists: false },
    { name: "skill_categories", exists: false },
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table.name).select("id").limit(1);
    if (error) {
      console.log(`❌ Table '${table.name}' does not exist: ${error.message}`);
    } else {
      table.exists = true;
      console.log(`✅ Table '${table.name}' exists (${data.length} rows)`);
    }
  }

  const allExist = tables.every(t => t.exists);
  
  if (!allExist) {
    console.log("\n⚠️  Some tables are missing. Please create them in Supabase SQL Editor.");
    console.log("Copy and paste the contents of scripts/supabase-schema.sql into:");
    console.log(`${supabaseUrl.replace('.supabase.co', '')}/project/default/sql/new`);
    console.log("\nOr go to: Supabase Dashboard → SQL Editor → New Query");
    return false;
  }

  // Seed default profile if empty
  const { data: profileData } = await supabase.from("profile").select("*").limit(1);
  if (profileData && profileData.length === 0) {
    console.log("\nSeeding default profile...");
    const { error: seedError } = await supabase.from("profile").insert({
      full_name: "Alex Chen",
      title: "Full-stack Software Engineer",
      hero_tagline: "Crafting digital experiences with purpose.",
      hero_subtitle: "Full-stack software engineer with 5+ years building scalable web applications, design systems, and developer tools that make a difference.",
      email: "alex@example.com",
      location: "San Francisco, CA",
      years_experience: "5+",
      projects_delivered: "30+",
      open_source_contributions: "15+",
      client_satisfaction: "99%",
      available_for_work: true,
    });
    if (seedError) {
      console.log(`  Error seeding profile: ${seedError.message}`);
    } else {
      console.log("  ✅ Default profile created");
    }
  }

  console.log("\n✅ All tables are ready!");
  return true;
}

checkAndSeedTables().catch(console.error);
