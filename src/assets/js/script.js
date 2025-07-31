  const { ipcRenderer } = require('electron');

  document.querySelector('.js-btn-close').addEventListener('click', () => {
    ipcRenderer.send('close-app');
  });

const weatherCodeMap = {
  0: "Clear Sky",
  1: "Mostly Clear",
  2: "Partly Cloudy",
  3: "Overcast Sky",
  45: "Dense Fog",
  48: "Icy Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Heavy Drizzle",
  56: "Freezing Mist",
  57: "Icy Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Freezing Rain",
  67: "Icy Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Light Showers",
  81: "Moderate Showers",
  82: "Heavy Showers",
  85: "Light Snowfall",
  86: "Heavy Snowfall",
  95: "Thunderstorm",
  96: "Hailstorm Light",
  99: "Hailstorm Severe"
};

let currentTempCelsius = null;

function updateTemperatureDisplay(unit) {
  const tempDisplayEl = document.querySelector('.js-temp-display');
  if(currentTempCelsius === null) return;

  if (unit === 'C'){
    tempDisplayEl.textContent = `${currentTempCelsius.toFixed(1)}°C`
  } else if (unit === 'F'){
    const tempF = celsiusToFahrenheit(currentTempCelsius);
    tempDisplayEl.textContent = `${tempF.toFixed(1)}°F`
  }
}

document.getElementById('fetchWeatherBtn').addEventListener('click', () => {
  const inputEl = document.querySelector('.js-city-input');
  const city = inputEl.value.trim();
  if(!city) {
    return;
  }

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
    .then(res => res.json())
    .then(data => {
      if(data.results && data.results.length > 0) {
        const {latitude, longitude} = data.results[0];
        console.log("Cords:", latitude,longitude);
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weathercode&current_weather=true`)
      } else {
        throw new Error("City not found");
      }
    })
    .then(res => res.json())
    .then(weatherData => {
      console.log("Weather data:", weatherData.current_weather);
      currentTempCelsius = weatherData.current_weather.temperature;
      updateTemperatureDisplay('C');
      inputEl.value = ``;
      const hourlyCodes = weatherData.hourly.weathercode;
        document.querySelector('.js-day-text').textContent = getWeatherDescription(hourlyCodes[0]);
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
});

function getWeatherDescription(code) {
  return weatherCodeMap[code];
}
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function setTemperature(celsius){
  currentTempCelsius = celsius;
  updateTemperatureDisplay('C');
}

document.querySelector('.js-btn-celsius').addEventListener('click', () => {
  updateTemperatureDisplay('C');
})

document.querySelector('.js-btn-fahrenheit').addEventListener('click', () => {
  updateTemperatureDisplay('F');
})
