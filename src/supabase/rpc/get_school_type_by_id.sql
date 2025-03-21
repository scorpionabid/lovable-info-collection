
CREATE OR REPLACE FUNCTION public.get_school_type_by_id(type_id uuid)
RETURNS TABLE(id uuid, name text, description text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT st.id, st.name, st.description
  FROM school_types st
  WHERE st.id = type_id;
END;
$$;
