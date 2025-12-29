const apiKey = "b22d7c0384030d5f22baa901956a5cd8";

function getWeather() {
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  //const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const url = `http://api.weatherapi.com/v1/current.json?key=daf3181939ef4977868132737252812&q=London&aqi=no`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
      document.getElementById("result").innerHTML = `
        <h3>${data.name}</h3>
        <p>🌡 Temperature: ${data.main.temp}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬 Wind: ${data.wind.speed} m/s</p>
        <p>☁ Condition: ${data.weather[0].main}</p>
      `;
    })
    .catch(() => {
      document.getElementById("result").innerHTML = "City not found!";
    });
}

getWeather();
