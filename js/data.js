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

    for (let i = 0; i < data.length; i++) {
        console.log(i);
        let name = data[i]['itemName'];
        let upc =  data[i]['upc'];
        let scannedDate =  data[i]['items'][0]['scannedDateTime'];
        let nutritionData = data[i]['nutritionData'];
        console.log(name);
        let tmp = "tab-item" + i;
        if (name !== "undefined") {
            var newElement = document.createElement('DIV');
            newElement.id = tmp;
            newElement.className = "tab-item";
            newElement.innerHTML = name;
            firstTab.appendChild(newElement);
            document.getElementById(tmp).addEventListener("click", function(){
                displayData(nutritionData)
            },false);
        }
    }
    // var newElement = document.createElement('div');
    // firstTab.appendChild(newElement);​​​​​​​​​​​​​​​​
}

function changeDisplay(name){
    console.log(name)
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

function displayData(nutritionData){
    console.log(nutritionData);

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
