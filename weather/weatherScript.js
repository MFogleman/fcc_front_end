/****
Terribleness disclaimer.

This code is rough, hard to read, not optimal, and overall bad.  This is one of 
my first learning processes, and every day I'm learning new ways to make things 
better.  If I rewrote the code every time I found a better way to do something, 
it wouldn't get done.  With that in mind, if it doesn't effect the end-user, I'm
probably not recoding it unless necesarry.
****/
var weatherString = "";
var debugWeather = "clear";
var weatherUnit = "K"; //"K"elvin "F"arenheit or "C"elsius.  
//API uses K by default, will need to convert
var expanded = false;
var userZip;
var kelvinTemp;
var showWeather = false;
var cityOutput = document.getElementById("cityName");
var weatherOutput = document.getElementById("weatherType");
var tempOutput = document.getElementById("weatherTemp");
var convertOutput = document.getElementById("convertText");
var geo_options = {
    enableHighAccuracy: false,
    maximumAge: 60000,
    timeout: 60000
};

var weatherObj = {
    temp: null,
    city: null,
    weather: null,
};

var owmGet = "http://api.openweathermap.org/data/2.5/weather?lat=latitude&lon=longitude&appid=ca8f05bd3f257bc61d199294fdc3927d";

var owmZip = "http://api.openweathermap.org/data/2.5/weather?zip=zipNum,us&appid=ca8f05bd3f257bc61d199294fdc3927d";

function toggleSlide() { //used for settings box animation
    if (expanded == false) {
        document.getElementById("slideout_inner").className = "show";
        document.getElementById("cornerIcon").classList.remove("fa-cogs");
        document.getElementById("cornerIcon").classList.add("fa-arrow-up");
        expanded = true;
    } else {
        document.getElementById("slideout_inner").classList.remove("show");
        document.getElementById("cornerIcon").classList.remove("fa-arrow-up");
        document.getElementById("cornerIcon").classList.add("fa-cogs");
        closeZipForm();
        expanded = false;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, geo_options);
    } else {
        cityOutput.innerHTML = "GeoLocation isn't supported.";
    }
}

function success(position) { //called if geolocation works
    var coordObj = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };

    owmGet = owmGet.replace(/latitude|longitude/gi, function(matched) {
        return coordObj[matched];
    });

    callAPI(owmGet);
}

function error() {
    cityOutput.innerHTML = "Unable to retrieve your location";
}

function zipLookup() {
    owmZip = owmZip.replace(/zipNum/, userZip);
    $.getJSON(owmZip).then(function(result) {
        assignWeather(result);
    });
}

function callAPI(owmSource) {
    $.getJSON(owmSource).then(function(result) {
        assignWeather(result);
    });
}

function assignWeather(result) {
    if (result.cod != "200"){ //if we did not get a successful result
        decideAnim();
        tempOutput.innerHTML = "Error";
        weatherOutput.innerHTML = null;
        cityOutput.innerHTML = "API may be down";
    }else{
        weatherUnit = "K";
        while (weatherObj.temp == null || 
               weatherObj.city == null || 
               weatherObj.weather == null){
            kelvinTemp = result.main.temp;
            weatherObj.temp = kelvinTemp;
            weatherObj.city = result.name;
            weatherObj.weather = result.weather[0].main;
            weatherString = result.weather[0].main;
            decideAnim();
        }
        kToF();
        cityOutput.innerHTML = weatherObj.city;
        weatherOutput.innerHTML = weatherObj.weather;
        tempOutput.innerHTML = weatherObj.temp + " &#8457";
    }

    weatherObj.temp = null;
    weatherObj.city = null;
    weatherObj.weather = null;
}
//***************************
//Conversion functions      *
//***************************
function kToF() {
    if (weatherUnit == "K") {
        weatherObj.temp = Math.floor((kelvinTemp * (9 / 5)) - 459.67);
        weatherUnit = "F";
    }
}

function fToC() {
    if (weatherUnit == "F") {
        weatherObj.temp = Math.floor(kelvinTemp - 273.15);
        weatherUnit = "C";
        tempOutput.innerHTML = weatherObj.temp + " &#8451";
        convertOutput.innerHTML = "Convert to Farenheit";
    }
}

function cToF() {
    if (weatherUnit == "C") {
        weatherObj.temp = Math.floor((kelvinTemp * (9 / 5)) - 459.67);
        weatherUnit = "F";
        tempOutput.innerHTML = weatherObj.temp + " &#8457";
        convertOutput.innerHTML = "Convert to Celsius";
    }
}

function convert() {
    if (weatherUnit == "F") {
        fToC();
    } else if (weatherUnit == "C") {
        cToF();
    }
}

//ZipCode functions
function openZipForm() {
    document.getElementById("changeLocLine").innerHTML = "<form><input name = 'zipInput' id='zipID' value ='12345' type = 'number' size = '100' onfocus=\"if(this.value==this.defaultValue)this.value='';\"><input type = 'button' id = 'zipButton' value='Change Zip Code' onclick = 'getZip(zipID.value)'></form>";
}

function closeZipForm() {
    document.getElementById("changeLocLine").innerHTML = "<a href=\"#\" onclick=\"openZipForm()\">Change Location</a>";
}


function getZip(userZip) {
    if (showWeather == true) {
        weatherAnim();
    }
    if (userZip.length != 5 || userZip.indexOf("e") != -1) {
        weatherOutput.innerHTML = "Error, please input exactly 5 digits for the zip code.  Example: 12345";
        tempOutput.innerHTML = "";
        cityOutput.innerHTML = "";
    } else {
        owmZip = owmZip.replace("zipNum", userZip);
        callAPI(owmZip);
        owmZip = owmZip.replace(userZip, "zipNum");
        if (weatherUnit == "C") {
            convert();
        }
    }
}



function weatherAnim() {

    if (showWeather == false) {
        document.getElementById("graphicBoxId").classList.add("graphicBoxEnd");
        showWeather = true;
    } else {
        document.getElementById("graphicBoxId").classList.remove("graphicBoxEnd");
        showWeather = false;
    }
}

function changeWeatherAnim() {
    if (debugWeather == "cloud") {
        document.getElementById("graphicBoxId").innerHTML += " <div class=\"fa fa-cloud\" id=\"cloud1\"></div>";
    }
    if (debugWeather == "lightning") {
        document.getElementById("graphicBoxId").innerHTML += "<div class=\"fa fa-bolt\"  id=\"bolt1\"></div><div class=\"fa fa-bolt\"  id=\"bolt2\"></div><div class=\"fa fa-bolt\"  id=\"bolt3\"></div>";
    }
    if (debugWeather == "clear") {
        document.getElementById("graphicBoxId").innerHTML = "";
    }
    if (debugWeather == "rain") {
        document.getElementById("graphicBoxId").innerHTML += "          <div class = \"fa fa-tint\" id=\"drop1\"></div>          <div class = \"fa fa-tint\" id=\"drop2\"></div>          <div class = \"fa fa-tint\" id=\"drop3\"></div>          <div class = \"fa fa-tint\" id=\"drop4\"></div>          <div class = \"fa fa-tint\" id=\"drop5\"></div>          <div class = \"fa fa-tint\" id=\"drop6\"></div>";
    }
    if (debugWeather == "snow") {
        document.getElementById("graphicBoxId").innerHTML += "<div class = \"fa fa-circle\" id =\"snow1\"></div>            <div class = \"fa fa-circle\" id =\"snow2\"></div>            <div class = \"fa fa-circle\" id =\"snow3\"></div>            <div class = \"fa fa-circle\" id =\"snow4\"></div>            <div class = \"fa fa-circle\" id =\"snow5\"></div>            <div class = \"fa fa-circle\" id =\"snow6\"></div>            <div class = \"fa fa-circle\" id =\"snow7\"></div>            <div class = \"fa fa-circle\" id =\"snow8\"></div>";
    }
    if (debugWeather == "sunny") {
        document.getElementById("graphicBoxId").innerHTML += "<span class=\"fa-stack fa-lg\">            <i class=\"fa fa-circle fa-stack-2x\"id=\"sunCircle\"></i><i class=\"fa fa-sun-o fa-spin fa-stack-1x\"></i></span>";
    }
}

function decideAnim() {
    debugWeather = "";
    document.getElementById("graphicBoxId").innerHTML = "";
    weatherString = weatherString.toLowerCase();
    if (~weatherString.indexOf("clear")) {
        debugWeather = "sunny";
    }
    if (weatherString.indexOf("clear")) { //anything other than clear, draw cloud
        debugWeather = "cloud";
        changeWeatherAnim();
    }
    if (~weatherString.indexOf("thunder")) {
        debugWeather = "lightning";
    }
    if (~weatherString.indexOf("rain") || ~weatherString.indexOf("storm")) {
        debugWeather = "rain";
    }
    if (~weatherString.indexOf("snow") || ~weatherString.indexOf("flurr")) {
        debugWeather = "snow";
    }
    changeWeatherAnim();
    weatherAnim();
}

window.onload = getLocation();
