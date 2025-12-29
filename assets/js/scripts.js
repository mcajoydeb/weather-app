const apiKey = "daf3181939ef4977868132737252812";
// https://api.weatherapi.com/v1/forecast.json?key=daf3181939ef4977868132737252812&q=London&days=5
getWeather();

function getWeather() {
  const city = document.getElementById("city").value || "London";

  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

  fetch(url)
    .then((response) => {
    
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      let day_name = getDay()
      let weather_condition_icon = data.current.condition.icon ? data.current.condition.icon : '//cdn.weatherapi.com/weather/64x64/day/122.png'
      document.getElementById("location").innerText = data.location.name;
      document.getElementById("date_n_day").innerText = `${day_name} ${data.location.localtime}`;
      
      document.getElementById("current_temp").innerText = `${data.current.temp_c}°C`;
      document.getElementById("current_condition").innerText = `${data.current.condition.text}`;
      document.getElementById("weather_details_condition").setAttribute("src",'https:'+weather_condition_icon) ;
      
      
      
    })
    .catch((error) => {
      document.getElementById("weather").innerHTML =
        `<p class="text-red-500">${error.message}</p>`;
    });
}

function getDay(){
  const today = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const dayName = days[today.getDay()];
  return dayName;
}