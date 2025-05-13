/*
  # Update territories table RLS policies

  1. Changes
    - Remove existing RLS policies for territories table
    - Add new comprehensive RLS policies for territories table
      - Enable read access for authenticated users
      - Enable write access for authenticated users
      - Enable delete access for authenticated users

  2. Security
    - Maintains RLS enabled on territories table
    - Adds clear, specific policies for each operation
    - Ensures authenticated users have full access to territories
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON territories;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON territories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON territories;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON territories;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON territories;

-- Create new comprehensive policies
CREATE POLICY "Enable read access for authenticated users"
ON territories FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON territories FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON territories FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON territories FOR DELETE
TO authenticated
USING (true);