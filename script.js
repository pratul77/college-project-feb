// OpenWeatherMap API
const apiKey = "60ff3ffe97da96f28c740071f6c6c9dd"; // Replace with your API key
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

    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

    forecastItem.innerHTML = `
        <h4>${new Date(item.dt * 1000).toLocaleDateString()}</h4>
        <img src="${iconUrl}" alt="${item.weather[0].description}" class="weather-icon">
        <p>Temp: ${item.temp.day}°C</p>
        <p>Min: ${item.temp.min}°C / Max: ${item.temp.max}°C</p>
        <p>${item.weather[0].description}</p>
    `;

    forecastItem.addEventListener("click", () => {
        showForecastDetailsInModal(item);
    });

    forecastContainer.appendChild(forecastItem);
    // 📊 Chart.js: Graph for 7-day forecast
const labels = data.list.slice(0, 7).map(item =>
  new Date(item.dt * 1000).toLocaleDateString()
);
const temps = data.list.slice(0, 7).map(item => item.temp.day);

// Clear existing chart (if any)
const chartCanvas = document.getElementById("forecastChart");
if (chartCanvas && chartCanvas.chart) {
  chartCanvas.chart.destroy();
}

const ctx = chartCanvas.getContext("2d");
chartCanvas.chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Temperature (°C)",
      data: temps,
      borderColor: "#00f0ff",
      backgroundColor: "rgba(0, 240, 255, 0.2)",
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false
      }
    }
  }
});

});

        })
        .catch(error => {
            console.error("Error fetching forecast:", error);
            alert("Could not load forecast data. Please try again later.");
            
        });
}
function showForecastDetails(item) {
  const box = document.getElementById("forecastDetailBox");
  const section = document.getElementById("forecastDetails");

  const date = new Date(item.dt * 1000).toLocaleDateString();
  const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
  const description = item.weather[0].description;
  const temp = item.temp.day;
  const min = item.temp.min;
  const max = item.temp.max;
  const humidity = item.humidity;
  const pressure = item.pressure;

  box.innerHTML = `
    <p><strong>Date:</strong> ${date}</p>
    <p><img src="${iconUrl}" alt="${description}" class="weather-icon"></p>
    <p><strong>Condition:</strong> ${description}</p>
    <p><strong>Temperature:</strong> ${temp}°C</p>
    <p><strong>Min:</strong> ${min}°C / <strong>Max:</strong> ${max}°C</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Pressure:</strong> ${pressure} hPa</p>
  `;

  section.style.display = "block";
  section.scrollIntoView({ behavior: "smooth" });
}
function showForecastDetailsInModal(item) {
    const modal = document.getElementById("forecastModal");
    const box = document.getElementById("forecastDetailBox");

    const date = new Date(item.dt * 1000).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const description = item.weather[0].description;
    const temp = item.temp.day;
    const min = item.temp.min;
    const max = item.temp.max;
    const humidity = item.humidity;
    const pressure = item.pressure;

    box.innerHTML = `
        <p><strong>Date:</strong> ${date}</p>
        <img src="${iconUrl}" class="weather-icon" alt="${description}">
        <p><strong>Condition:</strong> ${description}</p>
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Min:</strong> ${min}°C / Max: ${max}°C</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Pressure:</strong> ${pressure} hPa</p>
    `;

    modal.style.display = "flex";
}


// Fetch Current Weather with Icon
function fetchCurrentWeather(city) {
    
    fetch(`${currentWeatherUrl}?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            cityName.textContent = `City: ${data.name}`;
            temperature.textContent = `Temperature: ${data.main.temp}°C`;
            condition.textContent = `Condition: ${data.weather[0].main}`;
            // Clear previous classes
document.body.classList.remove("sunny", "rainy", "cloudy", "night", "snowy", "thunder");
const icon = document.getElementById("skyIcon");
icon.style.display = "none";

// Condition setup
const cond = data.weather[0].main.toLowerCase();
const now = data.dt;
const sunset = data.sys.sunset;
const isNight = now > sunset;

// Weather-based background animation
if (cond.includes("snow")) {
    document.body.classList.add("snowy");
} else if (cond.includes("thunder")) {
    document.body.classList.add("thunder");
} else if (cond.includes("rain")) {
    document.body.classList.add("rainy");
} else if (cond.includes("cloud")) {
    document.body.classList.add("cloudy");
} else if (cond.includes("clear") || cond.includes("sun")) {
    document.body.classList.add("sunny");
}

// Night fallback
if (isNight) {
    document.body.classList.add("night");
}

// --- Show sun or moon ---
icon.style.display = "block";
icon.style.backgroundImage = isNight
  ? "url('https://cdn-icons-png.flaticon.com/512/1164/1164954.png')" // Moon icon
  : "url('https://cdn-icons-png.flaticon.com/512/869/869869.png')"; // Sun icon



            suggestMoodPlaylist(data.weather[0].main);
            getDressingIndex(data.main.temp, data.wind.speed, data.weather[0].main.toLowerCase());



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
    function displayHealthTips(temp, condition) {
        const tips = document.getElementById("healthTips");
        if (temp > 35) {
            tips.textContent = "Health Tip: Stay hydrated, avoid direct sunlight.";
        } else if (temp < 10) {
            tips.textContent = "Health Tip: Wear warm clothes to avoid illness.";
        } else if (condition.includes("rain")) {
            tips.textContent = "Health Tip: Carry an umbrella and avoid wet shoes.";
        } else {
            tips.textContent = "Health Tip: Weather is good for outdoor activity.";
        }
    }
    
    function displayMoodAdvice(temp, condition) {
        const mood = document.getElementById("moodAdvice");
        if (condition.includes("clear")) {
            mood.textContent = "Mood Advice: Great day for a walk or some sunshine!";
        } else if (condition.includes("rain")) {
            mood.textContent = "Mood Advice: Cozy up with a book or movie!";
        } else {
            mood.textContent = "Mood Advice: Make the most of your day!";
        }
    }
    
    function displayEmergencyKit(condition, temp) {
        const kit = document.getElementById("emergencyKit");
        if (condition.includes("storm") || temp > 40) {
            kit.textContent = "Emergency Kit: Water, flashlight, charger, basic meds.";
        } else {
            kit.textContent = "";
        }
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
const voiceBtn = document.getElementById("voiceSearchButton");
if (voiceBtn && "webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {
        recognition.start();
    });

    recognition.onresult = function (event) {
        const city = event.results[0][0].transcript;
        locationInput.value = city;
        fetchCurrentWeather(city);
        fetchForecast(city);
    };

    recognition.onerror = function () {
        alert("Voice input failed. Please try again.");
    };
}


// Search Button Event Listener
searchButton.addEventListener("click", () => {
    const city = locationInput.value.trim();
    if (city) {
        fetchCurrentWeather(city);
        fetchForecast(city);
        showSmartDailyPlanner(city);

    } else {
        alert("Please enter a city name.");
    }
    

});
function formatHour(hour) {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
}
function showSmartDailyPlanner(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      let bestSlotsSet = new Set();

      data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const hour = date.getHours();
        const temp = item.main.temp;
        const condition = item.weather[0].main.toLowerCase();

        if (hour >= 5 && hour <= 9 && temp <= 30 && !condition.includes("rain")) {
          bestSlotsSet.add(hour); // Save unique good hours
        }
      });

      const bestSlots = Array.from(bestSlotsSet)
        .sort((a, b) => a - b)
        .map(hour => {
          const period = hour >= 12 ? "PM" : "AM";
          const formatted = hour % 12 === 0 ? 12 : hour % 12;
          return `${formatted}:00 ${period}`;
        });

      const output = bestSlots.length > 0
        ? `Best time to go outside today: ${bestSlots.join(", ")}.`
        : "No ideal outdoor time today. Stay safe indoors.";

      // ✅ Show in the new card
      document.getElementById("smartPlannerText").textContent = output;
    })
    .catch(err => {
      console.error("Smart Planner Error", err);
      document.getElementById("smartPlannerText").textContent = "Could not load planner data.";
    });
}



// Time formatting helper
function formatHour(hour) {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
}

document.getElementById("compareButton").addEventListener("click", () => {
    const city1 = document.getElementById("cityOneInput").value.trim();
    const city2 = document.getElementById("cityTwoInput").value.trim();
    if (city1 && city2) {
        compareTwoCities(city1, city2);
    } else {
        alert("Please enter both city names.");
    }
});

function compareTwoCities(city1, city2) {
    const compareResult = document.getElementById("compareResult");
    compareResult.innerHTML = "Loading...";

    Promise.all([
        fetch(`${currentWeatherUrl}?q=${city1}&units=metric&appid=${apiKey}`).then(res => res.json()),
        fetch(`${currentWeatherUrl}?q=${city2}&units=metric&appid=${apiKey}`).then(res => res.json())
    ])
    .then(([data1, data2]) => {
        compareResult.innerHTML = `
            <div class="forecast-item">
                <h3>${data1.name}</h3>
                <p>Temperature: ${data1.main.temp}°C</p>
                <p>Condition: ${data1.weather[0].main}</p>
                <p>Humidity: ${data1.main.humidity}%</p>
                <p>Wind: ${data1.wind.speed} km/h</p>
            </div>
            <div class="forecast-item">
                <h3>${data2.name}</h3>
                <p>Temperature: ${data2.main.temp}°C</p>
                <p>Condition: ${data2.weather[0].main}</p>
                <p>Humidity: ${data2.main.humidity}%</p>
                <p>Wind: ${data2.wind.speed} km/h</p>
            </div>
        `;
    })
    .catch(err => {
        console.error("Compare Error", err);
        compareResult.innerHTML = "Failed to fetch weather data.";
    });
}
function suggestMoodPlaylist(condition) {
  const moodText = document.getElementById("moodPlaylistText");
  const moodLink = document.getElementById("moodPlaylistLink");

  let message = "";
  let link = "";

  condition = condition.toLowerCase();

  if (condition.includes("rain")) {
    message = "Rainy Mood? Here's a Lo-fi Chill playlist:";
    link = "https://www.youtube.com/watch?v=DWcJFNfaw9c";
  } else if (condition.includes("clear") || condition.includes("sun")) {
    message = "Sunny Mood! Enjoy an upbeat vibe:";
    link = "https://www.youtube.com/watch?v=MG2fFZ2quWc";
  } else if (condition.includes("cloud")) {
    message = "Cloudy and calm? Try this chill playlist:";
    link = "https://www.youtube.com/watch?v=jfKfPfyJRdk";
  } else if (condition.includes("snow") || condition.includes("cold")) {
    message = "Cold outside? Warm up with acoustic vibes:";
    link = "https://www.youtube.com/watch?v=9P2wxxAKfK0";
  } else {
    message = "Your weather mood mix is ready:";
    link = "https://www.youtube.com/watch?v=5qap5aO4i9A";
  }

  moodText.textContent = message;
  moodLink.innerHTML = `<a href="${link}" target="_blank">🎶 Open Playlist</a>`;
}

function getDressingIndex(temp, wind, condition) {
  const dressingDiv = document.getElementById("dressingIndexText");
  let score = 0;
  let advice = "";

  // Basic clothing logic
  if (temp >= 35) {
    score = 10;
    advice = "It's very hot! Wear light cotton clothes, sunglasses, and stay hydrated.";
  } else if (temp >= 25 && temp < 35) {
    score = 50;
    advice = "Warm weather. T-shirt and light pants are fine.";
  } else if (temp >= 15 && temp < 25) {
    score = 75;
    advice = "Cool and pleasant. Wear long sleeves or light jacket.";
  } else if (temp >= 5 && temp < 15) {
    score = 85;
    advice = "Chilly! Use warm jacket and closed shoes.";
  } else {
    score = 95;
    advice = "Very cold! Wear thermal layers, gloves, and a heavy coat.";
  }

  if (condition.includes("rain")) {
    score += 5;
    advice += " Don't forget your umbrella or raincoat.";
  }

  // ✅ Show inside the new card
  dressingDiv.innerHTML = ` <strong>Dressing Index:</strong> ${score}/100<br>${advice}`;
}

document.getElementById("exportPDFButton").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Collect content
    const city = document.getElementById("cityName").textContent || "City: -";
    const temp = document.getElementById("temperature").textContent || "Temp: -";
    const cond = document.getElementById("condition").textContent || "Condition: -";
    const alert = document.getElementById("alertMessage").textContent || "No Alert";
    const health = document.getElementById("healthTips")?.textContent || "-";
    const mood = document.getElementById("moodAdvice")?.textContent || "-";
    const dress = document.getElementById("dressingIndex")?.textContent || "-";

    // Add content to PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("WeatherWise 20 - Weather Report", 10, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleString()}`, 10, 30);
    doc.text(city, 10, 40);
    doc.text(temp, 10, 50);
    doc.text(cond, 10, 60);
    doc.text("Alert: " + alert, 10, 70);
    doc.text("Health Tip: " + health, 10, 80);
    doc.text("Mood Advice: " + mood, 10, 90);
    doc.text("Dressing Advice: " + dress, 10, 100);

    // Save
    doc.save("WeatherWise_Report.pdf");
});
document.getElementById("chatButton").addEventListener("click", () => {
    const input = document.getElementById("chatInput").value.trim();
    handleWeatherChat(input);
});

function handleWeatherChat(input) {
    const responseBox = document.getElementById("chatResponse");
    if (!input) {
        responseBox.textContent = "Please enter a question.";
        return;
    }

    const words = input.toLowerCase().split(" ");
    let city = "";
    let dateOffset = 0;

    // Try to extract city from the question
    for (let i = 0; i < words.length; i++) {
        if (words[i] === "in" && words[i + 1]) {
            city = words[i + 1].charAt(0).toUpperCase() + words[i + 1].slice(1);
            break;
        }
    }

    // Check for "tomorrow", "today", "weekend"
    if (input.includes("tomorrow")) {
        dateOffset = 1;
    } else if (input.includes("weekend")) {
        dateOffset = 3; // approx next weekend
    } else {
        dateOffset = 0; // today by default
    }

    if (!city) {
        responseBox.textContent = "Couldn't understand the city. Try: 'Will it rain tomorrow in Delhi?'";
        return;
    }

    responseBox.textContent = "Thinking...";

    // Fetch forecast
    fetch(`${extendedForecastUrl}?q=${city}&cnt=20&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            const dayData = data.list[dateOffset];
            const temp = dayData.temp.day;
            const condition = dayData.weather[0].main;
            const rain = condition.toLowerCase().includes("rain");

            responseBox.innerHTML = `
                City: ${city}<br>
                Date: ${new Date(dayData.dt * 1000).toDateString()}<br>
                Forecast: ${condition}, ${temp}°C<br>
                ${rain ? "Yes, it might rain!" : "No rain expected."}
            `;
        })
        .catch(() => {
            responseBox.textContent = "Sorry, could not get the forecast. Check your input or internet.";
        });
}
// Voice recognition setup
const voiceButton = document.getElementById("voiceButton");
const chatInput = document.getElementById("chatInput");

voiceButton.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Sorry, your browser doesn't support voice input.");
    return;
  }

  const recognition = new webkitSpeechRecognition(); // Chrome only
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  voiceButton.textContent = "🎙️ Listening...";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    voiceButton.textContent = "🎙️ Speak";
    document.getElementById("chatButton").click(); // Trigger chat logic
  };

  recognition.onerror = (e) => {
    console.error(e);
    voiceButton.textContent = "🎙️ Try Again";
  };

  recognition.onend = () => {
    voiceButton.textContent = "🎙️ Speak";
  };
});
// Close modal when "X" clicked
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("forecastModal").style.display = "none";
});

// Optional: click outside modal to close
window.addEventListener("click", (e) => {
  const modal = document.getElementById("forecastModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
function applyWeatherEffect(condition) {
  const effect = document.getElementById("weatherEffect");
  effect.className = ''; // Clear previous effect

  condition = condition.toLowerCase();

  if (condition.includes("thunderstorm")) {
    effect.classList.add('lightning');
  } else if (condition.includes("snow")) {
    effect.classList.add('snow');
  } else if (condition.includes("clear")) {
    effect.classList.add('sun');
  } else if (condition.includes("mist") || condition.includes("fog")) {
    effect.classList.add('fog');
  }
}
const themeSwitch = document.getElementById("themeSwitch");

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

window.addEventListener("load", () => {
  lucide.createIcons();
});
function readWeather() {
  const city = document.getElementById("cityName").textContent;
  const temp = document.getElementById("temperature").textContent;
  const cond = document.getElementById("condition").textContent;
  const alert = document.getElementById("alertMessage").textContent || "";

  const message = `${city}. ${temp}. ${cond}. ${alert}`;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}
window.addEventListener("DOMContentLoaded", () => {
  const voiceBtn = document.getElementById("voiceSearchButton");

  if (!voiceBtn) {
    console.warn("🎤 voiceSearchButton not found in the DOM.");
    return;
  }

  voiceBtn.addEventListener("click", () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Add glow
    voiceBtn.classList.add("listening");

    recognition.start();

    recognition.onresult = (event) => {
      const spokenCity = event.results[0][0].transcript;
      document.getElementById("locationInput").value = spokenCity;

      fetchCurrentWeather(spokenCity);
      fetchForecast(spokenCity);
      showSmartDailyPlanner(spokenCity);
    };

    recognition.onerror = (event) => {
      alert("Voice recognition error: " + event.error);
    };

    recognition.onend = () => {
      voiceBtn.classList.remove("listening");
    };
  });
});
