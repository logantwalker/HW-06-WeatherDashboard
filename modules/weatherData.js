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
    const apiKey = '077020626c2d3cd50a785299625eb51a';
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

        let contentEl = `<div id="${locations[i].city}-${locations[i].state}" class="col s12">${locations[i].city}</div>`
        $('#tabContainer').append(contentEl);

        populateWeather(locations[i]);

    }
}

function populateWeather(location){
    let data = location.data;
    let weather =  data.main;

    console.log(weather);


    
}