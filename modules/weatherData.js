class Location{
    constructor(city,state,queryURL,data){
        this.city=city;
        this.state=state;
        this.query=queryURL;
        this.data=data;
    }
    elementId(){
        return `${this.city}-${this.state}`;
    }
}

let locations = [];


export function initTab(){

    if(localStorage.getItem('locations')){

        locations = JSON.parse(localStorage.getItem('locations'));
        renderStorage();

    }
    else{

        const initCity = 'atlanta';
        const initState = 'ga';
        const initCountry='us';
        const apiKey = '077020626c2d3cd50a785299625eb51a';
        let queryURL = `api.openweathermap.org/data/2.5/weather?q=${initCity},${initState},${initCountry}&units=imperial&appid=${apiKey}`;

        const onReject = (errThrown) => {
        console.log(errThrown);
        console.log(errThrown.responseText);
        }

        $.ajax({
            url: `http://${queryURL}`
        }).then(data =>{

         saveApiCall(initCity,initState,queryURL,data);

        }, onReject);

    }

    
}

export function querySubmit(){

    let locationInput = formatInput()
    let city = locationInput[0];
    let state = locationInput[1];

    searchApiCall(city,state);
    
}



function formatInput(){
    let userInput = $('#search').val();
    if(userInput.includes(', ')){

        let rawInput = userInput.replace(/\s+/g,'');

        let locationArr = rawInput.split(',');
        return locationArr;

    }
    else{
        console.log('bad format');
    }

}


function searchApiCall(city,state){

    const country='us';
    const apiKey =  '077020626c2d3cd50a785299625eb51a';
    let queryURL = `api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=imperial&appid=${apiKey}`;



    const onReject = (errThrown) => {
        console.log(errThrown);
        console.log(errThrown.responseText);
    }

    $.ajax({
        url: `http://${queryURL}`
    }).then(data =>{
        
        saveApiCall(city,state,queryURL,data);

    }, onReject);
}



function saveApiCall(city,state,queryURL,data){

    locations.push(new Location(city,state,queryURL,data));
    localStorage.setItem('locations',JSON.stringify(locations));

    document.location.reload(false);
}




function renderStorage(){
    $('.tabs').empty()
    for(let i=0; i < locations.length; i++){
        
        let locationTabEl = `<li class="tab col"><a href="#${locations[i].city}-${locations[i].state}">${locations[i].city}, ${locations[i].state}</a></li>`
        $('.tabs').append(locationTabEl);

        let contentEl = `<div id="${locations[i].city}-${locations[i].state}" class="col s12"></div>`
        $('#tabContainer').append(contentEl);

        populateWeatherTab(locations[i]);

    }
}

function populateWeatherTab(location){
    

    let data = location.data;
    let weather =  data.main;
    let state = location.state.toUpperCase();

    const getDate = () =>{
        var  curDate = new Date();
        var dd = String(curDate.getDate()).padStart(2, '0');
        var mm = String(curDate.getMonth() + 1).padStart(2, '0');
        var yyyy = curDate.getFullYear();

        curDate = mm + '/' + dd + '/' + yyyy;

        return curDate;
    }

    let curDate = getDate();

    let currentWeatherEl = `<div class='row heroCard' id='${data.name}-current'></div> `
    let locationTitle = `<h3 class="locationTitle ">${data.name}, ${state} <span id='${data.name}-span' style='font-size: 2.5rem;'>(${curDate})</span></h3>`;
    $(`#${location.city}-${location.state}`).append(currentWeatherEl);
    $(`#${data.name}-current`).append(locationTitle);
    $(`#${data.name}-current`).append('<div class="divider"></div>');

    //found a better way to do this but damn it took forever to write this so I'm leaving it
    const getIcon = (location) => {

        let city = location.city;
        let state = location.state
    
        const country='us';
        const apiKey =  '077020626c2d3cd50a785299625eb51a';
        let queryURL = `api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=imperial&mode=html&appid=${apiKey}`;
    
        const onReject = (errThrown) => {
            console.log(errThrown);
            console.log(errThrown.responseText);
        }

        $.ajax({
            url: `http://${queryURL}`
        }).then(data =>{
            let dataDivContent = data.split('<d')

            dataDivContent.forEach(el =>{
                if(el.indexOf('<img') > -1){
                    let iconStart = el.indexOf('<img');
                    let imgEl = el.slice(iconStart);
                    let iconEnd = imgEl.indexOf('/>');
                    imgEl = imgEl.slice(0,iconEnd+2);
                    
                    $(`#${location.data.name}-span`).append(imgEl);
                }
            });


        }, onReject);
    }

    getIcon(location);
    
    //current weather conditions
    

    //the current weather api doesnt have uvi and 5 day forecast, but it does have lat/long data,
    //which we will use to make a call to OneCallAPI 
    const oneCall = (data) =>{
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        let apiKey = '077020626c2d3cd50a785299625eb51a';
        let name = data.name;

        let queryURL=`api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${apiKey}`;

        const onReject = (errThrown) => {
            console.log(errThrown);
            console.log(errThrown.responseText);
        }

        $.ajax({

            url:`http://${queryURL}`

        }).then( data =>{
    
            let currentDataEl = `<ul class='currentDataEl' id='${name}-curData'></ul>`
            $(`#${name}-current`).append(currentDataEl);

            let currentTempEl = `<li>Current Temperature: ${data.current.temp}&#x2109;</li>`;
            $(`#${name}-curData`).append(currentTempEl);

            let currentHumidEl =  `<li>Current Humidity: ${data.current.humidity}%</li>`;
            $(`#${name}-curData`).append(currentHumidEl);

            let currentWindEl = `<li>Current Wind Speed: ${data.current.wind_speed} MPH</li>`;
            $(`#${name}-curData`).append(currentWindEl);

            //uvi color coding
            if(data.current.uvi <= 2){
                let currentUvEl = `<li>Current UV Index: <span id='colorCode' style='color: #ffffff; background-color: #8DC443'>${data.current.uvi}</span></li>`;
                $(`#${name}-curData`).append(currentUvEl);
            }
            else if(data.current.uvi > 2 && data.current.uvi <= 5){
                let currentUvEl = `<li>Current UV Index: <span id='colorCode' style='color: #ffffff; background-color: #FDD835'>${data.current.uvi}</span></li>`;
                $(`#${name}-curData`).append(currentUvEl);
            }
            else if(data.current.uvi > 5 && data.current.uvi <= 7){
                let currentUvEl = `<li>Current UV Index: <span id='colorCode' style='color: #ffffff; background-color: #FFB301'>${data.current.uvi}</span></li>`;
                $(`#${name}-curData`).append(currentUvEl);
            }
            else if(data.current.uvi > 7 && data.current.uvi <= 10){
                let currentUvEl = `<li>Current UV Index: <span id='colorCode' style='color: #ffffff; background-color: #D1394A'>${data.current.uvi}</span></li>`;
                $(`#${name}-curData`).append(currentUvEl);
            }
            else if(data.current.uvi > 10){
                let currentUvEl = `<li>Current UV Index: <span id='colorCode' style='color: #ffffff; background-color: #954F71'>${data.current.uvi}</span></li>`;
                $(`#${name}-curData`).append(currentUvEl);
            }
            

            let fiveDayCards = `<div class='row' id='${name}5day'></div>`;
            $(`#${name}-current`).append(fiveDayCards);

            for(let i=0; i<5; i++){

            }


        },onReject);

    }

    oneCall(data);



}



