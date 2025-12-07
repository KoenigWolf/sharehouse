-- Migration: Extend residents table with missing columns
-- Run this SQL in your Supabase SQL Editor

-- =====================
-- ADD MISSING COLUMNS TO RESIDENTS
-- =====================

-- Add full_name column
ALTER TABLE residents
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);

-- Add bio column
ALTER TABLE residents
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add move_in_date column
ALTER TABLE residents
  ADD COLUMN IF NOT EXISTS move_in_date DATE;

-- Add move_out_date column
ALTER TABLE residents
  ADD COLUMN IF NOT EXISTS move_out_date DATE;

-- Add role column with constraint
DO $$ BEGIN
  ALTER TABLE residents
    ADD COLUMN role VARCHAR(20) DEFAULT 'resident';

  ALTER TABLE residents
    ADD CONSTRAINT residents_role_check
    CHECK (role IN ('resident', 'accounting_admin', 'admin'));
EXCEPTION
  WHEN duplicate_column THEN null;
  WHEN duplicate_object THEN null;
END $$;

-- =====================
-- INDEXES
-- =====================

CREATE INDEX IF NOT EXISTS idx_residents_role ON residents(role);
CREATE INDEX IF NOT EXISTS idx_residents_move_out_date ON residents(move_out_date);

-- =====================
-- UPDATE RLS POLICIES
-- =====================

-- Drop existing update policy if exists and recreate with more fields
DROP POLICY IF EXISTS "Users can update own resident profile" ON residents;

CREATE POLICY "Users can update own resident profile"
  ON residents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to update any resident
CREATE POLICY "Admins can update any resident"
  ON residents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents r
      WHERE r.user_id = auth.uid() AND r.role = 'admin'
    )
  );

-- Allow admins to insert residents (for invitations)
DROP POLICY IF EXISTS "Admins can insert residents" ON residents;

CREATE POLICY "Admins can insert residents"
  ON residents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM residents r
      WHERE r.user_id = auth.uid() AND r.role = 'admin'
    )
    OR auth.uid() = user_id
  );
