const apiKey = "daf3181939ef4977868132737252812";
const apUrl = "http://api.weatherapi.com/v1/forecast.json?key=";
getWeather();

function getWeather() {
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
      document.getElementById("city_not_found").innerHTML =
        `<p class="text-red-500 text-shadow font-extrabold fade-text">${error.message}</p>`;
    });
}

  function fetchWeatherByCoords(lat, lon) {
    
    const url = `${apUrl}${apiKey}&q=${lat},${lon}&days=8`;
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
      document.getElementById("city_not_found").innerHTML =
        `<p class="text-red-500 text-shadow font-extrabold fade-text">${error.message}</p>`;
    });
  }

  function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        fetchWeatherByCoords(lat, lon);
      },
      (error) => {
        alert("Location access denied");
      }
    );
  }

function getDay(){
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

function renderWeather(data){
      let day_name = getDay()
      let weather_condition_icon = data.current.condition.icon ? data.current.condition.icon : '//cdn.weatherapi.com/weather/64x64/day/122.png'
      document.getElementById("location").innerText = data.location.name;
      document.getElementById("date_n_day").innerText = `${day_name} ${data.location.localtime}`;
      
      document.getElementById("current_temp").innerText = `${data.current.temp_c}°C`;
      document.getElementById("current_condition").innerText = `${data.current.condition.text}`;
      document.getElementById("weather_details_condition").setAttribute("src",'https:'+weather_condition_icon) ;
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
        
        forcast+='<div class="p-3 rounded-xl bg-white/20">'+name+'<br><span class="font-semibold">'+day.day.avgtemp_c+'°C</span></div>'
      
        if (date.getDay() === 1) return; // stop at Monday
      });
      
      document.getElementById("weekdays").innerHTML = forcast;
}