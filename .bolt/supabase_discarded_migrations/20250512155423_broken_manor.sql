/*
  # Initial Schema Setup

  1. New Tables
    - `people`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text, nullable)
      - `bio` (text, nullable)
      - `avatar` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `avatar` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `group_members`
      - `group_id` (uuid, references groups)
      - `person_id` (uuid, references people)
      - Primary key is (group_id, person_id)

    - `locations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `visited` (boolean)
      - `lat` (double precision)
      - `lng` (double precision)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `location_assignments`
      - `location_id` (uuid, references locations)
      - `group_id` (uuid, references groups, nullable)
      - `person_id` (uuid, references people, nullable)
      - At least one of group_id or person_id must be non-null

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
*/

-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- People table
CREATE TABLE public.people (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  bio text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Groups table
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Group members junction table
CREATE TABLE public.group_members (
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, person_id)
);

-- Locations table
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  visited boolean DEFAULT false,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Location assignments junction table
CREATE TABLE public.location_assignments (
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
  CONSTRAINT at_least_one_assignment CHECK (
    (group_id IS NOT NULL AND person_id IS NULL) OR
    (group_id IS NULL AND person_id IS NOT NULL)
  ),
  UNIQUE (location_id, group_id, person_id)
);

-- Enable Row Level Security
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for people table
CREATE POLICY "Enable read access for authenticated users"
  ON public.people FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.people FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.people FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON public.people FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for groups table
CREATE POLICY "Enable read access for authenticated users"
  ON public.groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.groups FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.groups FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON public.groups FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for group_members table
CREATE POLICY "Enable read access for authenticated users"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.group_members FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON public.group_members FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for locations table
CREATE POLICY "Enable read access for authenticated users"
  ON public.locations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.locations FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON public.locations FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for location_assignments table
CREATE POLICY "Enable read access for authenticated users"
  ON public.location_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON public.location_assignments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON public.location_assignments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON public.location_assignments FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON public.people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();