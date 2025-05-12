/*
  # Add bio column to people table

  1. Changes
    - Add bio column to people table as nullable text field
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'people' AND column_name = 'bio'
  ) THEN
    ALTER TABLE public.people ADD COLUMN bio text;
  END IF;
END $$;