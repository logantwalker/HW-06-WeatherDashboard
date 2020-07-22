import { initTab, querySubmit } from './modules/weatherData.js';

initTab();

$('#search').on('change',()=>{
    
    querySubmit();
});


//initializing materialize css styling
$(document).ready(function () {
    $('.tabs').tabs();
});