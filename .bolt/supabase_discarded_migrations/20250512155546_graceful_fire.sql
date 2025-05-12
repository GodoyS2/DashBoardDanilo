/*
  # Create core tables and relationships

  1. New Tables
    - `people`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `bio` (text, optional)
      - `avatar` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, optional)
      - `avatar` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `group_members`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key)
      - `person_id` (uuid, foreign key)
      - `created_at` (timestamp)

    - `locations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `visited` (boolean)
      - `lat` (double precision)
      - `lng` (double precision)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `location_assignments`
      - `id` (uuid, primary key)
      - `location_id` (uuid, foreign key)
      - `group_id` (uuid, foreign key, optional)
      - `person_id` (uuid, foreign key, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
*/

-- Create people table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'people') THEN
    CREATE TABLE public.people (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      phone text,
      bio text,
      avatar text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create groups table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'groups') THEN
    CREATE TABLE public.groups (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text,
      avatar text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create group_members table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'group_members') THEN
    CREATE TABLE public.group_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
      person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
      created_at timestamptz DEFAULT now(),
      UNIQUE(group_id, person_id)
    );
  END IF;
END $$;

-- Create locations table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'locations') THEN
    CREATE TABLE public.locations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      address text NOT NULL,
      visited boolean DEFAULT false,
      lat double precision NOT NULL,
      lng double precision NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create location_assignments table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'location_assignments') THEN
    CREATE TABLE public.location_assignments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
      group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
      person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
      created_at timestamptz DEFAULT now(),
      CHECK (
        (group_id IS NOT NULL AND person_id IS NULL) OR
        (group_id IS NULL AND person_id IS NOT NULL)
      )
    );
  END IF;
END $$;

-- Enable Row Level Security
DO $$ 
BEGIN
  EXECUTE 'ALTER TABLE public.people ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.location_assignments ENABLE ROW LEVEL SECURITY';
END $$;

-- Create policies for people table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read access for authenticated users' AND tablename = 'people') THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON public.people
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert access for authenticated users' AND tablename = 'people') THEN
    CREATE POLICY "Enable insert access for authenticated users"
      ON public.people
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update access for authenticated users' AND tablename = 'people') THEN
    CREATE POLICY "Enable update access for authenticated users"
      ON public.people
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete access for authenticated users' AND tablename = 'people') THEN
    CREATE POLICY "Enable delete access for authenticated users"
      ON public.people
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for other tables following the same pattern
DO $$ 
BEGIN
  -- Groups policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read access for authenticated users' AND tablename = 'groups') THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON public.groups
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert access for authenticated users' AND tablename = 'groups') THEN
    CREATE POLICY "Enable insert access for authenticated users"
      ON public.groups
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update access for authenticated users' AND tablename = 'groups') THEN
    CREATE POLICY "Enable update access for authenticated users"
      ON public.groups
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete access for authenticated users' AND tablename = 'groups') THEN
    CREATE POLICY "Enable delete access for authenticated users"
      ON public.groups
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create updated_at function if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;
END $$;

-- Create triggers if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_people_updated_at') THEN
    CREATE TRIGGER update_people_updated_at
      BEFORE UPDATE ON people
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_groups_updated_at') THEN
    CREATE TRIGGER update_groups_updated_at
      BEFORE UPDATE ON groups
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_locations_updated_at') THEN
    CREATE TRIGGER update_locations_updated_at
      BEFORE UPDATE ON locations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;