// OpenWeatherMap API
const apiKey = "801d815f2a11c0fe97e05465eeb1519f"; // Replace with your API key
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
// const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
const extendedForecastUrl = "https://pro.openweathermap.org/data/2.5/forecast/climate";


// DOM Elements
const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const alertMessage = document.getElementById("alertMessage");
const forecastContainer = document.getElementById("forecastContainer");

// Fetch Current Weather
// function fetchCurrentWeather(city) {
//     fetch(`${currentWeatherUrl}?q=${city}&units=metric&appid=${apiKey}`)
//         .then(response => response.json())
//         .then(data => {
//             cityName.textContent = `City: ${data.name}`;
//             temperature.textContent = `Temperature: ${data.main.temp}°C`;
//             condition.textContent = `Condition: ${data.weather[0].main}`;
//             displayAlerts(data);
//         })
//         .catch(error => console.error("Error fetching current weather:", error));
// }

// Updated Fetch 20-Day Forecast
function fetchForecast(city) {
    forecastContainer.innerHTML = ""; // Clear previous forecast

    // Use the updated 20-day forecast API
    fetch(`${extendedForecastUrl}?q=${city}&cnt=20&units=metric&appid=801d815f2a11c0fe97e05465eeb1519f`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch forecast data");
            }
            return response.json();
        })
        .then(data => {
            data.list.forEach(item => {
                const forecastItem = document.createElement("div");
                forecastItem.classList.add("forecast-item");

                // Generate the weather icon URL
                const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

                forecastItem.innerHTML = `
                    <h4>${new Date(item.dt * 1000).toLocaleDateString()}</h4>
                    <img src="${iconUrl}" alt="${item.weather[0].description}" class="weather-icon">
                    <p>Temp: ${item.temp.day}°C</p>
                    <p>Min: ${item.temp.min}°C / Max: ${item.temp.max}°C</p>
                    <p>${item.weather[0].description}</p>
                `;
                forecastContainer.appendChild(forecastItem);
            });
        })
        .catch(error => {
            console.error("Error fetching forecast:", error);
            alert("Could not load forecast data. Please try again later.");
        });
}

// Fetch Current Weather with Icon
function fetchCurrentWeather(city) {
    fetch(`${currentWeatherUrl}?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            cityName.textContent = `City: ${data.name}`;
            temperature.textContent = `Temperature: ${data.main.temp}°C`;
            condition.textContent = `Condition: ${data.weather[0].main}`;

            // Clear previous weather icon
            const existingIcon = document.querySelector(".weather-icon");
            if (existingIcon) {
                existingIcon.remove();
            }

            // Add weather icon
            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            const weatherIcon = document.createElement("img");
            weatherIcon.src = iconUrl;
            weatherIcon.alt = data.weather[0].description;
            weatherIcon.classList.add("weather-icon");

            // Insert the icon in the middle of the current weather bar
            const currentWeatherSection = document.querySelector("#currentWeather .current-weather");
            // currentWeatherSection.insertBefore(currentWeatherSection.firstChild, weatherIcon);
            currentWeatherSection.appendChild(weatherIcon);


            displayAlerts(data);
        })
        .catch(error => console.error("Error fetching current weather:", error));
}


// Display Alerts
function displayAlerts(weatherData) {
    const condition = weatherData.weather[0].main.toLowerCase();
    if (condition.includes("rain")) {
        alertMessage.textContent = "⚠️ Heavy Rain Alert! Stay indoors.";
        alertMessage.style.color = "red";
    } else if (weatherData.main.temp > 35) {
        alertMessage.textContent = "⚠️ Heat Wave Alert! Stay hydrated.";
        alertMessage.style.color = "orange";
    } else {
        alertMessage.textContent = "No alerts. Weather is clear.";
        alertMessage.style.color = "green";
    }
}

// Initialize Weather Map
const map = L.map("mapContainer").setView([20, 78], 4); // Default location: India
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

function changeLayer(layerType) {
    map.eachLayer((layer) => {
        if (layer.options && layer.options.layer) {
            map.removeLayer(layer);
        }
    });

    L.tileLayer(`https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${apiKey}`, {
        layer: layerType,
        attribution: "© OpenWeatherMap contributors",
    }).addTo(map);
}

// Search Button Event Listener
searchButton.addEventListener("click", () => {
    const city = locationInput.value.trim();
    if (city) {
        fetchCurrentWeather(city);
        fetchForecast(city);
    } else {
        alert("Please enter a city name.");
    }
});
