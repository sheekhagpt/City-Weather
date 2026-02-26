let btn = document.getElementById("weatherBtn");
let cityInput = document.getElementById("cityInput");
let result = document.getElementById("weatherResult");
let error = document.getElementById("error");

btn.addEventListener("click", async function () {

    let city = cityInput.value.trim();

    // Clear previous data
    error.textContent = "";
    result.innerHTML = "";

    // Empty input check
    if (city === "") {
        error.textContent = "Please enter a city name!";
        return;
    }

    try {

        // 1️⃣ Geocoding API call
        let geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        let geoData = await geoResponse.json();

        // City not found check
        if (!geoData.results || geoData.results.length === 0) {
            error.textContent = "City not found!";
            return;
        }

        let lat = geoData.results[0].latitude;
        let lon = geoData.results[0].longitude;
        let country = geoData.results[0].country;
        let cityName = geoData.results[0].name;

        // 2️⃣ Weather API call
        let weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        let weatherData = await weatherResponse.json();

        // Weather data check
        if (!weatherData.current_weather) {
            error.textContent = "Weather data not available!";
            return;
        }

        let temperature = weatherData.current_weather.temperature;
        let windspeed = weatherData.current_weather.windspeed;

        // 3️⃣ Show result on UI
        result.innerHTML = `
            <h3>${cityName}, ${country}</h3>
            <p><strong>Temperature:</strong> ${temperature} °C</p>
            <p><strong>Wind Speed:</strong> ${windspeed} km/h</p>
        `;

    } catch (err) {
        error.textContent = "Something went wrong. Please try again.";
        console.log(err);
    }
});