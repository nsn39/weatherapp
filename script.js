let lat = 51.505, long = -0.11;

//Setting up the map here..
var mymap = L.map('mapid').setView([lat, long], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaGV5aXRzbmlzaGFuMjAyMCIsImEiOiJjazlmd2kwaGowY3g0M2ZvM3k1c3ZmNGNwIn0.nD4d-qM-RI41eFe_qMAJLA'
}).addTo(mymap);

var circle = L.circle([lat, long], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

//Return the position's latitude and longitude on click.
function onMapClick(e) {
    lat = e.latlng.lat.toFixed(4);
    long = e.latlng.lng.toFixed(4);
    //After each click, we update the Request URL.
    q_val = `${lat},${long}`;
    req_url = base_url + api_type + '?key=' + api_key + '&q=' + q_val;
    /*
    console.log(e.latlng.lat, e.latlng.lng);
    console.log(req_url);
    */
    getWeather(req_url);
}

mymap.on('click', onMapClick);

//Setting map's current location as per Geolocation API
navigator.geolocation.getCurrentPosition((position) => {
    mymap.setView([position.coords.latitude, position.coords.longitude], 10);
    circle.setLatLng([position.coords.latitude, position.coords.longitude]);
});

//Connecting to WeatherAPI
let req_url;
let base_url = 'http://api.weatherapi.com/v1/';
let api_key = '97d565d4a8ca4ca7b3b94336200305';//LOL, this is my key shouldnt leave it like this.
let api_type = 'current.json';
let q_val = `${lat},${long}`;

function getWeather(url) {
    fetch(url).then((result) => {
        return result.json();
    }).then((json) => {
        updateWeather(json);
    });
}

//Obtain resp values from the JSON and update the page.
function updateWeather(json_obj) {
    let temp_celsius = json_obj.current.temp_c;
    //let temp_fahrenheit = json_obj.current.temp_f;
    let condition_text = json_obj.current.condition.text;
    let condition_image_url = json_obj.current.condition.icon;
    let current_time = json_obj.location.localtime;
    let place_name = json_obj.location.name;
    let country = json_obj.location.country;
    console.log(json_obj);

    let temp_holder = document.querySelector('#temp_celsius');
    let img_holder = document.querySelector('#condition_img');
    let comment_holder = document.querySelector('#weather_condition');
    let weather_comment = document.querySelector('#weather_comment');


    temp_holder.textContent  = temp_celsius;
    img_holder.src = condition_image_url;
    comment_holder.textContent = condition_text;
    weather_comment.textContent = place_name + ' , ' + country + ' , ' + current_time; 
}