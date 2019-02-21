var currentHighlight;

$( document ).ready(function() {

    var data = {};
    getCurrentItems().then(function (jsondata) {

        //console.log("Getting current items...");
        //console.log(JSON.stringify(data));
        populateTabs(jsondata);
        displayExpirationData(jsondata);
    });
    getHistoricalData("2019-2-21", "2024-12-15").then(function(historyData){
      displayHistoricalData(historyData);
    });

});

function getHistoricalData(startDate, endDate) {
  return $.ajax({
    url: 'https://aromn32tn6.execute-api.us-east-1.amazonaws.com/dev/get-historical-data?startDate=' + startDate + '&endDate=' + endDate,
    dataType: 'json',
    async: true
   });
}

function populateTabs(data){
    var tabArray = [document.getElementById("firstTab"),document.getElementById("secondTab"),document.getElementById("thirdTab"),document.getElementById("fourthTab")];

    for (let i = 0; i < data.length; i++) {
        let random = Math.floor((Math.random() * 3)+1);
        //console.log(i);
        let name = data[i]['itemName'];
        let upc =  data[i]['upc'];
        let scannedDate =  data[i]['items'][0]['scannedDateTime'];
        // let currentSubmission = false;

        if (scannedDate.split(" ")[0] == "2019-2-21"){
            random = 0;
            console.log(scannedDate);
        }
        let expData = data[i]['items'][0]['expData'];
        let nutritionData = data[i]['nutritionData'];
        let itemName = data[i]['itemName'];
        //console.log(name);
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


function getHistoricalData() {
    return $.ajax({
        url: 'https://aromn32tn6.execute-api.us-east-1.amazonaws.com/dev/get-historical-data?startDate=2019-02-15&endDate=2022-01-15',
        dataType: 'json',
        async: true
    });
}
function displayExpirationData(data) {
  var expList = [];
  for(x = 0; x < data.length; x++) {
    var itemName = data[x]['itemName'];
    for(y = 0; y < data[x]['items'].length; y++) {
      var expDate = data[x]['items'][y]['expDate'];
      var tmp = {};
      tmp['itemName'] = itemName;
      tmp['expDate'] = expDate;
      expList.push(tmp);
    }

  }

  //console.log(expList);
  expList.sort(GetSortOrder("expDate"));

  $('#expDateTable').empty();
  //append header row
  $('#expDateTable').append("<table id=\"expDateTable\">" +
    "<tr>" +
      "<th>Item</th>" +
      "<th>Exp. Date</th>" +
    "</tr>"
  );

  for(var j = 0; j < expList.length; j++) {
    if(expList[j]['expDate'] < "2019-02-28") {
      var date = expList[j]['expDate'].substr(5,expList[j]['expDate'].length-1);
      var expDate = date.split("-")[0] + "/" + date.split("-")[1];
      $('#expDateTable').append("<tr>" +
        "<td>" + expList[j]['itemName'] + "</td>" +
        "<td>" + expDate + "</td>" +
      "</tr>"
      );
    }
  }

}

function displayHistoricalData(data) {
  console.log("HUnter");
  console.log(JSON.stringify(data));

  $('#historyTable').empty();
  //append header row
  $('#historyTable').append("<table id=\"historyTable\">" +
    "<tr>" +
      "<th>Item</th>" +
      "<th>Date</th>" +
    "</tr>"
  );

  var listOfItems = [];

  for(var x = 0; x < data.length; x++) {
    var dateScanned = data[x]['dateScanned'];
    for(var y = 0; y < data[x]['details'].length; y++) {
      var item = data[x]['details'][y]['itemName'];
      for(var z = 0; z < data[x]['details'][y]['items'].length; z++) {
        //append items to listOfItems
        var tmp = {};
        tmp['scannedDate'] = dateScanned;//data[x]['details'][y]['items'][z]['scannedDateTime'].split(" ")[0];
        tmp['itemName'] = item;
        listOfItems.push(tmp);
      }

    }
  }

  listOfItems.sort(GetSortOrder("scannedDate"));
  console.log(JSON.stringify(listOfItems));


  for(var j = 0; j < listOfItems.length; j++) {
    var item = listOfItems[j]['itemName'];
    var date = listOfItems[j]['scannedDate'];
    $('#historyTable').append("<tr>" +
      "<td>" + item + "</td>" +
      "<td>" + date + "</td>" +
    "</tr>"
    );
  }


}


function GetSortOrder(arr) { //sorts by objects in a list
  return function(a,b) {
    if(a[arr] > b[arr]) {
      return 1;
    }
    else if (a[arr] < b[arr]) {
      return -1;
    }
    return 0;
  }
}
