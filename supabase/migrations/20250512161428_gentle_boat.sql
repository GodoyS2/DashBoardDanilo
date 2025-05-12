/*
  # Update location assignments primary key

  1. Changes
    - Drop existing unique constraint
    - Add new primary key constraint on (location_id, group_id, person_id)

  2. Notes
    - Ensures data integrity with a proper composite primary key
    - Maintains existing foreign key relationships
*/

-- Drop existing unique constraint
ALTER TABLE location_assignments 
DROP CONSTRAINT IF EXISTS location_assignments_location_id_group_id_person_id_key;

-- Add new primary key constraint
ALTER TABLE location_assignments 
ADD CONSTRAINT location_assignments_pkey 
PRIMARY KEY (location_id, group_id, person_id);