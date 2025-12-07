-- Run all seed files in order
-- Execute this file to insert all seed data

-- Note: In Supabase SQL Editor, you may need to run each file separately
-- or copy the contents of each file below in order.

-- Order of execution:
-- 1. 001_events.sql
-- 2. 002_meeting_notes.sql
-- 3. 003_house_rules.sql
-- 4. 004_accounting_entries.sql

-- To run from command line with psql:
-- psql $DATABASE_URL -f supabase/seed/001_events.sql
-- psql $DATABASE_URL -f supabase/seed/002_meeting_notes.sql
-- psql $DATABASE_URL -f supabase/seed/003_house_rules.sql
-- psql $DATABASE_URL -f supabase/seed/004_accounting_entries.sql
