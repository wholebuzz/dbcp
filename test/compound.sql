DROP TABLE IF EXISTS compoundA;
DROP TABLE IF EXISTS compoundB;
DROP TABLE IF EXISTS compoundC;

CREATE TABLE compoundA (
    id serial PRIMARY KEY,
    guid text NOT NULL,
    compoundB_id INTEGER
); 

CREATE TABLE compoundB (
    id serial PRIMARY KEY,
    guid text NOT NULL,
    compoundC_id INTEGER
); 

CREATE TABLE compoundC (
    id serial PRIMARY KEY,
    guid text NOT NULL
); 
