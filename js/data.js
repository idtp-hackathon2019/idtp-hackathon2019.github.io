$( document ).ready(function() {
    var data = {};
    getCurrentItems().then(function (jsondata) {

        console.log("Getting current items...");
        console.log(JSON.stringify(data));
        populateTabs(jsondata)
    });



});

function populateTabs(data){

    var firstTab = document.getElementById("firstTab");


    // var newElement = document.createElement('div');
    // firstTab.appendChild(newElement);​​​​​​​​​​​​​​​​

    for (let i = 0; i < data.length; i++) {
        console.log(i);
        var name = data[i]['itemName'];
        var upc =  data[i]['upc'];
        var scannedDate =  data[i]['items'][0]['scannedDateTime'];
        console.log(name);
        if (name !== "undefined") {
            firstTab.innerHTML += '<div class="tab-item" id="tab-item'+i+'">' + name + '</div>';
            // $(#firstTab).append('<div class='tab-item' id='tab-item"+i">')
            var tmp = "tab-item" + i;
            document.getElementById(tmp).addEventListener("click", changeDisplay, true);
            // firstTab.innerHTML += '<div class="tab-item" id="'+upc+"~"+scannedDate+'">' + name + '</div>';
        }
    }
}

function changeDisplay(){
    console.log("change display");
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















