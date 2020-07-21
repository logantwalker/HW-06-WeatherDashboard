export function initTab(){

    const initCity = 'atlanta';
    const initState = 'ga';
    const initCountry='us';
    const apiKey = '077020626c2d3cd50a785299625eb51a';
    let queryURL = `api.openweathermap.org/data/2.5/weather?q=${initCity},${initState},${initCountry}&appid=${apiKey}`;

    const onReject = (errThrown) => {
        console.log(errThrown);
        console.log(errThrown.responseText);
    }

    $.ajax({
        url: `http://${queryURL}`
    }).then(data =>{

        $("#initLocation").text(data.name);

    }, onReject);
}

export function querySubmit(){

    formatInput()
    
}

// class Event{
//     constructor(eventTitle,startTime,endTime,description){
//         this.title=eventTitle;
//         this.startTime = startTime;
//         this.endTime = endTime;
//         this.description = description;
//     }

// class Location{
//     constructor(){

//     }
// }

function formatInput(){
    let userInput = $('#search').val();
    if(userInput.includes(', ')){
        let rawInput = userInput.replace(/\s+/g,'');

        let locationArr = rawInput.split(',');
        let city = locationArr[0];
        let state = locationArr[1];

        searchApiCall(city,state);
    }
    else{
        console.log('bad format');
    }

}


function searchApiCall(city,state){

    const country='us';
    const apiKey = '077020626c2d3cd50a785299625eb51a';
    let queryURL = `api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${apiKey}`;

    const onReject = (errThrown) => {
        console.log(errThrown);
        console.log(errThrown.responseText);
    }

    $.ajax({
        url: `http://${queryURL}`
    }).then(data =>{
        let newTab = `<li class="tab col"><a href="#initLocation">${data.name}</a></li>`;
        $('.tabs').append(newTab);
        

    }, onReject);
}