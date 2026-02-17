# Product Guidelines

## Brand Voice & Tone

The portfolio template communicates with a **professional, warm, and approachable** tone. It should feel like a confident engineer presenting their work — not a corporate brochure and not a casual blog.

| Attribute | Do | Don't |
|---|---|---|
| Professional | Use clear, concise language | Use jargon or buzzwords |
| Warm | Use friendly, inviting phrasing | Sound cold or robotic |
| Confident | State accomplishments directly | Oversell or use superlatives |
| Approachable | Invite connection and conversation | Create barriers or formality |

## Terminology & Glossary

| Term | Definition | Usage |
|---|---|---|
| Portfolio | The public-facing website showcasing work | "View my portfolio" |
| Admin Panel | The protected `/admin` route for content management | "Manage content in the admin panel" |
| Section | A distinct content area on the homepage (Hero, About, Skills, etc.) | "Toggle section visibility" |
| Theme Settings | Visual customization options (font, color, layout) | "Customize your theme" |
| Tile Size | Project card display size (small, medium, large) | "Set tile size to large" |
| Featured | A project marked for prominent display | "Mark as featured" |

## Error Message Conventions

Error messages should be:

1. **Specific**: Tell the user what went wrong ("Invalid email format" not "Validation error")
2. **Actionable**: Suggest how to fix it ("Must be a valid HTTP(S) URL")
3. **Non-technical**: Avoid exposing internal details (no stack traces, no database errors)
4. **Consistent**: Use the same tone and structure across all messages

### Standard Error Patterns

```
Input errors:    "Must be a valid [type] (e.g., [example])"
Auth errors:     "Please login to continue"
Permission:      "You do not have required permission"
Not found:       "[Resource] not found"
Server errors:   "Something went wrong. Please try again."
```

## User-Facing Copy Standards

- Use sentence case for headings (not Title Case) in UI labels
- Use Title Case for section headers on the portfolio
- Button labels should be action verbs: "Save Changes", "Delete Project", "Apply to All"
- Toast messages should confirm the action: "Profile updated successfully", "Project deleted"
- Placeholder text should be helpful: "e.g., https://github.com/username/repo"

## Documentation Style

- Use Markdown for all documentation files
- Use tables for structured comparisons
- Use code blocks with language hints for technical examples
- Keep paragraphs focused — one idea per paragraph
- Link to related documents rather than duplicating content
