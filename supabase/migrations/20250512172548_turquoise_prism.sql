/*
  # Add phone column to people table

  1. Changes
    - Add phone column to people table as nullable text field
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.people ADD COLUMN phone text;
  END IF;
END $$;