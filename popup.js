

document.addEventListener('DOMContentLoaded', function() {
    var timeTable = new Object();
    chrome.storage.local.get(['optionsTable'], function(result) {
        timeTable = result.optionsTable;
        console.log("timeTable: ", Object.keys(timeTable), Object.values(timeTable));   
        createHtmlFromTable(timeTable);
    });

var refreshButton = document.getElementById('refreshButton');


refreshButton.addEventListener('click', function(){
    console.log("hey");
    getChromeVar();
});


}, false);


function createHtmlFromTable(timeTable){
    for(var key in timeTable){

        var div = document.createElement('div');
        var label = document.createElement('label');
        var icon = document.createElement('img');   

        label.textContent = timeTable[key];
        icon.setAttribute('src', 'https://www.google.com/s2/favicons?sz=16&domain='+key);
        icon.style.marginRight = '5px';

        div.appendChild(icon);
        div.appendChild(label);

        document.body.appendChild(div);
    }
}


function getChromeVar(){
    chrome.storage.local.get(['optionsTable'], function(result) {
            
        });
    }