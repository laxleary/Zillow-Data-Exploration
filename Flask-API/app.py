#################################################
#Import your dependencies
#################################################

from flask import Flask, jsonify, escape

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
import pandas as pd
import config2 
from flask_cors import CORS, cross_origin

#Need flask-cors "pip install flask-cors" to bypass CORS

#################################################
#Database Setup
#################################################

engine = create_engine(f'postgresql+psycopg2://postgres:{config2.postgres}@localhost/Zillow-Data')

#Reflect an existing database into a new model
Base = automap_base()

#Reflect the tables
Base.prepare(autoload_with = engine)

#Save references to the tables
Regions = Base.classes.regions
Indicators = Base.classes.indicators
Data = Base.classes.data
Cities = Base.classes.city_data

#Start a session 
session = Session(engine)

#################################################
#Setup Flask
#################################################

app = Flask(__name__)
CORS(app, supports_credentials=True)
#################################################
#Flask Routes
#################################################

@app.route("/")
@cross_origin(supports_credentials=True)
def welcome():
    """Return all available routes"""

    #Provide endpoints for copy/paste, but also include hyperlinks where relevant
    return(f'The available routes are: <br/>'
           f'<a href ="/api/v1.0/city_data">Description of city metadata for all known cities: /api/v1.0/city_data</a> <br/>'
           f'<a href = "/api/v1.0/data_by/<region_id>/<indicator_id>"> Description of data for the searched region and id: /api/v1.0/data_by/region_id/indicator_id </a> <br/>'
           f'<a href = "/api/v1.0/data/indicators"> All indicator metadata: /api/v1.0/data/indicators </a> <br/>'
           f'<a href = "/api/v1.0/data/coordinates/<name>"> Coordinates of searched city: /api/v1.0/data/coordinates/city_name </a> <br/>'
           f'<a href = "/api/v1.0/zillow-real-estate"> Real Estate Data for Plotly: /api/v1.0/zillow-real-estate </a> </br>')

@app.route("/api/v1.0/city_data")
@cross_origin(supports_credentials=True)
def cities():
    """Return location metadata"""

    # Perform a query to retrieve the data for the region
    data = session.query(Regions.region_id, Regions.region, Regions.region_type, Regions.lat, Regions.lon, Regions.city_name).\
        filter(Regions.region_type == 'city').\
        filter(Regions.lat != None)


    #Contruct the dictionary with the desired keys and values
    my_list = []
    for id, region, type, lat, lon, city_name in data:
        my_list.append({"id":id, "region":region,"type":type,"coordinates":[lat,lon],"name":city_name})
    
    #Close the SQLAlchemy session
    session.close()

    #Return as JSON
    return jsonify(my_list)

@app.route("/api/v1.0/data_by/<region_id>/<indicator_id>")
@cross_origin(supports_credentials=True)
def data(region_id, indicator_id):
    """Return the data for the given region_id matching the given indicator_id"""
    
    #Query the database for the data requested
    data = session.query(Data.indicator_id, Data.region_id, Data.value, Data.date).\
        filter(Data.region_id == region_id).\
        filter(Data.indicator_id == indicator_id)
    
    #Store these results in a dictionary
    my_list = []
    try:
        for indicator, region, value, date in data:
            my_list.append({"indicator":indicator, "region_id":region, "value":value, "date":date})
    except AttributeError:
        pass
    #Close the session
    session.close()

    #Return results in JSON
    return jsonify(my_list)

@app.route("/api/v1.0/data/indicators") 
@cross_origin(supports_credentials=True)
def indicators():
    """"Return the metadata for all indicators as JSON"""

    #Query the database for the needed data
    data = session.query(Indicators.indicator_id, Indicators.indicator, Indicators.category).all()
    
    #Store the query results as a list of dictionaries based on indicator ids
    indicator_list = []
    for id, name, category in data:
       indicator_list.append({"id":id, "title":name, "category":category})

    #Close the SQLAlchemy session
    session.close()

    #Return as JSON
    return jsonify(indicator_list)

@app.route("/api/v1.0/data/coordinates/<name>")
@cross_origin(supports_credentials=True)
def coordinates(name):
    """Return city coordinates"""

    # Perform a query to retrieve the data for the region
    data = session.query(Cities.lat, Cities.lon).\
        filter(Cities.city_name == name)


    #Contruct the dictionary with the desired keys and values
    my_list = []
    for lat, lon in data:
        my_list.append({"lat":lat, "lon":lon})
    
    #Close the SQLAlchemy session
    session.close()

    #Return as JSON
    return jsonify(my_list)

# Define the route for fetching data
@app.route('/api/v1.0/zillow-real-estate', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_zillow_data():
    # Load the CSV data using pandas
    data = pd.read_csv("../Data-Import/Resource-CSVs/Zillow-REAL ESTATE.csv")

    # Convert 'date' to datetime
    data['date'] = pd.to_datetime(data['date'])

    # Extract data for years 2021, 2022, and 2023
    data2021 = data[data['date'].dt.year == 2021]
    data2022 = data[data['date'].dt.year == 2022]
    data2023 = data[data['date'].dt.year == 2023]

    # Define a function to extract x and y data
    def extract_data(data):
        x_data = data['region_id'].tolist()
        y_data = pd.to_numeric(data['value'], errors='coerce').tolist()
        return x_data, y_data

    x_data_2021, y_data_2021 = extract_data(data2021)
    x_data_2022, y_data_2022 = extract_data(data2022)
    x_data_2023, y_data_2023 = extract_data(data2023)

    # Create JSON response
    response = {
        'data': {
            '2021': {
                'xData': x_data_2021,
                'yData': y_data_2021
            },
            '2022': {
                'xData': x_data_2022,
                'yData': y_data_2022
            },
            '2023': {
                'xData': x_data_2023,
                'yData': y_data_2023
            }
        }
    }

    return jsonify(response)



if __name__ == "__main__":
    app.run(debug = True)