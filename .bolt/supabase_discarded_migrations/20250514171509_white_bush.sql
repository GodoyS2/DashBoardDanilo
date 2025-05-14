/*
  # Fix Territory Images Schema

  1. Changes
    - Drop existing territory_images table and related tables if they exist
    - Recreate territory_images table with proper UUID handling
    - Add junction tables for group and people assignments
    - Enable RLS and add policies
    - Add updated_at trigger

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.territory_image_people CASCADE;
DROP TABLE IF EXISTS public.territory_image_groups CASCADE;
DROP TABLE IF EXISTS public.territory_images CASCADE;

-- Create territory_images table
CREATE TABLE IF NOT EXISTS public.territory_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    territory_id uuid REFERENCES public.territories(id) ON DELETE CASCADE,
    url text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create junction tables
CREATE TABLE IF NOT EXISTS public.territory_image_groups (
    image_id uuid REFERENCES public.territory_images(id) ON DELETE CASCADE,
    group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (image_id, group_id)
);

CREATE TABLE IF NOT EXISTS public.territory_image_people (
    image_id uuid REFERENCES public.territory_images(id) ON DELETE CASCADE,
    person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (image_id, person_id)
);

-- Enable RLS
ALTER TABLE public.territory_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territory_image_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territory_image_people ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable full access for authenticated users"
    ON public.territory_images
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
    ON public.territory_image_groups
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
    ON public.territory_image_people
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_territory_images_updated_at
    BEFORE UPDATE ON territory_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();