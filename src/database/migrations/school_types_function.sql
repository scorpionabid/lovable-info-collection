
-- Create function to get school types
CREATE OR REPLACE FUNCTION public.get_school_types()
RETURNS TABLE(id uuid, name text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT st.id, st.name
  FROM school_types st
  ORDER BY st.name;
END;
$$;
