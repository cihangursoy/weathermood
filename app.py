import os
import requests
from flask import Flask, jsonify, render_template, send_from_directory

app = Flask(__name__, static_folder="static", template_folder="static")

GEO_API = "https://ipinfo.io/json"
WEATHER_API = "https://api.openweathermap.org/data/2.5/weather"
WEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY", "")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/location")
def get_location():
    try:
        res = requests.get(GEO_API)
        res.raise_for_status()
        loc = res.json()
        return jsonify({
            "city": loc.get("city"),
            "region": loc.get("region"),
            "country": loc.get("country"),
            "loc": loc.get("loc")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/weather/<lat>/<lon>")
def get_weather(lat, lon):
    try:
        params = {
            "lat": lat,
            "lon": lon,
            "appid": WEATHER_API_KEY,
            "units": "metric"
        }
        res = requests.get(WEATHER_API, params=params)
        res.raise_for_status()
        weather = res.json()
        return jsonify(weather)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# For development: serve static files
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
