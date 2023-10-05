from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

# Define the route for fetching data
@app.route('/api/zillow-real-estate', methods=['GET'])
def get_zillow_data():
    # Load the CSV data using pandas
    data = pd.read_csv("ZILLOW-REAL ESTATE.csv")

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

if __name__ == '__main__':
    app.run(debug=True)
