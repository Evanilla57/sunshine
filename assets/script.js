// Variables
var apiKey = '948c68d5e82bcef7d9b883a9094fe684';
var cityEl = document.getElementById('city');
var searchBtn = document.getElementById('search-btn');
var historyBtn = document.getElementById('history-btn');
var searchLocal = [];
var searchInput;

// Calls load function
load();

// Create a button for each city in the search history when the page loads
function load() {
    var loadHistory = localStorage.getItem('searchLocal');
    if (loadHistory == null) {
        return;
    }

    var cityArray = JSON.parse(loadHistory);
    for (var i = 0; i < cityArray.length; i++) {
        createButton(cityArray[i]);
    }
}

// Displays weather forecast based on search input
function targetCity() {
    apiCall()
        .then(() => {
            // Update cityEl content
            cityEl.textContent = searchInput;

            console.log('test');
        })
        .catch((error) => {
            console.error(error);
        });
}

// Event Listener
searchBtn.addEventListener('click', (event) => {
    searchInput = document.getElementById('textInput').value;
    // Update search input value in the history button
    if (searchInput) {
        createButton(searchInput);
        storeHistory(searchInput);
    }
    targetCity();
});

// Keydown event listener for the input field
document.getElementById('textInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchInput = this.value;

        if (searchInput) {
            createButton(searchInput);
            storeHistory(searchInput);
        }
        targetCity();
    }
});

// Function to create a history button and add an event listener
function createButton(city) {
    let localBtn = document.createElement('button');
    localBtn.classList.add('local-btn');
    historyBtn.append(localBtn);
    localBtn.textContent = city;

    localBtn.addEventListener('click', (event) => {
        searchInput = event.target.textContent;
        apiCall();
        cityEl.textContent = searchInput;
        console.log('test');
    });
}

// Stores search data to local history
function storeHistory(event) {
    if (!searchInput) {
        return;
    }
    searchLocal.push(event);
    localStorage.setItem('searchLocal', JSON.stringify(searchLocal));
}

// Displays weekday
var weekday = [
    moment().format('dddd'),
    moment().add(1, 'd').format('dddd'),
    moment().add(2, 'd').format('dddd'),
    moment().add(3, 'd').format('dddd'),
    moment().add(4, 'd').format('dddd'),
    moment().add(5, 'd').format('dddd'),
    moment().add(6, 'd').format('dddd'),
];

for (i = 0; i < 6; i++) {
    document.getElementById('day-' + i + '').textContent = weekday[i];
}

// Logs forecast based on current position
window.addEventListener('load', () => {
    var lat;
    var lon;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            queryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    cityEl.textContent = data.city.name;
                    for (var i = 0; i < 6; i++) {
                        document.getElementById('temp-' + i + '').textContent = 'Temp: ' + Number(data.list[i].main.temp).toFixed(0) + '°';
                    }
                    for (var i = 0; i < 6; i++) {
                        document.getElementById('wind-' + i + '').textContent = 'Wind: ' + Number(data.list[i].wind.speed).toFixed(0) + ' mph';
                    }
                    for (var i = 0; i < 6; i++) {
                        document.getElementById('humid-' + i + '').textContent = 'Humidity: ' + Number(data.list[i].main.humidity) + '%';
                    }
                    for (var i = 0; i < 6; i++) {
                        document.getElementById('icon-' + i + '').src = 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '.png';
                    }
                });
        });
    }
});

// Function for API calls
function apiCall() {
    let geoCode;
    if (!searchInput) {
        window.alert('Please input a city');
        return Promise.reject('No city input');
    } else {
        geoCode = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchInput + '&limit=1&appid=' + apiKey + '';
    }

    return fetch(geoCode)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                let lon = data[0].lon;
                let lat = data[0].lat;
                queryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';

                // Fetch weather data using the obtained latitude and longitude
                return fetch(queryURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        for (var i = 0; i < 6; i++) {
                            document.getElementById('temp-' + i + '').textContent = 'Temp: ' + Number(data.list[i].main.temp).toFixed(0) + '°';
                            document.getElementById('wind-' + i + '').textContent = 'Wind: ' + Number(data.list[i].wind.speed).toFixed(0) + ' mph';
                            document.getElementById('humid-' + i + '').textContent = 'Humidity: ' + Number(data.list[i].main.humidity) + '%';
                            document.getElementById('icon-' + i + '').src = 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '.png';
                        }

                        // Check if a button with the same text content already exists
                        if (!historyBtn.querySelector('.local-btn') || !Array.from(historyBtn.querySelectorAll('.local-btn')).some(btn => btn.textContent === searchInput)) {
                            // Append a button for the current search input
                            createButton(searchInput);
                        }
                    });
            } else {
                // Handle the case where no data is returned
                console.error('No data received from the geo API');
                return Promise.reject('No data received from the geo API');
            }
        })
        .catch(function (error) {
            console.error(error);
        });
}