DROP TABLE IF EXISTS dbcptest;

CREATE TABLE dbcptest (
    id serial PRIMARY KEY,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    guid text NOT NULL,
    link text,
    feed text,
    props jsonb,
    tags jsonb
); 
