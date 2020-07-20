
export function testQuery(){
    const city='atlanta';
    const state='ga';
    const apiKey = '077020626c2d3cd50a785299625eb51a'
    const queryURL = `api.openweathermap.org/data/2.5/weather?q=${city},${state}&appid=${apiKey}`
    
    $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
            });
}
