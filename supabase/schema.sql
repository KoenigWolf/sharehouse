-- Supabase Schema for ShareHouse Resident Information System
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- TABLES
-- =====================

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number VARCHAR(10) NOT NULL UNIQUE,
  floor VARCHAR(5) NOT NULL,
  floor_plan_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Residents table
CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname VARCHAR(50) NOT NULL,
  room_number VARCHAR(10) NOT NULL REFERENCES rooms(room_number),
  floor VARCHAR(5) NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(room_number)
);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================

-- Enable RLS on tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- Rooms policies: All authenticated users can view rooms
CREATE POLICY "Authenticated users can view rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

-- Residents policies: All authenticated users can view all residents
CREATE POLICY "Authenticated users can view all residents"
  ON residents FOR SELECT
  TO authenticated
  USING (true);

-- Residents can only update their own profile
CREATE POLICY "Users can update own resident profile"
  ON residents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================
-- STORAGE BUCKETS
-- =====================

-- Create storage bucket for resident photos (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('resident-photos', 'resident-photos', true);

-- Storage policies for resident-photos bucket
-- Note: These need to be created in the Supabase Dashboard under Storage > Policies

-- =====================
-- INDEXES
-- =====================

CREATE INDEX IF NOT EXISTS idx_residents_user_id ON residents(user_id);
CREATE INDEX IF NOT EXISTS idx_residents_room_number ON residents(room_number);
CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON rooms(room_number);

-- =====================
-- REALTIME
-- =====================

-- Enable realtime for residents table
ALTER PUBLICATION supabase_realtime ADD TABLE residents;

-- =====================
-- SAMPLE DATA (Optional - for testing)
-- =====================

-- Insert sample rooms (40 rooms across 4 floors)
-- Uncomment and modify as needed

/*
DO $$
DECLARE
  floor_num INT;
  room_num INT;
BEGIN
  FOR floor_num IN 1..4 LOOP
    FOR room_num IN 1..10 LOOP
      INSERT INTO rooms (room_number, floor)
      VALUES (
        floor_num || '0' || room_num,
        floor_num || 'F'
      )
      ON CONFLICT (room_number) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
*/

-- =====================
-- FUNCTIONS
-- =====================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on residents table
CREATE TRIGGER update_residents_updated_at
  BEFORE UPDATE ON residents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
