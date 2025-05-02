document.addEventListener('DOMContentLoaded', function() {
    // Add console logging for debugging
    console.log('Solar system script loaded');

    // Get the container dimensions
    const solarSystem = document.getElementById('solar-system');
    const containerWidth = solarSystem.clientWidth;
    const containerHeight = solarSystem.clientHeight;
    console.log('Container dimensions:', containerWidth, containerHeight);

    const minDimension = Math.min(containerWidth, containerHeight);

    // Set scale factor for orbit sizes - adjust for better visibility
    const orbitScale = minDimension / 1800;

    // Set the sun radius based on container size
    const sunRadius = Math.max(20, minDimension * 0.05);

    // Cache DOM elements we'll need frequently
    const infoPanel = document.getElementById('info-panel');
    const bodyName = document.getElementById('body-name');
    const bodyDetails = document.getElementById('body-details');
    const closeInfoBtn = document.getElementById('close-info');

    // Planet data with relative sizes and orbital distances (not to scale but visually pleasing)
    const orbitalDistances = {
        mercury: 120,
        venus: 180,
        earth: 240,
        mars: 300,
        asteroid_belt: 400,  // Middle of the belt
        jupiter: 500,
        saturn: 600,
        uranus: 700,
        neptune: 800
    };

    const planetSizes = {
        mercury: 16,
        venus: 32,
        earth: 34,
        mars: 24,
        jupiter: 80,
        saturn: 72,
        uranus: 48,
        neptune: 48
    };

    // Orbital periods in seconds (for animation)
    const orbitalPeriods = {
        mercury: 20,
        venus: 30,
        earth: 40,
        mars: 60,
        jupiter: 100,
        saturn: 140,
        uranus: 200,
        neptune: 280
    };

    // Fetch celestial body data from the backend
    fetch('/api/celestial_bodies')
        .then(response => {
            console.log('API response status:', response.status);
            return response.json();
        })
        .then(data => {
            // Store the data globally
            window.celestialBodies = data;
            console.log('Celestial bodies data loaded:', data);

            // Create the solar system
            createSolarSystem();

            // Start the animation
            animatePlanets();
        })
        .catch(error => {
            console.error('Error fetching celestial body data:', error);
            // Use hardcoded fallback data in case API fails
            window.celestialBodies = getDefaultCelestialData();
            createSolarSystem();
            animatePlanets();
        });

    // Function to provide default celestial data if API fails
    function getDefaultCelestialData() {
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
        };
    }

    // Function to create the solar system elements
    function createSolarSystem() {
        console.log('Creating solar system');

        // Create the sun
        const sun = document.createElement('div');
        sun.className = 'celestial-body sun';
        sun.style.width = `${sunRadius * 2}px`;
        sun.style.height = `${sunRadius * 2}px`;
        sun.style.left = '50%';
        sun.style.top = '50%';
        sun.setAttribute('data-id', 'sun');
        solarSystem.appendChild(sun);

        // Add click event to the sun
        sun.addEventListener('click', () => showCelestialBodyInfo('sun'));

        console.log('Sun created');

        // Create orbit paths and planets
        for (const [planetId, distance] of Object.entries(orbitalDistances)) {
            console.log(`Creating ${planetId} at distance ${distance}`);

            if (planetId === 'asteroid_belt') {
                createAsteroidBelt(distance * orbitScale);
                continue;
            }

            // Create orbit
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            orbit.style.width = `${distance * 2 * orbitScale}px`;
            orbit.style.height = `${distance * 2 * orbitScale}px`;
            solarSystem.appendChild(orbit);
            console.log(`Created orbit for ${planetId}`);

            // Skip creating planet if it's the asteroid belt
            if (planetId === 'asteroid_belt') continue;

            // Create planet
            const planet = document.createElement('div');
            planet.className = 'celestial-body';
            planet.id = planetId;
            planet.setAttribute('data-id', planetId);

            // Set planet size
            const planetSize = planetSizes[planetId] * orbitScale * 2;
            planet.style.width = `${planetSize}px`;
            planet.style.height = `${planetSize}px`;

            // Set initial position
            const angle = Math.random() * Math.PI * 2; // Random starting position
            const orbitRadius = distance * orbitScale;
            const x = orbitRadius * Math.cos(angle) + containerWidth / 2;
            const y = orbitRadius * Math.sin(angle) + containerHeight / 2;

            planet.style.left = `${x}px`;
            planet.style.top = `${y}px`;

            // Set planet color
            const planetColor = window.celestialBodies[planetId]?.color || '#ffffff';
            planet.style.backgroundColor = planetColor;
            console.log(`Planet ${planetId} color: ${planetColor}`);

            // Store orbit data for animation
            planet.dataset.orbitRadius = orbitRadius;
            planet.dataset.angle = angle;
            planet.dataset.speed = 2 * Math.PI / (orbitalPeriods[planetId] * 60); // Angular velocity

            solarSystem.appendChild(planet);

            // Add click event to the planet
            planet.addEventListener('click', () => showCelestialBodyInfo(planetId));
            console.log(`Created planet ${planetId}`);
        }
    }

    // Function to create the asteroid belt
    function createAsteroidBelt(radius) {
        // Belt width
        const beltWidth = 50 * orbitScale;
        const innerRadius = radius - (beltWidth / 2);
        const outerRadius = radius + (beltWidth / 2);

        // Create a clickable ring for the asteroid belt
        const clickableBelt = document.createElement('div');
        clickableBelt.className = 'clickable-belt';
        clickableBelt.style.width = `${outerRadius * 2}px`;
        clickableBelt.style.height = `${outerRadius * 2}px`;
        clickableBelt.style.borderRadius = '50%';
        clickableBelt.style.border = `${beltWidth}px solid rgba(255, 255, 255, 0.05)`;
        clickableBelt.setAttribute('data-id', 'asteroid_belt');
        solarSystem.appendChild(clickableBelt);

        // Add click event to the asteroid belt
        clickableBelt.addEventListener('click', () => showCelestialBodyInfo('asteroid_belt'));

        // Create asteroid belt with individual asteroids
        const asteroidBelt = document.createElement('div');
        asteroidBelt.className = 'asteroid-belt';
        solarSystem.appendChild(asteroidBelt);

        // Create individual asteroids
        const numAsteroids = Math.floor(radius / 2);
        for (let i = 0; i < numAsteroids; i++) {
            const asteroid = document.createElement('div');
            asteroid.className = 'asteroid';

            // Random position within the belt
            const asteroidRadius = innerRadius + Math.random() * beltWidth;
            const angle = Math.random() * Math.PI * 2;
            const x = asteroidRadius * Math.cos(angle);
            const y = asteroidRadius * Math.sin(angle);

            asteroid.style.left = `${x}px`;
            asteroid.style.top = `${y}px`;

            // Random size
            const size = Math.random() * 2 + 1;
            asteroid.style.width = `${size}px`;
            asteroid.style.height = `${size}px`;

            asteroidBelt.appendChild(asteroid);
        }
    }

    // Function to animate the planets
    function animatePlanets() {
        const center = {
            x: containerWidth / 2,
            y: containerHeight / 2
        };

        // Get all planets
        const planets = document.querySelectorAll('.celestial-body:not(.sun)');

        // Animation function
        function animate() {
            planets.forEach(planet => {
                if (planet.id === 'asteroid_belt') return;

                // Get orbit data
                const radius = parseFloat(planet.dataset.orbitRadius);
                let angle = parseFloat(planet.dataset.angle);
                const speed = parseFloat(planet.dataset.speed);

                // Update angle
                angle += speed;
                if (angle > Math.PI * 2) angle -= Math.PI * 2;

                // Calculate new position
                const x = center.x + radius * Math.cos(angle);
                const y = center.y + radius * Math.sin(angle);

                // Update planet position
                planet.style.left = `${x}px`;
                planet.style.top = `${y}px`;

                // Store updated angle
                planet.dataset.angle = angle;
            });

            // Continue animation
            requestAnimationFrame(animate);
        }

        // Start animation
        animate();
    }

    // Function to show celestial body information
    function showCelestialBodyInfo(bodyId) {
        const body = window.celestialBodies[bodyId];

        if (!body) {
            console.error('Celestial body not found:', bodyId);
            return;
        }

        // Set the name
        bodyName.textContent = body.name;

        // Clear previous details
        bodyDetails.innerHTML = '';

        // Add description
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'body-description';
        descriptionDiv.textContent = body.description;
        bodyDetails.appendChild(descriptionDiv);

        // Add all other properties except name, type, description and color
        for (const [key, value] of Object.entries(body)) {
            if (['name', 'type', 'description', 'color'].includes(key)) continue;

            const row = document.createElement('div');
            row.className = 'detail-row';

            const label = document.createElement('div');
            label.className = 'detail-label';
            label.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            const valueElement = document.createElement('div');
            valueElement.className = 'detail-value';
            valueElement.textContent = value;

            row.appendChild(label);
            row.appendChild(valueElement);
            bodyDetails.appendChild(row);
        }

        // Show the panel
        infoPanel.classList.remove('hidden');
    }

    // Close the info panel when clicking the close button
    closeInfoBtn.addEventListener('click', function() {
        infoPanel.classList.add('hidden');
    });

    // Close the info panel when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === infoPanel) {
            infoPanel.classList.add('hidden');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        // Reload the page to recreate the solar system with new dimensions
        location.reload();
    });
});