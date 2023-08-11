// Variables
var apiKey = '948c68d5e82bcef7d9b883a9094fe684';
var cityEl = document.getElementById('city');
var searchBtn = document.getElementById('search-btn');
var historyBtn = document.getElementById('history-btn');
var searchLocal = [];
var searchInput;


// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// Calls load function
load();

// Displays weather forecast based on search input
function targetCity() {
    apiCall();
    let localBtn = document.createElement('button');
    localBtn.classList.add('local-btn');
    historyBtn.append(localBtn);
    localBtn.textContent = searchInput;
    storeHistory(searchInput);
    cityEl.textContent = searchInput;
    
    localBtn.addEventListener('click', (event) => {
        searchInput = event.target.textContent;
        apiCall();
        cityEl.textContent = searchInput;
    })
};



// Event Listeners

searchBtn.addEventListener('click', (event) => {
    searchInput = document.getElementById('textInput').value;
    targetCity();
})


//TODO: make forloop, compare forloop to default
// Displays weekday
var weekday = [
    moment().format('dddd'),
    moment().add(1, 'd').format('dddd'),
    moment().add(2, 'd').format('dddd'),
    moment().add(3, 'd').format('dddd'),
    moment().add(4, 'd').format('dddd'),
    moment().add(5, 'd').format('dddd'),
    moment().add(6, 'd').format('dddd'),
]

for (i = 0; i < 6; i++) {
    document.getElementById('day-' + i + '').textContent = weekday[i];
}

// Stores search data to local history
function storeHistory(event) {
    if (!searchInput.value) {
        return;
    };
    searchLocal.push(event);
    localStorage.setItem('searchLocal', JSON.stringify(searchLocal));
};

//  TODO:make local history persistent
//load function
function load() {
    var loadHistory = localStorage.getItem('searchLocal')
    if (loadHistory == null) {
        return;
    };
    var cityArray = JSON.parse(loadHistory)
    for (var i = 0; i < cityArray.length; i++) {
        var localBtn = document.createElement('button');
        localBtn.classList.add('local-btn')
        localBtn.textContent = cityArray[i]
        historyBtn.append(localBtn);
    }
};

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
                    return response.json()
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
                })
        });
    }
})


//function for API calls
function apiCall() {
    let geoCode;
    if (!searchInput) {
        window.alert('Please input a city');
        return;
    } else {
        geoCode = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchInput + '&limit=1&appid=' + apiKey + '';
    }

    fetch(geoCode)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lon = data[0].lon;
            console.log(data[0]);
            var lat = data[0].lat;
            queryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
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
                })
        });

}