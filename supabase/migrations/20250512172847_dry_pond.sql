/*
  # Add updated_at column to people table

  1. Changes
    - Add `updated_at` column to `people` table with default value of now()
    - Add trigger to automatically update the `updated_at` column when a record is modified

  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - Adds trigger to maintain updated_at timestamp automatically
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE people ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create trigger to update the updated_at column
DROP TRIGGER IF EXISTS update_people_updated_at ON people;
CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();