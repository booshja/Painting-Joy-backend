\echo 'Delete and recreate paintingjoy db?'
\prompt 'Return for yes or Ctrl+C to cancel > ' foo

DROP DATABASE paintingjoy;
CREATE DATABASE paintingjoy;
\connect paintingjoy

\i paintingjoy-schema.sql
-- \i paintingjoy-seed.sql

\echo 'Delete and recreate pj_test db?'
\prompt 'Return for yes or Ctrl+C to cancel > ' foo

DROP DATABASE pj_test;
CREATE DATABASE pj_test;
\connect pj_test

\i paintingjoy-schema.sql
