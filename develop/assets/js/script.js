// variable for DOM elements
const searchBtn = document.querySelector(".searchBtn");
const cityInput = document.querySelector("#city-name");
const cityNameEl = document.querySelector("#searched-city");
const cityContainer = document.querySelector("#city-container");
const dateEl = document.querySelector("#date");
const tempEl = document.querySelector("#temp");
const windEl = document.querySelector("#wind");
const humidityEl = document.querySelector("#humidity");
const uvEl = document.querySelector("#uv");
const fiveDayContainer = document.querySelector("#five-day");
const forecastEls = document.querySelector(".forecast");
const clearBtn = document.querySelector(".clear");
const searchedCity = document.querySelector(".city-button");
const fiveContainer = document.querySelector(".five-container");
const weatherIcon = document.querySelector(".weather-icon");
var cities = [];

// function to search for city
function formSubmitHandler() {
  // console.log(cityInput.value);

  // variable for city name
  let cityName = cityInput.value.trim();

  getCityUrl(cityName);
  getFive(cityName);
  cityButton(cityName);
  searchHistory(cityName);

  cityInput.value = "";
}

function searchHistory(city) {
    cities.push(city)
    localStorage.setItem("cities", JSON.stringify(cities));
}

function loadHistory() {
    let searchedCities = localStorage.getItem("cities");
    
    searchedCities = JSON.parse(searchedCities);
    
    for (i=0; i < searchedCities.length; i++) {
        showHistory(searchedCities[i])
        cities.push(searchedCities[i]);
    }
}

function showHistory(city) {
    let searchedCityEl = document.createElement("button");
    searchedCityEl.textContent = city;
    searchedCity.append(searchedCityEl);
}


// grabbing API info from weather site
function getCityUrl(city) {
  const apiKey = "208b86d4af1d114dc52f06c491f0fcd2";
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey +
    "";

  // sends request to sever for information
  fetch(apiUrl).then(function (response) {
    // if response works then we'll have an array of data
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        displayWeatherInfo(data, city);
      });
      // if no then application throws an error message to user
    } else {
      alert("Error: City not found");
    }
  });
}

function displayWeatherInfo(weather, city) {
  // creates variables for current date
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var weatherPic = weather.weather[0].icon;

  //console.log(weather);
  // console.log(city);

  // removes class to show whats in container
  cityContainer.classList.remove("d-none");

  // lists the name of the city that was searched
  cityNameEl.textContent = city;

  // creates span to show the current date
  var currentDate = document.createElement("span");
  currentDate.textContent = " " + "(" + month + "/" + day + "/" + year + ")";
  cityNameEl.appendChild(currentDate);

  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    "http://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
  );
  cityNameEl.appendChild(weatherIcon);

  tempEl.textContent = weather.main.temp;
  windEl.textContent = weather.wind.speed;
  humidityEl.textContent = weather.main.humidity;

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;

  getUvIndex(lat, lon);
}

function getUvIndex(lat, lon) {
  const apiKey = "208b86d4af1d114dc52f06c491f0fcd2";
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey +
    "&cnt=1";

  // sends request to sever for information
  fetch(apiUrl).then(function (response) {
    // if response works then we'll have an array of data
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        displayUvIndex(data);
      });
      // if no then application throws an error message to user
    } else {
      alert("Error: City not found");
    }
  });
}

function displayUvIndex(index) {
  uvEl.textContent = index.daily[0].uvi;
  console.log(uvEl.textContent);

  if (index.daily[0].uvi < 2) {
    uvEl.setAttribute("class", "favorable");
  } else if (index.daily[0].uvi < 4) {
    uvEl.setAttribute("class", "moderate");
  } else {
    uvEl.setAttribute("class", "severe");
  }
}

function getFive(city) {
  const apiKey = "208b86d4af1d114dc52f06c491f0fcd2";
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  // sends request to sever for information
  fetch(apiUrl).then(function (response) {
    // if response works then we'll have an array of data
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        displayFive(data);
      });
      // if no then application throws an error message to user
    } else {
      alert("Error: City not found");
    }
  });

  // loop goes to next hour instead of next day, also need to fix metric for numbers
  function displayFive(city) {
    fiveDayContainer.classList.remove("d-none");
    fiveContainer.innerHTML = "";
    var forecast = city.list;

    for (i = 0; i < forecast.length; i = i + 8) {
      var dailyForecast = forecast[i];
      var weatherPic = city.list[0].weather[0].icon;
      console.log(weatherPic);
      const forecastDate = new Date(dailyForecast.dt * 1000);
      const forecastDay = forecastDate.getDate();
      const forecastMonth = forecastDate.getMonth() + 1;
      const forecastYear = forecastDate.getFullYear();

      fiveDayDiv = document.createElement("div");
      fiveDayDiv.classList = "card bg-primary text-light m-2";

      fiveDayDate = document.createElement("h4");
      fiveDayDate.textContent =
        forecastMonth + "/" + forecastDay + "/" + forecastYear;
      fiveDayDate.classList = "card-header text-center";
      fiveDayDiv.append(fiveDayDate);

      // image wont loop through
      var weatherIcon = document.createElement("img");
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
      );
      fiveDayDiv.appendChild(weatherIcon);

      fiveDayTemp = document.createElement("p");
      fiveDayTemp.textContent = "Temp: " + dailyForecast.main.temp + "°F";
      fiveDayTemp.classList = "card-body text-center";
      fiveDayDiv.append(fiveDayTemp);

      fiveDayWind = document.createElement("p");
      fiveDayWind.textContent = "Wind: " + dailyForecast.wind.speed + "MPH";
      fiveDayWind.classList = "card-body text-center";
      fiveDayDiv.append(fiveDayWind);

      fiveDayHumidity = document.createElement("p");
      fiveDayHumidity.textContent =
        "Humidity " + dailyForecast.main.humidity + "%";
      fiveDayHumidity.classList = "card-body text-center";
      fiveDayDiv.append(fiveDayHumidity);

      fiveContainer.append(fiveDayDiv);
    }
  }
}

function cityButton(city) {
  cityBtnEl = document.createElement("button");
  cityBtnEl.textContent = city;
  cityBtnEl.classList = "d-flex w-100 btn-light border p-2";
  cityBtnEl.addEventListener("click", function () {
    getCityUrl(city);
  });
  searchedCity.append(cityBtnEl);
}

loadHistory();

searchBtn.addEventListener("click", formSubmitHandler);

clearBtn.addEventListener("click", function () {
  localStorage.clear();
});
