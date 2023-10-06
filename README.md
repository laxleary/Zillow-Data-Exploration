# Zillow-Data-Exploration
Project 3

## Usage Instructions
Our webpage can be found at [https://laxleary.github.io/Zillow-Data-Exploration/](https://laxleary.github.io/Zillow-Data-Exploration/).

In order to view the full functionality of the webpage, you will need to first follow these steps:

1. Run all queries in the [schema](schema.sql) using PostgreSQL. These can be run from top to bottom without issue.
2.  Import the 4 relevant csv files into their corresponding PostgresSQL tables, in order: [regions.csv](Data-Import/Resource-CSVs/regions.csv), [indicators.csv](Data-Import/Resource-CSVs/indicators.csv), [data.csv](https://data.nasdaq.com/tables/ZILLOW/ZILLOW-DATA/export), [cities_for_SQL](Data-Import/Resource-CSVs/cities_for_SQL_import.csv).
Note: The data.csv file is extremely large and may take multiple hours to import into Postgres.

3. In the folder Flask-API, create a config file storing your PostgreSQL password as the variable **postgres**.
4. [Run Flask](Flask-API/app.py)
   
The webpage should now have full functionality!
## Data Source
https://data.nasdaq.com/databases/ZILLOW/usage/export
