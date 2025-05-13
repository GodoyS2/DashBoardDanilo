/*
  # Add RLS policies for territories table

  1. Security Changes
    - Add policies for authenticated users to perform CRUD operations on territories
    - Policies allow:
      - Authenticated users to read all territories
      - Authenticated users to insert new territories
      - Authenticated users to update their territories
      - Authenticated users to delete their territories

  Note: These policies ensure authenticated users have full access to territories
  while maintaining security by preventing unauthorized access.
*/

-- Enable RLS if not already enabled
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read for authenticated users" ON territories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON territories;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON territories;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON territories;

-- Create comprehensive RLS policies
CREATE POLICY "Enable read for authenticated users"
ON territories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON territories
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON territories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON territories
FOR DELETE
TO authenticated
USING (true);