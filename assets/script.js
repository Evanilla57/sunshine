var apiKey = 'f5a003f8e333c73009944afc5cfcf5b8';
var searchEl = document.getElementById('search');
var cityEl = document.getElementById('city');
var searchBtn = document.getElementById('search-btn');
var historyBtn = document.getElementById('history-btn');
var searchLocal = [];
var searchInput;


// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

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

function storeHistory(event) {
    if (!searchEl.value) {
        return;
    };
    searchLocal.push(event);
    localStorage.setItem('searchLocal', JSON.stringify(searchLocal));
};

load();

function targetCity() {
    if (!searchInput) {
        geoCode = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchEl.value + '&limit=1&appid=' + apiKey + '';
        var localBtn = document.createElement('button');
        localBtn.classList.add('local-btn');
        localBtn.textContent = searchEl.value;
        historyBtn.append(localBtn);
        storeHistory(searchEl.value);
    } else {
        geoCode = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityEl + '&limit=1&appid=' + apiKey + '';
        storeHistory(cityEl)
    }
    cityEl = '';
    fetch(geoCode)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lon = data[0].lon;
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
};

searchBtn.addEventListener('click', targetCity);

searchBtn.addEventListener('click', (event) => {
    searchInput = event.target.textContent;
    targetCity();
}) 