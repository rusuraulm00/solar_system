from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__)

def load_planet_data():
    planets_file = os.path.join(app.static_folder,'data','planets.json')
    if os.path.exists(planets_file) and os.path.getsize(planets_file) > 0:
        try:
            with open(planets_file, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError:
            pass

        return {
            "mercury": {
                "name": "Mercury",
                "type": "planet",
                "description": "The smallest and innermost planet in the Solar System.",
                "distance": "57.9 million km",
                "diameter": "4,880 km",
                "orbit_period": "88 Earth days",
                "day_length": "58.6 Earth days",
                "color": "#b5b5b5"
            },
            "venus": {
                "name": "Venus",
                "type": "planet",
                "description": "The second planet from the Sun and the hottest planet in our solar system.",
                "distance": "108.2 million km",
                "diameter": "12,104 km",
                "orbit_period": "225 Earth days",
                "day_length": "243 Earth days",
                "color": "#e6e6b8"
            },
            "earth": {
                "name": "Earth",
                "type": "planet",
                "description": "Our home planet and the only known celestial body to harbor life.",
                "distance": "149.6 million km",
                "diameter": "12,742 km",
                "orbit_period": "365.25 days",
                "day_length": "24 hours",
                "color": "#6b93d6"
            },
            "mars": {
                "name": "Mars",
                "type": "planet",
                "description": "The fourth planet from the Sun, often called the 'Red Planet'.",
                "distance": "227.9 million km",
                "diameter": "6,779 km",
                "orbit_period": "687 Earth days",
                "day_length": "24.6 hours",
                "color": "#c1440e"
            },
            "asteroid_belt": {
                "name": "Asteroid Belt",
                "type": "asteroid_belt",
                "description": "A region of space between Mars and Jupiter containing numerous asteroids.",
                "distance": "300-600 million km",
                "width": "~150 million km",
                "estimated_objects": "Over 1 million objects larger than 1 km"
            },
            "jupiter": {
                "name": "Jupiter",
                "type": "planet",
                "description": "The largest planet in our solar system and the fifth from the Sun.",
                "distance": "778.5 million km",
                "diameter": "139,820 km",
                "orbit_period": "11.86 Earth years",
                "day_length": "9.93 hours",
                "color": "#c3a992"
            },
            "saturn": {
                "name": "Saturn",
                "type": "planet",
                "description": "The sixth planet from the Sun, famous for its beautiful ring system.",
                "distance": "1.4 billion km",
                "diameter": "116,460 km",
                "orbit_period": "29.46 Earth years",
                "day_length": "10.7 hours",
                "color": "#e3e0c0"
            },
            "uranus": {
                "name": "Uranus",
                "type": "planet",
                "description": "The seventh planet from the Sun and the first discovered with a telescope.",
                "distance": "2.9 billion km",
                "diameter": "50,724 km",
                "orbit_period": "84 Earth years",
                "day_length": "17.2 hours",
                "color": "#c1f0f6"
            },
            "neptune": {
                "name": "Neptune",
                "type": "planet",
                "description": "The eighth and farthest known planet from the Sun.",
                "distance": "4.5 billion km",
                "diameter": "49,244 km",
                "orbit_period": "165 Earth years",
                "day_length": "16.1 hours",
                "color": "#5089d6"
            },
            "sun": {
                "name": "Sun",
                "type": "star",
                "description": "The star at the center of our Solar System.",
                "diameter": "1,392,700 km",
                "mass": "1.989 × 10^30 kg",
                "temperature": "5,500°C (surface), 15,000,000°C (core)",
                "age": "~4.6 billion years",
                "color": "#ffd700"
            }
        }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/celestial_bodies')
def get_celestial_bodies():
    return jsonify(load_planet_data())

@app.route('/api/celestial_body/<body_id>')
def get_celestial_body(body_id):
    bodies = load_planet_data()
    if body_id in bodies:
        return jsonify(bodies[body_id])
    else:
        return jsonify({"error": "Celestial body not found"}), 404


if __name__ == '__main__':
    # Create directory for planet data if it doesn't exist
    data_dir = os.path.join(app.static_folder, 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    planets_data = load_planet_data()
    planets_file = os.path.join(data_dir, 'planets.json')
    with open(planets_file, 'w') as f:
        json.dump(planets_data, f, indent=2)

    app.run(debug=True)


