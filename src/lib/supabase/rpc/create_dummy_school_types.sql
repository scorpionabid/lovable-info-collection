
-- Create the school_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS school_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Function to initialize with sample school types if empty
CREATE OR REPLACE FUNCTION public.create_dummy_school_types()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  count_types INT;
BEGIN
  -- Check if we already have school types
  SELECT COUNT(*) INTO count_types FROM school_types;
  
  -- If no types exist, create some sample ones
  IF count_types = 0 THEN
    INSERT INTO school_types (name, description)
    VALUES 
      ('Primary School', 'Basic education for grades 1-4'),
      ('Middle School', 'Education for grades 5-8'),
      ('High School', 'Education for grades 9-12'),
      ('Vocational School', 'Specialized technical or career education'),
      ('Special Education School', 'Schools focused on special needs education');
  END IF;
END;
$$;

-- Execute the function to create dummy data if needed
SELECT create_dummy_school_types();
