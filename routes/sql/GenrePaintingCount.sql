/*
 * Purpose: Returns the genre name and the number of paintings for each genre for genres having over some set number of paintings.
 *
 * Details: If the minimum number of paintings is not specified, it will default to not having a minimum count.
 */
create or replace function get_genre_painting_count_above (pcount bigint default -1) returns table ("genreName" text, "count" bigint) language sql as $$
  select
  G."genreName",
  COUNT(PG."paintingId")
from
  "PaintingGenres" as PG
  right join "Genres" as G on G."genreId" = PG."genreId"
group by
  G."genreName"
having
  COUNT(PG."paintingId") > pcount
$$;

/*
 * Purpose: Returns the genre name and the number of paintings for each genre.
 */
create or replace function get_genre_painting_count () returns table ("genreName" text, "count" bigint) language sql as $$
  select * from get_genre_painting_count_above()
$$;