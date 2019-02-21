$( document ).ready(function() {
    var data = {};
    getCurrentItems().then(function (jsondata) {

        console.log("Getting current items...");
        console.log(JSON.stringify(data));
        populateTabs(jsondata)
    });

    detectswipe('an_element_id',myfunction);

    // detectswipe('an_other_element_id',my_other_function);




});

function populateTabs(data){

    var firstTab = document.getElementById("firstTab");


    // var newElement = document.createElement('div');
    // firstTab.appendChild(newElement);​​​​​​​​​​​​​​​​

    for (let i = 0; i < data.length; i++) {
        console.log(i);
        var name = data[i]['itemName'];
        console.log(name);
        if (name !== "undefined") {
            firstTab.innerHTML += '<div class="tab-item" id="">' + name + '</div>';
        }
    }
}

function getCurrentItems() {
    return $.ajax({
        url: 'https://aromn32tn6.execute-api.us-east-1.amazonaws.com/dev/get-current-items',
        dataType: 'json',
        async: true
    });
}

function moveToHistory(upc, scannedDateTime) {
    return $.ajax({
        url: 'https://aromn32tn6.execute-api.us-east-1.amazonaws.com/dev/move-to-historical?upc=' + upc + '&scannedDateTime=' + scannedDateTime,
        dataType: 'json',
        async: true
    });
}















