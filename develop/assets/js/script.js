// variable for DOM elements
const searchBtn = document.querySelector(".searchBtn");
const cityInput = document.querySelector("#city-name");
const cityNameEl = document.querySelector("#searched-city");
const cityContainer = document.querySelector("#city-container");
const tempEl = document.querySelector("#temp");
const windEl = document.querySelector("#wind");
const humidityEl = document.querySelector("#humidity");
const uvEl = document.querySelector("#uv");
const fiveDayContainer = document.querySelector("#five-day");
const searchedCity = document.querySelector(".city-button");
const fiveContainer = document.querySelector(".five-container");
const historyContainer = document.querySelector(".history-container");
var searchedCityEl;
var searchedCityContainer;

// setting variable for API key
const apiKey = "208b86d4af1d114dc52f06c491f0fcd2";

// array to store data for localStorage
var cities = [];

// function to search for city
function formSubmitHandler() {

  // sets variable for city name and clears white space for link to work
  let cityName = cityInput.value.trim();


  // functions to get weather information and passes arguments to functions
  getCityUrl(cityName);
  cityButton(cityName);
  searchHistory(cityName);

  // clears the value of cityInput
  cityInput.value = "";
}

// sets the names of searched cities into localStorage
function searchHistory(city) {
    cities.push(city)
    localStorage.setItem("cities", JSON.stringify(cities));
}

// grabs city names from localStorage
function loadHistory() {
    let searchedCities = localStorage.getItem("cities");
    if (!searchedCities) {
        return false;
    }
    
    searchedCities = JSON.parse(searchedCities);
    
    for (i=0; i < searchedCities.length; i++) {
        showHistory(searchedCities[i])
        cities.push(searchedCities[i]);
    }
}

// keeps city names on the screen after the page refreshes
function showHistory(city) {
    // creates elements to store city names
    searchedCityContainer = document.createElement("div")
    searchedCityEl = document.createElement("button");
    searchedCityEl.textContent = city;
    searchedCityEl.classList = "d-flex w-100 btn btn-dark border p-2";

    // places elements
    historyContainer.appendChild(searchedCityContainer)
    searchedCityContainer.appendChild(searchedCityEl);

    // click function to allow elements to research for those cities
    searchedCityEl.addEventListener("click", function() {
        getCityUrl(city);
    });
}

// grabbing API info from weather site
function getCityUrl(city) {
  // the build up of the URL to grab weather info
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey

  // sends request to sever for information
  fetch(apiUrl).then(function (response) {
    // if response works then we'll have an array of data
    if (response.ok) {
      response.json().then(function (data) {
        // calls the function to display current weather
        displayWeatherInfo(data, city);
      });
      // if no then application throws an error message to user
    } else {
      alert("Error: City not found");
    }
  });
}

// function to display current weather info
function displayWeatherInfo(weather, city) {

  // creates variables for current date
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();

  // sets variable for the current weather icon
  var weatherPic = weather.weather[0].icon;

  // removes class to show whats in container
  cityContainer.classList.remove("d-none");

  // assigns name of city to a variable
  cityNameEl.textContent = city;

  // creates span to show the current date
  var currentDate = document.createElement("span");
  currentDate.textContent = " " + "(" + month + "/" + day + "/" + year + ")";
  cityNameEl.appendChild(currentDate);

  // creates image to show icon of current weather
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
  cityNameEl.appendChild(weatherIcon);

  // sets the weather information to its corresponding html tag
  tempEl.textContent = weather.main.temp;
  humidityEl.textContent = weather.main.humidity;
  windEl.textContent = weather.wind.speed;
  
  // sets variables for latitude and longitude 
  var lat = weather.coord.lat;
  var lon = weather.coord.lon;

  // calls functions to get UV info and display five day forecast
  getUvIndex(lat, lon);
  getFive(lat, lon);
}

// function to get UV info
function getUvIndex(lat, lon) {

  // the build for grabbing UV info
  let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";

  // sends request to sever for information
  fetch(apiUrl).then(function (response) {
    // if response works then we'll have an array of data
    if (response.ok) {
      response.json().then(function (data) {
        // calls the function to display UV index
        displayUvIndex(data);
      });
      // if no then application throws an error message to user
    } else {
      alert("Error: City not found");
    }
  });
}

//function to display UV index
function displayUvIndex(index) {
  // sets context of element to UV info
  uvEl.textContent = index.daily[0].uvi;

  // if statement to give color warning for UV index
  if (index.daily[0].uvi < 2) {
    uvEl.setAttribute("class", "bg-success text-white p-2")
  } else if (index.daily[0].uvi < 4) {
    uvEl.setAttribute("class","bg-warning text-black p-2");
  } else {
    uvEl.setAttribute("class", "bg-danger text-white p-2")
  }
}

// function to get info for five-day forecast
function getFive(lat, lon) {
  // the build up for the URL
  let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + apiKey;
    
  // sends request to sever for information
  fetch(apiUrl).then(function(response) {
    // if response works then we'll have an array of data
    if (response.ok) {
      response.json().then(function (data) {
        // calls function to display five day forecast
        displayFive(data);
      });
      // if no then application throws an error message to user
    } else {
      alert("Error: City not found");
    }
  });

  // function to display five day forecast
  function displayFive(city) {

    // removes the ability to not see whats in the container
    fiveDayContainer.classList.remove("d-none");

    // resets container when new city is searched
    fiveContainer.innerHTML = "";

    // sets a variable to the array of info passed in
    var forecast = city.daily;

    // for loop to create elements to display five day forecast
    for (i=1; i < forecast.length-2; i=i+1) {
      // sets new variable for array in for loop
      var dailyForecast = forecast[i];
      // sets variable for weather icon
      var weatherPic = dailyForecast.weather[0].icon;
      // sets variables for date
      const forecastDate = new Date(dailyForecast.dt * 1000);
      const forecastDay = forecastDate.getDate();
      const forecastMonth = forecastDate.getMonth() + 1;
      const forecastYear = forecastDate.getFullYear();

      // creates div element to hold weather info
      fiveDayDiv = document.createElement("div");
      fiveDayDiv.classList = "card bg-primary text-light m-2";

      // creates header tag to display date and append date
      fiveDayDate = document.createElement("h4");
      fiveDayDate.textContent = forecastMonth + "/" + forecastDay + "/" + forecastYear;
      fiveDayDate.classList = "card-header text-center";
      fiveDayDiv.append(fiveDayDate);

      // creates and appends an image tag to hold the weather icons
      var weatherIcon = document.createElement("img");
      weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
      fiveDayDiv.appendChild(weatherIcon);

      // creates and appends a p tag to display temperature
      fiveDayTemp = document.createElement("p");
      fiveDayTemp.textContent = "Temp: " + dailyForecast.temp.day + "°F";
      console.log(fiveDayTemp.textContent);
      fiveDayTemp.classList = "card-body text-center";
      fiveDayDiv.append(fiveDayTemp);

      // creates and appends a p tag to display wind speed
      fiveDayWind = document.createElement("p");
      fiveDayWind.textContent = "Wind: " + dailyForecast.wind_speed + "MPH";
      console.log(fiveDayWind.textContent);
      fiveDayWind.classList = "card-body text-center";
      fiveDayDiv.append(fiveDayWind);

      // creates and appends a p tag to display humidity
      fiveDayHumidity = document.createElement("p");
      fiveDayHumidity.textContent = "Humidity " + dailyForecast.humidity + "%";
      console.log(fiveDayHumidity.textContent);
      fiveDayHumidity.classList = "card-body text-center";
      fiveDayDiv.append(fiveDayHumidity);

      // appends entire dive to container
      fiveContainer.append(fiveDayDiv);
    }
  }
}

// function to create and display searched city button
function cityButton(city) {
  cityBtnEl = document.createElement("button");
  cityBtnEl.textContent = city;
  cityBtnEl.classList = "d-flex w-100 btn btn-dark border p-2";

  // an eventlistener so that the cities that have been searched can be clicked and searched again
  cityBtnEl.addEventListener("click", function () {
   getCityUrl(city);
  });

  // appends city buttons to container
  searchedCity.append(cityBtnEl);
}

// calls the function to load history from localStorage
loadHistory();

// event listener to start application
searchBtn.addEventListener("click", formSubmitHandler);