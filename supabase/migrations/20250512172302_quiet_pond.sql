/*
  # Add avatar column to people table

  1. Changes
    - Add 'avatar' column to 'people' table
      - Type: text (to store avatar URL)
      - Nullable: true (not all users will have avatars)

  2. Security
    - No changes to RLS policies needed as the existing policies cover all columns
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'people' 
    AND column_name = 'avatar'
  ) THEN
    ALTER TABLE people ADD COLUMN avatar text;
  END IF;
END $$;