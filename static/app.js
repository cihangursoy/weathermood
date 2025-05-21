const locElem = document.getElementById('location');
const weatherElem = document.getElementById('weather');
const errorElem = document.getElementById('error');
const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

async function fetchLocation() {
    const res = await fetch('/api/location');
    return res.json();
}
async function fetchWeather(lat, lon) {
    const res = await fetch(`/api/weather/${lat}/${lon}`);
    return res.json();
}

function setError(msg) {
    errorElem.textContent = msg;
    errorElem.classList.remove('hidden');
}

function clearError() {
    errorElem.classList.add('hidden');
}

function describeWeather(data) {
    if (data.weather && data.weather[0]) {
        return data.weather[0].main + " - " + (data.weather[0].description || "");
    }
    return "";
}

// Minimal or realistic weather visualizations
function drawWeather(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!data.weather) return;

    const weather = data.weather[0].main;
    const temp = data.main.temp;

    // Sky
    if (weather === "Clear") {
        // Day or night
        const hr = (new Date()).getHours();
        ctx.fillStyle = (hr > 18 || hr < 6) ? "#172040" : "#6ec6ff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sun or moon
        ctx.beginPath();
        ctx.arc(canvas.width * 0.8, canvas.height * 0.3, 40, 0, 2 * Math.PI);
        ctx.fillStyle = (hr > 18 || hr < 6) ? "#f9f7e8" : "#ffe066";
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    else if (weather === "Clouds") {
        ctx.fillStyle = "#a0b8cf";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw clouds
        for (let i = 0; i < 3; i++) {
            drawCloud(canvas.width * (0.2 + 0.3 * i), canvas.height * (0.3 + 0.1 * i), 50 + Math.random() * 20);
        }
    }
    else if (weather === "Rain" || weather === "Drizzle") {
        ctx.fillStyle = "#6a819b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw clouds
        for (let i = 0; i < 2; i++) {
            drawCloud(canvas.width * (0.4 + 0.3 * i), canvas.height * 0.3, 60);
        }
        // Draw rain
        for (let i = 0; i < 40; i++) {
            drawRaindrop();
        }
    }
    else if (weather === "Thunderstorm") {
        ctx.fillStyle = "#232946";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw clouds
        drawCloud(canvas.width / 2, canvas.height * 0.25, 70);
        // Lightning
        if (Math.random() > 0.92) drawLightning();
        // Rain
        for (let i = 0; i < 30; i++) drawRaindrop();
    }
    else if (weather === "Snow") {
        ctx.fillStyle = "#dde6ed";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw clouds
        drawCloud(canvas.width * 0.5, canvas.height * 0.3, 70);
        // Draw snowflakes
        for (let i = 0; i < 40; i++) drawSnowflake();
    }
    else if (weather === "Mist" || weather === "Fog" || weather === "Haze") {
        ctx.fillStyle = "#bfc7cc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw fog layers
        for (let i = 0; i < 4; i++) {
            ctx.globalAlpha = 0.12 + i * 0.06;
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, canvas.height * (0.5 + i*0.1), canvas.width, 25);
        }
        ctx.globalAlpha = 1.0;
    }
    else {
        ctx.fillStyle = "#eee";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Helper functions for drawing
function drawCloud(x, y, r) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + r, y - r, r, Math.PI * 1, Math.PI * 1.85);
    ctx.arc(x + r*2, y, r, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#bbb";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
    ctx.restore();
}
function drawRaindrop() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.7 + canvas.height * 0.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 2, y + 15);
    ctx.strokeStyle = "#5ecaff";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
}
function drawSnowflake() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.7 + canvas.height * 0.2;
    ctx.beginPath();
    ctx.arc(x, y, 2.5 + Math.random() * 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1.0;
}
function drawLightning() {
    ctx.save();
    ctx.beginPath();
    const x = canvas.width * 0.55;
    let y = canvas.height * 0.2;
    ctx.moveTo(x, y);
    for (let i = 0; i < 7; i++) {
        x += 8 - Math.random() * 16;
        y += 14 + Math.random() * 10;
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#ffe066";
    ctx.lineWidth = 5;
    ctx.shadowColor = "#ffffcc";
    ctx.shadowBlur = 20;
    ctx.globalAlpha = 0.8;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
    ctx.restore();
}

// Animation loop
let lastWeather = null;
function animate() {
    if (lastWeather) drawWeather(lastWeather);
    requestAnimationFrame(animate);
}
animate();

async function initialize() {
    try {
        clearError();
        // 1. Get location
        const loc = await fetchLocation();
        if (loc.error) throw loc.error;
        locElem.textContent = `${loc.city}, ${loc.region}, ${loc.country}`;
        const [lat, lon] = loc.loc.split(',');

        // 2. Get weather
        const weather = await fetchWeather(lat, lon);
        if (weather.error) throw weather.error;
        weatherElem.textContent = describeWeather(weather);

        // 3. Set for animation
        lastWeather = weather;
    } catch (e) {
        setError("Could not fetch weather. Try again later.");
        locElem.textContent = "";
        weatherElem.textContent = "";
    }
}

initialize();
