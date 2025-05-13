/*
  # Add Territories Table with Image Support

  1. New Tables
    - territories
      - id (uuid, primary key)
      - name (text, required)
      - description (text, optional)
      - image_url (text, optional)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS public.territories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    image_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable full access for authenticated users"
    ON public.territories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_territories_updated_at
    BEFORE UPDATE ON territories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();