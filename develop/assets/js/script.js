// variable for DOM elements
const searchBtn = document.querySelector(".searchBtn");
const cityInput = document.querySelector("#city-name");

// variable for API key



// grabbing API info from weather site
function getCityForecast(city) {
    const apiKey = "208b86d4af1d114dc52f06c491f0fcd2"
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + ""

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            })
        }
    })
}


// function to search for city
function searchCity() {
    console.log(cityInput.value);
    
    // variable for city name
    let cityName = cityInput.value.trim();

    localStorage.setItem("search-history", cityName);

    getCityForecast(cityName);
    
}

searchBtn.addEventListener("click", searchCity);

