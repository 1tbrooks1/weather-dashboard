// variable for DOM elements
const searchBtn = document.querySelector(".searchBtn");
const cityInput = document.querySelector("#city-name");
const cityNameEl = document.querySelector("#searched-city");
const cityContainer = document.querySelector("#city-container");
const dateEl = document.querySelector("#date");

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
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + ""

    // sends request to sever for information
    fetch(apiUrl).then(function(response) {
        // if response works then we'll have an array of data
        if (response.ok) {
            response.json().then(function(data) {
                // console.log();
                displayWeatherInfo (data, city);
            });
        // if no then application throws an error message to user 
        } else {
            alert("Error: City not found");
        }
    });
}

function displayWeatherInfo(weather, city) {
    console.log(weather);
    console.log(city);

    cityContainer.classList.remove("d-none");

    cityNameEl.textContent = city;
    dateEl.textContent = new Date();
}




searchBtn.addEventListener("click", searchCity);

