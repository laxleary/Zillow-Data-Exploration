# Zillow-Data-Exploration
## Project 3
### By: Hannah Burgess, Aubrey Leary, and Gabrellea Norman

## Background
Zillow stands as the forefront real estate and rental platform, committed to arming consumers with vital data, inspiration, and insights about their home, while facilitating connections with top-notch local 
experts ready to lend their expertise. Within this project, we'll delve into housing data sourced from Zillow via NASDAQ. This dataset encompasses information on Real Estate Data categorized by region, housing type 
(including sales/rentals), and region type and includes many indicators. Our objective is for the user to have an interactive dashboard to explore the data presented by Zillow on regions across the United States. 
This tool aims to assist users in discerning housing potentials and trends. 



## Prerequisistes 

Make sure you have the following installed:

- Python (3.6 and above)

- Flask (Install with pip install)

- SQL (MySQL, PostgreSQL, or any other DMS of your choice)

- SQLAlchemy (Install with pip install SQL Alchemey)

- Javascript (for frontend interactivity)

* VSCode extensions for HTML and CSS may also be beneficial

## Usage Instructions
Our webpage can be found at [https://laxleary.github.io/Zillow-Data-Exploration/](https://laxleary.github.io/Zillow-Data-Exploration/).

In order to view the full functionality of the webpage, you will need to first follow these steps:

1. Run all queries in the [schema](schema.sql) using PostgreSQL. These can be run from top to bottom without issue.
2.  Import the 4 relevant csv files into their corresponding PostgresSQL tables, in order: [regions.csv](Data-Import/Resource-CSVs/regions.csv), [indicators.csv](Data-Import/Resource-CSVs/indicators.csv), [data.csv](https://data.nasdaq.com/tables/ZILLOW/ZILLOW-DATA/export), [cities_for_SQL](Data-Import/Resource-CSVs/cities_for_SQL_import.csv).
**Note: The data.csv file is extremely large and may take multiple hours to import into Postgres.**

3. In the folder Flask-API, create a config file storing your PostgreSQL password as the variable **postgres**.
4. [Run Flask](Flask-API/app.py) (more details for this step can be found below if needed)
   
The webpage should now have full functionality!

A slide show presenting the work done on the repository and its intended use can be found [here](https://docs.google.com/presentation/d/1Zi1szDj21tAhBGQp1SkIZv0P69IcVQ6u0K2kJKclElw/edit#slide=id.g28a22248245_12_8).


## Creation Process
Download the CSVs provided in ZILLOW | Zillow Real Estate Data | Nasdaq Data Link to SQL, use SQL as your database to house the data. Create a database in SQL in the database create a schema to run all queries to 

create tables named: Regions, Indicators, and Data then import the corresponding data files into the respective folder. SQL was used to achieve the cities for SQL_import.csv and the Zillow-Real-Estate.csv. 

Once CSVs are cleaned and made to display the information you would like to be presented. 


### Create Flask API to serve data to webpage: 

 Using app.py set up Flask application and define routes:
 
1. Import the dependencies
   
2. "pip install flask-cors" to bypass CORS

3. Create Flask Routes

4. Define routes and fetch data using CSV

5. Then return JSON

### Javascript files. 

To achieve Scatterplot: 

1. Use Plotly.d3 to load Zillow-Real-Estate.csv

2. Create SCatter Plot to Display data for the years 2021, 2022, 2023 (coding can be found in static folder scatterplot.jss)

![image](https://github.com/laxleary/Zillow-Data-Exploration/assets/130908954/81a83c58-c22f-43eb-b17d-b94e9b222111)

To achieve Map: 

1. Call the cityData API

2. Create the map with layers, markers, and drop-down menu (coding can be found in static folder logic.js)

3. Use specific longitude and latitude for plotting the regions

![image](https://github.com/laxleary/Zillow-Data-Exploration/assets/130908954/32d4e0a6-ce17-43c1-86c3-18c0690c7065)

*You have the option to enter the city, state, and house size by the number of bedrooms and each marker will

display the value in that particular region.


### CSS
1. Use CSS to style the webpage (Coding can be found in the static folder [style.css](style.css) to show how our webpage was styled)

### HTML 

1. Use HTML to structure the Zillow Data Exploration dashboard and include data by fetching and executing the JS files and style.css

2. In index.html link the CSS and Javascript files

3. For the purpose of this project we used style.css, Plotly, Leaflet.Js, chroma.js, D3.js JS, and Scatterplot JS


## Run Flask Application

1. Navigate to the Project folder and run python app.py

2. This will start the Flask server

3. [Run Flask](Flask-API/app.py)


## Access the Webpage
1. Open browser

2. The Home Search data Web page should be rendered with the HTML, CSS and Javascript information:

   
![image](demo_images/line_chart.png)



## Data Sources
https://data.nasdaq.com/databases/ZILLOW/usage/export
[Geoapify Places API](https://apidocs.geoapify.com/playground/places/)

## Outside Sources
The following code was developed by the three co-authors using methods learned in class. New methods were developed with the assistance of StackOverflow, GeeksforGeeks, and official documentation for Leaflet, Plotly,
D3, Python, Bootstrap, and JavaScript. Code was not copied directly from these sources, rather the authors used their explanations to develop novel code. 
