
-- Function to get school types
CREATE OR REPLACE FUNCTION get_school_types()
RETURNS TABLE (
  id UUID,
  name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name
  FROM school_types s
  ORDER BY s.name;
END;
$$;

-- Additional function that returns a plain list
CREATE OR REPLACE FUNCTION get_school_type_list()
RETURNS TABLE (
  id UUID,
  name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name
  FROM school_types s
  ORDER BY s.name;
END;
$$;
