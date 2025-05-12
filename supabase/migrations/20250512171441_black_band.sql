/*
  # Initial Schema Setup

  1. Tables
    - people: Store user information
    - groups: Store group information
    - group_members: Junction table for group memberships
    - locations: Store location information
    - location_assignments: Junction table for location assignments

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- People table
CREATE TABLE IF NOT EXISTS public.people (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    bio text,
    avatar text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Groups table
CREATE TABLE IF NOT EXISTS public.groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    avatar text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Group members junction table
CREATE TABLE IF NOT EXISTS public.group_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
    person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(group_id, person_id)
);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    address text NOT NULL,
    visited boolean DEFAULT false,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Location assignments junction table
CREATE TABLE IF NOT EXISTS public.location_assignments (
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

-- Enable Row Level Security
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
  -- People policies
  EXECUTE format('CREATE POLICY "Enable full access for authenticated users" ON public.people FOR ALL TO authenticated USING (true) WITH CHECK (true)');
  
  -- Groups policies
  EXECUTE format('CREATE POLICY "Enable full access for authenticated users" ON public.groups FOR ALL TO authenticated USING (true) WITH CHECK (true)');
  
  -- Group members policies
  EXECUTE format('CREATE POLICY "Enable full access for authenticated users" ON public.group_members FOR ALL TO authenticated USING (true) WITH CHECK (true)');
  
  -- Locations policies
  EXECUTE format('CREATE POLICY "Enable full access for authenticated users" ON public.locations FOR ALL TO authenticated USING (true) WITH CHECK (true)');
  
  -- Location assignments policies
  EXECUTE format('CREATE POLICY "Enable full access for authenticated users" ON public.location_assignments FOR ALL TO authenticated USING (true) WITH CHECK (true)');
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_people_updated_at
    BEFORE UPDATE ON people
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();