var currentHighlight;

$( document ).ready(function() {
    var data = {};
    getCurrentItems().then(function (jsondata) {

        console.log("Getting current items...");
        console.log(JSON.stringify(data));
        populateTabs(jsondata)
    });
    getHistoricalData().then(function(historyData){
        displayRecentlyDeleted(historyData);
    });
});

function populateTabs(data){
    var tabArray = [document.getElementById("firstTab"),document.getElementById("secondTab"),document.getElementById("thirdTab"),document.getElementById("fourthTab")];

    for (let i = 0; i < data.length; i++) {
        let random = Math.floor((Math.random() * 4));
        console.log(i);
        let name = data[i]['itemName'];
        let upc =  data[i]['upc'];
        let scannedDate =  data[i]['items'][0]['scannedDateTime'];
        let expData = data[i]['items'][0]['expData'];
        let nutritionData = data[i]['nutritionData'];
        let itemName = data[i]['itemName'];
        console.log(name);
        let tmp = "tab-item" + i;
        if (name !== "undefined") {
            var newElement = document.createElement('DIV');
            newElement.id = tmp;
            newElement.className = "tab-item";
            newElement.innerHTML = name;
            tabArray[random].appendChild(newElement);
            document.getElementById(tmp).addEventListener("click", function(){
                if (currentHighlight != null) {
                    document.getElementById(currentHighlight).style.backgroundColor = "white";
                }
                currentHighlight = tmp;
                document.getElementById(tmp).style.backgroundColor = "lightgrey";
                displayData(nutritionData, itemName);
            },false);
        }
    }
    // var newElement = document.createElement('div');
    // firstTab.appendChild(newElement);​​​​​​​​​​​​​​​​
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

function displayData(nutritionData, itemName){

    //$('nutritionalDataLabel').empty();
    //$('nutritionalDataLabel').append("NUTRITIONAL INFddsO<br>" + itemName);
    $("#nutritionalDataLabel").text(itemName).css("font-weight","Bold");


    $('#nutritionTable').empty();
    $('#nutritionTable').append("<table id=\"nutritionTable\">" +
      "<tr class=\"nutritionDataRow\">" +
        "<td style=\"text-align: center\"><span class=\"bigger\">" + nutritionData.proteins + "</span><br><span class=\"labelsize\">Protein</span></td>" +
        "<td style=\"text-align: center\"><span class=\"bigger\">" + nutritionData.carbohydrates + "</span><br><span class=\"labelsize\">Carbs</span></td>" +
      "</tr>" +
      "<tr class=\"nutritionDataRow\">" +
        "<td style=\"text-align: center\" colspan=2><span class=\"bigger\">" + nutritionData.calories + "</span><br><span class=\"labelsize\">Calories</span></td>" +
      "</tr>" +
      "<tr class=\"nutritionDataRow\">" +
        "<td style=\"text-align: center\"><span class=\"bigger\">" + nutritionData.fat + "</span><br><span class=\"labelsize\">Fat</span></td>" +
        "<td style=\"text-align: center\"><span class=\"bigger\">" + nutritionData.sugars + "</span><br><span class=\"labelsize\">Sugar</span></td>" +
      "</tr>" +
    "</table>");

}


function displayRecentlyDeleted(data){
    console.log(JSON.stringify(data));

    for (let i = 0; i < data.length; i++) {
        var newElement = document.createElement('DIV');
        newElement.id = tmp;
        newElement.className = "tab-item";
    }
}

function getHistoricalData() {
    return $.ajax({
        url: 'https://aromn32tn6.execute-api.us-east-1.amazonaws.com/dev/get-historical-data?startDate=2019-02-15&endDate=2022-01-15',
        dataType: 'json',
        async: true
    });
}