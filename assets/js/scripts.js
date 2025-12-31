const apiKey = "daf3181939ef4977868132737252812";
const apUrl = "http://api.weatherapi.com/v1/forecast.json?key=";
const cityInput = document.getElementById("city");
const recentWrapper = document.getElementById("recent-wrapper");
const recentSelect = document.getElementById("recentCities");
var currentTempC = 0;
var currentTempF = 0;
let isCelsius = true;
const STORAGE_KEY = "recent_cities";

getWeather();

function getWeather(cityName = null) {
  const city = document.getElementById("city").value || "London";
  if (!validateCity(city)) return;
  fetchWeather(`q=${city}`);
  saveRecentCity(city);
}

function fetchWeather(query = null) {

  const url = `${apUrl}${apiKey}&${query}&days=8`;
  fetch(url)
    .then(res => res.json())
    .then(data => updateUI(data))
    .catch(() => showError("Invalid location"));
}

function validateCity(city) {
  if (!city) {
    showError("City name cannot be empty");
    return false;
  }
  return true;
}

function showError(msg) {
  document.getElementById("city_not_found").innerHTML =
    `<p class="text-red-500 text-shadow font-extrabold fade-text">${msg}</p>`;
}

function getWeathers() {
  const city = document.getElementById("city").value || "London";
  const url = `${apUrl}${apiKey}&q=${city}&days=8`;
  document.getElementById("city_not_found").innerHTML = '';
  fetch(url)
    .then((response) => {

      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      renderWeather(data)

    })
    .catch((error) => {

    });
}



function getCurrentLocationWeather() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(`q=${latitude},${longitude}`);
    },
    () => showError("Location permission denied")
  );
}

function getDay() {
  const today = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const dayName = days[today.getDay()];
  return dayName;
}

function getDayByDayNum(day_num) {
  const today = new Date();
  today.setDate(today.getDate() + day_num);
  return today;
}

function updateUI(data) {
  let day_name = getDay()
  currentTempC = data.current.temp_c;
  currentTempF = data.current.temp_f;
  let weather_condition_icon = data.current.condition.icon ? data.current.condition.icon : '//cdn.weatherapi.com/weather/64x64/day/122.png'
  document.getElementById("location").innerText = data.location.name;
  document.getElementById("date_n_day").innerText = `${day_name} ${data.location.localtime}`;

  document.getElementById("current_temp").innerText = `${data.current.temp_c}°C`;
  document.getElementById("current_condition").innerText = `${data.current.condition.text}`;
  document.getElementById("weather_details_condition").setAttribute("src", 'https:' + weather_condition_icon);
  document.getElementById("sunrise").innerText = `🌅 ${data.forecast.forecastday[0].astro.sunrise}`;
  document.getElementById("sunset").innerText = `🌇 ${data.forecast.forecastday[0].astro.sunset}`;
  document.getElementById("today").innerText = `${data.forecast.forecastday[0].day.avgtemp_c}°C`;
  document.getElementById("today_condition").innerText = `${data.forecast.forecastday[0].day.condition.text}`;

  document.getElementById("tomorrow").innerText = `${data.forecast.forecastday[1].day.avgtemp_c}°C`;
  document.getElementById("tomorrow_condition").innerText = `${data.forecast.forecastday[1].day.condition.text}`;

  document.getElementById("morning").innerText = `${data.forecast.forecastday[1].hour[6].temp_c}°C`;
  document.getElementById("morning_condition").innerText = `${data.forecast.forecastday[1].hour[6].condition.text}`;

  document.getElementById("afternoon").innerText = `${data.forecast.forecastday[1].hour[13].temp_c}°C`;
  document.getElementById("afternoon_condition").innerText = `${data.forecast.forecastday[1].hour[13].condition.text}`;

  document.getElementById("evening").innerText = `${data.forecast.forecastday[1].hour[18].temp_c}°C`;
  document.getElementById("evening_condition").innerText = `${data.forecast.forecastday[1].hour[18].condition.text}`;

  let forcast = "";
  data.forecast.forecastday.forEach((day, index) => {
    const date = new Date(day.date);

    if (index === 0) return; // skip today

    const name = date.toLocaleDateString("en-US", { weekday: "long" });

    forcast += '<div class="p-3 rounded-xl bg-white/20">' + name + '<br><span class="font-semibold">' + day.day.avgtemp_c + '°C</span></div>'

    if (date.getDay() === 1) return; // stop at Monday
  });

  document.getElementById("weekdays").innerHTML = forcast;
}

function saveRecentCity(city) {
  let cities = JSON.parse(localStorage.getItem("recent")) || [];
  cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());
  cities.unshift(city);
  cities = cities.slice(0, 5);
  localStorage.setItem("recent", JSON.stringify(cities));
  updateDropdown();
}

function updateDropdown() {
  const cities = JSON.parse(localStorage.getItem("recent")) || [];
  if (!cities.length) return;

  recentWrapper.classList.remove("hidden");
  recentSelect.innerHTML = `<option value="">Recent Searches</option>`;
  cities.forEach(city => {
    recentSelect.innerHTML += `<option>${city}</option>`;
  });
}

recentSelect.addEventListener("change", function () {
  const selectedCity = this.value;
  if (selectedCity) {
    cityInput.value = selectedCity;
    getWeather(selectedCity);
  }
});


toggleTemp.addEventListener("click", () => {

  isCelsius = !isCelsius;
  document.getElementById("current_temp").innerText = isCelsius
    ? `${currentTempC}°C`
    : `${currentTempF}°F`;
});