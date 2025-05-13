/*
  # Update territories table RLS policies

  1. Security Changes
    - Add RLS policies for INSERT, UPDATE, and DELETE operations
    - Allow authenticated users to perform all CRUD operations
    - Maintain existing SELECT policy

  2. Changes
    - Add new policies for INSERT, UPDATE, and DELETE operations
    - Keep existing policy for SELECT operations
*/

-- Add policy for INSERT operations
CREATE POLICY "Enable insert for authenticated users" ON territories
FOR INSERT TO authenticated
WITH CHECK (true);

-- Add policy for UPDATE operations
CREATE POLICY "Enable update for authenticated users" ON territories
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Add policy for DELETE operations
CREATE POLICY "Enable delete for authenticated users" ON territories
FOR DELETE TO authenticated
USING (true);