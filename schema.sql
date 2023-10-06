
-- The data for SQL is stored in Resource-CSVs indicators.csv and regions.csv  which can be imported into the database and tables created below
--The main dataset can be found as an Excel file in the resource for the data provided in the README. This file could not be added to the repository because it is too
--large, but should also be imported to SQL (this will take a long time)


CREATE DATABASE "Zillow-Data"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

DROP TABLE IF EXISTS Regions;
DROP TABLE IF EXISTS Indicators;
DROP TABLE IF EXISTS Data;

DROP TABLE IF EXISTS City_data;




CREATE TABLE Regions (
    region_id varchar PRIMARY KEY,
    region_type varchar NOT NULL,
    region varchar NOT NULL
);

CREATE TABLE Indicators (
    indicator_id varchar PRIMARY KEY,
    indicator varchar NOT NULL,
    category varchar NOT NULL
);

CREATE TABLE Data (
    indicator_id varchar NOT NULL, 
    FOREIGN KEY (indicator_id)
    REFERENCES Indicators(indicator_id),
    region_id varchar NOT NULL,
    FOREIGN KEY (region_id)
    REFERENCES Regions(region_id),
    "date" date NOT NULL,
    "value" float NOT NULL,
    CONSTRAINT data_id PRIMARY KEY (indicator_id, region_id, "date")
);


CREATE TABLE City_data (
    region_id varchar PRIMARY KEY    
);

ALTER TABLE Regions
    ADD COLUMN lat float;

ALTER TABLE Regions
    ADD COLUMN lon float;

ALTER TABLE Regions
    ADD COLUMN city_name varchar;

ALTER TABLE City_data
    ADD COLUMN lat float NOT NULL;

ALTER TABLE City_data
    ADD COLUMN lon float NOT NULL;

ALTER TABLE City_data
    ADD COLUMN city_name varchar NOT NULL;
