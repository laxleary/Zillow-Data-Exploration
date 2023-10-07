# Zillow-Data-Exploration
Project 3

## Background
Zillow stands as the forefront real estate and rental platform, committed to arming consumers with vital data, inspiration, and insights about their home, while facilitating connections with top-notch local 

experts ready to lend their expertise. Within this project, we'll delve into housing data sourced from Zillow via NASDAQ. This dataset encompasses information on Real Estate Data categorized by region, housing type 

(including sales/rentals), and region type and includes many indicators. Our objective is for the user to have an interactive dashboard to explore the data presented by Zillow on regions across the United States. 

This tool aims to assist users in discerning housing potentials and trends.


## Prerequisistes 

Make sure you have the following installed:

- Python (3.6 and above)

- Flask (Install with pip install)

- SQL (MySQL, PostrgreSQL, or any other database of your choice)

- SQLAlchemy (Install with pip install SQL Alchamey)

- Javascript (for frontend interactivity)

- D3.js (for Data Visualization)

- HTML (for structring the webpage)

## Instructions 







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
