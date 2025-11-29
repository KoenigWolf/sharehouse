-- Storage Policies for ShareHouse
-- Run these after creating the storage bucket in Supabase Dashboard

-- First, create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resident-photos',
  'resident-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Authenticated users can view all photos
CREATE POLICY "Authenticated users can view photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resident-photos');

-- Policy: Users can upload their own photos
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resident-photos' AND
  (storage.foldername(name))[1] = 'photos'
);

-- Policy: Users can update their own photos
CREATE POLICY "Users can update own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resident-photos' AND
  auth.uid()::text = (SPLIT_PART((storage.filename(name)), '-', 1))
)
WITH CHECK (
  bucket_id = 'resident-photos' AND
  auth.uid()::text = (SPLIT_PART((storage.filename(name)), '-', 1))
);

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resident-photos' AND
  auth.uid()::text = (SPLIT_PART((storage.filename(name)), '-', 1))
);

-- Alternative simpler policies if the above don't work:
-- (Use these instead if you want less restrictive policies)

/*
-- Allow authenticated users to upload to photos folder
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resident-photos');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resident-photos');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resident-photos');
*/
