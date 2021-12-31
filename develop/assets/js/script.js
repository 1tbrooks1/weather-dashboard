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

// global variables



// function to search for city
function searchCity() {
    // console.log(cityInput.value);
    
    // variable for city name
    let cityName = cityInput.value.trim();

    localStorage.setItem("search-history", cityName);

    getCityUrl(cityName);
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
    uvEl.textContent = index.current.uvi;

    if (index.current.uvi <= 2) {
        uvEl.classList = "favorable"
    } else if (index.current.uvi >2 && index.current.uvi <= 8) {
        uvEl.classList = "moderate"
    } else (index.current.uvi > 8); {
        uvEl.classList = "severe"
    }
}
   

searchBtn.addEventListener("click", searchCity);

