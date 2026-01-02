-- Meeting Notes: Open access for all users
-- This migration changes the RLS policies to allow anyone to create and update meeting notes

-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Only admins can insert meeting notes" ON meeting_notes;
DROP POLICY IF EXISTS "Only admins can update meeting notes" ON meeting_notes;

-- Create new open access policies
CREATE POLICY "Anyone can insert meeting notes" ON meeting_notes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update meeting notes" ON meeting_notes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
