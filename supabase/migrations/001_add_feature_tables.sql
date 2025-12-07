-- Migration: Add feature tables for Events, Meetings, House Rules, and Accounting
-- Run this SQL in your Supabase SQL Editor

-- =====================
-- PREREQUISITE: Add role column to residents table
-- This must be done first because RLS policies reference it
-- =====================

-- Add role column if not exists
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

-- Create index for role
CREATE INDEX IF NOT EXISTS idx_residents_role ON residents(role);

-- =====================
-- EVENTS TABLE
-- =====================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(200),
  description TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Anyone can view events (public data)
DROP POLICY IF EXISTS "Anyone can view events" ON events;
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

-- Only admins can insert/update/delete events
DROP POLICY IF EXISTS "Admins can insert events" ON events;
CREATE POLICY "Admins can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update events" ON events;
CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete events" ON events;
CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Index for events
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- MEETING NOTES TABLE
-- =====================

CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  summary TEXT,
  decisions TEXT[] DEFAULT '{}',
  action_items TEXT[] DEFAULT '{}',
  attendees TEXT[] DEFAULT '{}',
  content TEXT,
  doc_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for meeting_notes
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;

-- Anyone can view meeting notes (public data)
DROP POLICY IF EXISTS "Anyone can view meeting notes" ON meeting_notes;
CREATE POLICY "Anyone can view meeting notes"
  ON meeting_notes FOR SELECT
  USING (true);

-- Only admins can manage meeting notes
DROP POLICY IF EXISTS "Admins can insert meeting notes" ON meeting_notes;
CREATE POLICY "Admins can insert meeting notes"
  ON meeting_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update meeting notes" ON meeting_notes;
CREATE POLICY "Admins can update meeting notes"
  ON meeting_notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete meeting notes" ON meeting_notes;
CREATE POLICY "Admins can delete meeting notes"
  ON meeting_notes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Index for meeting_notes
CREATE INDEX IF NOT EXISTS idx_meeting_notes_date ON meeting_notes(date DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_meeting_notes_updated_at ON meeting_notes;
CREATE TRIGGER update_meeting_notes_updated_at
  BEFORE UPDATE ON meeting_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- HOUSE RULES TABLE
-- =====================

-- Create category enum type
DO $$ BEGIN
  CREATE TYPE house_rule_category AS ENUM ('living', 'cleaning', 'noise', 'safety', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS house_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category house_rule_category NOT NULL DEFAULT 'other',
  details TEXT,
  effective_from DATE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for house_rules
ALTER TABLE house_rules ENABLE ROW LEVEL SECURITY;

-- Anyone can view house rules (public data)
DROP POLICY IF EXISTS "Anyone can view house rules" ON house_rules;
CREATE POLICY "Anyone can view house rules"
  ON house_rules FOR SELECT
  USING (true);

-- Only admins can manage house rules
DROP POLICY IF EXISTS "Admins can insert house rules" ON house_rules;
CREATE POLICY "Admins can insert house rules"
  ON house_rules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update house rules" ON house_rules;
CREATE POLICY "Admins can update house rules"
  ON house_rules FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete house rules" ON house_rules;
CREATE POLICY "Admins can delete house rules"
  ON house_rules FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Indexes for house_rules
CREATE INDEX IF NOT EXISTS idx_house_rules_category ON house_rules(category);
CREATE INDEX IF NOT EXISTS idx_house_rules_sort ON house_rules(sort_order);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_house_rules_updated_at ON house_rules;
CREATE TRIGGER update_house_rules_updated_at
  BEFORE UPDATE ON house_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ACCOUNTING ENTRIES TABLE
-- =====================

-- Create enum types
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('paypay', 'cash', 'bank');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE entry_type AS ENUM ('income', 'expense');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS accounting_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  method payment_method NOT NULL,
  type entry_type NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount INT NOT NULL CHECK (amount > 0),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for accounting_entries
ALTER TABLE accounting_entries ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view accounting entries
DROP POLICY IF EXISTS "Authenticated users can view accounting" ON accounting_entries;
CREATE POLICY "Authenticated users can view accounting"
  ON accounting_entries FOR SELECT
  TO authenticated
  USING (true);

-- Only accounting admins and admins can manage entries
DROP POLICY IF EXISTS "Accounting admins can insert entries" ON accounting_entries;
CREATE POLICY "Accounting admins can insert entries"
  ON accounting_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role IN ('admin', 'accounting_admin')
    )
  );

DROP POLICY IF EXISTS "Accounting admins can update entries" ON accounting_entries;
CREATE POLICY "Accounting admins can update entries"
  ON accounting_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role IN ('admin', 'accounting_admin')
    )
  );

DROP POLICY IF EXISTS "Accounting admins can delete entries" ON accounting_entries;
CREATE POLICY "Accounting admins can delete entries"
  ON accounting_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role IN ('admin', 'accounting_admin')
    )
  );

-- Indexes for accounting_entries
CREATE INDEX IF NOT EXISTS idx_accounting_date ON accounting_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_accounting_type ON accounting_entries(type);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_accounting_entries_updated_at ON accounting_entries;
CREATE TRIGGER update_accounting_entries_updated_at
  BEFORE UPDATE ON accounting_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ENABLE REALTIME (optional, uncomment if needed)
-- =====================

-- ALTER PUBLICATION supabase_realtime ADD TABLE events;
-- ALTER PUBLICATION supabase_realtime ADD TABLE meeting_notes;
-- ALTER PUBLICATION supabase_realtime ADD TABLE house_rules;
-- ALTER PUBLICATION supabase_realtime ADD TABLE accounting_entries;
