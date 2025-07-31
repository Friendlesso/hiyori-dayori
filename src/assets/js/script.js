document.getElementById('fetchWeatherBtn').addEventListener('click', () => {
  const city = document.querySelector('.city_input').value.trim();
  if(!city) {
    alert('Please enter a city name');
    return;
  }

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
    .then(res => res.json())
    .then(data => {
      if(data.results && data.results.length > 0) {
        const {latitude, longitude} = data.results[0];
        console.log("Cords:", latitude,longitude);
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
      } else {
        throw new Error("City not found");
      }
    })
    .then(res => res.json())
    .then(weatherData => {
      console.log("Weather data:", weatherData.current_weather);
      document.querySelector('.temp_display').textContent = `${weatherData.current_weather.temperature}°C`;
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
});