# Moody Weather Visualization Webapp

A minimal and moody weather visualization webapp.  
Detects your location via IP, fetches current weather, and displays a minimal or realistic animated visualization.

## Features

- Auto-detects your location (approximate, via IP)
- Fetches current weather conditions (OpenWeatherMap)
- Minimal, animated visualizations for sun, clouds, rain, snow, etc.
- Works locally or deployable to Codespaces/Render/Heroku/etc.

## Setup

1. **Get an OpenWeatherMap API Key:**
   - Sign up at [https://openweathermap.org/api](https://openweathermap.org/api)
   - Copy your API key.

2. **Clone this repo and set up:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Set your API key:**
   - Option 1: In your shell
     ```bash
     export OPENWEATHER_API_KEY=your_key_here
     ```
   - Option 2: Create a `.env` file and use [python-dotenv](https://pypi.org/project/python-dotenv/) (optional)

4. **Run the app:**
   ```bash
   python app.py
   ```
   Then visit [http://localhost:5000](http://localhost:5000)

## Deploy on GitHub Codespaces

- Open this repo in GitHub Codespaces and run:
  ```
  pip install -r requirements.txt
  export OPENWEATHER_API_KEY=your_key_here
  python app.py
  ```

## Customization

- Edit `static/app.js` for custom visualizations.
- Style with `static/style.css`.

---

**Note:** IP-based location is approximate (city-level) and may not be very precise for all users.
