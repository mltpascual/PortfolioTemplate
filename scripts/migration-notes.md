# Migration: Layout Settings Columns

**Date:** 2026-02-16
**Status:** Success

Added to `theme_settings` table:
- `layout_mode` TEXT NOT NULL DEFAULT 'separate' 
- `section_order` TEXT NOT NULL DEFAULT 'hero,about,projects,skills,experience,education,contact'

Executed via Supabase SQL Editor.
