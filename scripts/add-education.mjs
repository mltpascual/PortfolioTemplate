import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const entries = [
  {
    user_id: 1,
    institution: "Red River College Polytechnic",
    degree: "Advanced Diploma",
    field_of_study: "Technology Management",
    start_year: 2024,
    end_year: 2024,
    description: "GPA (3.92). Jan 2024 - Aug 2024.",
    sort_order: 1,
  },
  {
    user_id: 1,
    institution: "Adamson University",
    degree: "Bachelor of Science",
    field_of_study: "Information Technology",
    start_year: 2016,
    end_year: 2020,
    description: "Candidate for Best Capstone Mobile Game: Project Re:Earth. June 2016 - May 2020.",
    sort_order: 2,
  },
];

for (const entry of entries) {
  const { data, error } = await sb.from("education").insert(entry).select().single();
  if (error) {
    console.error(`Failed to add ${entry.institution}:`, error.message);
  } else {
    console.log(`Added: ${data.institution} - ${data.degree} in ${data.field_of_study}`);
  }
}
