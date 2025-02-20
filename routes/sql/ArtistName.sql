-- https://postgrest.org/en/stable/references/api/computed_fields.html
-- a computed field that combines data from two columns
CREATE FUNCTION artistName("Artists")
RETURNS text AS $$
  SELECT $1."firstName" || ' ' || $1."lastName";
$$ LANGUAGE SQL;