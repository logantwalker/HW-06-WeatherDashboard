//import { testQuery } from './modules/weatherData.js';

function testQuery(){
    const city='Atlanta';
    const apiKey = '077020626c2d3cd50a785299625eb51a'
    const queryURL = `api.openweathermap.org/data/2.5/weather?q=London,uk&appid=077020626c2d3cd50a785299625eb51a`
    
    const onAccept = (data) => {
        console.log(data);
    }
    const onReject = (errThrown) =>{
        console.log(errThrown);
    }

    $.ajax({
        method:'GET',
        url: queryURL
    }).then(onAccept, onReject);
}


testQuery();
//initializing materialize css styling
$(document).ready(function(){
    $('.tabs').tabs();
  });