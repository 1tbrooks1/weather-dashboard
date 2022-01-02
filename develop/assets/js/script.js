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




// global variables



// function to search for city
function searchCity() {
    // console.log(cityInput.value);
    
    // variable for city name
    let cityName = cityInput.value.trim();

    localStorage.setItem("search-history", cityName);

    getCityUrl(cityName);
    getFive(cityName);
    getHistory(cityName);
}

// grabbing API info from weather site
function getCityUrl(city) {
    const apiKey = "208b86d4af1d114dc52f06c491f0fcd2"
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey + ""

    // sends request to sever for information
    fetch(apiUrl).then(function(response) {
        // if response works then we'll have an array of data
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayWeatherInfo (data, city);
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

    //console.log(weather);
    // console.log(city);

    // removes class to show whats in container
    cityContainer.classList.remove("d-none");

    // lists the name of the city that was searched 
    cityNameEl.textContent = city;

    // creates span to show the current date
    var currentDate = document.createElement("span")
    currentDate.textContent =" " + "(" + month + "/" + day + "/" + year + ")";
    cityNameEl.appendChild(currentDate);

    tempEl.textContent = weather.main.temp;
    windEl.textContent = weather.wind.speed;
    humidityEl.textContent = weather.main.humidity;
    
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;

    getUvIndex(lat, lon);
}

function getUvIndex(lat, lon) {
    const apiKey = "208b86d4af1d114dc52f06c491f0fcd2"
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey

    // sends request to sever for information
    fetch(apiUrl).then(function(response) {
        // if response works then we'll have an array of data
        if (response.ok) {
            response.json().then(function(data) {
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

    if (index.daily[0].uvi <= 2) {
        uvEl.classList.add("favorable");
    } else if (index.daily[0].uvi > 2 && index.current.uvi <= 8) {
        uvEl.classList.add("moderate");
     } else if (index.daily[0].uvi > 8); {
        uvEl.classList.add("severe")
    }
}

function getFive(city) {
    const apiKey = "208b86d4af1d114dc52f06c491f0fcd2"
    let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey

    // sends request to sever for information
    fetch(apiUrl).then(function(response) {
        // if response works then we'll have an array of data
        if (response.ok) {
            response.json().then(function(data) {
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
       console.log(city);
    fiveDayContainer.classList.remove("d-none");

    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    var forecast = city.list;
        for (i = 5; i < forecast.length; i=i+8) {
            var dailyForecast = forecast[i];

            fiveDayDate = document.createElement("h4");
            fiveDayDate.textContent =" " + "(" + month + "/" + day + "/" + year + ")";
            forecastEls.append(fiveDayDate);

            // need to dynamically create img

            fiveDayTemp = document.createElement("p")
            fiveDayTemp.textContent = dailyForecast.main.temp;
            forecastEls.append(fiveDayTemp);

            fiveDayWind = document.createElement("p");
            fiveDayWind.textContent = dailyForecast.wind.speed;
            forecastEls.append(fiveDayWind);

            fiveDayHumidity = document.createElement("p");
            fiveDayHumidity.textContent = dailyForecast.main.humidity;
            forecastEls.append(fiveDayHumidity);
        };
   }

   // not sure why this function isnt working 
   function getHistory(city) {
   cityBtnEl = document.createElement("button");
   cityBtnEl.textContent = ("city");
   searchedCity.append(cityBtnEl);

}

// getHistory();

}
    


   
   

searchBtn.addEventListener("click", searchCity);

clearBtn.addEventListener("click", function() {
    localStorage.clear();
})


